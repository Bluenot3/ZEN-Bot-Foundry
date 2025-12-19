
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  is_subscribed: boolean;
  google_authorized: boolean;
  subscription_expiry?: string;
}

export type ProviderId = 'openai' | 'google' | 'anthropic' | 'openrouter' | 'groq' | 'mistral' | 'cohere' | 'perplexity' | 'deepseek' | 'together' | 'fireworks' | 'nano';

export interface Model {
  model_id: string;
  provider_id: ProviderId;
  display_name: string;
  capabilities: {
    reasoning: boolean;
    coding: boolean;
    vision: boolean;
    long_context: boolean;
    tool_calling: boolean;
  };
  context_window: number;
  cost_tier: 'low' | 'medium' | 'high';
  speed_tier: 'fast' | 'balanced' | 'slow';
}

export interface Tool {
  tool_id: string;
  name: string;
  description: string;
  enabled: boolean;
  config?: Record<string, any>;
}

export interface ApiKey {
  provider_id: ProviderId;
  key_snippet: string;
  encrypted_key: string;
  created_at: string;
}

export interface Artifact {
  id: string;
  title: string;
  type: 'code' | 'web-app' | 'component' | 'document';
  language: string;
  content: string;
}

export interface KnowledgeAsset {
  id: string;
  name: string;
  type: 'url' | 'pdf' | 'image' | 'text' | 'doc';
  source: string; // URL or File Name
  content_preview?: string;
  status: 'indexed' | 'processing' | 'error';
  size?: string;
  created_at: string;
}

export interface BotConfig {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string;
  avatar_url?: string;
  system_instructions: string;
  tone: string;
  model_config: {
    primary_model: string;
    fallback_chain: string[];
    temperature: number;
    topP: number;
    topK: number;
    maxOutputTokens: number;
    cheap_mode: boolean;
    use_native_key: boolean;
    safety_settings: 'OFF' | 'LOW' | 'MEDIUM' | 'HIGH';
  };
  features: {
    dual_response_mode: boolean;
    multi_agent_consult: boolean;
    autonomous_loops: boolean;
    thought_stream_visibility: boolean;
    adaptive_routing: boolean;
    recursive_thinking: boolean;
  };
  tools: Tool[];
  memory_config: {
    type: 'session' | 'persistent' | 'rag';
    knowledge_base_ids: string[];
    summary_threshold: number;
  };
  publish_state: 'private' | 'unlisted' | 'public';
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  dual_content?: string; // For dual-response mode
  selected_variant?: 'A' | 'B';
  consultation_log?: string[]; // Log of agent-to-agent consultations
  timestamp: number;
  tool_calls?: { tool_name: string; input: string; output: string }[];
  model_used?: string;
  tokens?: number;
  artifacts?: Artifact[];
}

export interface UsageEvent {
  date: string;
  tokens: number;
  cost_est: number;
  model: string;
  status: 'SUCCESS' | 'FAILURE';
}
