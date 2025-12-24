
import { Model, Tool } from './types';

export const IMAGE_STYLE_CHIPS = [
  "Cinematic", "Concept Photo", "Anime", "Cyberpunk", "Oil Painting", 
  "3D Render", "Vector Art", "Polaroid", "Blueprint", "Pixel Art", 
  "Minimalist", "Vaporwave", "Double Exposure", "Tilt-Shift", "Isometric", 
  "Steampunk", "Hyper-Realistic", "Sketch", "Pop Art", "Gothic", 
  "Origami", "Glitch Art", "Synthwave", "Low Poly", "Macro Photography", 
  "Unreal Engine 5", "Charcoal", "Ukiyo-e", "Bokeh", "Claymation",
  "Product Shot", "Architectural", "Fantasy Map", "Neon Sign", "Paper Cut",
  "Ethereal", "Brutalist", "Noir", "Renaissance", "Surrealism"
];

export const COMPATIBLE_IMAGE_MODELS = {
  openai: [
    { id: 'gpt-image-1.5', name: 'GPT-IMG 1.5' },
    { id: 'gpt-image-1.0', name: 'GPT-IMG 1.0' },
    { id: 'dall-e-3', name: 'DALL-E 3' }
  ],
  google: [
    { id: 'nano-banana-pro', name: 'Nano Banana Pro' },
    { id: 'nano-banana', name: 'Nano Banana' }
  ]
};

export const MODEL_REGISTRY: Model[] = [
  // --- OPENAI (GPT-5 & Future Series) ---
  { model_id: 'gpt-5.2', provider_id: 'openai', display_name: 'GPT-5.2 (Apex)', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true, image_gen: true }, context_window: 2000000, cost_tier: 'high', speed_tier: 'balanced' },
  { model_id: 'gpt-5.1-thinking', provider_id: 'openai', display_name: 'GPT-5.1 Thinking', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true, image_gen: true }, context_window: 1000000, cost_tier: 'high', speed_tier: 'balanced' },
  { model_id: 'gpt-5.1-fast', provider_id: 'openai', display_name: 'GPT-5.1 Fast', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true, image_gen: false }, context_window: 500000, cost_tier: 'medium', speed_tier: 'fast' },
  { model_id: 'gpt-5.1', provider_id: 'openai', display_name: 'GPT-5.1', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true, image_gen: true }, context_window: 1000000, cost_tier: 'high', speed_tier: 'balanced' },
  { model_id: 'o1-pro', provider_id: 'openai', display_name: 'o1 Pro Reasoning', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true, image_gen: true }, context_window: 200000, cost_tier: 'high', speed_tier: 'balanced' },
  
  // --- GOOGLE (Gemini 3 & Nano Series) ---
  { model_id: 'gemini-3-ultra-preview', provider_id: 'google', display_name: 'Gemini 3 Ultra', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true, image_gen: true }, context_window: 2000000, cost_tier: 'high', speed_tier: 'balanced' },
  { model_id: 'gemini-3-pro-preview', provider_id: 'google', display_name: 'Gemini 3 Pro', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true, image_gen: true }, context_window: 2000000, cost_tier: 'high', speed_tier: 'balanced' },
  { model_id: 'gemini-3-flash-preview', provider_id: 'google', display_name: 'Gemini 3 Flash', capabilities: { reasoning: false, coding: true, vision: true, long_context: true, tool_calling: true, image_gen: true }, context_window: 1000000, cost_tier: 'low', speed_tier: 'fast' },
  { model_id: 'nano-banana-pro', provider_id: 'google', display_name: 'Nano Banana Pro', capabilities: { reasoning: false, coding: false, vision: true, long_context: false, tool_calling: false, image_gen: true }, context_window: 64000, cost_tier: 'medium', speed_tier: 'fast' },
  { model_id: 'nano-banana', provider_id: 'google', display_name: 'Nano Banana (Visual)', capabilities: { reasoning: false, coding: false, vision: true, long_context: false, tool_calling: false, image_gen: true }, context_window: 32000, cost_tier: 'low', speed_tier: 'fast' },

  // --- ANTHROPIC (Claude 4.5 Series) ---
  { model_id: 'claude-4.5-opus', provider_id: 'anthropic', display_name: 'Claude 4.5 Opus', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 800000, cost_tier: 'high', speed_tier: 'balanced' },
  { model_id: 'claude-4.5-sonnet', provider_id: 'anthropic', display_name: 'Claude 4.5 Sonnet', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 800000, cost_tier: 'medium', speed_tier: 'fast' },
  
  // --- LEGACY FRONTIER ---
  { model_id: 'gpt-4o', provider_id: 'openai', display_name: 'GPT-4o', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true, image_gen: true }, context_window: 128000, cost_tier: 'medium', speed_tier: 'fast' },
  { model_id: 'deepseek-r1', provider_id: 'deepseek', display_name: 'DeepSeek-R1 (Reasoning)', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: false }, context_window: 128000, cost_tier: 'low', speed_tier: 'balanced' },
];

export const AVAILABLE_TOOLS: Tool[] = [
  { tool_id: 'gen_image_foundry', name: 'Visual Core (Image Gen)', description: 'Synthesize images using DALL-E 3 or Nano Banana.', enabled: false },
  { tool_id: 'code_artifact_engine', name: 'Artifact Engine', description: 'Enable real-time code execution and live UI previews.', enabled: false },
  { tool_id: 'web_intel', name: 'Web Intel (Search)', description: 'Ground responses in live web data.', enabled: false },
  { tool_id: 'code_kernel', name: 'Python Sandbox', description: 'Execute data analysis in a secure environment.', enabled: false },
  { tool_id: 'file_analyzer', name: 'Document X-Ray', description: 'Deep semantic analysis of complex documents.', enabled: false },
];

export const BOT_TEMPLATES = [
  {
    name: "Strategy Master",
    description: "Expert in game theory and competitive analysis.",
    icon: "♟️",
    industry: "Consulting",
    tools: ["web_intel", "code_kernel"],
    system_instructions: "You are a master strategist."
  },
  {
    name: "Code Architect",
    description: "Specialized in software design and live artifact creation.",
    icon: "💻",
    industry: "Technology",
    tools: ["code_artifact_engine", "code_kernel"],
    system_instructions: "You are an expert software architect. Always use artifacts for code."
  }
];
