// Integration: javascript_openai  
import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing required OpenAI API key: OPENAI_API_KEY');
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface CaseAnalysis {
  category: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  summary: string;
  requiredSpecializations: string[];
  estimatedComplexity: 'simple' | 'moderate' | 'complex' | 'very_complex';
  recommendedActions: string[];
}

export interface LawyerMatchRecommendation {
  lawyerId: string;
  matchScore: number;
  reasoning: string;
  specializations: string[];
}

export class LawlyAI {
  // Analyze case description and categorize it
  async analyzeLegalCase(caseDescription: string, caseTitle: string): Promise<CaseAnalysis> {
    try {
      const prompt = `Analyze the following Nigerian legal case and provide a structured response in JSON format:

Title: ${caseTitle}
Description: ${caseDescription}

Categorize this case into one of these Nigerian legal categories:
- Corporate/Commercial Law
- Family Law
- Property/Real Estate Law  
- Criminal Law
- Employment Law
- Tax Law
- Immigration Law
- Intellectual Property Law
- Contract Law
- Personal Injury/Tort Law
- Banking/Finance Law
- Constitutional Law

Assess urgency level (low, medium, high, urgent) and provide analysis in this exact JSON format:
{
  "category": "category name",
  "urgency": "urgency level", 
  "summary": "concise case summary",
  "requiredSpecializations": ["specialization1", "specialization2"],
  "estimatedComplexity": "complexity level",
  "recommendedActions": ["action1", "action2", "action3"]
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const analysis = JSON.parse(response.choices[0].message.content || '{}');
      return analysis as CaseAnalysis;
    } catch (error: any) {
      throw new Error(`AI case analysis failed: ${error.message}`);
    }
  }

  // Generate lawyer matching recommendations
  async recommendLawyers(
    caseAnalysis: CaseAnalysis, 
    availableLawyers: Array<{
      id: string;
      specializations: string[];
      rating: number;
      totalCases: number;
      location: string;
      yearsOfExperience: number;
    }>
  ): Promise<LawyerMatchRecommendation[]> {
    try {
      const prompt = `Based on this legal case analysis, rank and recommend the most suitable lawyers from the available options.

Case Analysis:
- Category: ${caseAnalysis.category}
- Urgency: ${caseAnalysis.urgency}
- Required Specializations: ${caseAnalysis.requiredSpecializations.join(', ')}
- Complexity: ${caseAnalysis.estimatedComplexity}

Available Lawyers:
${availableLawyers.map(lawyer => 
  `ID: ${lawyer.id}, Specializations: [${lawyer.specializations.join(', ')}], Rating: ${lawyer.rating}, Cases: ${lawyer.totalCases}, Experience: ${lawyer.yearsOfExperience} years, Location: ${lawyer.location}`
).join('\n')}

Provide recommendations in JSON array format with match scores (0-100):
[
  {
    "lawyerId": "lawyer_id",
    "matchScore": score_number,
    "reasoning": "why this lawyer is a good match",
    "specializations": ["relevant_specialization1", "relevant_specialization2"]
  }
]

Consider specialization relevance (60%), experience level (20%), rating (15%), and case complexity match (5%).`;

      const response = await openai.chat.completions.create({
        model: "gpt-5", 
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || '[]');
      return result.recommendations || result;
    } catch (error: any) {
      throw new Error(`AI lawyer recommendation failed: ${error.message}`);
    }
  }

  // Summarize uploaded legal document
  async summarizeLegalDocument(documentText: string, documentType?: string): Promise<string> {
    try {
      const prompt = `Summarize this Nigerian legal document concisely, highlighting key points, obligations, dates, and important clauses:

Document Type: ${documentType || 'Legal Document'}
Content: ${documentText}

Provide a clear, structured summary suitable for a lawyer's review.`;

      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [{ role: "user", content: prompt }],
      });

      return response.choices[0].message.content || '';
    } catch (error: any) {
      throw new Error(`Document summarization failed: ${error.message}`);
    }
  }

  // Generate legal document draft
  async generateLegalDraft(
    documentType: string,
    parameters: Record<string, any>,
    jurisdiction: string = 'Nigeria'
  ): Promise<string> {
    try {
      const prompt = `Generate a professional legal document draft for ${jurisdiction}:

Document Type: ${documentType}
Parameters: ${JSON.stringify(parameters, null, 2)}

Create a comprehensive draft following Nigerian legal standards and format. Include appropriate legal language, clauses, and disclaimers. Mark any sections that require lawyer review with [LAWYER REVIEW REQUIRED].`;

      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [{ role: "user", content: prompt }],
      });

      return response.choices[0].message.content || '';
    } catch (error: any) {
      throw new Error(`Legal draft generation failed: ${error.message}`);
    }
  }

  // Analyze message sentiment and legal tone
  async analyzeMessageSentiment(messageContent: string): Promise<{
    sentiment: 'positive' | 'negative' | 'neutral';
    confidence: number;
    urgency: 'low' | 'medium' | 'high';
    legalTone: 'formal' | 'informal' | 'aggressive' | 'professional';
  }> {
    try {
      const prompt = `Analyze the sentiment and legal tone of this message in a legal context:

Message: ${messageContent}

Provide analysis in JSON format:
{
  "sentiment": "positive|negative|neutral",
  "confidence": confidence_score_0_to_1,
  "urgency": "low|medium|high", 
  "legalTone": "formal|informal|aggressive|professional"
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error: any) {
      throw new Error(`Message analysis failed: ${error.message}`);
    }
  }
}

export const lawlyAI = new LawlyAI();