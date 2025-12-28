import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import {
  ArrowRight,
  ArrowLeft,
  Download,
  FileText,
  CheckCircle,
  Eye,
  Loader2,
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { CompletedForm, fetchCompletedForms, submitPacket } from "@/intake/api";
import {
  PacketMeta,
  ensurePacketForCategory,
  getActivePacket,
  getOrCreateSessionId,
  normalizeCategory,
} from "@/intake/session";

type MatterType = 
  | "divorce"
  | "modification"
  | "enforcement"
  | "adoption"
  | "mediation"
  | "marital-agreement"
  | "prenuptial-agreement"
  | "wills-trusts-estates"
  | "not-sure"
  | "unsure"
  | null;

type CompletedDocument = {
  id: string;
  name: string;
  url: string;
  blobRef?: string;
  createdAt: string;
};

export default function ClientIntake() {
  const { toast } = useToast();
  const [matterType, setMatterType] = useState<MatterType>(null);
  const [packet, setPacket] = useState<PacketMeta | null>(() => getActivePacket());
  const [viewerForm, setViewerForm] = useState<CompletedForm | null>(null);
  const [viewerPage, setViewerPage] = useState(1);

  const matterOptions = useMemo(
    () => [
      { id: "divorce" as MatterType, label: "Divorce", description: "Dissolution of marriage" },
      { id: "modification" as MatterType, label: "Modification", description: "Modify existing orders" },
      { id: "enforcement" as MatterType, label: "Enforcement", description: "Enforce court orders" },
      { id: "adoption" as MatterType, label: "Adoption", description: "Adoption proceedings" },
      { id: "mediation" as MatterType, label: "Mediation", description: "Mediation services" },
      { id: "marital-agreement" as MatterType, label: "Marital Agreement", description: "Postnuptial agreements" },
      { id: "prenuptial-agreement" as MatterType, label: "Prenuptial Agreement", description: "Prenuptial agreements" },
      { id: "wills-trusts-estates" as MatterType, label: "Wills/Trusts/Estates", description: "Estate planning" },
      { id: "not-sure" as MatterType, label: "Not sure", description: "I'm not sure what I need" },
    ],
    [],
  );

  useEffect(() => {
    const active = getActivePacket();
    if (active) {
      setPacket(active);
      const match = matterOptions.find((option) => normalizeCategory(option.id) === active.category);
      if (match) {
        setMatterType(match.id);
      }
    }
  }, [matterOptions]);

  const sessionId = useMemo(() => packet?.sessionId ?? getOrCreateSessionId(), [packet]);

  const handleMatterSelect = (type: MatterType) => {
    setMatterType(type);
    setViewerForm(null);
    if (type && type !== "not-sure" && type !== "unsure") {
      const nextPacket = ensurePacketForCategory(type);
      setPacket(nextPacket);
    }
  };

  const getContinuePath = () => {
    if (!matterType || matterType === "not-sure") return null;
    const pathMap: Record<Exclude<MatterType, null>, string> = {
      divorce: "/intake/divorce",
      modification: "/intake/modification",
      enforcement: "/intake/enforcement",
      adoption: "/intake/adoption",
      mediation: "/intake/mediation",
      "marital-agreement": "/intake/marital-agreement",
      "prenuptial-agreement": "/intake/prenuptial-agreement",
      "wills-trusts-estates": "/intake/wills-trusts-estates",
      "not-sure": "",
      unsure: "",
    };
    return pathMap[matterType] || null;
  };

  const hasContinueForm = getContinuePath() !== null;

  const getDocxFileName = (matter: MatterType): string | null => {
    if (!matter || matter === "not-sure" || matter === "unsure") return null;

    const docxMap: Record<string, string> = {
      divorce: "Intake - Divorce.docx",
      modification: "Intake - Modification.docx",
      enforcement: "Intake - Enforcement.docx",
      adoption: "Intake - Adoption.docx",
      mediation: "Intake - Mediation.docx",
      "marital-agreement": "Intake - Marital Agreement.docx",
      "prenuptial-agreement": "Intake - Prenuptual Agreement.docx",
      "wills-trusts-estates": "Intake - Wills Trusts & Estates.docx",
    };

    return docxMap[matter] || null;
  };

  const normalizedCategory = normalizeCategory(matterType ?? packet?.category ?? "unsure");

  const completedQuery = useQuery({
    queryKey: ["client-intake", "completed", sessionId, packet?.packetId],
    enabled: Boolean(sessionId && packet?.packetId),
    retry: false,
    queryFn: async () => {
      if (!sessionId || !packet?.packetId) {
        throw new Error("Missing packet");
      }
      try {
        return await fetchCompletedForms(sessionId, packet.packetId);
      } catch (error) {
        if (error instanceof Error && error.message.startsWith("404")) {
          return {
            sessionId,
            packetId: packet.packetId,
            category: packet.category,
            createdAt: new Date().toISOString(),
            completedForms: [],
          };
        }
        throw error;
      }
    },
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!sessionId || !packet?.packetId) throw new Error("Missing packet");
      await submitPacket(sessionId, packet.packetId);
    },
    onSuccess: () => {
      toast({
        title: "Submitted",
        description: "Email sent with your completed intake attachments.",
      });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Unable to submit right now.";
      toast({
        title: "Submit failed",
        description: message,
        variant: "destructive",
      });
    },
  });

  const completedForms = completedQuery.data?.completedForms ?? [];
  const hasCompletedForms = completedForms.length > 0;
  const basicCompleted = completedForms.some((f) => f.formType === "basic-intake");
  const categoryCompleted = completedForms.some((f) => f.formType === normalizedCategory);
  const showSubmit = basicCompleted && categoryCompleted;

  const formLabel = (formType: string) => {
    if (formType === "basic-intake") return "Basic Intake";
    return matterOptions.find((o) => normalizeCategory(o.id) === formType)?.label ?? formType;
  };

  // Transform CompletedForm[] to CompletedDocument[]
  const completedDocs: CompletedDocument[] = useMemo(() => {
    return completedForms.map((form) => ({
      id: form.formType,
      name: formLabel(form.formType),
      url: form.files.pdf,
      blobRef: form.files.pdf,
      createdAt: form.completedAt,
    }));
  }, [completedForms, matterOptions]);

  const hasCompleted = completedDocs.length > 0;
  const selectedIntakeType = matterType;

  const openViewer = (form: CompletedForm) => {
    setViewerForm(form);
    setViewerPage(1);
  };

  const currentPage = viewerPage;
  const totalPages = viewerForm?.pageCount ?? 1;
  const handlePageChange = (delta: number) => {
    setViewerPage((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > totalPages) return totalPages;
      return next;
    });
  };

  const selectedLabel = matterOptions.find((o) => o.id === matterType)?.label ?? "your matter";

  return (
    <div className="min-h-screen bg-background pb-20">
      <Section className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-2">
            Client Intake
          </h1>
          <p className="text-muted-foreground">
            Let's get started. We'll guide you through the intake process.
          </p>
        </div>

        {!matterType && (
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="font-serif text-2xl">What do you need help with?</CardTitle>
              <CardDescription>
                Select the type of legal matter you need assistance with.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {matterOptions.map((option) => (
                <Button
                  key={option.id}
                  onClick={() => handleMatterSelect(option.id)}
                  className="w-full justify-start h-auto py-4 cursor-pointer"
                  variant="outline"
                >
                  <div className="text-left">
                    <div className="font-semibold">{option.label}</div>
                    <div className="text-sm text-muted-foreground font-normal">
                      {option.description}
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
        )}

        {matterType && (
          <motion.div
            layout
            className={`grid gap-6 ${
              hasCompleted
                ? "lg:grid-cols-[2fr_1.1fr]"
                : "grid-cols-1"
            }`}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <motion.div layout className={hasCompleted ? "" : "max-w-2xl mx-auto w-full"}>
              <Card className="shadow-xl">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setMatterType(null)}
                      className="shrink-0"
                      aria-label="Go back"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex-1">
                      <CardTitle className="font-serif text-2xl">Let's Get Started</CardTitle>
                      <CardDescription>
                        Complete Basic Intake, then continue to your {selectedLabel.toLowerCase()} form.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className={`p-4 rounded-lg border ${basicCompleted ? "bg-muted text-muted-foreground" : "bg-muted/50"}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Start with Basic Intake
                        </p>
                        <p className="text-sm">
                          Collects essential information about you and your matter.
                        </p>
                      </div>
                      {basicCompleted && <CheckCircle className="h-5 w-5 text-primary" />}
                    </div>
                    <div className="space-y-3">
                      <Button
                        asChild
                        className="w-full"
                        size="lg"
                        variant={basicCompleted ? "outline" : "default"}
                        disabled={basicCompleted}
                      >
                        <Link href="/intake/basic" onClick={() => window.scrollTo(0, 0)}>
                          {basicCompleted ? "Basic Intake Completed" : "Start Basic Information"}
                          {!basicCompleted && <ArrowRight className="w-4 h-4 ml-2" />}
                        </Link>
                      </Button>
                      <a
                        href="/documents/Intake Basic Information.docx"
                        download
                        className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors border border-border rounded-md hover:bg-muted/50"
                      >
                        <Download className="w-4 h-4" />
                        <FileText className="w-4 h-4" />
                        Download Basic Intake Form (DOCX)
                      </a>
                    </div>
                  </div>

                  {hasContinueForm && (
                    <div className={`p-4 rounded-lg border ${categoryCompleted ? "bg-muted text-muted-foreground" : basicCompleted ? "bg-amber-50 border-amber-200" : "bg-muted/30"}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {categoryCompleted ? "Category Intake completed" : "Next step"}
                          </p>
                          <p className="text-sm">
                            Continue with the {selectedLabel.toLowerCase()} intake for details.
                          </p>
                        </div>
                        {(basicCompleted || categoryCompleted) && categoryCompleted && <CheckCircle className="h-5 w-5 text-primary" />}
                      </div>
                      <div className="space-y-3">
                        <Button
                          asChild
                          size="lg"
                          variant={categoryCompleted ? "outline" : "secondary"}
                          className={
                            categoryCompleted
                              ? "w-full"
                              : basicCompleted
                                ? "w-full bg-amber-100 text-amber-900 hover:bg-amber-100 border-amber-200"
                                : "w-full"
                          }
                          disabled={!hasContinueForm || categoryCompleted}
                        >
                          <Link href={getContinuePath()!} onClick={() => window.scrollTo(0, 0)}>
                            {categoryCompleted ? `${selectedLabel} Intake Completed` : `Continue to ${selectedLabel} Intake`}
                            {!categoryCompleted && <ArrowRight className="w-4 h-4 ml-2" />}
                          </Link>
                        </Button>
                        {getDocxFileName(matterType) && (
                          <a
                            href={`/documents/${getDocxFileName(matterType)}`}
                            download
                            className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors border border-border rounded-md hover:bg-muted/50"
                          >
                            <Download className="w-4 h-4" />
                            <FileText className="w-4 h-4" />
                            Download {selectedLabel} Intake Form (DOCX)
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {!hasContinueForm && matterType !== "not-sure" && (
                    <div className="border rounded-lg p-4 bg-muted/30">
                      <p className="text-sm text-muted-foreground mb-4">
                        A detailed intake form for {selectedLabel.toLowerCase()} is coming next.
                        For now, please complete the basic intake form above.
                      </p>
                      {getDocxFileName(matterType) && (
                        <a
                          href={`/documents/${getDocxFileName(matterType)}`}
                          download
                          className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors border border-border rounded-md hover:bg-muted/50"
                        >
                          <Download className="w-4 h-4" />
                          <FileText className="w-4 h-4" />
                          Download {selectedLabel} Intake Form (DOCX)
                        </a>
                      )}
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      Need to speak with someone directly?
                    </p>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/contact" onClick={() => window.scrollTo(0, 0)}>Contact Us</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <AnimatePresence mode="wait">
              {hasCompleted && (
                <motion.div
                  layout
                  key="completed-documents"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="w-full"
                >
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle>Completed Documents</CardTitle>
                      <CardDescription>View, download, and submit your completed packet.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        {completedDocs.map((doc) => {
                          const originalForm = completedForms.find((f) => f.formType === doc.id);
                          if (!originalForm) return null;
                          return (
                            <div
                              key={doc.id}
                              className="flex gap-3 items-start border rounded-md p-3 hover:bg-muted/50 cursor-pointer"
                              onClick={() => openViewer(originalForm)}
                            >
                              <div className="w-16 h-20 overflow-hidden rounded-md border bg-muted/40 flex items-center justify-center">
                                {originalForm.files.thumb ? (
                                  <img src={originalForm.files.thumb} alt={`${doc.name} thumbnail`} className="h-full w-full object-cover" />
                                ) : (
                                  <FileText className="h-8 w-8 text-muted-foreground" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium truncate">{doc.name}</p>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    asChild
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <a href={doc.url} download aria-label={`Download ${doc.name}`}>
                                      <Download className="h-4 w-4" />
                                    </a>
                                  </Button>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(doc.createdAt).toLocaleString()}
                                </p>
                              </div>
                              <Eye className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
                            </div>
                          );
                        })}
                      </div>

                      {showSubmit && (
                        <Button
                          className="w-full"
                          onClick={() => submitMutation.mutate()}
                          disabled={submitMutation.isPending}
                        >
                          {submitMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                          Submit Now
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </Section>

      <Dialog open={!!viewerForm} onOpenChange={(open) => !open && setViewerForm(null)}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>{viewerForm ? formLabel(viewerForm.formType) : "Completed form"}</DialogTitle>
            <DialogDescription>
              Page {currentPage} of {totalPages}
            </DialogDescription>
          </DialogHeader>
          {viewerForm && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {new Date(viewerForm.completedAt).toLocaleString()}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(-1)}
                    disabled={currentPage <= 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage >= totalPages}
                  >
                    Next
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={viewerForm.files.pdf} download>
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </a>
                  </Button>
                </div>
              </div>
              <div className="border rounded-md overflow-hidden h-[70vh]">
                <iframe
                  src={`${viewerForm.files.pdf}#page=${currentPage}`}
                  title="Completed form preview"
                  className="w-full h-full"
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
