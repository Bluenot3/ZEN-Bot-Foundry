
import { GoogleGenAI } from "@google/genai";
import { BotConfig, Message, Artifact } from '../types';
import { AnalyticsService } from './store';

interface LLMResponse {
  content: string;
  dual_content?: string;
  consultation_log?: string[];
  image_url?: string;
  tool_calls?: any[];
  model_used: string;
  tokens: number;
  artifacts?: Artifact[];
}

export const ModelRouter = {
  chat: async (bot: BotConfig, history: Message[], userPrompt: string): Promise<LLMResponse> => {
    const modelId = bot.model_config.primary_model;
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Simulate Consultation Logic
    let consultation_log: string[] = [];
    if (bot.features.multi_agent_consult) {
      consultation_log.push(`Consulting Peer Agent [ZEN-ARCHITECT-ALPHA]...`);
      consultation_log.push(`Strategy adjustment: "Implementing Recursive Reasoning Layer."`);
    }

    // Map non-native models to the best Gemini equivalents for simulation
    let actualModel = modelId;
    let thinkingBudget = 0;

    if (modelId === 'claude-4-5-sonnet' || modelId === 'gpt-o3-mini' || bot.features.recursive_thinking) {
      actualModel = 'gemini-3-pro-preview';
      thinkingBudget = 32768; // High budget for reasoning models
    } else if (modelId.includes('flash')) {
      actualModel = 'gemini-3-flash-preview';
    } else if (!modelId.includes('gemini')) {
      actualModel = 'gemini-3-pro-preview';
    }

    try {
      const promptSuffix = bot.features.dual_response_mode 
        ? "\n\nCRITICAL: Provide TWO distinct variations of your response separated by '---VAR_B---'. Variant A should be more technical/direct, Variant B should be more creative/expansive."
        : "";

      const response = await ai.models.generateContent({
        model: actualModel,
        contents: [
          { role: 'user', parts: [{ text: `MISSION_PROFILE: ${bot.system_instructions}\n\nIMPORTANT: If the user asks for code, provide high-quality, self-contained files in markdown code blocks. ${promptSuffix}` }] },
          ...history.slice(-10).map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.selected_variant === 'B' ? (m.dual_content || m.content) : m.content }]
          })),
          { role: 'user', parts: [{ text: userPrompt }] }
        ] as any,
        config: {
          temperature: bot.model_config.temperature,
          topP: bot.model_config.topP,
          topK: bot.model_config.topK,
          maxOutputTokens: bot.model_config.maxOutputTokens,
          thinkingConfig: thinkingBudget > 0 ? { thinkingBudget } : undefined
        }
      });

      const responseText = response.text || "SYSTEM_ERROR: NULL_SIGNAL_RECEIVED.";
      
      let content = responseText;
      let dual_content = undefined;

      if (bot.features.dual_response_mode && responseText.includes('---VAR_B---')) {
        const parts = responseText.split('---VAR_B---');
        content = parts[0].trim();
        dual_content = parts[1].trim();
      }

      // Artifact Extraction Logic
      const artifacts: Artifact[] = [];
      const combinedText = dual_content ? `${content}\n${dual_content}` : content;
      const codeBlockRegex = /```(html|tsx|javascript|typescript|css|js|ts)\n([\s\S]*?)```/g;
      let match;
      while ((match = codeBlockRegex.exec(combinedText)) !== null) {
        const lang = match[1];
        const code = match[2];
        artifacts.push({
          id: crypto.randomUUID(),
          title: `Neural Asset (${lang.toUpperCase()})`,
          type: (lang === 'html' || lang === 'tsx') ? 'web-app' : 'code',
          language: lang,
          content: code
        });
      }

      const tokens = Math.floor((userPrompt.length + responseText.length) / 4);

      AnalyticsService.logUsage({
        date: new Date().toISOString(),
        tokens,
        cost_est: actualModel.includes('pro') ? tokens * 0.00003 : tokens * 0.00001,
        model: modelId.toUpperCase(),
        status: 'SUCCESS'
      });

      return {
        content,
        dual_content,
        consultation_log: consultation_log.length > 0 ? consultation_log : undefined,
        model_used: modelId.toUpperCase(),
        tokens,
        artifacts: artifacts.length > 0 ? artifacts : undefined
      };
    } catch (error) {
      throw error;
    }
  }
};
