import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Sparkles,
  User,
  GraduationCap,
  Mail,
  Phone,
  Lightbulb,
  Heart,
  CheckCircle2,
  ArrowRight,
  Calendar,
} from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  course: z.string().min(2, "Please enter your course/branch").max(100),
  year: z.string().min(1, "Please select your current year"),
  email: z.string().email("Invalid email address").max(255),
  contact: z.string().min(10, "Contact must be at least 10 digits").max(15),
  eventIdea: z.string().min(10, "Please share your ideas (minimum 10 characters)").max(500),
  reason: z.string().min(20, "Please tell us more (minimum 20 characters)").max(1000),
  interests: z.array(z.string()).min(1, "Select at least one interest"),
  agreement: z.boolean().refine((val) => val === true, "You must agree to continue"),
});

type FormData = z.infer<typeof formSchema>;

const interests = [
  "Web Development",
  "AI/ML",
  "Cybersecurity",
  "IoT",
  "Robotics",
  "App Development",
  "Cloud Computing",
  "Blockchain",
];

const Join = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      course: "",
      year: "",
      email: "",
      contact: "",
      eventIdea: "",
      reason: "",
      interests: [],
      agreement: false,
    },
  });

  const watchedFields = form.watch();
  
  // Calculate progress based on filled fields
  const calculateProgress = () => {
    const fields = Object.keys(watchedFields);
    const filledFields = fields.filter((key) => {
      const value = watchedFields[key as keyof FormData];
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === "boolean") return value;
      return value && value.toString().length > 0;
    });
    return (filledFields.length / fields.length) * 100;
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log("Form submitted:", data);
    
    setIsSuccess(true);
    
    toast({
      title: "Application Submitted Successfully! 🎉",
      description: "Welcome to TECHSHASTRA! We'll contact you soon.",
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
          <Card className="max-w-2xl w-full border-primary/20 shadow-2xl animate-scale-in">
            <CardContent className="pt-12 pb-8 text-center space-y-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">Welcome to TECHSHASTRA! 🎉</h2>
              <p className="text-muted-foreground text-lg">
                Your application has been submitted successfully. Our team will review it and get back to you within 2-3 business days.
              </p>
              <div className="pt-4 space-y-3 text-left bg-muted/30 rounded-lg p-6">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  What's Next?
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Check your email for a confirmation message</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Follow us on Instagram @techshastra_utu for updates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Join our community events and workshops</span>
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
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <Navbar />
      
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 space-y-4 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">Join the Innovation Hub</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="text-gradient-neon">Become a Member</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Join UTU's premier technical and entrepreneurship community. Let's innovate, create, and dominate together.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-muted-foreground">Application Progress</span>
              <span className="text-sm font-medium text-primary">{Math.round(calculateProgress())}%</span>
            </div>
            <Progress value={calculateProgress()} className="h-2" />
          </div>

          {/* Form Card */}
          <Card className="border-primary/10 shadow-2xl backdrop-blur-sm bg-card/50 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <User className="w-6 h-6 text-primary" />
                Membership Application
              </CardTitle>
              <CardDescription>
                Fill out this form to join TECHSHASTRA. All fields are required.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  
                  {/* Step 1: Personal Information */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-border">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
                        <p className="text-sm text-muted-foreground">Tell us about yourself</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <User className="w-4 h-4 text-primary" />
                              Full Name *
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="John Doe" 
                                {...field}
                                className="transition-all focus:border-primary"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-primary" />
                              Email Address *
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="john.doe@gmail.com" 
                                {...field}
                                className="transition-all focus:border-primary"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="contact"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-primary" />
                              Contact Number *
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="tel" 
                                placeholder="+91 XXXXXXXXXX" 
                                {...field}
                                className="transition-all focus:border-primary"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="course"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <GraduationCap className="w-4 h-4 text-primary" />
                              Course/Branch *
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="B.Tech Computer Science" 
                                {...field}
                                className="transition-all focus:border-primary"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary" />
                            Current Academic Year *
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="grid grid-cols-2 md:grid-cols-4 gap-4"
                            >
                              {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((year) => (
                                <FormItem key={year}>
                                  <FormControl>
                                    <div className="relative">
                                      <RadioGroupItem
                                        value={year}
                                        id={year}
                                        className="peer sr-only"
                                      />
                                      <label
                                        htmlFor={year}
                                        className="flex items-center justify-center rounded-lg border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                                      >
                                        <span className="text-sm font-medium">{year}</span>
                                      </label>
                                    </div>
                                  </FormControl>
                                </FormItem>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Step 2: Interests & Ideas */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-border">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Lightbulb className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">Your Interests & Ideas</h3>
                        <p className="text-sm text-muted-foreground">What excites you in tech?</p>
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="interests"
                      render={() => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-4 h-4 text-primary" />
                            Select Your Interests * (Choose at least one)
                          </FormLabel>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {interests.map((interest) => (
                              <FormField
                                key={interest}
                                control={form.control}
                                name="interests"
                                render={({ field }) => {
                                  return (
                                    <FormItem key={interest}>
                                      <FormControl>
                                        <div className="relative">
                                          <Checkbox
                                            id={interest}
                                            checked={field.value?.includes(interest)}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([...field.value, interest])
                                                : field.onChange(
                                                    field.value?.filter(
                                                      (value) => value !== interest
                                                    )
                                                  );
                                            }}
                                            className="peer sr-only"
                                          />
                                          <label
                                            htmlFor={interest}
                                            className="flex items-center justify-center rounded-lg border-2 border-muted bg-background p-3 text-center hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all min-h-[60px]"
                                          >
                                            <span className="text-xs font-medium">{interest}</span>
                                          </label>
                                        </div>
                                      </FormControl>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="eventIdea"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-primary" />
                            Event/Program Ideas *
                          </FormLabel>
                          <FormDescription>
                            Share your ideas for workshops, hackathons, seminars, or any programs you'd like to see
                          </FormDescription>
                          <FormControl>
                            <Textarea 
                              placeholder="I'd love to see workshops on AI/ML, organize a hackathon focused on sustainability, or maybe host guest talks from industry experts..."
                              className="min-h-[120px] transition-all focus:border-primary resize-none"
                              {...field}
                            />
                          </FormControl>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <FormMessage />
                            <span>{field.value?.length || 0}/500</span>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Step 3: Motivation */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-border">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Heart className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">Why TECHSHASTRA?</h3>
                        <p className="text-sm text-muted-foreground">Tell us your motivation</p>
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="reason"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-primary" />
                            Why do you want to be a member? *
                          </FormLabel>
                          <FormDescription>
                            Tell us what motivates you to join and how you plan to contribute to the community
                          </FormDescription>
                          <FormControl>
                            <Textarea 
                              placeholder="I want to join TECHSHASTRA because I'm passionate about technology and innovation. I believe in collaborative learning and want to contribute by..."
                              className="min-h-[150px] transition-all focus:border-primary resize-none"
                              {...field}
                            />
                          </FormControl>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <FormMessage />
                            <span>{field.value?.length || 0}/1000</span>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="agreement"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-border p-4 bg-muted/30">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="cursor-pointer">
                              I agree to the terms and conditions *
                            </FormLabel>
                            <FormDescription>
                              By submitting this form, you agree to participate actively in club activities and follow the community guidelines.
                            </FormDescription>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <Button 
                      type="submit" 
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-lg font-semibold group"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                          Submitting Application...
                        </>
                      ) : (
                        <>
                          Submit Application
                          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="mt-8 space-y-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Card className="border-primary/10 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">What happens after you apply?</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                        Our team reviews your application within 2-3 business days
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                        You'll receive a confirmation email with next steps
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                        Get invited to our orientation session and community events
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center text-sm text-muted-foreground">
              <p>Questions? Contact us at <a href="mailto:vmsb.utu.ddn.2023@gmail.com" className="text-primary hover:underline">vmsb.utu.ddn.2023@gmail.com</a></p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Join;
