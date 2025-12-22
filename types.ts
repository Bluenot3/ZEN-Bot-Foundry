
export type EntitlementType = 'agent_access' | 'tool_access' | 'knowledge_access' | 'platform_tier' | 'metered_tokens';

export interface Entitlement {
  id: string;
  user_id: string;
  type: EntitlementType;
  resource_id: string; // Bot ID, Tool ID, or 'platform'
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

export interface ArenaProfile {
  id: string;
  creator_id: string;
  slug: string;
  name: string;
  bio: string;
  payout_config: {
    stripe_connect_id?: string;
    eth_payout_address?: string;
    sol_payout_address?: string;
  };
  branding: {
    primary_color: string;
    logo_url?: string;
  };
}

export interface Product {
  id: string;
  arena_id: string;
  name: string;
  description: string;
  price_plans: PricePlan[];
  resource_ids: string[]; // Bot IDs or Tool IDs included
  status: 'draft' | 'published' | 'archived';
}

export interface PricePlan {
  id: string;
  type: 'one_time' | 'subscription' | 'usage';
  amount: number;
  currency: 'USD' | 'ETH' | 'SOL';
  interval?: 'month' | 'year';
  stripe_price_id?: string;
  gumroad_product_id?: string;
}

export interface WalletLink {
  address: string;
  chain_id: number;
  provider: 'metamask' | 'phantom' | 'coinbase' | 'walletconnect';
  connected_at: string;
}

export interface PaymentEvent {
  id: string;
  source: 'stripe' | 'gumroad' | 'crypto';
  external_id: string;
  user_id: string;
  amount: number;
  currency: string;
  product_id: string;
  event_type: 'purchase_success' | 'subscription_updated' | 'refund' | 'chargeback';
  timestamp: string;
}

/** Missing Types Fix **/

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
}

export interface Artifact {
  id: string;
  title: string;
  language: string;
  content: string;
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
  features: {
    dual_response_mode: boolean;
    multi_agent_consult: boolean;
    thought_stream_visibility: boolean;
    quick_forge: boolean;
  };
  workflow: {
    planning_strategy: 'linear' | 'chain-of-thought' | 'react' | 'autonomous';
  };
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

export interface KnowledgeAsset {
  id: string;
  name: string;
  type: 'pdf' | 'url' | 'doc' | 'image';
  source: string;
  size?: string;
  status: 'indexed' | 'pending';
  created_at: string;
}
