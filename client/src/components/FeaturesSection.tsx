import { Card, CardContent } from "@/components/ui/card";
import { Bot, FileText, Shield, Search, MessageSquare, CreditCard } from "lucide-react";
import digitalToolsImage from "@assets/generated_images/Lawyer_using_digital_legal_tools_d60e0020.png";

export default function FeaturesSection() {
  const features = [
    {
      icon: <Bot className="h-8 w-8 text-primary" />,
      title: "AI-Powered Case Triage",
      description: "Get instant case categorization and lawyer matching based on your legal needs using advanced AI technology."
    },
    {
      icon: <Search className="h-8 w-8 text-primary" />,
      title: "Find Verified Lawyers",
      description: "Browse Nigerian Bar Association verified lawyers with specializations, ratings, and transparent pricing."
    },
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: "Document Processing",
      description: "Upload legal documents for AI-powered summarization and analysis to better understand your case."
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
      title: "Secure Communication",
      description: "Chat directly with lawyers through our encrypted messaging system with file sharing capabilities."
    },
    {
      icon: <CreditCard className="h-8 w-8 text-primary" />,
      title: "Escrow Payments",
      description: "Secure payment processing with escrow protection for consultations and legal services."
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Data Protection",
      description: "NDPR compliant platform ensuring your sensitive legal information remains secure and confidential."
    }
  ];

  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-features-title">
            Everything You Need for Legal Services
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="text-features-description">
            Our comprehensive platform combines AI technology with verified legal expertise 
            to provide seamless legal service delivery.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="hover-elevate" data-testid={`card-feature-${index}`}>
              <CardContent className="p-6">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2" data-testid={`text-feature-title-${index}`}>
                  {feature.title}
                </h3>
                <p className="text-muted-foreground" data-testid={`text-feature-description-${index}`}>
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Highlight */}
        <div className="bg-card rounded-lg p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4" data-testid="text-ai-tools-title">
                AI-Powered Legal Tools for Modern Practice
              </h3>
              <p className="text-muted-foreground mb-6" data-testid="text-ai-tools-description">
                Our platform provides lawyers with cutting-edge AI tools for legal research, 
                document drafting, and case management, while ensuring all outputs meet 
                Nigerian legal standards and NBA compliance requirements.
              </p>
              <ul className="space-y-3" data-testid="list-ai-features">
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Legal research with Nigerian statutes and precedents</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>AI-assisted document drafting and templates</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Case progress tracking and client communication</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <img
                src={digitalToolsImage}
                alt="Lawyer using digital legal tools"
                className="rounded-lg shadow-lg"
                data-testid="img-digital-tools"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}