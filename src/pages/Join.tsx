/**
 * Join Page
 * 
 * Provides membership application forms for students, mentors, and partners.
 * Uses react-hook-form with zod validation for form management.
 */
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  course: z.string().optional(),
  organization: z.string().optional(),
  year: z.string().optional(),
  email: z.string().email("Invalid email address").max(255),
  contact: z.string().min(10, "Contact must be at least 10 digits").max(15),
  eventIdea: z.string().optional(),
  reason: z.string().min(20, "Please tell us more (minimum 20 characters)").max(1000),
  interests: z.array(z.string()).min(1, "Select at least one interest"),
  agreement: z.boolean().refine((val) => val === true, "You must agree to continue"),
});

type FormData = z.infer<typeof formSchema>;

const interests = [
  "Web Development",
  "AI & Machine Learning",
  "Cybersecurity",
  "Internet of Things (IoT)",
  "Robotics & Automation",
  "App Development",
  "Cloud Computing",
  "Blockchain Technology",
  "Data Science",
  "UI/UX Design",
  "AR/VR Development",
  "Game Development",
  "FinTech",
  "EdTech",
  "Renewable Energy Tech",
];

const Join = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("student");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      course: "",
      organization: "",
      year: "",
      email: "",
      contact: "",
      eventIdea: "",
      reason: "",
      interests: [],
      agreement: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`Form submitted for ${activeTab}:`, data);
    setIsSuccess(true);
    toast({
      title: "Application Submitted! 🎉",
      description: `Thank you for interest as a ${activeTab}. We'll contact you soon.`,
    });
    setTimeout(() => {
      form.reset();
      setIsSuccess(false);
    }, 5000);
    setIsSubmitting(false);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-24 flex items-center justify-center min-h-[80vh]">
          <Card className="max-w-2xl w-full glass border-0 shadow-2xl animate-scale-in">
            <CardContent className="pt-12 pb-8 text-center space-y-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-3xl font-heading font-light text-foreground uppercase tracking-widest">Success! 🎉</h2>
              <p className="text-foreground/60 text-lg font-light">
                Your application as a <span className="text-primary font-normal uppercase">{activeTab}</span> has been received.
                Our team will review it and get back to you soon.
              </p>
              <div className="pt-4 space-y-3 text-left bg-primary/5 rounded-2xl p-8">
                <h3 className="font-heading text-sm tracking-widest uppercase text-foreground/70 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Next Steps
                </h3>
                <ul className="space-y-3 text-sm font-light text-foreground/50">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Watch for a confirmation email in your inbox.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Follow @techshastra_utu for real-time updates.</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-24">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 space-y-6">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass text-[10px] tracking-[0.2em] uppercase text-primary font-medium">
              Join Our Ecosystem
            </div>
            <h1 className="text-4xl md:text-7xl font-heading font-light tracking-tight">
              <span className="text-foreground">Apply for </span>
              <span className="text-primary italic">Membership</span>
            </h1>
            <p className="text-lg text-foreground/50 max-w-2xl mx-auto font-light tracking-wide italic">
              "Innovate, Create, Dominate — Join the technical elite of Uttarakhand."
            </p>
          </div>

          <Tabs defaultValue="student" className="w-full space-y-12" onValueChange={setActiveTab}>
            <div className="flex justify-center">
              <TabsList className="glass h-16 p-1 bg-background/50 rounded-full border-0">
                <TabsTrigger value="student" className="rounded-full px-8 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-500 font-light tracking-widest uppercase text-[10px]">Students</TabsTrigger>
                <TabsTrigger value="mentor" className="rounded-full px-8 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-500 font-light tracking-widest uppercase text-[10px]">Mentors</TabsTrigger>
                <TabsTrigger value="partner" className="rounded-full px-8 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-500 font-light tracking-widest uppercase text-[10px]">Partners</TabsTrigger>
              </TabsList>
            </div>

            <Card className="glass border-0 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="p-10 pb-0 space-y-2">
                <CardTitle className="text-2xl font-heading font-light tracking-wide flex items-center gap-3">
                  <User className="w-6 h-6 text-primary" />
                  {activeTab === "student" && "Student Registration"}
                  {activeTab === "mentor" && "Mentor Application"}
                  {activeTab === "partner" && "Strategic Partnership"}
                </CardTitle>
                <CardDescription className="font-light tracking-wide text-foreground/40 italic">
                  Complete the form below to begin your journey with TECHSHASTRA.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-10 pt-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
                    {/* Basic Info */}
                    <div className="grid md:grid-cols-2 gap-8">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="space-y-4">
                            <FormLabel className="text-xs font-light tracking-widest uppercase text-foreground/50">Full Name</FormLabel>
                            <FormControl>
                              <Input {...field} className="glass h-14 rounded-2xl border-0 focus-visible:ring-1 focus-visible:ring-primary/30" placeholder="Ex: Akhilesh Raje" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="space-y-4">
                            <FormLabel className="text-xs font-light tracking-widest uppercase text-foreground/50">Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} className="glass h-14 rounded-2xl border-0 focus-visible:ring-1 focus-visible:ring-primary/30" placeholder="your@email.com" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <FormField
                        control={form.control}
                        name="contact"
                        render={({ field }) => (
                          <FormItem className="space-y-4">
                            <FormLabel className="text-xs font-light tracking-widest uppercase text-foreground/50">Contact Number</FormLabel>
                            <FormControl>
                              <Input type="tel" {...field} className="glass h-14 rounded-2xl border-0 focus-visible:ring-1 focus-visible:ring-primary/30" placeholder="+91 XXXXXXXXXX" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {activeTab === "student" ? (
                        <FormField
                          control={form.control}
                          name="course"
                          render={({ field }) => (
                            <FormItem className="space-y-4">
                              <FormLabel className="text-xs font-light tracking-widest uppercase text-foreground/50">Course/Branch</FormLabel>
                              <FormControl>
                                <Input {...field} className="glass h-14 rounded-2xl border-0 focus-visible:ring-1 focus-visible:ring-primary/30" placeholder="B.Tech CSE" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ) : (
                        <FormField
                          control={form.control}
                          name="organization"
                          render={({ field }) => (
                            <FormItem className="space-y-4">
                              <FormLabel className="text-xs font-light tracking-widest uppercase text-foreground/50">Current Organization</FormLabel>
                              <FormControl>
                                <Input {...field} className="glass h-14 rounded-2xl border-0 focus-visible:ring-1 focus-visible:ring-primary/30" placeholder="Company or Institution" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>

                    {/* Domains Selection */}
                    <FormField
                      control={form.control}
                      name="interests"
                      render={() => (
                        <FormItem className="space-y-6">
                          <FormLabel className="text-xs font-light tracking-widest uppercase text-foreground/50">Domains of Interest (Multi-select)</FormLabel>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                            {interests.map((interest) => (
                              <FormField
                                key={interest}
                                control={form.control}
                                name="interests"
                                render={({ field }) => (
                                  <FormItem key={interest}>
                                    <FormControl>
                                      <div className="relative group">
                                        <Checkbox
                                          id={interest}
                                          checked={field.value?.includes(interest)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, interest])
                                              : field.onChange(field.value?.filter((value) => value !== interest));
                                          }}
                                          className="peer sr-only"
                                        />
                                        <label
                                          htmlFor={interest}
                                          className="flex items-center justify-center rounded-xl glass p-4 text-center hover:bg-primary/5 peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground cursor-pointer transition-all duration-300 min-h-[60px]"
                                        >
                                          <span className="text-[10px] uppercase font-light tracking-widest">{interest}</span>
                                        </label>
                                      </div>
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Motivation */}
                    <FormField
                      control={form.control}
                      name="reason"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <FormLabel className="text-xs font-light tracking-widest uppercase text-foreground/50">What is your motivation for joining TECHSHASTRA?</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about your innovative spirit..."
                              className="glass min-h-[150px] rounded-2xl border-0 focus-visible:ring-1 focus-visible:ring-primary/30 resize-none p-6 font-light italic"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="agreement"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-4 space-y-0 p-6 glass rounded-2xl bg-primary/5">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1">
                            <FormLabel className="text-xs font-light tracking-widest uppercase text-foreground/60 cursor-pointer">
                              I align with TechShastra's collective vision and values.
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full h-16 rounded-full bg-primary text-primary-foreground font-heading font-light tracking-widest uppercase text-sm hover:scale-[1.01] transition-all duration-500 shadow-2xl"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Processing Application..." : "Submit Application"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Join;
