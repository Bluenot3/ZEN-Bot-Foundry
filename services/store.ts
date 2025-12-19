
import { BotConfig, User, ApiKey, UsageEvent, KnowledgeAsset } from '../types';
import { AVAILABLE_TOOLS, MODEL_REGISTRY } from '../constants';

const STORAGE_KEYS = {
  USER: 'zen_user',
  BOTS: 'zen_bots',
  API_KEYS: 'zen_api_keys',
  USAGE: 'zen_usage',
  KNOWLEDGE: 'zen_knowledge'
};

const MOCK_USER: User = {
  id: 'USR-7721-X',
  email: 'operator@zenfoundry.mil',
  name: 'OPERATOR 01',
  avatar_url: 'https://api.dicebear.com/7.x/identicon/svg?seed=zen',
  is_subscribed: false,
  google_authorized: false
};

export const AuthService = {
  getUser: (): User | null => {
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    return stored ? JSON.parse(stored) : null;
  },
  login: (email: string = 'operator@zenfoundry.mil'): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = { ...MOCK_USER, email };
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        resolve(user);
      }, 1200);
    });
  },
  authorizeGoogle: (): Promise<User> => {
    return new Promise((resolve) => {
      const user = AuthService.getUser();
      if (user) {
        user.google_authorized = true;
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        resolve(user);
      }
    });
  },
  setSubscription: (status: boolean): Promise<User> => {
    return new Promise((resolve) => {
      const user = AuthService.getUser();
      if (user) {
        user.is_subscribed = status;
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        resolve(user);
      }
    });
  },
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    window.location.reload();
  }
};

export const BotService = {
  getBots: (): BotConfig[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.BOTS);
    return stored ? JSON.parse(stored) : [];
  },
  getBot: (id: string): BotConfig | undefined => {
    const bots = BotService.getBots();
    return bots.find(b => b.id === id);
  },
  saveBot: (bot: BotConfig): Promise<BotConfig> => {
    return new Promise((resolve) => {
      const bots = BotService.getBots();
      const existingIndex = bots.findIndex(b => b.id === bot.id);
      if (existingIndex >= 0) {
        bots[existingIndex] = { ...bot, updated_at: new Date().toISOString() };
      } else {
        bots.push(bot);
      }
      localStorage.setItem(STORAGE_KEYS.BOTS, JSON.stringify(bots));
      setTimeout(() => resolve(bot), 800);
    });
  },
  deleteBot: (id: string) => {
    const bots = BotService.getBots().filter(b => b.id !== id);
    localStorage.setItem(STORAGE_KEYS.BOTS, JSON.stringify(bots));
  },
  createEmptyBot: (): BotConfig => ({
    id: crypto.randomUUID(),
    owner_id: 'USR-7721-X',
    name: 'NEW_ASSET_UNIT',
    slug: `asset-${Date.now()}`,
    description: 'Autonomous neural processing unit.',
    system_instructions: 'You are a mission-critical AI intelligence asset. Provide objective, high-fidelity data processing.',
    tone: 'NEUTRAL',
    model_config: {
      primary_model: MODEL_REGISTRY[0].model_id,
      fallback_chain: [],
      temperature: 0.2,
      topP: 0.9,
      topK: 40,
      maxOutputTokens: 2048,
      cheap_mode: false,
      use_native_key: false,
      safety_settings: 'MEDIUM'
    },
    // Fix: Adding adaptive_routing and recursive_thinking to match the BotConfig.features type definition
    features: {
      dual_response_mode: false,
      multi_agent_consult: false,
      autonomous_loops: false,
      thought_stream_visibility: true,
      adaptive_routing: false,
      recursive_thinking: false
    },
    tools: AVAILABLE_TOOLS.map(t => ({ ...t })),
    memory_config: {
      type: 'session',
      knowledge_base_ids: [],
      summary_threshold: 4096
    },
    publish_state: 'private',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }),
  createBotFromTemplate: (template: any): BotConfig => {
    const empty = BotService.createEmptyBot();
    return {
      ...empty,
      name: template.name.toUpperCase().replace(/\s+/g, '_'),
      description: template.description,
      system_instructions: template.system_instructions,
    };
  }
};

export const KeyService = {
  getKeys: (): ApiKey[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.API_KEYS);
    return stored ? JSON.parse(stored) : [];
  },
  saveKey: (provider_id: string, key: string) => {
    const keys = KeyService.getKeys();
    const newEntry: ApiKey = {
      provider_id: provider_id as any,
      key_snippet: `${key.substring(0, 4)}...${key.substring(key.length - 4)}`,
      encrypted_key: key, 
      created_at: new Date().toISOString()
    };
    const filtered = keys.filter(k => k.provider_id !== provider_id);
    filtered.push(newEntry);
    localStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify(filtered));
  },
  deleteKey: (provider_id: string) => {
    const keys = KeyService.getKeys();
    const filtered = keys.filter(k => k.provider_id !== provider_id);
    localStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify(filtered));
  }
};

export const KnowledgeService = {
  getAssets: (): KnowledgeAsset[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.KNOWLEDGE);
    return stored ? JSON.parse(stored) : [];
  },
  saveAsset: (asset: KnowledgeAsset): Promise<KnowledgeAsset> => {
    return new Promise((resolve) => {
      const assets = KnowledgeService.getAssets();
      assets.push(asset);
      localStorage.setItem(STORAGE_KEYS.KNOWLEDGE, JSON.stringify(assets));
      setTimeout(() => resolve(asset), 600);
    });
  },
  deleteAsset: (id: string) => {
    const assets = KnowledgeService.getAssets().filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.KNOWLEDGE, JSON.stringify(assets));
  }
};

export const AnalyticsService = {
  getUsage: (): UsageEvent[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.USAGE);
    return stored ? JSON.parse(stored) : [];
  },
  logUsage: (event: UsageEvent) => {
    const usage = AnalyticsService.getUsage();
    usage.push(event);
    localStorage.setItem(STORAGE_KEYS.USAGE, JSON.stringify(usage));
  }
};
