import { Model, Tool } from './types';

export const MODEL_REGISTRY: Model[] = [
  // OPENAI
  { model_id: 'gpt-5.2', provider_id: 'openai', display_name: 'GPT-5.2 (Ultra)', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 2000000, cost_tier: 'high', speed_tier: 'balanced' },
  { model_id: 'gpt-5.1', provider_id: 'openai', display_name: 'GPT-5.1', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 1000000, cost_tier: 'high', speed_tier: 'balanced' },
  { model_id: 'gpt-5', provider_id: 'openai', display_name: 'GPT-5 (Standard)', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 1000000, cost_tier: 'high', speed_tier: 'balanced' },
  { model_id: 'gpt-4o', provider_id: 'openai', display_name: 'GPT-4o (Omni)', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'medium', speed_tier: 'fast' },
  { model_id: 'gpt-4.1', provider_id: 'openai', display_name: 'GPT-4.1', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'medium', speed_tier: 'balanced' },
  { model_id: 'gpt-4-turbo', provider_id: 'openai', display_name: 'GPT-4 Turbo', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'medium', speed_tier: 'balanced' },
  { model_id: 'o4-reasoning', provider_id: 'openai', display_name: 'o4-reasoning', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: false }, context_window: 128000, cost_tier: 'high', speed_tier: 'balanced' },
  { model_id: 'o3-mini', provider_id: 'openai', display_name: 'o3-mini / o3-mini-high', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 200000, cost_tier: 'low', speed_tier: 'fast' },
  { model_id: 'dall-e-3', provider_id: 'openai', display_name: 'DALL·E 3', capabilities: { reasoning: false, coding: false, vision: false, long_context: false, tool_calling: false }, context_window: 0, cost_tier: 'medium', speed_tier: 'balanced' },
  { model_id: 'gpt-image-1', provider_id: 'openai', display_name: 'GPT-Image-1', capabilities: { reasoning: false, coding: false, vision: true, long_context: false, tool_calling: false }, context_window: 0, cost_tier: 'medium', speed_tier: 'fast' },
  { model_id: 'whisper-v3', provider_id: 'openai', display_name: 'Whisper-v3 (speech → text)', capabilities: { reasoning: false, coding: false, vision: false, long_context: false, tool_calling: false }, context_window: 0, cost_tier: 'low', speed_tier: 'fast' },
  { model_id: 'tts-1-hd', provider_id: 'openai', display_name: 'TTS-1 / TTS-1-HD (text → speech)', capabilities: { reasoning: false, coding: false, vision: false, long_context: false, tool_calling: false }, context_window: 0, cost_tier: 'low', speed_tier: 'fast' },

  // GOOGLE
  { model_id: 'gemini-3-pro-preview', provider_id: 'google', display_name: 'Gemini 3 Pro', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 2000000, cost_tier: 'medium', speed_tier: 'balanced' },
  { model_id: 'gemini-3-flash-preview', provider_id: 'google', display_name: 'Gemini 3 Flash', capabilities: { reasoning: false, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 1000000, cost_tier: 'low', speed_tier: 'fast' },
  { model_id: 'gemini-2.5-pro', provider_id: 'google', display_name: 'Gemini 2.5 Pro', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 2000000, cost_tier: 'medium', speed_tier: 'balanced' },
  { model_id: 'gemini-2.5-flash', provider_id: 'google', display_name: 'Gemini 2.5 Flash', capabilities: { reasoning: false, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 1000000, cost_tier: 'low', speed_tier: 'fast' },
  { model_id: 'nano-banana', provider_id: 'google', display_name: 'Nano-Banana', capabilities: { reasoning: false, coding: false, vision: true, long_context: false, tool_calling: false }, context_window: 8000, cost_tier: 'low', speed_tier: 'fast' },
  { model_id: 'nano-banana-pro', provider_id: 'google', display_name: 'Nano-Banana Pro', capabilities: { reasoning: true, coding: true, vision: true, long_context: false, tool_calling: false }, context_window: 16000, cost_tier: 'low', speed_tier: 'fast' },
  { model_id: 'gemini-vision-pro', provider_id: 'google', display_name: 'Gemini Vision Pro', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'high', speed_tier: 'balanced' },
  { model_id: 'gemini-audio', provider_id: 'google', display_name: 'Gemini Audio', capabilities: { reasoning: false, coding: false, vision: false, long_context: false, tool_calling: false }, context_window: 0, cost_tier: 'low', speed_tier: 'fast' },
  { model_id: 'gemini-multimodal-ultra', provider_id: 'google', display_name: 'Gemini Multimodal Ultra', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 2000000, cost_tier: 'high', speed_tier: 'balanced' },

  // ANTHROPIC
  { model_id: 'claude-4-5-opus', provider_id: 'anthropic', display_name: 'Claude Opus 4.5', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 400000, cost_tier: 'high', speed_tier: 'balanced' },
  { model_id: 'claude-4-opus', provider_id: 'anthropic', display_name: 'Claude Opus 4', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 200000, cost_tier: 'high', speed_tier: 'balanced' },
  { model_id: 'claude-4-sonnet', provider_id: 'anthropic', display_name: 'Claude Sonnet 4', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 200000, cost_tier: 'medium', speed_tier: 'fast' },
  { model_id: 'claude-3-5-sonnet', provider_id: 'anthropic', display_name: 'Claude Sonnet 3.5', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 200000, cost_tier: 'medium', speed_tier: 'fast' },
  { model_id: 'claude-haiku-3', provider_id: 'anthropic', display_name: 'Claude Haiku 3', capabilities: { reasoning: false, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'low', speed_tier: 'fast' },
  { model_id: 'claude-instant', provider_id: 'anthropic', display_name: 'Claude Instant', capabilities: { reasoning: false, coding: false, vision: false, long_context: true, tool_calling: true }, context_window: 100000, cost_tier: 'low', speed_tier: 'fast' },

  // PERPLEXITY
  { model_id: 'sonar-pro', provider_id: 'perplexity', display_name: 'Sonar Pro', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 32000, cost_tier: 'medium', speed_tier: 'fast' },
  { model_id: 'sonar-reasoning-pro', provider_id: 'perplexity', display_name: 'Sonar Reasoning Pro', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 32000, cost_tier: 'high', speed_tier: 'balanced' },
  { model_id: 'sonar-large', provider_id: 'perplexity', display_name: 'Sonar Large', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'medium', speed_tier: 'balanced' },
  { model_id: 'sonar-small', provider_id: 'perplexity', display_name: 'Sonar Small', capabilities: { reasoning: false, coding: false, vision: false, long_context: true, tool_calling: true }, context_window: 32000, cost_tier: 'low', speed_tier: 'fast' },
  { model_id: 'sonar-online', provider_id: 'perplexity', display_name: 'Sonar Online', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'medium', speed_tier: 'fast' },
  { model_id: 'sonar-deep-research', provider_id: 'perplexity', display_name: 'Sonar Deep Research', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 256000, cost_tier: 'high', speed_tier: 'balanced' },

  // MISTRAL
  { model_id: 'mistral-large', provider_id: 'mistral', display_name: 'Mistral Large', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'medium', speed_tier: 'balanced' },
  { model_id: 'mistral-medium', provider_id: 'mistral', display_name: 'Mistral Medium', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 64000, cost_tier: 'medium', speed_tier: 'balanced' },
  { model_id: 'mistral-small', provider_id: 'mistral', display_name: 'Mistral Small', capabilities: { reasoning: false, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 32000, cost_tier: 'low', speed_tier: 'fast' },
  { model_id: 'mixtral-8x22b', provider_id: 'mistral', display_name: 'Mixtral 8×22B', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 64000, cost_tier: 'medium', speed_tier: 'fast' },
  { model_id: 'mixtral-8x7b', provider_id: 'mistral', display_name: 'Mixtral 8×7B', capabilities: { reasoning: false, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 32000, cost_tier: 'low', speed_tier: 'fast' },
  { model_id: 'codestral', provider_id: 'mistral', display_name: 'Codestral', capabilities: { reasoning: false, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 32000, cost_tier: 'medium', speed_tier: 'fast' },
  { model_id: 'pixtral-large', provider_id: 'mistral', display_name: 'Pixtral Large', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'high', speed_tier: 'balanced' },
  { model_id: 'pixtral-vision', provider_id: 'mistral', display_name: 'Pixtral Vision', capabilities: { reasoning: false, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'medium', speed_tier: 'fast' },

  // META
  { model_id: 'llama-3-1-405b', provider_id: 'meta', display_name: 'Llama 3.1 405B', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'high', speed_tier: 'balanced' },
  { model_id: 'llama-3-1-70b', provider_id: 'meta', display_name: 'Llama 3.1 70B', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'low', speed_tier: 'fast' },
  { model_id: 'llama-3-1-8b', provider_id: 'meta', display_name: 'Llama 3.1 8B', capabilities: { reasoning: false, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'low', speed_tier: 'fast' },
  { model_id: 'llama-3-code', provider_id: 'meta', display_name: 'Llama 3 Code', capabilities: { reasoning: false, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 32000, cost_tier: 'medium', speed_tier: 'fast' },
  { model_id: 'llama-guard', provider_id: 'meta', display_name: 'Llama Guard', capabilities: { reasoning: false, coding: false, vision: false, long_context: false, tool_calling: false }, context_window: 8000, cost_tier: 'low', speed_tier: 'fast' },

  // XAI
  { model_id: 'grok-2', provider_id: 'xai', display_name: 'Grok-2', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'medium', speed_tier: 'fast' },
  { model_id: 'grok-2-vision', provider_id: 'xai', display_name: 'Grok-2 Vision', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'medium', speed_tier: 'fast' },
  { model_id: 'grok-1-5', provider_id: 'xai', display_name: 'Grok-1.5', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'low', speed_tier: 'balanced' },

  // AMAZON
  { model_id: 'amazon-titan-text', provider_id: 'amazon', display_name: 'Amazon Titan Text', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 8000, cost_tier: 'low', speed_tier: 'fast' },
  { model_id: 'amazon-titan-image', provider_id: 'amazon', display_name: 'Amazon Titan Image', capabilities: { reasoning: false, coding: false, vision: true, long_context: false, tool_calling: false }, context_window: 0, cost_tier: 'medium', speed_tier: 'balanced' },
  { model_id: 'amazon-titan-multimodal', provider_id: 'amazon', display_name: 'Amazon Titan Multimodal', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 32000, cost_tier: 'high', speed_tier: 'balanced' },
  { model_id: 'amazon-titan-embeddings', provider_id: 'amazon', display_name: 'Amazon Titan Embeddings', capabilities: { reasoning: false, coding: false, vision: false, long_context: false, tool_calling: false }, context_window: 0, cost_tier: 'low', speed_tier: 'fast' },

  // NVIDIA
  { model_id: 'nemotron-4', provider_id: 'nvidia', display_name: 'Nemotron-4', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'medium', speed_tier: 'fast' },
  { model_id: 'nvidia-nemo-guardrails', provider_id: 'nvidia', display_name: 'NVIDIA NeMo Guardrails', capabilities: { reasoning: false, coding: false, vision: false, long_context: false, tool_calling: false }, context_window: 0, cost_tier: 'low', speed_tier: 'fast' },
  { model_id: 'nvidia-rtx-chat', provider_id: 'nvidia', display_name: 'NVIDIA RTX Chat', capabilities: { reasoning: true, coding: true, vision: true, long_context: false, tool_calling: false }, context_window: 8000, cost_tier: 'low', speed_tier: 'fast' },

  // COHERE
  { model_id: 'command-r-plus', provider_id: 'cohere', display_name: 'Command R+', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'medium', speed_tier: 'balanced' },
  { model_id: 'command-r', provider_id: 'cohere', display_name: 'Command R', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'low', speed_tier: 'fast' },
  { model_id: 'command-light', provider_id: 'cohere', display_name: 'Command Light', capabilities: { reasoning: false, coding: false, vision: false, long_context: true, tool_calling: true }, context_window: 32000, cost_tier: 'low', speed_tier: 'fast' },
  { model_id: 'embed-v3', provider_id: 'cohere', display_name: 'Embed v3', capabilities: { reasoning: false, coding: false, vision: false, long_context: false, tool_calling: false }, context_window: 0, cost_tier: 'low', speed_tier: 'fast' },
  { model_id: 'rerank-v3', provider_id: 'cohere', display_name: 'Rerank v3', capabilities: { reasoning: false, coding: false, vision: false, long_context: false, tool_calling: false }, context_window: 0, cost_tier: 'low', speed_tier: 'fast' },

  // SPECIALIZED
  { model_id: 'magistral-medium-1-2', provider_id: 'specialized', display_name: 'Magistral Medium 1.2', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 64000, cost_tier: 'medium', speed_tier: 'balanced' },
  { model_id: 'deepseek-r1', provider_id: 'specialized', display_name: 'DeepSeek R1', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: false }, context_window: 128000, cost_tier: 'low', speed_tier: 'balanced' },
  { model_id: 'deepseek-v3', provider_id: 'specialized', display_name: 'DeepSeek V3', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'low', speed_tier: 'fast' },
  { model_id: 'qwen-2-5-max', provider_id: 'specialized', display_name: 'Qwen 2.5 Max', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'medium', speed_tier: 'fast' },
  { model_id: 'qwen-2-5-vision', provider_id: 'specialized', display_name: 'Qwen 2.5 Vision', capabilities: { reasoning: false, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'medium', speed_tier: 'fast' },
  { model_id: 'yi-large', provider_id: 'specialized', display_name: 'Yi Large', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'medium', speed_tier: 'balanced' },
  { model_id: 'yi-vision', provider_id: 'specialized', display_name: 'Yi Vision', capabilities: { reasoning: false, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'medium', speed_tier: 'fast' },
];

export const AVAILABLE_TOOLS: Tool[] = [
  { tool_id: 'web_search', name: 'Web Intel', description: 'Real-time search across global networks.', enabled: false },
  { tool_id: 'code_interpreter', name: 'Compute Kernel', description: 'Sandboxed code execution environment.', enabled: false },
  { tool_id: 'imaging_unit', name: 'Imaging Unit', description: 'Generate high-fidelity assets from descriptions.', enabled: false },
  { tool_id: 'vault_query', name: 'Vault Query', description: 'Deep retrieval from uploaded document banks.', enabled: false },
  { tool_id: 'api_bridge', name: 'API Bridge', description: 'Interact with external REST endpoints.', enabled: false },
  { tool_id: 'social_scribe', name: 'Social Scribe', description: 'Synthesize and post across Twitter/X networks.', enabled: false },
  { tool_id: 'crm_sync', name: 'CRM Sync', description: 'Synchronize leads with Salesforce/Hubspot.', enabled: false },
  { tool_id: 'slack_uplink', name: 'Slack Uplink', description: 'Direct message injection into Slack channels.', enabled: false },
  { tool_id: 'db_tunnel', name: 'DB Tunnel', description: 'Query PostgreSQL/MongoDB data lakes.', enabled: false },
  { tool_id: 'vector_lattice', name: 'Vector Lattice', description: 'Advanced neural embedding search.', enabled: false },
];

export const BOT_TEMPLATES = [
  { id: 'tpl-architect', name: 'Neural Architect', description: 'Expert in full-stack system design.', system_instructions: 'You are an elite Senior Software Architect...', icon: '🏗️', industry: 'Engineering', voice: 'professional', planning: 'chain-of-thought' },
  { id: 'tpl-sentinel', name: 'Cyber Sentinel', description: 'Offensive cybersecurity auditing unit.', system_instructions: 'You are a Principal Security Researcher...', icon: '🛡️', industry: 'Security', voice: 'stoic', planning: 'autonomous' }
];