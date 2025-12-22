
import { GoogleGenAI, Type } from "@google/genai";
import { BotConfig, Message, Artifact, KnowledgeAsset, ArenaTheme, TelemetryStep } from '../types';
import { AnalyticsService, CommerceService, AuthService, KnowledgeService } from './store';

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
  chatStream: async (
    bot: BotConfig, 
    history: Message[], 
    userPrompt: string, 
    onChunk: (text: string) => void,
    onTelemetry?: (step: TelemetryStep) => void
  ): Promise<LLMResponse> => {
    
    const sendTelemetry = (type: TelemetryStep['type'], label: string, detail?: string) => {
      onTelemetry?.({
        id: crypto.randomUUID(),
        type,
        label,
        detail,
        status: 'active',
        timestamp: Date.now()
      });
    };

    sendTelemetry('UPLINK', 'Initializing Neural Uplink', `Target Model: ${bot.model_config.primary_model}`);

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // RAG: Inject Knowledge (TOON optimized)
    sendTelemetry('RETRIEVAL', 'Consulting Knowledge Vault', `Scanning ${bot.knowledge_ids.length} indexed assets`);
    const selectedKnowledge = KnowledgeService.getAssets().filter(a => (bot.knowledge_ids || []).includes(a.id));
    
    let knowledgeContext = "";
    selectedKnowledge.forEach(k => {
      if (k.type === 'toon' && k.toon_chunks) {
        knowledgeContext += k.toon_chunks.map(c => `[TOON_CHUNK_${c.id}][TAGS: ${c.tags.join(', ')}]\n${c.text}`).join('\n');
      } else {
        knowledgeContext += `[SOURCE: ${k.name}]\n${k.content || k.source}\n`;
      }
    });

    sendTelemetry('REASONING', 'Cognitive Synthesis', `Budget: ${bot.model_config.thinking_budget} tokens`);

    // Tools Check
    const activeTools = bot.tools.filter(t => t.enabled);
    if (activeTools.length > 0) {
      sendTelemetry('TOOL_EXEC', 'Verifying Tool Entitlements', `${activeTools.length} tools attached`);
    }

    const isHighTier = bot.model_config.thinking_budget > 0 || bot.model_config.primary_model.includes('pro');
    const geminiModel = isHighTier ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';

    const systemPrompt = `
      ${bot.system_instructions}
      [IDENTITY_LOCK]: You are "${bot.name}" powered by "${bot.model_config.primary_model}".
      [VAULT]: ${knowledgeContext || "No knowledge assets attached."}
      [TOOLS_MANIFEST]: ${activeTools.map(t => t.name).join(', ')}
    `;

    const contents = history.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));
    contents.push({ role: 'user', parts: [{ text: userPrompt }] });

    const responseStream = await ai.models.generateContentStream({
      model: geminiModel,
      contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: bot.model_config.temperature,
        thinkingConfig: bot.model_config.thinking_budget > 0 
          ? { thinkingBudget: bot.model_config.thinking_budget } 
          : undefined
      }
    });

    let fullText = "";
    let thinking = "";

    sendTelemetry('OUTPUT', 'Streaming Neural Signal', 'Decryption in progress');

    for await (const chunk of responseStream) {
      const text = chunk.text;
      if (text) {
        fullText += text;
        onChunk(fullText);
      }
      if (chunk.candidates?.[0]?.content?.parts) {
        const thoughtPart = chunk.candidates[0].content.parts.find((p: any) => p.thought);
        if (thoughtPart) thinking += (thoughtPart as any).text || "";
      }
    }

    const artifacts: Artifact[] = [];
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let match;
    while ((match = codeBlockRegex.exec(fullText)) !== null) {
      artifacts.push({
        id: crypto.randomUUID(),
        title: "Extracted Fragment",
        language: match[1] || 'plaintext',
        content: match[2].trim()
      });
    }

    sendTelemetry('SYNTHESIS', 'Session Manifest Finalized', `Tokens: ${Math.ceil(fullText.length / 4)}`);

    return {
      content: fullText,
      thinking_log: thinking,
      model_used: bot.model_config.primary_model,
      tokens: fullText.length / 4,
      artifacts: artifacts.length > 0 ? artifacts : undefined,
    };
  },

  enhance: async (text: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Upgrade this text. Output ONLY the upgraded version:\n\n${text}`,
    });
    return response.text?.trim() || text;
  },

  generateArenaTheme: async (prompt: string): Promise<ArenaTheme> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Design a UI/UX theme for: "${prompt}". Respond with JSON matching ArenaTheme interface.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            primary_color: { type: Type.STRING },
            secondary_color: { type: Type.STRING },
            bg_color: { type: Type.STRING },
            accent_color: { type: Type.STRING },
            font_family: { type: Type.STRING },
            border_radius: { type: Type.STRING },
            animation_style: { type: Type.STRING, enum: ["none", "subtle", "dynamic", "glitch"] },
            glass_blur: { type: Type.STRING },
            button_style: { type: Type.STRING, enum: ["flat", "glow", "glass", "outline"] },
            border_intensity: { type: Type.STRING }
          },
          required: ["primary_color", "secondary_color", "bg_color", "accent_color", "font_family", "border_radius", "animation_style", "glass_blur", "button_style", "border_intensity"]
        }
      }
    });
    return JSON.parse(response.text || '{}') as ArenaTheme;
  },

  // Cross-provider action logic (Nano-Banana etc.)
  generateImageWithBanana: async (prompt: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [{ parts: [{ text: prompt }] }],
    });
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
    throw new Error("Image synthesis failed");
  }
};
