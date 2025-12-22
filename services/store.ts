
import { Entitlement, WalletLink, User, ApiKey, BotConfig, UsageEvent, KnowledgeAsset } from '../types';

const COMMERCE_KEYS = {
  ENTITLEMENTS: 'zen_entitlements',
  WALLET: 'zen_wallet_link',
  ARENAS: 'zen_arenas'
};

export const CommerceService = {
  getEntitlements: (userId: string): Entitlement[] => {
    const stored = localStorage.getItem(COMMERCE_KEYS.ENTITLEMENTS);
    if (!stored) return [];
    return JSON.parse(stored).filter((e: Entitlement) => e.user_id === userId);
  },

  checkAccess: (userId: string, resourceId: string): boolean => {
    const entitlements = CommerceService.getEntitlements(userId);
    return entitlements.some(e => 
      e.resource_id === resourceId && 
      e.status === 'active' && 
      (!e.valid_until || new Date(e.valid_until) > new Date())
    );
  },

  addEntitlement: (entitlement: Entitlement) => {
    const all = JSON.parse(localStorage.getItem(COMMERCE_KEYS.ENTITLEMENTS) || '[]');
    all.push(entitlement);
    localStorage.setItem(COMMERCE_KEYS.ENTITLEMENTS, JSON.stringify(all));
  },

  setWallet: (link: WalletLink | null) => {
    if (link) localStorage.setItem(COMMERCE_KEYS.WALLET, JSON.stringify(link));
    else localStorage.removeItem(COMMERCE_KEYS.WALLET);
  },

  getWallet: (): WalletLink | null => {
    const stored = localStorage.getItem(COMMERCE_KEYS.WALLET);
    return stored ? JSON.parse(stored) : null;
  }
};

/** Missing Services Implementation **/

export const AuthService = {
  getUser: (): User | null => {
    const stored = localStorage.getItem('zen_user');
    return stored ? JSON.parse(stored) : null;
  },
  login: async (): Promise<User> => {
    const mockUser: User = { id: 'usr-1', email: 'operator@zen.foundry' };
    localStorage.setItem('zen_user', JSON.stringify(mockUser));
    return mockUser;
  },
  logout: () => {
    localStorage.removeItem('zen_user');
    window.location.reload();
  },
  authorizeGoogle: async (): Promise<User> => {
    const user = AuthService.getUser();
    if (!user) throw new Error("No user");
    const updated = { ...user, google_authorized: true };
    localStorage.setItem('zen_user', JSON.stringify(updated));
    return updated;
  },
  setSubscription: (active: boolean) => {
    localStorage.setItem('zen_premium', active ? 'true' : 'false');
  }
};

export const BotService = {
  getBots: (): BotConfig[] => {
    const stored = localStorage.getItem('zen_bots');
    return stored ? JSON.parse(stored) : [];
  },
  getBot: (id: string): BotConfig | undefined => {
    return BotService.getBots().find(b => b.id === id);
  },
  saveBot: async (bot: BotConfig) => {
    const bots = BotService.getBots();
    const idx = bots.findIndex(b => b.id === bot.id);
    if (idx >= 0) bots[idx] = bot;
    else bots.push(bot);
    localStorage.setItem('zen_bots', JSON.stringify(bots));
  },
  deleteBot: (id: string) => {
    const bots = BotService.getBots().filter(b => b.id !== id);
    localStorage.setItem('zen_bots', JSON.stringify(bots));
  },
  createEmptyBot: (): BotConfig => ({
    id: crypto.randomUUID(),
    name: 'NEW_ASSET',
    slug: 'new-asset-' + Math.random().toString(36).substring(7),
    description: '',
    publish_state: 'draft',
    system_instructions: 'You are a professional assistant designed for high-fidelity intelligence.',
    model_config: { primary_model: 'gemini-3-flash-preview', temperature: 0.7, thinking_budget: 0 },
    tools: [
      { tool_id: 'web_search', name: 'Web Intel', description: 'Real-time search across global networks.', enabled: false },
      { tool_id: 'code_interpreter', name: 'Compute Kernel', description: 'Sandboxed code execution.', enabled: false },
    ],
    features: { dual_response_mode: false, multi_agent_consult: false, thought_stream_visibility: true, quick_forge: false },
    workflow: { planning_strategy: 'linear' }
  }),
  createBotFromTemplate: (template: any): BotConfig => {
    const bot = BotService.createEmptyBot();
    return {
      ...bot,
      name: template.name,
      description: template.description,
      system_instructions: template.system_instructions,
      workflow: { planning_strategy: template.planning || 'linear' }
    };
  }
};

export const AnalyticsService = {
  getUsage: (): UsageEvent[] => {
    return JSON.parse(localStorage.getItem('zen_usage') || '[]');
  }
};

export const KeyService = {
  getKeys: (): ApiKey[] => {
    return JSON.parse(localStorage.getItem('zen_keys') || '[]');
  },
  saveKey: (providerId: string, key: string) => {
    const keys = KeyService.getKeys();
    const snippet = key.substring(0, 8) + '...';
    const idx = keys.findIndex(k => k.provider_id === providerId);
    if (idx >= 0) keys[idx] = { provider_id: providerId, key_snippet: snippet };
    else keys.push({ provider_id: providerId, key_snippet: snippet });
    localStorage.setItem('zen_keys', JSON.stringify(keys));
  },
  deleteKey: (providerId: string) => {
    const keys = KeyService.getKeys().filter(k => k.provider_id !== providerId);
    localStorage.setItem('zen_keys', JSON.stringify(keys));
  }
};

export const KnowledgeService = {
  getAssets: (): KnowledgeAsset[] => {
    return JSON.parse(localStorage.getItem('zen_knowledge') || '[]');
  },
  saveAsset: async (asset: KnowledgeAsset) => {
    const assets = KnowledgeService.getAssets();
    assets.push(asset);
    localStorage.setItem('zen_knowledge', JSON.stringify(assets));
  },
  deleteAsset: (id: string) => {
    const assets = KnowledgeService.getAssets().filter(a => a.id !== id);
    localStorage.setItem('zen_knowledge', JSON.stringify(assets));
  }
};
