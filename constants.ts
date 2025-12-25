
import { Model, Tool } from './types';

export const IMAGE_STYLE_CHIPS = [
  "Cinematic", "Concept Photo", "Anime", "Cyberpunk", "Oil Painting", 
  "3D Render", "Vector Art", "Polaroid", "Blueprint", "Pixel Art", 
  "Minimalist", "Vaporwave", "Double Exposure", "Tilt-Shift", "Isometric", 
  "Steampunk", "Hyper-Realistic", "Sketch", "Pop Art", "Gothic", 
  "Origami", "Glitch Art", "Synthwave", "Low Poly", "Macro Photography", 
  "Unreal Engine 5", "Charcoal", "Ukiyo-e", "Bokeh", "Claymation"
];

export const COMPATIBLE_IMAGE_MODELS = {
  openai: [
    { id: 'dall-e-3', name: 'DALL-E 3' },
    { id: 'gpt-image-1.5', name: 'GPT-Image 1.5' },
    { id: 'gpt-image-1.0', name: 'GPT-Image 1.0' }
  ],
  google: [
    { id: 'imagen-4', name: 'Imagen 4 Ultra' },
    { id: 'imagen-3', name: 'Imagen 3' },
    { id: 'nano-banana-pro', name: 'Nano Banana Pro' }
  ]
};

export const MODEL_REGISTRY: Model[] = [
  // --- OPENAI ---
  { model_id: 'gpt-5.2', provider_id: 'openai', display_name: 'GPT-5.2 (Apex)', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true, image_gen: true }, context_window: 2000000, cost_tier: 'high', speed_tier: 'balanced' },
  { model_id: 'gpt-5.1-thinking', provider_id: 'openai', display_name: 'GPT-5.1 Thinking', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true, image_gen: true }, context_window: 1000000, cost_tier: 'high', speed_tier: 'balanced' },
  { model_id: 'gpt-5.1-fast', provider_id: 'openai', display_name: 'GPT-5.1 Fast', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true, image_gen: false }, context_window: 500000, cost_tier: 'medium', speed_tier: 'fast' },
  { model_id: 'gpt-4o', provider_id: 'openai', display_name: 'GPT-4o', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true, image_gen: true }, context_window: 128000, cost_tier: 'medium', speed_tier: 'fast' },
  { model_id: 'gpt-4o-mini', provider_id: 'openai', display_name: 'GPT-4o Mini', capabilities: { reasoning: false, coding: true, vision: true, long_context: true, tool_calling: true, image_gen: false }, context_window: 128000, cost_tier: 'low', speed_tier: 'fast' },
  { model_id: 'o1-pro', provider_id: 'openai', display_name: 'o1 Pro', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: false, image_gen: false }, context_window: 200000, cost_tier: 'high', speed_tier: 'balanced' },

  // --- GOOGLE ---
  { model_id: 'gemini-3-pro-preview', provider_id: 'google', display_name: 'Gemini 3 Pro', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true, image_gen: true }, context_window: 2000000, cost_tier: 'high', speed_tier: 'balanced' },
  { model_id: 'gemini-3-flash-preview', provider_id: 'google', display_name: 'Gemini 3 Flash', capabilities: { reasoning: false, coding: true, vision: true, long_context: true, tool_calling: true, image_gen: true }, context_window: 1000000, cost_tier: 'low', speed_tier: 'fast' },
  { model_id: 'gemini-2.5-pro', provider_id: 'google', display_name: 'Gemini 2.5 Pro', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true, image_gen: true }, context_window: 2000000, cost_tier: 'medium', speed_tier: 'balanced' },
  { model_id: 'gemini-2.5-flash', provider_id: 'google', display_name: 'Gemini 2.5 Flash', capabilities: { reasoning: false, coding: true, vision: true, long_context: true, tool_calling: true, image_gen: true }, context_window: 1000000, cost_tier: 'low', speed_tier: 'fast' },

  // --- ANTHROPIC ---
  { model_id: 'claude-4.5-opus', provider_id: 'anthropic', display_name: 'Claude 4.5 Opus', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 800000, cost_tier: 'high', speed_tier: 'balanced' },
  { model_id: 'claude-3-5-sonnet', provider_id: 'anthropic', display_name: 'Claude 3.5 Sonnet', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 200000, cost_tier: 'medium', speed_tier: 'balanced' },
  { model_id: 'claude-3-haiku', provider_id: 'anthropic', display_name: 'Claude 3 Haiku', capabilities: { reasoning: false, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 200000, cost_tier: 'low', speed_tier: 'fast' },

  // --- OTHERS (META, MISTRAL, DEEPSEEK) ---
  { model_id: 'deepseek-r1', provider_id: 'deepseek', display_name: 'DeepSeek-R1', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: false }, context_window: 128000, cost_tier: 'low', speed_tier: 'balanced' },
  { model_id: 'llama-3.3-70b', provider_id: 'meta', display_name: 'Llama 3.3 70B', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'low', speed_tier: 'fast' },
  { model_id: 'mistral-large-2', provider_id: 'mistral', display_name: 'Mistral Large 2', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'medium', speed_tier: 'balanced' },
];

export const AVAILABLE_TOOLS: Tool[] = [
  { tool_id: 'gen_image_foundry', name: 'Visual Synthesis', description: 'Generate high-fidelity images using DALL-E 3 or Imagen 4.', enabled: false },
  { tool_id: 'code_artifact_engine', name: 'Artifact Engine', description: 'Enable real-time code execution and live UI previews.', enabled: false },
  { tool_id: 'web_intel', name: 'Web Intelligence', description: 'Ground responses in live web data (Google/Bing).', enabled: false },
  { tool_id: 'code_kernel', name: 'Code Interpreter', description: 'Execute data analysis in a secure Python environment.', enabled: false },
  { tool_id: 'file_analyzer', name: 'Document Analysis', description: 'Deep semantic analysis of PDF/Docx files.', enabled: false },
  
  // --- NEW TOOLS ---
  { tool_id: 'voice_synth', name: 'Voice Synthesis', description: 'Generate lifelike speech in real-time.', enabled: false },
  { tool_id: 'sentiment_engine', name: 'Sentiment Matrix', description: 'Analyze user emotion and tone for adaptive responses.', enabled: false },
  { tool_id: 'calendar_uplink', name: 'Calendar Uplink', description: 'Read/Write access to Google/Outlook calendars.', enabled: false },
  { tool_id: 'mail_relay', name: 'Email Relay', description: 'Draft and send emails via secure SMTP.', enabled: false },
  { tool_id: 'slack_bridge', name: 'Slack Bridge', description: 'Connect directly to Slack workspaces for messaging.', enabled: false },
  { tool_id: 'notion_sync', name: 'Notion Sync', description: 'Read and update Notion databases.', enabled: false },
  { tool_id: 'crypto_wallet', name: 'Wallet Actions', description: 'Check balances and propose transactions.', enabled: false },
  { tool_id: 'video_analyzer', name: 'Video Vision', description: 'Analyze video frames for content understanding.', enabled: false },
  { tool_id: 'memory_vault', name: 'Long-term Memory', description: 'Store user preferences across sessions.', enabled: false },
  { tool_id: 'wolfram_alpha', name: 'Wolfram Alpha', description: 'Computational knowledge engine access.', enabled: false },
];

export const BOT_TEMPLATES = [
  {
    name: "Strategy Expert",
    description: "Expert in game theory and competitive analysis.",
    icon: "♟️",
    industry: "Consulting",
    tools: ["web_intel", "code_kernel"],
    system_instructions: "You are a master strategist."
  },
  {
    name: "Software Architect",
    description: "Specialized in software design and live artifact creation.",
    icon: "💻",
    industry: "Technology",
    tools: ["code_artifact_engine", "code_kernel"],
    system_instructions: "You are an expert software architect. Always use artifacts for code."
  }
];
