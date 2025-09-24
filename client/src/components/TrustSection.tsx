import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Shield, Star, Users } from "lucide-react";
import courthouseImage from "@assets/generated_images/Nigerian_courthouse_building_exterior_57b6dbe1.png";

export default function TrustSection() {
  const stats = [
    { icon: <Users className="h-8 w-8" />, number: "1,000+", label: "Verified Lawyers" },
    { icon: <CheckCircle className="h-8 w-8" />, number: "5,000+", label: "Cases Resolved" },
    { icon: <Star className="h-8 w-8" />, number: "4.9/5", label: "Client Rating" },
    { icon: <Shield className="h-8 w-8" />, number: "100%", label: "Secure Payments" },
  ];

  const verificationSteps = [
    "Nigerian Bar Association (NBA) membership verification",
    "Supreme Court of Nigeria enrollment confirmation", 
    "Practicing certificate validation",
    "Background checks and professional references",
    "Continuous compliance monitoring"
  ];

  const testimonials = [
    {
      name: "Adebayo Ogundimu",
      role: "Business Owner, Lagos",
      content: "Lawly helped me find the perfect lawyer for my contract disputes. The AI matching was spot-on, and the process was seamless.",
      rating: 5
    },
    {
      name: "Dr. Fatima Abdullahi",
      role: "Medical Professional, Abuja", 
      content: "The document analysis feature saved me hours of work. My lawyer was able to quickly understand my case and provide excellent advice.",
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-muted/20">
      <div className="container px-4">
        {/* Trust Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4" data-testid="badge-trust">
            <Shield className="w-4 h-4 mr-2" />
            Trusted & Verified
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-trust-title">
            Nigeria's Most Trusted Legal Platform
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="text-trust-description">
            Every lawyer on our platform undergoes rigorous verification to ensure 
            you're working with qualified, licensed professionals.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center hover-elevate" data-testid={`card-stat-${index}`}>
              <CardContent className="p-6">
                <div className="text-primary mb-2 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-2xl md:text-3xl font-bold mb-1" data-testid={`text-stat-number-${index}`}>
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground" data-testid={`text-stat-label-${index}`}>
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Verification Process */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold mb-6" data-testid="text-verification-title">
              Rigorous Lawyer Verification Process
            </h3>
            <div className="space-y-4">
              {verificationSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-3" data-testid={`verification-step-${index}`}>
                  <CheckCircle className="h-5 w-5 text-chart-3 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{step}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-muted-foreground" data-testid="text-compliance-note">
              All lawyers maintain active NBA practicing certificates and comply with 
              professional conduct rules and advertising restrictions.
            </p>
          </div>
          <div className="relative">
            <img
              src={courthouseImage}
              alt="Nigerian courthouse representing legal authority"
              className="rounded-lg shadow-lg"
              data-testid="img-courthouse"
            />
          </div>
        </div>

        {/* Testimonials */}
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-8" data-testid="text-testimonials-title">
            What Our Clients Say
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover-elevate" data-testid={`card-testimonial-${index}`}>
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-muted-foreground mb-4" data-testid={`text-testimonial-content-${index}`}>
                    "{testimonial.content}"
                  </blockquote>
                  <div>
                    <div className="font-semibold" data-testid={`text-testimonial-name-${index}`}>
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground" data-testid={`text-testimonial-role-${index}`}>
                      {testimonial.role}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}