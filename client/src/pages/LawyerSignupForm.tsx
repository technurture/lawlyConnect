import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Scale, Briefcase, ArrowLeft, ArrowRight, Plus, X } from "lucide-react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

const lawyerSignupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  phone: z.string().optional(),
  barNumber: z.string().min(1, "NBA Bar Number is required"),
  yearsOfExperience: z.number().min(0, "Years of experience must be 0 or greater"),
  specializations: z.array(z.string()).min(1, "Please select at least one specialization"),
  location: z.string().min(1, "Location is required"),
  bio: z.string().min(10, "Please provide a brief bio (minimum 10 characters)"),
  hourlyRate: z.number().min(1, "Hourly rate must be greater than 0").optional(),
  consultationFee: z.number().min(1, "Consultation fee must be greater than 0").optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LawyerSignupData = z.infer<typeof lawyerSignupSchema>;

const specializationOptions = [
  "Corporate Law",
  "Criminal Law", 
  "Family Law",
  "Property Law",
  "Employment Law",
  "Tax Law",
  "Immigration Law",
  "Intellectual Property",
  "Banking & Finance",
  "Constitutional Law",
  "Civil Litigation",
  "Commercial Law",
  "Environmental Law",
  "Healthcare Law",
  "Human Rights Law"
];

export default function LawyerSignupForm() {
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);

  const form = useForm<LawyerSignupData>({
    resolver: zodResolver(lawyerSignupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      barNumber: "",
      yearsOfExperience: 0,
      specializations: [],
      location: "",
      bio: "",
      hourlyRate: undefined,
      consultationFee: undefined,
    },
  });

  const handleSpecializationChange = (specialization: string, checked: boolean) => {
    const updated = checked 
      ? [...selectedSpecializations, specialization]
      : selectedSpecializations.filter(s => s !== specialization);
    
    setSelectedSpecializations(updated);
    form.setValue('specializations', updated);
  };

  const handleSubmit = async (data: LawyerSignupData) => {
    try {
      // Remove confirmPassword before sending to backend
      const { confirmPassword, ...submitData } = data;
      
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...submitData,
          userType: 'lawyer'
        }),
      });

      if (response.ok) {
        const result = await response.json();
        // Store tokens for authenticated session
        localStorage.setItem('accessToken', result.accessToken);
        localStorage.setItem('refreshToken', result.refreshToken);
        // Redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        const error = await response.json();
        form.setError('email', { message: error.message || 'Signup failed' });
      }
    } catch (error) {
      form.setError('email', { message: 'Network error. Please try again.' });
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="w-full max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2" data-testid="link-home">
            <Scale className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">Lawly</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-foreground" data-testid="text-signup-title">
            Join as Lawyer
          </h2>
          <p className="mt-2 text-sm text-muted-foreground" data-testid="text-signup-description">
            Create your professional profile to connect with clients
          </p>
        </div>

        {/* Signup Form */}
        <Card>
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Briefcase className="h-6 w-6 text-primary" />
              <span>Lawyer Registration</span>
            </CardTitle>
            <CardDescription>
              Complete your professional profile for NBA verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} data-testid="input-first-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} data-testid="input-last-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="john.doe@lawfirm.com" 
                            {...field} 
                            data-testid="input-email" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="••••••••" 
                              {...field} 
                              data-testid="input-password" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="••••••••" 
                              {...field} 
                              data-testid="input-confirm-password" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input 
                            type="tel" 
                            placeholder="+234 800 123 4567" 
                            {...field} 
                            data-testid="input-phone" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Professional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Professional Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="barNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>NBA Bar Number</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="NBA/XXX/XXXX" 
                              {...field} 
                              data-testid="input-bar-number" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="yearsOfExperience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Years of Experience</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0"
                              placeholder="5" 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              data-testid="input-experience" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Lagos, Nigeria" 
                            {...field} 
                            data-testid="input-location" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="specializations"
                    render={() => (
                      <FormItem>
                        <FormLabel>Legal Specializations</FormLabel>
                        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-md p-4">
                          {specializationOptions.map((specialization) => (
                            <label 
                              key={specialization} 
                              className="flex items-center space-x-2 cursor-pointer"
                            >
                              <Checkbox
                                checked={selectedSpecializations.includes(specialization)}
                                onCheckedChange={(checked) => 
                                  handleSpecializationChange(specialization, checked as boolean)
                                }
                                data-testid={`checkbox-${specialization.toLowerCase().replace(/\s+/g, '-')}`}
                              />
                              <span className="text-sm">{specialization}</span>
                            </label>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Professional Bio</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Brief description of your legal experience and expertise..."
                            className="min-h-20"
                            {...field} 
                            data-testid="input-bio" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Pricing Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Pricing (Optional)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="hourlyRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hourly Rate (₦)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1"
                              placeholder="15000" 
                              {...field} 
                              onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                              data-testid="input-hourly-rate" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="consultationFee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Consultation Fee (₦)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1"
                              placeholder="25000" 
                              {...field} 
                              onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                              data-testid="input-consultation-fee" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  data-testid="button-submit-lawyer-signup"
                >
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="text-center space-y-2">
          <Link href="/signup" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to signup options
          </Link>
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline" data-testid="link-login">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}