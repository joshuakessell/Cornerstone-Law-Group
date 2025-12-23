import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COMPANY_INFO } from "@/lib/content";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number required"),
  topic: z.string({ required_error: "Please select a topic" }),
  message: z.string().min(10, "Please provide a brief message")
});

export default function Contact() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: ""
    }
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Form submitted:", data);
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
                          <SelectItem value="mediation">Mediation</SelectItem>
                          <SelectItem value="estate">Estate Planning</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="text-base">Message (Optional)</Label>
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
