import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { COMPANY_INFO } from "@/lib/content";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Clock, CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number required"),
  topic: z.string({ required_error: "Please select a topic" }),
  message: z.string().optional(),
  // Divorce fields
  divorceActiveCase: z.string().optional(),
  divorceCauseNumber: z.string().optional(),
  divorceWithChildren: z.string().optional(),
  divorceCollaborative: z.string().optional(),
  // Modification/Enforcement fields
  modificationCauseNumber: z.string().optional(),
  modificationCounty: z.string().optional(),
  // Premarital/Marital fields
  maritalPlanningMarriage: z.string().optional(),
  maritalHasDate: z.string().optional(),
  maritalWeddingDate: z.date().optional(),
  maritalPropertyAgreement: z.string().optional(),
}).refine((data) => {
  // Divorce: if active case is yes, cause number is required
  if (data.topic === "divorce" && data.divorceActiveCase === "yes") {
    return !!data.divorceCauseNumber;
  }
  return true;
}, {
  message: "Cause number is required when active case is pending",
  path: ["divorceCauseNumber"],
}).refine((data) => {
  // Premarital: if planning marriage and has date is yes, wedding date is required
  if (data.topic === "premarital" && data.maritalPlanningMarriage === "yes" && data.maritalHasDate === "yes") {
    return !!data.maritalWeddingDate;
  }
  return true;
}, {
  message: "Wedding date is required",
  path: ["maritalWeddingDate"],
});

export default function Contact() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const topic = form.watch("topic");
  const divorceActiveCase = form.watch("divorceActiveCase");
  const maritalPlanningMarriage = form.watch("maritalPlanningMarriage");
  const maritalHasDate = form.watch("maritalHasDate");

  const onSubmit = (_data: z.infer<typeof formSchema>) => {
    toast({
      title: "Message Sent",
      description: "Thank you for contacting us. We will reach out shortly to schedule your consultation.",
      duration: 5000,
    });
    form.reset();
  };

  return (
    <>
      <div className="bg-primary text-white py-24 md:py-32">
        <div className="container mx-auto px-6 md:px-12">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl leading-relaxed">
            Take the first step towards clarity. Schedule a consultation to discuss your case with our experienced team.
          </p>
        </div>
      </div>

      <Section padded>
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Form */}
          <div>
            <h2 className="font-serif text-3xl font-bold text-primary mb-8">Send us a Message</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="text-base">Full Name</Label>
                      <FormControl>
                        <Input placeholder="Jane Doe" className="h-12 bg-gray-50 border-gray-200" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="text-base">Email Address</Label>
                        <FormControl>
                          <Input placeholder="jane@example.com" className="h-12 bg-gray-50 border-gray-200" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="text-base">Phone Number</Label>
                        <FormControl>
                          <Input placeholder="(214) 555-0123" className="h-12 bg-gray-50 border-gray-200" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="text-base">How can we help?</Label>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 bg-gray-50 border-gray-200">
                            <SelectValue placeholder="Select a topic" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="divorce">Divorce</SelectItem>
                          <SelectItem value="custody">Child Custody</SelectItem>
                          <SelectItem value="modification">Modification</SelectItem>
                          <SelectItem value="enforcement">Enforcement</SelectItem>
                          <SelectItem value="premarital">Premarital Agreement</SelectItem>
                          <SelectItem value="marital">Marital Agreement</SelectItem>
                          <SelectItem value="mediation">Mediation</SelectItem>
                          <SelectItem value="estate">Estate Planning</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Divorce Conditional Fields */}
                {topic === "divorce" && (
                  <div className="space-y-6 p-4 bg-muted/50 rounded-lg border border-border">
                    <FormField
                      control={form.control}
                      name="divorceActiveCase"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Do you have an active case pending?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex gap-6"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="divorce-active-yes" />
                                <Label htmlFor="divorce-active-yes" className="cursor-pointer">Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="divorce-active-no" />
                                <Label htmlFor="divorce-active-no" className="cursor-pointer">No</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {divorceActiveCase === "yes" && (
                      <FormField
                        control={form.control}
                        name="divorceCauseNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">Cause Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter cause number" className="h-12 bg-gray-50 border-gray-200" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="divorceWithChildren"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Do you have children?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex gap-6"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="divorce-children-yes" />
                                <Label htmlFor="divorce-children-yes" className="cursor-pointer">Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="divorce-children-no" />
                                <Label htmlFor="divorce-children-no" className="cursor-pointer">No</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="divorceCollaborative"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Are you interested in collaborative divorce?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex gap-6"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="divorce-collab-yes" />
                                <Label htmlFor="divorce-collab-yes" className="cursor-pointer">Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="divorce-collab-no" />
                                <Label htmlFor="divorce-collab-no" className="cursor-pointer">No</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Modification/Enforcement Conditional Fields */}
                {(topic === "modification" || topic === "enforcement") && (
                  <div className="space-y-6 p-4 bg-muted/50 rounded-lg border border-border">
                    <FormField
                      control={form.control}
                      name="modificationCauseNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Existing Cause Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter cause number" className="h-12 bg-gray-50 border-gray-200" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="modificationCounty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">County Case Filed In</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter county name" className="h-12 bg-gray-50 border-gray-200" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Premarital/Marital Conditional Fields */}
                {(topic === "premarital" || topic === "marital") && (
                  <div className="space-y-6 p-4 bg-muted/50 rounded-lg border border-border">
                    {topic === "premarital" && (
                      <>
                        <FormField
                          control={form.control}
                          name="maritalPlanningMarriage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base">Are you planning to get married?</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  className="flex gap-6"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="yes" id="marital-planning-yes" />
                                    <Label htmlFor="marital-planning-yes" className="cursor-pointer">Yes</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="no" id="marital-planning-no" />
                                    <Label htmlFor="marital-planning-no" className="cursor-pointer">No</Label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {maritalPlanningMarriage === "yes" && (
                          <>
                            <FormField
                              control={form.control}
                              name="maritalHasDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-base">Do you have a wedding date?</FormLabel>
                                  <FormControl>
                                    <RadioGroup
                                      onValueChange={field.onChange}
                                      value={field.value}
                                      className="flex gap-6"
                                    >
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="yes" id="marital-date-yes" />
                                        <Label htmlFor="marital-date-yes" className="cursor-pointer">Yes</Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="no" id="marital-date-no" />
                                        <Label htmlFor="marital-date-no" className="cursor-pointer">No</Label>
                                      </div>
                                    </RadioGroup>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {maritalHasDate === "yes" && (
                              <FormField
                                control={form.control}
                                name="maritalWeddingDate"
                                render={({ field }) => (
                                  <FormItem className="flex flex-col">
                                    <FormLabel className="text-base">Wedding Date</FormLabel>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <FormControl>
                                          <Button
                                            variant="outline"
                                            className={cn(
                                              "h-12 w-full justify-start text-left font-normal bg-gray-50 border-gray-200",
                                              !field.value && "text-muted-foreground"
                                            )}
                                          >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                          </Button>
                                        </FormControl>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                          mode="single"
                                          selected={field.value}
                                          onSelect={field.onChange}
                                          disabled={(date) => date < new Date()}
                                          initialFocus
                                        />
                                      </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            )}
                          </>
                        )}
                      </>
                    )}

                    <FormField
                      control={form.control}
                      name="maritalPropertyAgreement"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">
                            {topic === "premarital"
                              ? "Are you presently married and looking to make a property agreement?"
                              : "Are you looking to make a property agreement?"}
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex gap-6"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="marital-property-yes" />
                                <Label htmlFor="marital-property-yes" className="cursor-pointer">Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="marital-property-no" />
                                <Label htmlFor="marital-property-no" className="cursor-pointer">No</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Message field - required for "other", optional otherwise */}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        {topic === "other" ? "Message" : "Additional Message (Optional)"}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please briefly describe your situation..."
                          className="min-h-[150px] bg-gray-50 border-gray-200 resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" size="lg" className="w-full rounded-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg">
                  Request Consultation
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-4">
                  Submitting this form does not create an attorney-client relationship.
                </p>
              </form>
            </Form>
          </div>

          {/* Contact Info & Map */}
          <div className="space-y-12">
            <div>
              <h2 className="font-serif text-3xl font-bold text-primary mb-8">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary mb-1">Office Address</h3>
                    <p className="text-foreground/90 text-lg">
                      {COMPANY_INFO.address.street}<br/>
                      {COMPANY_INFO.address.city}, {COMPANY_INFO.address.state} {COMPANY_INFO.address.zip}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                     <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary mb-1">Phone</h3>
                    <a href={`tel:${COMPANY_INFO.phone}`} className="text-foreground/90 text-lg hover:text-accent transition-colors">
                      {COMPANY_INFO.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                     <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary mb-1">Email</h3>
                    <a href={`mailto:${COMPANY_INFO.email}`} className="text-foreground/90 text-lg hover:text-accent transition-colors">
                      {COMPANY_INFO.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                     <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary mb-1">Hours</h3>
                    <p className="text-foreground/90">
                      Mon – Thu: {COMPANY_INFO.hours.mon_thu}<br/>
                      Fri: {COMPANY_INFO.hours.fri}<br/>
                      Sat – Sun: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-muted rounded-xl overflow-hidden h-[300px] relative border border-border shadow-inner flex items-center justify-center">
              <div className="text-center p-6">
                <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground font-medium">Map Component Placeholder</p>
                <p className="text-muted-foreground/70 text-sm mt-2">Embedded Google Map would load here.</p>
                <p className="text-primary font-bold mt-4">{COMPANY_INFO.address.street}, {COMPANY_INFO.address.city}</p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
