
import { GoogleGenAI, Type } from "@google/genai";
import { BotConfig, Message, Artifact, KnowledgeAsset, ArenaTheme, TelemetryStep } from '../types';
import { AnalyticsService, CommerceService, AuthService, KnowledgeService, KeyService } from './store';

interface LLMResponse {
  content: string;
  image_url?: string;
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
        timestamp: Date.now(),
        metrics: {
          latency: Math.random() * 30 + 5,
          tokens_per_sec: Math.random() * 120 + 50,
          attention_heads: 128,
          vram_usage: Math.random() * 25 + 10
        }
      });
    };

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    sendTelemetry('UPLINK', 'Neural Uplink Stable', `Node: ${bot.model_config.primary_model}`);

    // Knowledge Retrieval
    const assets = KnowledgeService.getAssets();
    const selectedKnowledge = assets.filter(a => (bot.knowledge_ids || []).includes(a.id));
    if (selectedKnowledge.length > 0) {
      sendTelemetry('RETRIEVAL', 'Vault Query Active', `Found ${selectedKnowledge.length} context nodes`);
    }
    let knowledgeContext = selectedKnowledge.map(k => `[KNOWLEDGE_NODE: ${k.name}]\n${k.content || k.source}`).join('\n');

    // Robust Image Request Detection
    const imageIndicators = [/generate image/i, /create image/i, /draw/i, /show me an image/i, /visualize/i, /make a picture/i, /image of/i, /photo of/i];
    const isImageReq = bot.image_gen_config.enabled && imageIndicators.some(regex => regex.test(userPrompt));

    let imageUrl: string | undefined = undefined;

    if (isImageReq) {
      sendTelemetry('IMAGE_GEN', 'Synthesis Pipeline Hot', `Model: gemini-2.5-flash-image`);
      try {
        const stylePrefix = bot.image_gen_config.style_prompt ? `Style: ${bot.image_gen_config.style_prompt}. ` : '';
        const chipSuffix = bot.image_gen_config.selected_chips && bot.image_gen_config.selected_chips.length > 0 
          ? ` (Presets: ${bot.image_gen_config.selected_chips.join(', ')})` 
          : '';
        const finalImagePrompt = `${stylePrefix}${userPrompt}${chipSuffix}`;

        imageUrl = await ModelRouter.generateImageWithBanana(finalImagePrompt);
        sendTelemetry('SYNTHESIS', 'Vector Field Collapsed', 'Image manifest finalized.');
      } catch (e) {
        console.error("Image generation failure:", e);
        sendTelemetry('ENTROPY_ANALYSIS', 'Synthesis Terminal Failure', 'Diffusion engine error or unauthorized key.');
      }
    }

    sendTelemetry('REASONING', 'Thought Flux Engaged', `Budget: ${bot.model_config.thinking_budget} TKNS`);

    // Routing
    const isHighTier = bot.model_config.thinking_budget > 0 || bot.model_config.primary_model.includes('pro') || bot.model_config.primary_model.includes('o1');
    const geminiRoutingModel = isHighTier ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';

    const systemPrompt = `
      ${bot.system_instructions}
      [IDENTITY]: You are "${bot.name}" (Engine: ${bot.model_config.primary_model}).
      [VAULT]: ${knowledgeContext || "Knowledge vault empty."}
      [IMAGE_GEN]: ${bot.image_gen_config.enabled ? 'ENABLED' : 'DISABLED'}.
      Directive: If asked for an image, acknowledge your visualization process while the diffusion engine synthesizes the result.
    `;

    const contents = history.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));
    contents.push({ role: 'user', parts: [{ text: userPrompt }] });

    const responseStream = await ai.models.generateContentStream({
      model: geminiRoutingModel,
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

    sendTelemetry('OUTPUT', 'Neural Signal Streaming', 'Broadcasting frequency...');

    for await (const chunk of responseStream) {
      const text = chunk.text;
      if (text) {
        fullText += text;
        onChunk(fullText);
      }
      if (chunk.candidates?.[0]?.content?.parts) {
        const thoughtPart = chunk.candidates[0].content.parts.find((p: any) => (p as any).thought);
        if (thoughtPart) thinking += (thoughtPart as any).text || "";
      }
    }

    const artifacts: Artifact[] = [];
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let match;
    while ((match = codeBlockRegex.exec(fullText)) !== null) {
      artifacts.push({
        id: crypto.randomUUID(),
        title: "Extracted Logic",
        language: match[1] || 'plaintext',
        content: match[2].trim()
      });
    }

    sendTelemetry('SYNTHESIS', 'Session manifest sealed.', `Processed ${Math.ceil(fullText.length / 4)} tokens.`);

    return {
      content: fullText,
      image_url: imageUrl,
      thinking_log: thinking,
      model_used: bot.model_config.primary_model,
      tokens: Math.ceil(fullText.length / 4),
      artifacts: artifacts.length > 0 ? artifacts : undefined,
    };
  },

  enhance: async (text: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a world-class copywriter for a high-tech AI company. Enhance this text to be more powerful, technical, and aesthetically compelling. Keep it concise. Return ONLY the enhanced text:\n\n${text}`,
    });
    return response.text?.trim() || text;
  },

  generateImageWithBanana: async (prompt: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [{ parts: [{ text: prompt }] }],
    });
    
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("No image signal detected in diffusion response.");
  },

  generateArenaTheme: async (prompt: string): Promise<ArenaTheme> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Synthesize a professional UI theme based on this vibe: ${prompt}.`,
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
            animation_style: { type: Type.STRING, enum: ['none', 'subtle', 'dynamic', 'glitch'] },
            glass_blur: { type: Type.STRING },
            button_style: { type: Type.STRING, enum: ['flat', 'glow', 'glass', 'outline'] },
            border_intensity: { type: Type.STRING }
          },
          required: ["primary_color", "secondary_color", "bg_color", "accent_color", "font_family", "border_radius", "animation_style", "glass_blur", "button_style", "border_intensity"]
        }
      }
    });
    
    try {
      return JSON.parse(response.text || '{}');
    } catch (e) {
      return {
        primary_color: '#3b82f6',
        secondary_color: '#1e293b',
        bg_color: '#020617',
        accent_color: '#00f7ff',
        font_family: 'Inter',
        border_radius: '1rem',
        animation_style: 'subtle',
        glass_blur: '20px',
        button_style: 'glass',
        border_intensity: '1px'
      };
    }
  }
};
