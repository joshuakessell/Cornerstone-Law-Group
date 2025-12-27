import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs";
import path from "path";

export type IntakePresentationGroup = {
  title: string;
  fields: Array<{ id: string; label: string; value: unknown }>;
};

export type IntakePresentation = {
  title: string;
  groups: IntakePresentationGroup[];
};

const PAGE_WIDTH = 612; // Letter size in points
const PAGE_HEIGHT = 792;
const MARGIN = 72; // 1 inch
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const CONTENT_HEIGHT = PAGE_HEIGHT - MARGIN * 2;
const HEADER_HEIGHT = 100;
const FOOTER_HEIGHT = 40;
const BODY_START = MARGIN + HEADER_HEIGHT;
const BODY_END = PAGE_HEIGHT - MARGIN - FOOTER_HEIGHT;
const LINE_HEIGHT = 14;
const GROUP_SPACING = 20;
const FIELD_SPACING = 12;

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "";
  }
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number") {
    return value.toString();
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return "";
    if (value.length <= 3) {
      return value.map((v) => formatValue(v)).filter(Boolean).join(", ");
    }
    return value.map((v) => `• ${formatValue(v)}`).filter(Boolean).join("\n");
  }
  if (typeof value === "object") {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

function wordWrap(text: string, maxWidth: number, font: any, fontSize: number): string[] {
  // First split by newlines, then wrap each line
  const paragraphs = text.split("\n");
  const lines: string[] = [];

  for (const paragraph of paragraphs) {
    const words = paragraph.split(" ");
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const width = font.widthOfTextAtSize(testLine, fontSize);
      if (width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
  }

  return lines;
}

async function tryLoadLogo(): Promise<Uint8Array | null> {
  const logoPaths = [
    path.resolve(process.cwd(), "client", "public", "brand", "logo-black.png"),
    path.resolve(process.cwd(), "client", "public", "brand", "cornerstone_logo_footer.png"),
  ];

  for (const logoPath of logoPaths) {
    if (fs.existsSync(logoPath)) {
      try {
        return await fs.promises.readFile(logoPath);
      } catch {
        // Continue to next path
      }
    }
  }
  return null;
}

export async function generateSummaryPdf(args: {
  formType: string;
  category?: string;
  sessionId: string;
  packetId: string;
  presentation?: IntakePresentation;
  answers: Record<string, unknown>;
}): Promise<{ pdfBytes: Uint8Array; pageCount: number }> {
  const { formType, category, presentation, answers } = args;

  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const logoBytes = await tryLoadLogo();
  let logoImage = null;
  if (logoBytes) {
    try {
      logoImage = await pdfDoc.embedPng(logoBytes);
    } catch {
      // If PNG embedding fails, try JPG
      try {
        logoImage = await pdfDoc.embedJpg(logoBytes);
      } catch {
        // Skip logo if both fail
      }
    }
  }

  let currentY = BODY_START;
  let currentPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  // Helper to add new page
  const addPage = () => {
    currentPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    currentY = BODY_START;
  };

  // Helper to check if we need a new page
  const checkPage = (neededHeight: number) => {
    if (currentY + neededHeight > BODY_END) {
      addPage();
    }
  };

  // Draw header on current page
  const drawHeader = () => {
    const headerY = PAGE_HEIGHT - MARGIN;
    let headerX = MARGIN;

    // Logo
    if (logoImage) {
      const logoHeight = 40;
      const logoWidth = (logoImage.width / logoImage.height) * logoHeight;
      try {
        currentPage.drawImage(logoImage, {
          x: headerX,
          y: headerY - logoHeight,
          width: logoWidth,
          height: logoHeight,
        });
        headerX += logoWidth + 20;
      } catch {
        // Skip logo if draw fails
      }
    }

    // Title
    currentPage.drawText("Cornerstone Law Group", {
      x: headerX,
      y: headerY - 20,
      size: 18,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

    // Form type / category
    const formLabel = presentation?.title || formType.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    currentPage.drawText(formLabel, {
      x: headerX,
      y: headerY - 40,
      size: 14,
      font: font,
      color: rgb(0.3, 0.3, 0.3),
    });

    if (category && category !== "unsure") {
      const categoryLabel = category.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
      currentPage.drawText(categoryLabel, {
        x: headerX,
        y: headerY - 55,
        size: 12,
        font: font,
        color: rgb(0.5, 0.5, 0.5),
      });
    }

    // Date/time
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    currentPage.drawText(dateStr, {
      x: PAGE_WIDTH - MARGIN - font.widthOfTextAtSize(dateStr, 10),
      y: headerY - 20,
      size: 10,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    });
  };

  // Draw header on first page
  drawHeader();

  // Build groups
  let groups: IntakePresentationGroup[] = [];
  if (presentation?.groups && presentation.groups.length > 0) {
    groups = presentation.groups;
  } else {
    // Fallback: flat answers
    const flatFields = Object.entries(answers)
      .filter(([_, value]) => value !== null && value !== undefined && value !== "")
      .map(([id, value]) => ({
        id,
        label: id.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
        value,
      }));
    groups = [{ title: "Answers", fields: flatFields }];
  }

  // Render groups
  for (const group of groups) {
    // Skip empty groups
    const visibleFields = group.fields.filter((f) => {
      const formatted = formatValue(f.value);
      return formatted !== "";
    });
    if (visibleFields.length === 0) continue;

    checkPage(GROUP_SPACING + LINE_HEIGHT * 2 + visibleFields.length * FIELD_SPACING);

    // Group title
    currentPage.drawText(group.title, {
      x: MARGIN,
      y: currentY,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    currentY -= LINE_HEIGHT + 5;

    // Group fields
    for (const field of visibleFields) {
      const value = formatValue(field.value);
      if (!value) continue;

      const lines = wordWrap(value, CONTENT_WIDTH - 20, font, 10);
      const fieldHeight = LINE_HEIGHT + lines.length * LINE_HEIGHT + 5;

      checkPage(fieldHeight);

      // Field label
      currentPage.drawText(field.label, {
        x: MARGIN + 10,
        y: currentY,
        size: 10,
        font: boldFont,
        color: rgb(0.2, 0.2, 0.2),
      });
      currentY -= LINE_HEIGHT;

      // Field value (multi-line)
      for (const line of lines) {
        currentPage.drawText(line, {
          x: MARGIN + 20,
          y: currentY,
          size: 10,
          font: font,
          color: rgb(0, 0, 0),
        });
        currentY -= LINE_HEIGHT;
      }

      currentY -= 5; // Spacing between fields
    }

    currentY -= GROUP_SPACING; // Spacing between groups
  }

  // Draw footer on all pages
  for (let i = 0; i < pdfDoc.getPageCount(); i++) {
    const page = pdfDoc.getPage(i);
    if (i > 0) {
      // Redraw header on subsequent pages
      const headerY = PAGE_HEIGHT - MARGIN;
      let headerX = MARGIN;

      if (logoImage) {
        const logoHeight = 40;
        const logoWidth = (logoImage.width / logoImage.height) * logoHeight;
        try {
          page.drawImage(logoImage, {
            x: headerX,
            y: headerY - logoHeight,
            width: logoWidth,
            height: logoHeight,
          });
          headerX += logoWidth + 20;
        } catch {
          // Skip logo if draw fails
        }
      }

      page.drawText("Cornerstone Law Group", {
        x: headerX,
        y: headerY - 20,
        size: 18,
        font: boldFont,
        color: rgb(0, 0, 0),
      });
    }

    // Footer
    page.drawText(`Page ${i + 1} of ${pdfDoc.getPageCount()}`, {
      x: MARGIN,
      y: MARGIN + 10,
      size: 9,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    });
  }

  const pdfBytes = await pdfDoc.save();
  return { pdfBytes, pageCount: pdfDoc.getPageCount() };
}

