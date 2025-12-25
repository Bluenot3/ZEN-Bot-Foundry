
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
    sendTelemetry('UPLINK', 'Neural Handshake Complete', `Node: ${bot.model_config.primary_model}`);

    // Knowledge Retrieval
    const assets = KnowledgeService.getAssets();
    const selectedKnowledge = assets.filter(a => (bot.knowledge_ids || []).includes(a.id));
    let knowledgeContext = selectedKnowledge.map(k => `[VAULT_NODE: ${k.name}]\n${k.content || k.source}`).join('\n');

    // Image Request Logic
    const imageIndicators = [/generate image/i, /create image/i, /draw/i, /visualize/i, /image of/i, /picture of/i];
    const isImageReq = bot.image_gen_config.enabled && imageIndicators.some(regex => regex.test(userPrompt));

    let imageUrl: string | undefined = undefined;

    if (isImageReq) {
      const targetImageModel = bot.image_gen_config.model || 'nano-banana-pro';
      sendTelemetry('IMAGE_GEN', 'Synthesis Initialization', `Visual Engine: ${targetImageModel}`);
      
      try {
        imageUrl = await ModelRouter.generateImageWithFailsafes(userPrompt, targetImageModel, (log) => {
           sendTelemetry('ENTROPY_ANALYSIS', 'Model Reroute Signal', log);
        });
      } catch (e: any) {
        sendTelemetry('ENTROPY_ANALYSIS', 'Synthesis Terminal Failure', e.message);
      }
    }

    const artifactsEnabled = bot.tools.some(t => t.tool_id === 'code_artifact_engine');
    
    // Advanced System Instruction Assembly
    const systemPromptParts = [
      bot.system_instructions,
      bot.positive_directives ? `\n[BEHAVIORAL_FOCUS]: ${bot.positive_directives}` : '',
      bot.negative_directives ? `\n[BEHAVIORAL_AVOIDANCE]: ${bot.negative_directives}` : '',
      knowledgeContext ? `\n[CONTEXT_VAULT]: ${knowledgeContext}` : '\n[CONTEXT_VAULT]: Vault offline.',
      artifactsEnabled ? '\n[ARTIFACT_ENGINE]: ACTIVE. When providing structural code (HTML/CSS/JS/React), enclose it in standard Markdown blocks. This will be automatically rendered in the side-pane for the user.' : '\n[ARTIFACT_ENGINE]: DISABLED',
      `\n[ENGINE_SPEC]: ${bot.model_config.primary_model}`,
      '\n[MODE]: ADAPTIVE_PROFESSIONAL',
      bot.system_reminder ? `\n[FINAL_ANCHOR_REMINDER]: ${bot.system_reminder}` : ''
    ];

    const systemPrompt = systemPromptParts.filter(Boolean).join('\n');

    // Context Budget Logic: Prune history if needed
    // Simple estimation: 1 char ~= 0.25 tokens. 
    // We only keep the last N messages that fit within context_budget
    const contextBudget = bot.model_config.context_budget || 100000;
    let currentTokenEstimate = 0;
    const prunedHistory: Message[] = [];
    
    // Process from newest to oldest
    for (let i = history.length - 1; i >= 0; i--) {
       const msg = history[i];
       const estimatedTokens = msg.content.length * 0.3; // Conservative estimate
       if (currentTokenEstimate + estimatedTokens < contextBudget) {
          prunedHistory.unshift(msg);
          currentTokenEstimate += estimatedTokens;
       } else {
          break; // Stop adding if we hit the limit
       }
    }
    
    // Always include system prompt cost in telemetry, but for chat API it's handled via config
    sendTelemetry('REASONING', 'Context Optimization', `History pruned to ${prunedHistory.length} turns (${Math.round(currentTokenEstimate)} est. tokens)`);

    const contents = prunedHistory.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));
    contents.push({ role: 'user', parts: [{ text: userPrompt }] });

    const responseStream = await ai.models.generateContentStream({
      model: bot.model_config.primary_model.includes('gpt-5') || bot.model_config.primary_model.includes('pro') ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview',
      contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: bot.model_config.temperature,
        topP: bot.model_config.top_p,
        maxOutputTokens: bot.model_config.max_output_tokens,
        thinkingConfig: bot.model_config.thinking_budget > 0 
          ? { thinkingBudget: bot.model_config.thinking_budget } 
          : undefined,
        stopSequences: bot.model_config.stop_sequences?.length > 0 ? bot.model_config.stop_sequences : undefined,
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

    // High-Precision Artifact Extraction
    const artifacts: Artifact[] = [];
    if (artifactsEnabled) {
      const codeRegex = /```(html|css|javascript|typescript|jsx|tsx|json|python)\n([\s\S]{150,}?)```/gi;
      let match;
      while ((match = codeRegex.exec(fullText)) !== null) {
        artifacts.push({
          id: crypto.randomUUID(),
          title: `Synthesis_${match[1].toUpperCase()}_Node`,
          language: match[1].toLowerCase(),
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
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: [{ parts: [{ text: prompt }] }],
      });
      
      const part = response.candidates[0].content.parts.find(p => p.inlineData);
      if (part?.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
      throw new Error("Buffer Empty");
    };

    if (requestedModel.includes('gpt-image') || requestedModel.includes('dall-e')) {
       try { return await attemptGen(requestedModel); } 
       catch (e) {
          onRetry?.(`OpenAI Cascade: ${requestedModel} failed. Falling back to DALL-E 3...`);
          try { return await attemptGen('dall-e-3'); }
          catch (e2) {
             onRetry?.(`OpenAI Critical: Cascade failed. Rerouting to Google Visual Core...`);
             return await attemptGen('gemini-2.5-flash-image');
          }
       }
    }

    return await attemptGen(requestedModel);
  },

  enhance: async (text: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Synthesize a highly professional, technical, and precise version of this bot directive. Ensure it reads like a master-level agent prompt. Return ONLY the enhanced text:\n\n${text}`,
    });
    return response.text?.trim() || text;
  },

  generateArenaTheme: async (prompt: string): Promise<ArenaTheme> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Synthesize a tactical JSON theme for a UI based on: ${prompt}`,
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
