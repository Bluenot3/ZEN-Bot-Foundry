
import { Model, Tool } from './types';

export const MODEL_REGISTRY: Model[] = [
  {
    model_id: 'gemini-3-pro-preview',
    provider_id: 'google',
    display_name: 'Gemini 3 Pro (Elite)',
    capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true },
    context_window: 2000000,
    cost_tier: 'medium',
    speed_tier: 'balanced'
  },
  {
    model_id: 'gemini-3-flash-preview',
    provider_id: 'google',
    display_name: 'Gemini 3 Flash (Instant)',
    capabilities: { reasoning: false, coding: true, vision: true, long_context: true, tool_calling: true },
    context_window: 1000000,
    cost_tier: 'low',
    speed_tier: 'fast'
  },
  {
    model_id: 'gpt-o3-mini',
    provider_id: 'openai',
    display_name: 'GPT-o3-mini (Logic)',
    capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: true },
    context_window: 200000,
    cost_tier: 'medium',
    speed_tier: 'fast'
  },
  {
    model_id: 'claude-4-5-sonnet',
    provider_id: 'anthropic',
    display_name: 'Claude 4.5 Sonnet',
    capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true },
    context_window: 400000,
    cost_tier: 'high',
    speed_tier: 'balanced'
  }
];

export const AVAILABLE_TOOLS: Tool[] = [
  { tool_id: 'web_search', name: 'Web Intel', description: 'Real-time search across global networks.', enabled: false },
  { tool_id: 'code_interpreter', name: 'Compute Kernel', description: 'Sandboxed Python/JS execution environment.', enabled: false },
  { tool_id: 'visual_gen', name: 'Imaging Unit', description: 'Generate high-fidelity assets from descriptions.', enabled: false },
  { tool_id: 'knowledge_rag', name: 'Vault Query', description: 'Deep retrieval from uploaded document banks.', enabled: false },
  { tool_id: 'api_connector', name: 'API Bridge', description: 'Interact with external REST endpoints.', enabled: false },
];

export const BOT_TEMPLATES = [
  {
    id: 'tpl-architect',
    name: 'Neural Architect',
    description: 'Expert in full-stack system design and rapid prototyping.',
    system_instructions: 'You are an elite Senior Software Architect. Your goal is to produce clean, modular, and high-performance React/TypeScript applications. Always provide artifacts for any significant code blocks.',
    icon: '🏗️',
    industry: 'Engineering',
    voice: 'professional',
    planning: 'chain-of-thought'
  },
  {
    id: 'tpl-analyst',
    name: 'Signal Analyst',
    description: 'Deep-dive financial and technical document analysis agent.',
    system_instructions: 'You are a Senior Quantitative Analyst. You specialize in parsing complex reports, identifying trends, and calculating projections with high precision.',
    icon: '📊',
    industry: 'Finance',
    voice: 'concise',
    planning: 'react'
  },
  {
    id: 'tpl-copywriter',
    name: 'Creative Engine',
    description: 'Generative marketing and narrative design unit.',
    system_instructions: 'You are a world-class Copywriter and Narrative Designer. You excel at high-impact messaging, brand storytelling, and multi-channel content strategy.',
    icon: '✍️',
    industry: 'Marketing',
    voice: 'energetic',
    planning: 'linear'
  },
  {
    id: 'tpl-sentinel',
    name: 'Cyber Sentinel',
    description: 'Offensive and defensive cybersecurity auditing unit.',
    system_instructions: 'You are a Principal Security Researcher. You audit code, networks, and systems for vulnerabilities. You provide detailed remediation paths and risk scoring.',
    icon: '🛡️',
    industry: 'Security',
    voice: 'stoic',
    planning: 'autonomous'
  }
];
