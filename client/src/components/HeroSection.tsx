import { Button } from "@/components/ui/button";
import { Search, Shield, Zap } from "lucide-react";
import heroImage from "@assets/generated_images/Nigerian_legal_professionals_consultation_0da73d3b.png";

export default function HeroSection() {
  const features = [
    {
      icon: <Search className="h-5 w-5" />,
      text: "Find verified lawyers"
    },
    {
      icon: <Zap className="h-5 w-5" />,
      text: "AI-powered matching"
    },
    {
      icon: <Shield className="h-5 w-5" />,
      text: "Secure payments"
    }
  ];

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Nigerian legal professionals"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6" data-testid="text-hero-title">
            Connect with Nigeria's{" "}
            <span className="text-primary-foreground">Verified Lawyers</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90" data-testid="text-hero-description">
            Get expert legal advice, AI-assisted document drafting, and secure case management 
            all in one trusted platform.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-4 py-2 border border-primary-foreground/20"
                data-testid={`feature-pill-${index}`}
              >
                {feature.icon}
                <span className="text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              onClick={() => window.location.href = '/api/login?userType=client'}
              data-testid="button-hero-get-started"
            >
              Get Started - It's Free
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/20"
              onClick={() => window.location.href = '/api/login?userType=lawyer'}
              data-testid="button-hero-find-lawyer"
            >
              Join as Lawyer
            </Button>
          </div>

          {/* Trust Indicator */}
          <p className="mt-6 text-sm text-primary-foreground/80" data-testid="text-trust-indicator">
            Trusted by 1000+ lawyers across Nigeria • Nigerian Bar Association Verified
          </p>
        </div>
      </div>
    </section>
  );
}