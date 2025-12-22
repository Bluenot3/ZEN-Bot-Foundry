
import { Model, Tool } from './types';

export const MODEL_REGISTRY: Model[] = [
  // OPENAI
  { model_id: 'gpt-5.2-ultra', provider_id: 'openai', display_name: 'GPT-5.2 Ultra', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 2000000, cost_tier: 'high', speed_tier: 'balanced' },
  { model_id: 'gpt-5.1-pro', provider_id: 'openai', display_name: 'GPT-5.1 Pro', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 1000000, cost_tier: 'high', speed_tier: 'fast' },
  { model_id: 'o4-ultra-reasoning', provider_id: 'openai', display_name: 'o4 Ultra (Reasoning)', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: false }, context_window: 128000, cost_tier: 'high', speed_tier: 'balanced' },
  { model_id: 'o3-high', provider_id: 'openai', display_name: 'o3-high', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 200000, cost_tier: 'medium', speed_tier: 'fast' },
  { model_id: 'gpt-4o', provider_id: 'openai', display_name: 'GPT-4o (Omni)', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'medium', speed_tier: 'fast' },

  // GOOGLE
  { model_id: 'gemini-3.5-pro-preview', provider_id: 'google', display_name: 'Gemini 3.5 Pro', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 2000000, cost_tier: 'high', speed_tier: 'balanced' },
  { model_id: 'gemini-3-pro-preview', provider_id: 'google', display_name: 'Gemini 3 Pro', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 2000000, cost_tier: 'medium', speed_tier: 'balanced' },
  { model_id: 'gemini-3-flash-preview', provider_id: 'google', display_name: 'Gemini 3 Flash', capabilities: { reasoning: false, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 1000000, cost_tier: 'low', speed_tier: 'fast' },
  { model_id: 'nano-banana-pro', provider_id: 'google', display_name: 'Nano-Banana Pro', capabilities: { reasoning: true, coding: true, vision: true, long_context: false, tool_calling: false }, context_window: 16000, cost_tier: 'low', speed_tier: 'fast' },

  // ANTHROPIC
  { model_id: 'claude-4-preview', provider_id: 'anthropic', display_name: 'Claude 4 Preview', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 500000, cost_tier: 'high', speed_tier: 'balanced' },
  { model_id: 'claude-3-7-sonnet', provider_id: 'anthropic', display_name: 'Claude 3.7 Sonnet', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 200000, cost_tier: 'medium', speed_tier: 'fast' },
  { model_id: 'claude-3-5-sonnet', provider_id: 'anthropic', display_name: 'Claude 3.5 Sonnet', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 200000, cost_tier: 'medium', speed_tier: 'fast' },

  // X.AI
  { model_id: 'grok-3-ultra', provider_id: 'xai', display_name: 'Grok-3 Ultra', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 256000, cost_tier: 'high', speed_tier: 'fast' },
  { model_id: 'grok-3-vision', provider_id: 'xai', display_name: 'Grok-3 Vision', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'medium', speed_tier: 'fast' },

  // META
  { model_id: 'llama-4-405b', provider_id: 'meta', display_name: 'Llama 4 405B', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'high', speed_tier: 'balanced' },
  { model_id: 'llama-3.3-70b', provider_id: 'meta', display_name: 'Llama 3.3 70B', capabilities: { reasoning: false, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'low', speed_tier: 'fast' },

  // MISTRAL
  { model_id: 'mistral-large-3', provider_id: 'mistral', display_name: 'Mistral Large 3', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'high', speed_tier: 'balanced' },
  { model_id: 'mistral-large-2411', provider_id: 'mistral', display_name: 'Mistral Large 2', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'medium', speed_tier: 'balanced' },

  // DEEPSEEK
  { model_id: 'deepseek-v3', provider_id: 'specialized', display_name: 'DeepSeek V3', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'low', speed_tier: 'fast' },
  { model_id: 'deepseek-r1', provider_id: 'specialized', display_name: 'DeepSeek R1 (Reasoning)', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: false }, context_window: 64000, cost_tier: 'low', speed_tier: 'balanced' },
  
  // COHERE
  { model_id: 'command-r7b', provider_id: 'cohere', display_name: 'Command R7B', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'low', speed_tier: 'fast' },
];

export const AVAILABLE_TOOLS: Tool[] = [
  // Image Generation
  { tool_id: 'gen_image_banana', name: 'Nano-Banana Image', description: 'Generate high-fidelity assets using Google Nano-Banana-Pro.', enabled: false, required_key: 'google' },
  { tool_id: 'gen_image_dalle', name: 'DALL·E 3 Render', description: 'Generate creative imagery via OpenAI DALL·E 3.', enabled: false, required_key: 'openai' },
  { tool_id: 'gpt_image_15', name: 'GPT-Image 1.5', description: 'Advanced image synthesis and editing using OpenAI GPT-Image suite.', enabled: false, required_key: 'openai' },
  { tool_id: 'midjourney_relay', name: 'Midjourney Relay', description: 'Discord-integrated high-art synthesis relay.', enabled: false, required_key: 'discord' },
  
  // Intelligence & RAG
  { tool_id: 'web_search', name: 'Web Intel', description: 'Real-time global network search and news scraping.', enabled: false },
  { tool_id: 'toon_retrieval', name: 'TOON Search', description: 'Deep retrieval from TOON-optimized vault chunks.', enabled: false },
  { tool_id: 'code_kernel', name: 'Compute Kernel', description: 'Sandboxed code execution (Python/Node.js).', enabled: false },
  { tool_id: 'firecrawl_scrape', name: 'Firecrawl Deep Scrape', description: 'Advanced recursively-scraped intelligence via Firecrawl API.', enabled: false, required_key: 'firecrawl' },
  
  // Connections
  { tool_id: 'slack_bridge', name: 'Slack Uplink', description: 'Inject results and maintain state in Slack channels.', enabled: false, required_key: 'slack' },
  { tool_id: 'github_sync', name: 'Git Archive', description: 'Pull or push code to GitHub repositories.', enabled: false, required_key: 'github' },
  { tool_id: 'notion_vault', name: 'Notion Sync', description: 'Read/Write to Notion workspaces and databases.', enabled: false, required_key: 'notion' },
  { tool_id: 'gmail_nexus', name: 'Gmail Outbox', description: 'Draft and send professional emails via Google Workspace.', enabled: false, required_key: 'google' },
  
  // Data & Analysis
  { tool_id: 'sql_tunnel', name: 'SQL Tunnel', description: 'Query structured databases (Postgres/MySQL) securely.', enabled: false },
  { tool_id: 'spreadsheet_analyst', name: 'Sheet Intel', description: 'Complex Excel/CSV data synthesis and pivot generation.', enabled: false },
  { tool_id: 'vector_lattice', name: 'Vector Lattice', description: 'Semantic cross-indexing across multiple namespaces.', enabled: false },
  
  // Media
  { tool_id: 'tts_synth', name: 'Voice Synthesis', description: 'Convert text to high-fidelity audio (ElevenLabs/Google).', enabled: false },
  { tool_id: 'audio_transcribe', name: 'Neural Ear', description: 'Speech-to-text audio processing and diarization.', enabled: false },
  { tool_id: 'video_veo', name: 'Veo Video', description: 'Generate short cinematic clips via Google Veo.', enabled: false, required_key: 'google' },
  { tool_id: 'pika_video', name: 'Pika Motion', description: 'Generate high-motion cinematic clips via Pika Labs.', enabled: false, required_key: 'pika' },

  // Specialized
  { tool_id: 'crm_bridge', name: 'CRM Bridge', description: 'Salesforce/Hubspot lead and contact synchronization.', enabled: false },
  { tool_id: 'social_scribe', name: 'X Scribe', description: 'Synthesize trends and post to X (Twitter) natively.', enabled: false },
  { tool_id: 'pdf_analyzer', name: 'Deep PDF', description: 'Extract tables and data from complex PDF structures.', enabled: false },
  { tool_id: 'json_validator', name: 'JSON Schema Fix', description: 'Ensure output matches strict Zod/JSON schemas.', enabled: false },
  { tool_id: 'crypto_ticker', name: 'On-Chain Ticker', description: 'Real-time crypto, DEX, and stock market telemetry.', enabled: false },
  { tool_id: 'calendar_sync', name: 'Chronos Link', description: 'Manage and resolve Google/Outlook calendars.', enabled: false },
  { tool_id: 'weather_radar', name: 'Meteor Radar', description: 'Global hyper-local weather and atmospheric data.', enabled: false },
  { tool_id: 'translation_core', name: 'Polyglot Core', description: 'Real-time high-fidelity translation across 100+ languages.', enabled: false },
  { tool_id: 'news_wire', name: 'Signal Wire', description: 'Breaking global news and sentiment trend tracking.', enabled: false },

  // Advanced Utility
  { tool_id: 'perplex_research', name: 'Perplexity Engine', description: 'Deep research grounding via Perplexity API.', enabled: false, required_key: 'perplexity' },
  { tool_id: 'anthropic_computer', name: 'Computer Control', description: 'Direct UI manipulation and computer control (Claude specialized).', enabled: false, required_key: 'anthropic' },
  { tool_id: 'zapier_central', name: 'Zapier Hub', description: 'Connect to 5000+ apps via Zapier automation triggers.', enabled: false, required_key: 'zapier' },
];

export const BOT_TEMPLATES = [
  { 
    id: 'tpl-quant', 
    name: 'Quant Strategist', 
    description: 'High-frequency alpha generation and risk parity analysis.', 
    system_instructions: 'You are a Quantitative Strategist at a top-tier hedge fund. Your expertise includes Black-Litterman models, Kelly Criterion, and Greeks analysis. Use the Crypto Ticker and Sheet Intel tools to synthesize market anomalies.', 
    icon: '📈', 
    industry: 'Finance', 
    voice: 'technical', 
    planning: 'chain-of-thought',
    tools: ['crypto_ticker', 'spreadsheet_analyst', 'sql_tunnel']
  },
  { 
    id: 'tpl-biotech', 
    name: 'Molecular Synthesizer', 
    description: 'Protein folding logic and CRISPR-Cas9 sequencing patterns.', 
    system_instructions: 'You are a Computational Biologist. Assist in drug discovery workflows, molecular docking simulations, and genomic sequencing analysis. You rely on deep scientific accuracy.', 
    icon: '🧬', 
    industry: 'Science', 
    voice: 'precise', 
    planning: 'autonomous',
    tools: ['toon_retrieval', 'pdf_analyzer', 'code_kernel']
  },
  { 
    id: 'tpl-osint', 
    name: 'OSINT Spec Ops', 
    description: 'Open-source intelligence gathering and recursive scraping.', 
    system_instructions: 'You are an OSINT Specialist. Gather intelligence from public records, digital footprints, and global news wires. You excel at recursive scraping via Firecrawl.', 
    icon: '🔍', 
    industry: 'Intelligence', 
    voice: 'analytical', 
    planning: 'autonomous',
    tools: ['web_search', 'firecrawl_scrape', 'news_wire', 'social_scribe']
  }
];
