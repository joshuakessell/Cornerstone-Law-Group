import { useState, useEffect } from "react";
import { Section } from "@/components/ui/section";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";

const submitsKey = () => `cs_intake_submissions_v1`;

interface Submission {
  intakeType: string;
  title: string;
  submittedAt: string;
  answers: Record<string, unknown>;
}

export default function IntakeSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(submitsKey());
      if (raw) {
        const parsed = JSON.parse(raw);
        setSubmissions(Array.isArray(parsed) ? parsed : []);
      }
    } catch (e) {
      console.error("Failed to load submissions:", e);
    }
  }, []);

  const toggleExpand = (index: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 pt-24">
      <Section container>
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-primary">Intake Submissions (POC)</h1>
          <p className="text-muted-foreground">View submissions stored in localStorage</p>
        </div>

        {submissions.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No submissions found.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {submissions.map((sub, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg">{sub.title}</CardTitle>
                        <Badge variant="secondary">{sub.intakeType}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Submitted: {formatDate(sub.submittedAt)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleExpand(index)}
                    >
                      {expanded.has(index) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                {expanded.has(index) && (
                  <CardContent>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <pre className="text-xs overflow-auto">
                        {JSON.stringify(sub, null, 2)}
                      </pre>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}


