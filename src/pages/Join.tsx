import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  course: z.string().min(2, "Please enter your course/branch").max(100),
  year: z.string().min(1, "Please select your current year"),
  email: z.string().email("Invalid email address").max(255),
  contact: z.string().min(10, "Contact must be at least 10 digits").max(15),
  eventIdea: z.string().min(10, "Please share your ideas (minimum 10 characters)").max(500),
  reason: z.string().min(20, "Please tell us more (minimum 20 characters)").max(1000),
});

type FormData = z.infer<typeof formSchema>;

const Join = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log("Form submitted:", data);
    
    toast({
      title: "Application Submitted!",
      description: "We'll review your application and get back to you soon.",
    });
    
    form.reset();
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-float">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Join <span className="text-primary">TECHSHASTRA</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Become part of UTU's premier technical and entrepreneurship community
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-8 shadow-lg">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Student Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Course/Branch */}
                <FormField
                  control={form.control}
                  name="course"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course/Branch *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., B.Tech Computer Science" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Current Year */}
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Year *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 1st Year, 2nd Year" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Student Gmail */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student Gmail *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your.email@gmail.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Contact */}
                <FormField
                  control={form.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number *</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="+91 XXXXXXXXXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Event/Program Ideas */}
                <FormField
                  control={form.control}
                  name="eventIdea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What event, program, or anything you want to have or host? *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Share your ideas for workshops, hackathons, seminars, or any programs you'd like to see..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Why Join */}
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Why do you want to be a member in TECHSHASTRA? *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us what motivates you to join and how you plan to contribute..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            </Form>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>All fields marked with * are required</p>
            <p className="mt-2">Questions? Contact us at vmsb.utu.ddn.2023@gmail.com</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Join;
