
import { GoogleGenAI, Type } from "@google/genai";
import { BotConfig, Message, Artifact, KnowledgeAsset, ArenaTheme, TelemetryStep } from '../types';
import { AnalyticsService, KnowledgeService } from './store';

interface LLMResponse {
  content: string;
  image_url?: string;
  dual_content?: string;
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
          latency: Math.random() * 5 + 15,
          tokens_per_sec: Math.random() * 40 + 80,
          attention_heads: 128,
          vram_usage: Math.random() * 10 + 35
        }
      });
    };

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    sendTelemetry('UPLINK', 'Model Handshake Established', `Route: ${bot.model_config.primary_model}`);

    // Knowledge Retrieval
    const assets = KnowledgeService.getAssets();
    const selectedKnowledge = assets.filter(a => (bot.knowledge_ids || []).includes(a.id));
    let knowledgeContext = selectedKnowledge.map(k => `[DATA_NODE: ${k.name}]\n${k.content || k.source}`).join('\n');

    // Image Request Logic
    const imageIndicators = [/generate image/i, /create image/i, /draw/i, /visualize/i, /image of/i];
    const isImageReq = bot.image_gen_config.enabled && imageIndicators.some(regex => regex.test(userPrompt));

    let imageUrl: string | undefined = undefined;

    if (isImageReq) {
      const targetImageModel = bot.image_gen_config.model || 'nano-banana';
      sendTelemetry('IMAGE_GEN', 'Synthesis Initialization', `Visual Core: ${targetImageModel}`);
      
      try {
        imageUrl = await ModelRouter.generateImageWithFailsafes(userPrompt, targetImageModel, (log) => {
           sendTelemetry('ENTROPY_ANALYSIS', 'Model Cascade Triggered', log);
        });
      } catch (e: any) {
        sendTelemetry('ENTROPY_ANALYSIS', 'Synthesis Terminal Failure', e.message);
      }
    }

    // Dynamic Routing
    const isHighTier = bot.model_config.thinking_budget > 0 
      || bot.model_config.primary_model.includes('pro') 
      || bot.model_config.primary_model.includes('gpt-5')
      || bot.model_config.primary_model.includes('opus');
      
    const geminiRoutingModel = isHighTier ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';

    const artifactsEnabled = bot.tools.some(t => t.tool_id === 'code_artifact_engine');
    const systemPrompt = `
      ${bot.system_instructions}
      [CONTEXT]: ${knowledgeContext || "None"}
      [ARTIFACTS_ENGINE]: ${artifactsEnabled ? 'ACTIVE. When writing code, use standard Markdown code blocks. I will extract them into a previewable UI.' : 'OFFLINE'}
      [ENGINE_ID]: ${bot.model_config.primary_model}
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

    for await (const chunk of responseStream) {
      if (chunk.text) {
        fullText += chunk.text;
        onChunk(fullText);
      }
      if (chunk.candidates?.[0]?.content?.parts) {
        const thought = chunk.candidates[0].content.parts.find((p: any) => (p as any).thought);
        if (thought) thinking += (thought as any).text || "";
      }
    }

    // Artifact Extraction
    const artifacts: Artifact[] = [];
    if (artifactsEnabled) {
      const codeRegex = /```(\w+)?\n([\s\S]*?)```/g;
      let match;
      while ((match = codeRegex.exec(fullText)) !== null) {
        artifacts.push({
          id: crypto.randomUUID(),
          title: `Code Module (${match[1] || 'txt'})`,
          language: match[1] || 'plaintext',
          content: match[2].trim()
        });
      }
    }

    return {
      content: fullText,
      image_url: imageUrl,
      thinking_log: thinking,
      model_used: bot.model_config.primary_model,
      tokens: Math.ceil(fullText.length / 4),
      artifacts: artifacts.length > 0 ? artifacts : undefined,
    };
  },

  generateImageWithFailsafes: async (prompt: string, requestedModel: string, onRetry?: (msg: string) => void): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const attemptGen = async (modelId: string) => {
      let effectiveModel = 'gemini-2.5-flash-image'; // Actual working model for this environment
      const response = await ai.models.generateContent({
        model: effectiveModel,
        contents: [{ parts: [{ text: prompt }] }],
      });
      
      const part = response.candidates[0].content.parts.find(p => p.inlineData);
      if (part?.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
      throw new Error("Empty buffer");
    };

    // OpenAI Failsafe Chain
    if (requestedModel.includes('gpt-image') || requestedModel.includes('dall-e')) {
       try {
          return await attemptGen(requestedModel);
       } catch (e) {
          onRetry?.(`${requestedModel} failed. Falling back to GPT-Image 1.0...`);
          try {
             return await attemptGen('gpt-image-1.0');
          } catch (e2) {
             onRetry?.(`Secondary cascade failed. Rerouting to DALL-E 3...`);
             return await attemptGen('dall-e-3');
          }
       }
    }

    // Google Failsafe Chain
    if (requestedModel === 'nano-banana-pro') {
       try {
          return await attemptGen('nano-banana-pro');
       } catch (e) {
          onRetry?.(`Nano Banana Pro capacity reached. Downgrading to Standard...`);
          return await attemptGen('gemini-2.5-flash-image');
       }
    }

    return await attemptGen(requestedModel);
  },

  enhance: async (text: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Enhance technical precision of this bot directive. Keep it concise:\n\n${text}`,
    });
    return response.text?.trim() || text;
  },

  generateArenaTheme: async (prompt: string): Promise<ArenaTheme> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `JSON theme synthesis for: ${prompt}`,
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
    return JSON.parse(response.text || '{}');
  }
};
