import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Play } from "lucide-react";

type FormType =
  | "basic-intake"
  | "divorce"
  | "modification"
  | "enforcement"
  | "adoption"
  | "mediation"
  | "marital-agreement"
  | "prenuptial-agreement"
  | "wills-trusts-estates";

type FieldPlacement = {
  key: string;
  page: number;
  x: number;
  y: number;
  size: number;
  label?: string;
};

type MapperData = {
  formType: string;
  templatePdfUrl: string;
  previewPngUrl: string;
  page: number;
  pageCount: number;
  pageWidth: number;
  pageHeight: number;
  fields: Array<{ key: string; label: string }>;
  placements: FieldPlacement[];
};

const formTypeOptions: FormType[] = [
  "basic-intake",
  "divorce",
  "modification",
  "enforcement",
  "adoption",
  "mediation",
  "marital-agreement",
  "prenuptial-agreement",
  "wills-trusts-estates",
];

const formTypeLabel = (ft: FormType): string => {
  const labels: Record<FormType, string> = {
    "basic-intake": "Basic Intake",
    divorce: "Divorce",
    modification: "Modification",
    enforcement: "Enforcement",
    adoption: "Adoption",
    mediation: "Mediation",
    "marital-agreement": "Marital Agreement",
    "prenuptial-agreement": "Prenuptial Agreement",
    "wills-trusts-estates": "Wills/Trusts/Estates",
  };
  return labels[ft] || ft;
};

export default function IntakeMapper() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formType, setFormType] = useState<FormType>("basic-intake");
  const [page, setPage] = useState(1);
  const [selectedFieldKey, setSelectedFieldKey] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const imageRef = useRef<HTMLImageElement>(null);

  const mapperQuery = useQuery<MapperData>({
    queryKey: ["mapper", formType, page],
    enabled: Boolean(formType),
    queryFn: async () => {
      const res = await fetch(`/api/client-intake/dev/mapper/${formType}?page=${page}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Failed to load mapper data: ${res.statusText}`);
      }
      return res.json();
    },
  });

  const setupMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/client-intake/dev/setup-templates", {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Setup failed: ${res.statusText}`);
      }
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Setup Complete",
        description: "Templates and field maps have been initialized.",
      });
      queryClient.invalidateQueries({ queryKey: ["mapper"] });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Setup failed";
      toast({
        title: "Setup Failed",
        description: message,
        variant: "destructive",
      });
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (fields: FieldPlacement[]) => {
      const res = await fetch(`/api/client-intake/dev/mapper/${formType}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Save failed: ${res.statusText}`);
      }
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Saved",
        description: "Field map has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["mapper", formType] });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Save failed";
      toast({
        title: "Save Failed",
        description: message,
        variant: "destructive",
      });
    },
  });

  if (!import.meta.env.DEV) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Mapper Unavailable</CardTitle>
            <CardDescription>Mapper is only available in development mode.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const data = mapperQuery.data;
  const isLoading = mapperQuery.isLoading;
  const error = mapperQuery.error;

  const filteredFields =
    data?.fields.filter(
      (f) =>
        !searchQuery ||
        f.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.label.toLowerCase().includes(searchQuery.toLowerCase()),
    ) ?? [];

  const placementsMap = new Map<string, FieldPlacement>();
  data?.placements.forEach((p) => {
    placementsMap.set(p.key, p);
  });

  const getPlacement = (key: string): FieldPlacement => {
    return placementsMap.get(key) ?? {
      key,
      page: page,
      x: 0,
      y: 0,
      size: 10,
    };
  };

  const isMapped = (key: string): boolean => {
    const placement = placementsMap.get(key);
    return placement ? placement.x !== 0 || placement.y !== 0 : false;
  };

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!selectedFieldKey || !data || !imageRef.current) return;

    const img = imageRef.current;
    const rect = img.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;
    const displayedWidth = rect.width;
    const displayedHeight = rect.height;

    const clickX_pixels = (clickX / displayedWidth) * naturalWidth;
    const clickY_pixels = (clickY / displayedHeight) * naturalHeight;

    const pointsPerPixel = data.pageWidth / naturalWidth;
    const x = clickX_pixels * pointsPerPixel;
    const y = data.pageHeight - clickY_pixels * pointsPerPixel;

    const currentPlacements = data.placements.filter((p) => p.key !== selectedFieldKey);
    const existingPlacement = placementsMap.get(selectedFieldKey);
    const field = data.fields.find((f) => f.key === selectedFieldKey);
    const newPlacement: FieldPlacement = {
      key: selectedFieldKey,
      page: page,
      x,
      y,
      size: existingPlacement?.size ?? 10,
      label: field?.label,
    };

    const updatedPlacements = [...currentPlacements, newPlacement];
    saveMutation.mutate(updatedPlacements);
  };

  const handleSave = () => {
    if (!data) return;
    saveMutation.mutate(data.placements);
  };

  const pageNumbers = data ? Array.from({ length: data.pageCount }, (_, i) => i + 1) : [];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Intake Template Mapper</CardTitle>
            <CardDescription>
              Click on a field in the list, then click on the preview image to set its position.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium mb-2 block">Form Type</label>
                <Select value={formType} onValueChange={(v) => setFormType(v as FormType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {formTypeOptions.map((ft) => (
                      <SelectItem key={ft} value={ft}>
                        {formTypeLabel(ft)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {data && (
                <div className="flex-1 min-w-[150px]">
                  <label className="text-sm font-medium mb-2 block">Page</label>
                  <Select value={String(page)} onValueChange={(v) => setPage(Number(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {pageNumbers.map((p) => (
                        <SelectItem key={p} value={String(p)}>
                          Page {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button onClick={() => setupMutation.mutate()} disabled={setupMutation.isPending}>
                {setupMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Run Setup
                  </>
                )}
              </Button>

              {data && (
                <Button onClick={handleSave} disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Field Map
                    </>
                  )}
                </Button>
              )}
            </div>

            {data && (
              <div>
                <a
                  href={data.templatePdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  Open template PDF in new tab
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">
                {error instanceof Error ? error.message : "Failed to load mapper data"}
              </p>
            </CardContent>
          </Card>
        )}

        {data && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Fields</CardTitle>
                <CardDescription>Select a field to position it on the form.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Search fields..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {filteredFields.map((field) => {
                    const mapped = isMapped(field.key);
                    const isSelected = selectedFieldKey === field.key;
                    const placement = getPlacement(field.key);

                    return (
                      <div
                        key={field.key}
                        onClick={() => setSelectedFieldKey(field.key)}
                        className={`
                          p-3 rounded-md border cursor-pointer transition-colors
                          ${isSelected ? "border-primary bg-primary/10" : "border-border hover:bg-accent"}
                          ${!mapped ? "opacity-60" : ""}
                        `}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm">{field.label}</div>
                            <div className="text-xs text-muted-foreground mt-1 font-mono truncate">
                              {field.key}
                            </div>
                            {mapped && (
                              <div className="text-xs text-muted-foreground mt-1">
                                Page {placement.page}, ({placement.x.toFixed(1)}, {placement.y.toFixed(1)})
                              </div>
                            )}
                          </div>
                          {!mapped && (
                            <span className="text-xs text-muted-foreground whitespace-nowrap">Unmapped</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  {selectedFieldKey
                    ? `Click on the image to position "${data.fields.find((f) => f.key === selectedFieldKey)?.label ?? selectedFieldKey}"`
                    : "Select a field from the list to position it"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center h-[600px]">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="border rounded-md p-4 bg-muted/20">
                    <img
                      ref={imageRef}
                      src={data.previewPngUrl}
                      alt={`Preview of ${formType} page ${page}`}
                      onClick={handleImageClick}
                      className="w-full h-auto cursor-crosshair"
                      style={{ maxHeight: "600px", objectFit: "contain" }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

