
export type EntitlementType = 'agent_access' | 'tool_access' | 'knowledge_access' | 'platform_tier' | 'metered_tokens';

export interface Entitlement {
  id: string;
  user_id: string;
  type: EntitlementType;
  resource_id: string; 
  status: 'active' | 'expired' | 'pending' | 'revoked';
  valid_until?: string;
  metadata: {
    source: 'stripe' | 'gumroad' | 'crypto' | 'admin';
    transaction_id: string;
    seats?: number;
    tokens_remaining?: number;
  };
  created_at: string;
  updated_at: string;
}

export interface Model {
  model_id: string;
  provider_id: string;
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
  speed_tier: 'fast' | 'balanced';
}

export interface Tool {
  tool_id: string;
  name: string;
  description: string;
  enabled: boolean;
  required_key?: string; // e.g. 'google' or 'openai'
}

export interface Artifact {
  id: string;
  title: string;
  language: string;
  content: string;
}

export interface TelemetryStep {
  id: string;
  type: 'UPLINK' | 'RETRIEVAL' | 'REASONING' | 'TOOL_EXEC' | 'SYNTHESIS' | 'OUTPUT';
  status: 'pending' | 'active' | 'complete' | 'error';
  label: string;
  detail?: string;
  timestamp: number;
  duration?: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  dual_content?: string;
  consultation_log?: string[];
  thinking_log?: string;
  timestamp: number;
  model_used?: string;
  tokens?: number;
  artifacts?: Artifact[];
  selected_variant?: 'A' | 'B';
  isStreaming?: boolean;
  telemetry?: TelemetryStep[];
}

export interface BotConfig {
  id: string;
  name: string;
  slug: string;
  description: string;
  avatar_url?: string;
  publish_state: 'draft' | 'private' | 'arena';
  system_instructions: string;
  model_config: {
    primary_model: string;
    temperature: number;
    thinking_budget: number;
  };
  tools: Tool[];
  knowledge_ids: string[];
  starter_prompts: string[];
  features: {
    dual_response_mode: boolean;
    multi_agent_consult: boolean;
    thought_stream_visibility: boolean;
    quick_forge: boolean;
    xray_vision: boolean;
  };
  workflow: {
    planning_strategy: 'linear' | 'chain-of-thought' | 'react' | 'autonomous';
  };
}

export interface TOONChunk {
  id: string;
  text: string;
  tags: string[];
  vector_hash?: string;
  token_count: number;
}

export interface KnowledgeAsset {
  id: string;
  name: string;
  type: 'pdf' | 'url' | 'doc' | 'image' | 'text' | 'spreadsheet' | 'toon';
  source: string;
  content?: string; 
  toon_chunks?: TOONChunk[];
  tags: string[];
  size?: string;
  status: 'indexed' | 'pending';
  created_at: string;
}

export interface ArenaTheme {
  primary_color: string;
  secondary_color: string;
  bg_color: string;
  accent_color: string;
  font_family: string;
  border_radius: string;
  animation_style: 'none' | 'subtle' | 'dynamic' | 'glitch';
  glass_blur: string;
  button_style: 'flat' | 'glow' | 'glass' | 'outline';
  border_intensity: string;
}

export interface ArenaConfig {
  id: string;
  name: string;
  description: string;
  slug: string;
  bot_ids: string[];
  theme: ArenaTheme;
  custom_css?: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  google_authorized?: boolean;
}

export interface ApiKey {
  provider_id: string;
  key_snippet: string;
}

export interface UsageEvent {
  date: string;
  tokens: number;
  cost_est: number;
  model: string;
  status: 'SUCCESS' | 'FAILURE';
}

export interface WalletLink {
  address: string;
  chain_id: number;
  provider: string;
  connected_at: string;
}

export interface PricePlan {
  id: string;
  type: string;
  amount: number;
  interval?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  resource_ids: string[];
  price_plans: PricePlan[];
}
