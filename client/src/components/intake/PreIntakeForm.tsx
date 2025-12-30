import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";

type ServiceType = 
  | "divorce"
  | "modification"
  | "enforcement"
  | "adoption"
  | "mediation"
  | "marital-agreement"
  | "prenuptial-agreement"
  | "wills-trusts-estates";

interface PreIntakeData {
  fullName: string;
  email: string;
  phone: string;
  serviceType: ServiceType;
  // Divorce routing questions
  hasChildren?: "yes" | "no";
  activeCasePending?: "yes" | "no";
  // Modification/Enforcement routing questions
  existingCauseNumber?: string;
  countyFiledIn?: string;
  // Mediation routing questions
  // (uses activeCasePending)
  // Prenuptial/Marital Agreements routing questions
  planningToGetMarried?: "yes" | "no";
  haveDate?: "yes" | "no";
}

interface PreIntakeFormProps {
  serviceType: ServiceType;
  serviceLabel: string;
}

export function PreIntakeForm({ serviceType, serviceLabel }: PreIntakeFormProps) {
  const [, setLocation] = useLocation();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<PreIntakeData>({
    fullName: "",
    email: "",
    phone: "",
    serviceType,
  });

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    // Basic phone validation - allows digits, spaces, dashes, parentheses
    const cleaned = phone.replace(/[\s\-\(\)]/g, "");
    return /^\d{10,}$/.test(cleaned);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Validate required fields
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Service-specific validation
    if (serviceType === "divorce") {
      if (!formData.hasChildren) {
        newErrors.hasChildren = "Please select an option";
      }
      if (!formData.activeCasePending) {
        newErrors.activeCasePending = "Please select an option";
      }
    } else if (serviceType === "modification" || serviceType === "enforcement") {
      if (!formData.existingCauseNumber?.trim()) {
        newErrors.existingCauseNumber = "Cause number is required";
      }
      if (!formData.countyFiledIn?.trim()) {
        newErrors.countyFiledIn = "County is required";
      }
    } else if (serviceType === "mediation") {
      if (!formData.activeCasePending) {
        newErrors.activeCasePending = "Please select an option";
      }
    } else if (serviceType === "prenuptial-agreement" || serviceType === "marital-agreement") {
      if (!formData.planningToGetMarried) {
        newErrors.planningToGetMarried = "Please select an option";
      }
      if (formData.planningToGetMarried === "yes" && !formData.haveDate) {
        newErrors.haveDate = "Please select an option";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Save to localStorage as fallback
    const submission = {
      ...formData,
      submittedAt: new Date().toISOString(),
    };
    localStorage.setItem(`preIntake_${Date.now()}`, JSON.stringify(submission));

    // Try to save to backend if endpoint exists
    try {
      const response = await fetch("/api/pre-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      });
      if (!response.ok) {
        console.warn("Failed to save to backend, using localStorage fallback");
      }
    } catch (error) {
      console.warn("Backend not available, using localStorage fallback", error);
    }

    // Navigate to next steps page with service type
    setLocation(`/pre-intake/next-steps?service=${serviceType}`);
  };

  const updateField = (field: keyof PreIntakeData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Section className="max-w-2xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-4 mb-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation("/client-intake")}
                className="shrink-0"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex-1">
                <CardTitle className="font-serif text-2xl">Begin {serviceLabel} Intake</CardTitle>
                <CardDescription>
                  We'll collect some basic information, then guide you to our secure client portal.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  className={errors.fullName ? "border-destructive" : ""}
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive">{errors.fullName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className={errors.phone ? "border-destructive" : ""}
                  placeholder="(214) 555-1234"
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone}</p>
                )}
              </div>

              {/* Divorce routing questions */}
              {serviceType === "divorce" && (
                <>
                  <div className="space-y-3 pt-4 border-t">
                    <Label>Do you have children? *</Label>
                    <RadioGroup
                      value={formData.hasChildren}
                      onValueChange={(value) => updateField("hasChildren", value as "yes" | "no")}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="children-yes" />
                        <Label htmlFor="children-yes" className="font-normal cursor-pointer">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="children-no" />
                        <Label htmlFor="children-no" className="font-normal cursor-pointer">No</Label>
                      </div>
                    </RadioGroup>
                    {errors.hasChildren && (
                      <p className="text-sm text-destructive">{errors.hasChildren}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label>Do you have an active case pending? *</Label>
                    <RadioGroup
                      value={formData.activeCasePending}
                      onValueChange={(value) => updateField("activeCasePending", value as "yes" | "no")}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="case-yes" />
                        <Label htmlFor="case-yes" className="font-normal cursor-pointer">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="case-no" />
                        <Label htmlFor="case-no" className="font-normal cursor-pointer">No</Label>
                      </div>
                    </RadioGroup>
                    {errors.activeCasePending && (
                      <p className="text-sm text-destructive">{errors.activeCasePending}</p>
                    )}
                  </div>
                </>
              )}

              {/* Modification/Enforcement routing questions */}
              {(serviceType === "modification" || serviceType === "enforcement") && (
                <>
                  <div className="space-y-2 pt-4 border-t">
                    <Label htmlFor="existingCauseNumber">Existing Cause Number *</Label>
                    <Input
                      id="existingCauseNumber"
                      value={formData.existingCauseNumber || ""}
                      onChange={(e) => updateField("existingCauseNumber", e.target.value)}
                      className={errors.existingCauseNumber ? "border-destructive" : ""}
                    />
                    {errors.existingCauseNumber && (
                      <p className="text-sm text-destructive">{errors.existingCauseNumber}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="countyFiledIn">County Filed In *</Label>
                    <Input
                      id="countyFiledIn"
                      value={formData.countyFiledIn || ""}
                      onChange={(e) => updateField("countyFiledIn", e.target.value)}
                      className={errors.countyFiledIn ? "border-destructive" : ""}
                    />
                    {errors.countyFiledIn && (
                      <p className="text-sm text-destructive">{errors.countyFiledIn}</p>
                    )}
                  </div>
                </>
              )}

              {/* Mediation routing questions */}
              {serviceType === "mediation" && (
                <div className="space-y-3 pt-4 border-t">
                  <Label>Do you have an active case pending? *</Label>
                  <RadioGroup
                    value={formData.activeCasePending}
                    onValueChange={(value) => updateField("activeCasePending", value as "yes" | "no")}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="mediation-case-yes" />
                      <Label htmlFor="mediation-case-yes" className="font-normal cursor-pointer">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="mediation-case-no" />
                      <Label htmlFor="mediation-case-no" className="font-normal cursor-pointer">No</Label>
                    </div>
                  </RadioGroup>
                  {errors.activeCasePending && (
                    <p className="text-sm text-destructive">{errors.activeCasePending}</p>
                  )}
                </div>
              )}

              {/* Prenuptial/Marital Agreements routing questions */}
              {(serviceType === "prenuptial-agreement" || serviceType === "marital-agreement") && (
                <>
                  <div className="space-y-3 pt-4 border-t">
                    <Label>Are you planning to get married? *</Label>
                    <RadioGroup
                      value={formData.planningToGetMarried}
                      onValueChange={(value) => updateField("planningToGetMarried", value as "yes" | "no")}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="marriage-yes" />
                        <Label htmlFor="marriage-yes" className="font-normal cursor-pointer">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="marriage-no" />
                        <Label htmlFor="marriage-no" className="font-normal cursor-pointer">No</Label>
                      </div>
                    </RadioGroup>
                    {errors.planningToGetMarried && (
                      <p className="text-sm text-destructive">{errors.planningToGetMarried}</p>
                    )}
                  </div>

                  {formData.planningToGetMarried === "yes" && (
                    <div className="space-y-3">
                      <Label>Do you have a wedding date? *</Label>
                      <RadioGroup
                        value={formData.haveDate}
                        onValueChange={(value) => updateField("haveDate", value as "yes" | "no")}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="date-yes" />
                          <Label htmlFor="date-yes" className="font-normal cursor-pointer">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="date-no" />
                          <Label htmlFor="date-no" className="font-normal cursor-pointer">No</Label>
                        </div>
                      </RadioGroup>
                      {errors.haveDate && (
                        <p className="text-sm text-destructive">{errors.haveDate}</p>
                      )}
                    </div>
                  )}
                </>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/client-intake")}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button type="submit" className="flex-1">
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </Section>
    </div>
  );
}

