import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { CheckCircle2, ChevronRight, ChevronLeft, Save } from "lucide-react";
import { Section } from "@/components/ui/section";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

// --- Schema Definitions ---

const personalSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  address: z.string().min(5, "Full address is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Invalid email address"),
  occupation: z.string().optional(),
  employer: z.string().optional(),
});

const opposingSchema = z.object({
  opposingName: z.string().min(2, "Opposing party name is required"),
  relationship: z.string().min(1, "Relationship type is required"),
  dateOfMarriage: z.string().optional(),
  dateOfSeparation: z.string().optional(),
  opposingAttorney: z.string().optional(),
});

const childrenSchema = z.object({
  hasChildren: z.enum(["yes", "no"]),
  childrenDetails: z.string().optional(), // keeping it simple as a text area for the mockup
});

const issuesSchema = z.object({
  primaryIssue: z.string().min(1, "Please select a primary issue"),
  description: z.string().min(20, "Please provide a brief description of the situation"),
  goals: z.string().min(10, "Please describe your primary goals"),
});

// Combined schema for the final review/submit
const formSchema = z.intersection(
  z.intersection(personalSchema, opposingSchema),
  z.intersection(childrenSchema, issuesSchema)
);

type FormData = z.infer<typeof formSchema>;

const STEPS = [
  { id: 1, title: "Personal Information", description: "Tell us about yourself" },
  { id: 2, title: "Opposing Party", description: "Information about your spouse or partner" },
  { id: 3, title: "Children", description: "Details about children involved" },
  { id: 4, title: "Legal Issues", description: "How can we help you?" },
  { id: 5, title: "Review", description: "Confirm your details" },
];

export default function ClientIntake() {
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  // Initialize form with combined schema, but we will validate partially per step
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema), // This resolves the FULL schema
    mode: "onChange",
    defaultValues: {
      hasChildren: "no",
    }
  });

  const { trigger, getValues, watch } = form;

  // Watch fields for dynamic display in review
  const values = watch();

  const nextStep = async () => {
    let isValid = false;
    
    // Validate fields for current step
    if (step === 1) {
      isValid = await trigger(["fullName", "dateOfBirth", "address", "phone", "email"]);
    } else if (step === 2) {
      isValid = await trigger(["opposingName", "relationship"]);
    } else if (step === 3) {
      isValid = await trigger(["hasChildren"]);
    } else if (step === 4) {
      isValid = await trigger(["primaryIssue", "description", "goals"]);
    } else {
      isValid = true;
    }

    if (isValid) {
      setStep(s => s + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setStep(s => s - 1);
    window.scrollTo(0, 0);
  };

  const onSubmit = (data: FormData) => {
    // Mock Database Submission
    const submissions = JSON.parse(localStorage.getItem("intake_submissions") || "[]");
    const newSubmission = {
      id: Date.now(),
      submittedAt: new Date().toISOString(),
      status: "New",
      data: data
    };
    localStorage.setItem("intake_submissions", JSON.stringify([...submissions, newSubmission]));

    setSubmitted(true);
    toast({
      title: "Intake Form Submitted",
      description: "Your information has been securely received. We will review it shortly.",
    });
    window.scrollTo(0, 0);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-muted/30 pt-32 pb-20 px-6">
        <Card className="max-w-xl mx-auto text-center p-12 shadow-lg border-primary/10">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-primary mb-4">Submission Received</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Thank you for completing the Client Intake Form. Your information has been securely recorded. 
            One of our team members will review your details and contact you within 24 business hours.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/">Return Home</Link>
            </Button>
            <Button asChild className="rounded-full bg-primary text-white">
              <Link href="/client-area">Back to Client Area</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pt-32 pb-20">
      <Section className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-2">New Client Intake</h1>
          <p className="text-gray-600">Please provide your details so we can better understand your case.</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8 px-2 md:px-8 relative">
           <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10 transform -translate-y-1/2 hidden md:block"></div>
           {STEPS.map((s) => (
             <div key={s.id} className={`flex flex-col items-center gap-2 relative z-10 bg-muted/30 px-2 ${step >= s.id ? "text-primary" : "text-gray-400"}`}>
               <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                 step >= s.id ? "bg-primary text-white border-primary" : "bg-white border-gray-300"
               }`}>
                 {step > s.id ? <CheckCircle2 className="w-5 h-5" /> : s.id}
               </div>
               <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider hidden md:block">{s.title}</span>
             </div>
           ))}
        </div>

        <Card className="shadow-xl border-t-4 border-t-primary">
          <CardHeader>
            <CardTitle className="font-serif text-2xl">{STEPS[step-1].title}</CardTitle>
            <CardDescription>{STEPS[step-1].description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="space-y-6">
                
                {/* Step 1: Personal Info */}
                {step === 1 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="fullName" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Legal Name</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl><Input type="date" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="address" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Address</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="occupation" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Occupation (Optional)</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="employer" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employer (Optional)</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </div>
                )}

                {/* Step 2: Opposing Party */}
                {step === 2 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                     <FormField control={form.control} name="opposingName" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Opposing Party Name (Spouse/Partner)</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="relationship" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Relationship to You</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select relationship" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="spouse">Spouse</SelectItem>
                              <SelectItem value="partner">Partner</SelectItem>
                              <SelectItem value="parent">Other Parent</SelectItem>
                              <SelectItem value="relative">Relative</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                       <div className="grid md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="dateOfMarriage" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Marriage (if applicable)</FormLabel>
                            <FormControl><Input type="date" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="dateOfSeparation" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Separation</FormLabel>
                            <FormControl><Input type="date" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                       <FormField control={form.control} name="opposingAttorney" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Does the other party have an attorney? (Name if known)</FormLabel>
                          <FormControl><Input {...field} placeholder="Leave blank if unknown" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                  </div>
                )}

                {/* Step 3: Children */}
                {step === 3 && (
                   <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                      <FormField control={form.control} name="hasChildren" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Are there minor children involved?</FormLabel>
                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />

                      {watch("hasChildren") === "yes" && (
                         <FormField control={form.control} name="childrenDetails" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Please list names and dates of birth for all children</FormLabel>
                            <FormControl>
                              <Textarea {...field} className="min-h-[150px]" placeholder="Example:&#10;John Doe, DOB: 01/01/2015&#10;Jane Doe, DOB: 05/12/2018" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      )}
                   </div>
                )}

                {/* Step 4: Legal Issues */}
                {step === 4 && (
                   <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                     <FormField control={form.control} name="primaryIssue" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Legal Issue</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select the main issue" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="divorce">Divorce</SelectItem>
                              <SelectItem value="custody">Child Custody / Support</SelectItem>
                              <SelectItem value="modification">Modification of Order</SelectItem>
                              <SelectItem value="enforcement">Enforcement</SelectItem>
                              <SelectItem value="agreement">Premarital/Marital Agreement</SelectItem>
                              <SelectItem value="adoption">Adoption</SelectItem>
                              <SelectItem value="estate">Estate Planning</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                      
                      <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brief Description of Situation</FormLabel>
                          <FormControl>
                            <Textarea {...field} className="min-h-[120px]" placeholder="Please describe why you are seeking legal counsel..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="goals" render={({ field }) => (
                        <FormItem>
                          <FormLabel>What are your primary goals?</FormLabel>
                          <FormControl>
                            <Textarea {...field} className="min-h-[100px]" placeholder="What is the most important outcome for you?" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                   </div>
                )}

                {/* Step 5: Review */}
                {step === 5 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="bg-gray-50 p-6 rounded-lg space-y-4 text-sm">
                      <div>
                        <h4 className="font-bold text-primary border-b border-gray-200 pb-1 mb-2">Personal Information</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <p><span className="text-gray-500">Name:</span> {values.fullName}</p>
                          <p><span className="text-gray-500">DOB:</span> {values.dateOfBirth}</p>
                          <p><span className="text-gray-500">Phone:</span> {values.phone}</p>
                          <p><span className="text-gray-500">Email:</span> {values.email}</p>
                          <p className="col-span-2"><span className="text-gray-500">Address:</span> {values.address}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-primary border-b border-gray-200 pb-1 mb-2">Opposing Party</h4>
                        <div className="grid grid-cols-2 gap-2">
                           <p><span className="text-gray-500">Name:</span> {values.opposingName}</p>
                           <p><span className="text-gray-500">Relation:</span> {values.relationship}</p>
                           <p><span className="text-gray-500">Marriage:</span> {values.dateOfMarriage || "N/A"}</p>
                           <p><span className="text-gray-500">Separation:</span> {values.dateOfSeparation || "N/A"}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-primary border-b border-gray-200 pb-1 mb-2">Case Details</h4>
                        <p><span className="text-gray-500">Issue:</span> {values.primaryIssue}</p>
                        <p className="mt-2"><span className="text-gray-500 block mb-1">Description:</span> {values.description}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground bg-blue-50 p-4 rounded-md">
                      <div className="min-w-4 mt-0.5">ℹ️</div>
                      <p>Please review your information carefully. Once submitted, your data will be securely stored and reviewed by our intake team.</p>
                    </div>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between border-t bg-gray-50/50 p-6">
            {step > 1 ? (
              <Button variant="outline" onClick={prevStep} className="gap-2">
                <ChevronLeft className="w-4 h-4" /> Previous
              </Button>
            ) : (
              <div></div> // Spacer
            )}
            
            {step < 5 ? (
              <Button onClick={nextStep} className="bg-primary hover:bg-primary/90 gap-2">
                Next Step <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
               <Button onClick={form.handleSubmit(onSubmit)} className="bg-accent hover:bg-accent/90 text-white gap-2 shadow-lg">
                Submit Intake Form <Save className="w-4 h-4" />
              </Button>
            )}
          </CardFooter>
        </Card>
      </Section>
    </div>
  );
}
