
import { Entitlement, WalletLink, User, ApiKey, BotConfig, UsageEvent, KnowledgeAsset, ArenaConfig, ArenaTheme } from '../types';

const STORE_KEYS = {
  ENTITLEMENTS: 'zen_entitlements',
  WALLET: 'zen_wallet_link',
  ARENAS: 'zen_arenas',
  BOTS: 'zen_bots',
  USER: 'zen_user',
  USAGE: 'zen_usage',
  KEYS: 'zen_keys',
  KNOWLEDGE: 'zen_knowledge'
};

export const ArenaService = {
  getArenas: (): ArenaConfig[] => {
    const stored = localStorage.getItem(STORE_KEYS.ARENAS);
    return stored ? JSON.parse(stored) : [];
  },
  getArena: (id: string): ArenaConfig | undefined => {
    return ArenaService.getArenas().find(a => a.id === id);
  },
  saveArena: async (arena: ArenaConfig) => {
    const arenas = ArenaService.getArenas();
    const idx = arenas.findIndex(a => a.id === arena.id);
    if (idx >= 0) arenas[idx] = arena;
    else arenas.push(arena);
    localStorage.setItem(STORE_KEYS.ARENAS, JSON.stringify(arenas));
  },
  deleteArena: (id: string) => {
    const arenas = ArenaService.getArenas().filter(a => a.id !== id);
    localStorage.setItem(STORE_KEYS.ARENAS, JSON.stringify(arenas));
  },
  createEmptyArena: (): ArenaConfig => ({
    id: crypto.randomUUID(),
    name: 'NEW_ARENA',
    description: 'A high-fidelity space for intelligence interaction.',
    slug: 'arena-' + Math.random().toString(36).substring(7),
    bot_ids: [],
    theme: {
      primary_color: '#3b82f6',
      secondary_color: '#1e293b',
      bg_color: '#020617',
      accent_color: '#00f7ff',
      font_family: 'Inter',
      border_radius: '1rem',
      animation_style: 'subtle',
      glass_blur: '20px',
      button_style: 'glass',
      border_intensity: '1px'
    },
    created_at: new Date().toISOString()
  })
};

export const CommerceService = {
  getEntitlements: (userId: string): Entitlement[] => {
    const stored = localStorage.getItem(STORE_KEYS.ENTITLEMENTS);
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
    const all = JSON.parse(localStorage.getItem(STORE_KEYS.ENTITLEMENTS) || '[]');
    all.push(entitlement);
    localStorage.setItem(STORE_KEYS.ENTITLEMENTS, JSON.stringify(all));
  },
  setWallet: (link: WalletLink | null) => {
    if (link) localStorage.setItem(STORE_KEYS.WALLET, JSON.stringify(link));
    else localStorage.removeItem(STORE_KEYS.WALLET);
  },
  getWallet: (): WalletLink | null => {
    const stored = localStorage.getItem(STORE_KEYS.WALLET);
    return stored ? JSON.parse(stored) : null;
  }
};

export const AuthService = {
  getUser: (): User | null => {
    const stored = localStorage.getItem(STORE_KEYS.USER);
    return stored ? JSON.parse(stored) : null;
  },
  login: async (): Promise<User> => {
    const mockUser: User = { id: 'usr-1', email: 'operator@zen.foundry' };
    localStorage.setItem(STORE_KEYS.USER, JSON.stringify(mockUser));
    return mockUser;
  },
  logout: () => {
    localStorage.removeItem(STORE_KEYS.USER);
    window.location.reload();
  },
  authorizeGoogle: async (): Promise<User> => {
    const user = AuthService.getUser();
    if (!user) throw new Error("No user");
    const updated = { ...user, google_authorized: true };
    localStorage.setItem(STORE_KEYS.USER, JSON.stringify(updated));
    return updated;
  },
  setSubscription: (active: boolean) => {
    localStorage.setItem('zen_premium', active ? 'true' : 'false');
  }
};

export const BotService = {
  getBots: (): BotConfig[] => {
    const stored = localStorage.getItem(STORE_KEYS.BOTS);
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
    localStorage.setItem(STORE_KEYS.BOTS, JSON.stringify(bots));
  },
  deleteBot: (id: string) => {
    const bots = BotService.getBots().filter(b => b.id !== id);
    localStorage.setItem(STORE_KEYS.BOTS, JSON.stringify(bots));
  },
  createEmptyBot: (): BotConfig => ({
    id: crypto.randomUUID(),
    name: 'NEW_ASSET',
    slug: 'new-asset-' + Math.random().toString(36).substring(7),
    description: '',
    publish_state: 'draft',
    system_instructions: 'You are a professional assistant designed for high-fidelity intelligence.',
    system_reminder: 'Focus on being concise and technically accurate.',
    positive_directives: 'Provide clear, logical, and evidence-based responses.',
    negative_directives: 'Avoid excessive jargon, filler words, or unsubstantiated claims.',
    model_config: { 
      primary_model: 'gemini-3-flash-preview', 
      temperature: 0.7, 
      thinking_budget: 0,
      top_p: 0.95,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop_sequences: []
    },
    image_gen_config: {
      enabled: false,
      model: 'nano-banana-pro',
      style_prompt: '',
      selected_chips: ['Cinematic'],
      custom_chips: [],
      aspect_ratio: '1:1'
    },
    tools: [
      { tool_id: 'web_search', name: 'Web Intel', description: 'Real-time search across global networks.', enabled: false },
    ],
    knowledge_ids: [],
    starter_prompts: ['Analyze current system state'],
    features: { dual_response_mode: false, multi_agent_consult: false, thought_stream_visibility: true, quick_forge: false, xray_vision: true },
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
    return JSON.parse(localStorage.getItem(STORE_KEYS.USAGE) || '[]');
  },
  logUsage: (event: UsageEvent) => {
    const usage = AnalyticsService.getUsage();
    usage.push(event);
    localStorage.setItem(STORE_KEYS.USAGE, JSON.stringify(usage));
  }
};

export const KeyService = {
  getKeys: (): ApiKey[] => {
    return JSON.parse(localStorage.getItem(STORE_KEYS.KEYS) || '[]');
  },
  saveKey: (providerId: string, key: string) => {
    const keys = KeyService.getKeys();
    const snippet = key.substring(0, 8) + '...';
    const idx = keys.findIndex(k => k.provider_id === providerId);
    if (idx >= 0) keys[idx] = { provider_id: providerId, key_snippet: snippet };
    else keys.push({ provider_id: providerId, key_snippet: snippet });
    localStorage.setItem(STORE_KEYS.KEYS, JSON.stringify(keys));
  },
  deleteKey: (providerId: string) => {
    const keys = KeyService.getKeys().filter(k => k.provider_id !== providerId);
    localStorage.setItem(STORE_KEYS.KEYS, JSON.stringify(keys));
  }
};

export const KnowledgeService = {
  getAssets: (): KnowledgeAsset[] => {
    return JSON.parse(localStorage.getItem(STORE_KEYS.KNOWLEDGE) || '[]');
  },
  saveAsset: async (asset: KnowledgeAsset) => {
    const assets = KnowledgeService.getAssets();
    assets.push(asset);
    localStorage.setItem(STORE_KEYS.KNOWLEDGE, JSON.stringify(assets));
  },
  deleteAsset: (id: string) => {
    const assets = KnowledgeService.getAssets().filter(a => a.id !== id);
    localStorage.setItem(STORE_KEYS.KNOWLEDGE, JSON.stringify(assets));
  }
};
