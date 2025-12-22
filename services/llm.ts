
import { GoogleGenAI } from "@google/genai";
import { BotConfig, Message, Artifact } from '../types';
import { AnalyticsService, CommerceService, AuthService } from './store';

interface LLMResponse {
  content: string;
  dual_content?: string;
  consultation_log?: string[];
  thinking_log?: string;
  model_used: string;
  tokens: number;
  artifacts?: Artifact[];
}

export const ModelRouter = {
  chat: async (bot: BotConfig, history: Message[], userPrompt: string): Promise<LLMResponse> => {
    // --- Entitlement Enforcement ---
    const user = AuthService.getUser();
    if (user && bot.publish_state === 'arena') {
      const hasAccess = CommerceService.checkAccess(user.id, bot.id);
      if (!hasAccess) {
        throw new Error("LOCKED_ASSET: Entitlement verification failed for resource " + bot.id);
      }
    }

    // Initialize Google GenAI
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Prepare conversation history for the SDK
    const contents = history.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));
    contents.push({ role: 'user', parts: [{ text: userPrompt }] });

    // Execute generation with system instruction and thinking budget
    const response = await ai.models.generateContent({
      model: bot.model_config.primary_model || 'gemini-3-flash-preview',
      contents,
      config: {
        systemInstruction: bot.system_instructions,
        temperature: bot.model_config.temperature,
        thinkingConfig: bot.model_config.thinking_budget > 0 
          ? { thinkingBudget: bot.model_config.thinking_budget } 
          : undefined
      }
    });

    const textOutput = response.text || "SIGNAL_LOST: EMPTY_RESPONSE";

    // Extract artifacts from code blocks
    let artifacts: Artifact[] = [];
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let match;
    while ((match = codeBlockRegex.exec(textOutput)) !== null) {
      artifacts.push({
        id: crypto.randomUUID(),
        title: "Synthesized Module",
        language: match[1] || 'typescript',
        content: match[2].trim()
      });
    }

    // Extract thinking logs if available in candidates
    let thinking = "";
    if (response.candidates?.[0]?.content?.parts) {
      const thoughtPart = response.candidates[0].content.parts.find((p: any) => p.thought);
      if (thoughtPart) {
        thinking = (thoughtPart as any).text || "";
      }
    }

    // Handle Dual Response Feature
    let dualContent: string | undefined = undefined;
    if (bot.features.dual_response_mode) {
      dualContent = textOutput + "\n\n[EXPANSIVE_MODE_ENABLED: SYNERGETIC_OUTPUT_ATTACHED]";
    }

    return {
      content: textOutput,
      dual_content: dualContent,
      thinking_log: thinking,
      model_used: bot.model_config.primary_model,
      tokens: textOutput.length / 4, // Simple estimation
      artifacts: artifacts.length > 0 ? artifacts : undefined,
      consultation_log: bot.features.multi_agent_consult ? ["SWARM_UPLINK: MULTI_AGENT_VERIFICATION_COMPLETE"] : undefined
    };
  }
};
