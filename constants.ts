
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
  // --- OPENAI (Frontier & Future) ---
  { model_id: 'gpt-5.2', provider_id: 'openai', display_name: 'GPT-5.2 (Apex)', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true, image_gen: true }, context_window: 2000000, cost_tier: 'high', speed_tier: 'balanced' },
  { model_id: 'gpt-5.1-thinking', provider_id: 'openai', display_name: 'GPT-5.1 Thinking', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true, image_gen: true }, context_window: 1000000, cost_tier: 'high', speed_tier: 'balanced' },
  { model_id: 'gpt-5.1-fast', provider_id: 'openai', display_name: 'GPT-5.1 Fast', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true, image_gen: false }, context_window: 500000, cost_tier: 'medium', speed_tier: 'fast' },
  { model_id: 'gpt-5.1', provider_id: 'openai', display_name: 'GPT-5.1', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true, image_gen: true }, context_window: 1000000, cost_tier: 'high', speed_tier: 'balanced' },
  
  // --- OPENAI (Visual) ---
  { model_id: 'gpt-image-1.5', provider_id: 'openai', display_name: 'GPT-Image 1.5 (Hyper-Real)', capabilities: { reasoning: false, coding: false, vision: true, long_context: false, tool_calling: false, image_gen: true }, context_window: 16000, cost_tier: 'high', speed_tier: 'balanced' },
  { model_id: 'gpt-image-1.0', provider_id: 'openai', display_name: 'GPT-Image 1.0', capabilities: { reasoning: false, coding: false, vision: true, long_context: false, tool_calling: false, image_gen: true }, context_window: 16000, cost_tier: 'medium', speed_tier: 'fast' },
  { model_id: 'dall-e-3', provider_id: 'openai', display_name: 'DALL-E 3', capabilities: { reasoning: false, coding: false, vision: true, long_context: false, tool_calling: false, image_gen: true }, context_window: 4000, cost_tier: 'medium', speed_tier: 'balanced' },

  // --- OPENAI (Legacy Frontier) ---
  { model_id: 'o1', provider_id: 'openai', display_name: 'o1 (Heavy Reasoning)', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true, image_gen: true }, context_window: 128000, cost_tier: 'high', speed_tier: 'balanced' },
  { model_id: 'o1-mini', provider_id: 'openai', display_name: 'o1-mini', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'low', speed_tier: 'fast' },
  { model_id: 'gpt-4o', provider_id: 'openai', display_name: 'GPT-4o', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true, image_gen: true }, context_window: 128000, cost_tier: 'medium', speed_tier: 'fast' },

  // --- GOOGLE (Gemini 3 & Nano Series) ---
  { model_id: 'gemini-3-pro-preview', provider_id: 'google', display_name: 'Gemini 3 Pro (Multimodal)', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true, image_gen: true }, context_window: 2000000, cost_tier: 'high', speed_tier: 'balanced' },
  { model_id: 'gemini-3-flash-preview', provider_id: 'google', display_name: 'Gemini 3 Flash', capabilities: { reasoning: false, coding: true, vision: true, long_context: true, tool_calling: true, image_gen: true }, context_window: 1000000, cost_tier: 'low', speed_tier: 'fast' },
  { model_id: 'gemini-3-ultra-preview', provider_id: 'google', display_name: 'Gemini 3 Ultra (Experimental)', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true, image_gen: true }, context_window: 2000000, cost_tier: 'high', speed_tier: 'balanced' },
  { model_id: 'gemini-2.5-flash-preview', provider_id: 'google', display_name: 'Gemini 2.5 Flash', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true, image_gen: true }, context_window: 1000000, cost_tier: 'low', speed_tier: 'fast' },
  
  // --- GOOGLE (Visual Core) ---
  { model_id: 'nano-banana-pro', provider_id: 'google', display_name: 'Nano Banana Pro', capabilities: { reasoning: false, coding: false, vision: true, long_context: false, tool_calling: false, image_gen: true }, context_window: 64000, cost_tier: 'medium', speed_tier: 'fast' },
  { model_id: 'nano-banana', provider_id: 'google', display_name: 'Nano Banana', capabilities: { reasoning: false, coding: false, vision: true, long_context: false, tool_calling: false, image_gen: true }, context_window: 32000, cost_tier: 'low', speed_tier: 'fast' },

  // --- ANTHROPIC (Claude 4.5 Series) ---
  { model_id: 'claude-4.5-opus', provider_id: 'anthropic', display_name: 'Claude 4.5 Opus', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 500000, cost_tier: 'high', speed_tier: 'balanced' },
  { model_id: 'claude-4.5-sonnet', provider_id: 'anthropic', display_name: 'Claude 4.5 Sonnet', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 500000, cost_tier: 'medium', speed_tier: 'fast' },
  { model_id: 'claude-3-5-sonnet-20241022', provider_id: 'anthropic', display_name: 'Claude 3.5 Sonnet', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 200000, cost_tier: 'medium', speed_tier: 'fast' },
  { model_id: 'claude-3-5-haiku-20241022', provider_id: 'anthropic', display_name: 'Claude 3.5 Haiku', capabilities: { reasoning: false, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 200000, cost_tier: 'low', speed_tier: 'fast' },

  // --- DEEPSEEK (Open Frontier) ---
  { model_id: 'deepseek-v3', provider_id: 'deepseek', display_name: 'DeepSeek-V3', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 64000, cost_tier: 'low', speed_tier: 'fast' },
  { model_id: 'deepseek-r1', provider_id: 'deepseek', display_name: 'DeepSeek-R1 (Reasoning)', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: false }, context_window: 128000, cost_tier: 'low', speed_tier: 'balanced' },

  // --- MISTRAL ---
  { model_id: 'mistral-large-latest', provider_id: 'mistral', display_name: 'Mistral Large 2', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'medium', speed_tier: 'balanced' },
  { model_id: 'pixtral-12b-2409', provider_id: 'mistral', display_name: 'Pixtral 12B', capabilities: { reasoning: false, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'low', speed_tier: 'fast' },

  // --- META (Llama 4 Future) ---
  { model_id: 'llama-4-405b', provider_id: 'meta', display_name: 'Llama 4 405B (Future)', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 256000, cost_tier: 'high', speed_tier: 'balanced' },
  { model_id: 'llama-3.1-405b-instruct', provider_id: 'meta', display_name: 'Llama 3.1 405B', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'medium', speed_tier: 'balanced' },

  // --- PERPLEXITY ---
  { model_id: 'sonar-reasoning-pro', provider_id: 'perplexity', display_name: 'Sonar Reasoning Pro', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'medium', speed_tier: 'balanced' },
];

export const AVAILABLE_TOOLS: Tool[] = [
  { tool_id: 'gen_image_foundry', name: 'Foundry Synthesis', description: 'Universal image generation layer (DALL-E 3 / Imagen 3).', enabled: false },
  { tool_id: 'web_intel', name: 'Web Intel (Search)', description: 'Real-time grounding via Google Search or Perplexity.', enabled: false },
  { tool_id: 'code_kernel', name: 'Execution Kernel', description: 'Sandboxed Python/Node.js code execution.', enabled: false },
  { tool_id: 'file_analyzer', name: 'Document X-Ray', description: 'Deep semantic analysis of attached PDFs and data files.', enabled: false },
  { tool_id: 'firecrawl_scrape', name: 'Firecrawl Deep Scrape', description: 'Recursive web scraping and markdown conversion.', enabled: false },
  { tool_id: 'notion_vault', name: 'Notion Sync', description: 'Direct workspace R/W access for agent persistence.', enabled: false },
  { tool_id: 'github_nexus', name: 'GitHub Nexus', description: 'Interact with repos, manage PRs, and commit code.', enabled: false },
  { tool_id: 'slack_bridge', name: 'Slack Bridge', description: 'Deploy agent logic into internal Slack workspaces.', enabled: false },
  { tool_id: 'sql_tunnel', name: 'Database Tunnel', description: 'Secure read-only access to structured SQL databases.', enabled: false },
  { tool_id: 'tts_synth', name: 'Neural Voice', description: 'Convert text responses into high-fidelity audio streams.', enabled: false },
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
    description: "Specialized in software design patterns and implementation.",
    icon: "💻",
    industry: "Technology",
    tools: ["github_nexus", "code_kernel"],
    system_instructions: "You are an expert software architect."
  },
  {
    name: "Legal Scholar",
    description: "Specialized in contract review and regulatory compliance analysis.",
    icon: "⚖️",
    industry: "Legal",
    tools: ["file_analyzer", "web_intel"],
    system_instructions: "You are a high-level legal consultant."
  },
  {
    name: "Market Analyst",
    description: "Real-time trend analysis and consumer sentiment synthesis.",
    icon: "📈",
    industry: "Finance",
    tools: ["web_intel", "firecrawl_scrape"],
    system_instructions: "You are an expert market analyst."
  }
];
