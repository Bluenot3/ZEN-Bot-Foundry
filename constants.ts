
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

export const MODEL_REGISTRY: Model[] = [
  // OPENAI - Production Frontier
  { model_id: 'o1', provider_id: 'openai', display_name: 'o1 (Advanced Reasoning)', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true, image_gen: true }, context_window: 128000, cost_tier: 'high', speed_tier: 'balanced' },
  { model_id: 'o1-mini', provider_id: 'openai', display_name: 'o1-mini', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'low', speed_tier: 'fast' },
  { model_id: 'gpt-4o', provider_id: 'openai', display_name: 'GPT-4o', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true, image_gen: true }, context_window: 128000, cost_tier: 'medium', speed_tier: 'fast' },
  { model_id: 'gpt-4o-mini', provider_id: 'openai', display_name: 'GPT-4o-mini', capabilities: { reasoning: false, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'low', speed_tier: 'fast' },

  // GOOGLE - Production Gemini
  { model_id: 'gemini-2.5-flash-preview', provider_id: 'google', display_name: 'Gemini 2.5 Flash', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true, image_gen: true }, context_window: 1000000, cost_tier: 'low', speed_tier: 'fast' },
  { model_id: 'gemini-3-pro-preview', provider_id: 'google', display_name: 'Gemini 3 Pro', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true, image_gen: true }, context_window: 2000000, cost_tier: 'high', speed_tier: 'balanced' },
  { model_id: 'gemini-3-flash-preview', provider_id: 'google', display_name: 'Gemini 3 Flash', capabilities: { reasoning: false, coding: true, vision: true, long_context: true, tool_calling: true, image_gen: true }, context_window: 1000000, cost_tier: 'low', speed_tier: 'fast' },

  // ANTHROPIC - Production Claude
  { model_id: 'claude-3-5-sonnet-20241022', provider_id: 'anthropic', display_name: 'Claude 3.5 Sonnet', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 200000, cost_tier: 'medium', speed_tier: 'fast' },
  { model_id: 'claude-3-5-haiku-20241022', provider_id: 'anthropic', display_name: 'Claude 3.5 Haiku', capabilities: { reasoning: false, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 200000, cost_tier: 'low', speed_tier: 'fast' },
  { model_id: 'claude-3-opus-20240229', provider_id: 'anthropic', display_name: 'Claude 3 Opus', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 200000, cost_tier: 'high', speed_tier: 'balanced' },

  // DEEPSEEK - Open Frontier
  { model_id: 'deepseek-chat', provider_id: 'deepseek', display_name: 'DeepSeek-V3', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 64000, cost_tier: 'low', speed_tier: 'fast' },
  { model_id: 'deepseek-reasoner', provider_id: 'deepseek', display_name: 'DeepSeek-R1', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: false }, context_window: 128000, cost_tier: 'low', speed_tier: 'balanced' },

  // MISTRAL
  { model_id: 'mistral-large-latest', provider_id: 'mistral', display_name: 'Mistral Large 2', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'medium', speed_tier: 'balanced' },
  { model_id: 'pixtral-12b-2409', provider_id: 'mistral', display_name: 'Pixtral 12B', capabilities: { reasoning: false, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'low', speed_tier: 'fast' },

  // PERPLEXITY
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

// Fix: Added BOT_TEMPLATES to fix Marketplace error
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
