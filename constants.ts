
import { Model, Tool } from './types';

export const MODEL_REGISTRY: Model[] = [
  {
    model_id: 'gemini-3-pro-preview',
    provider_id: 'google',
    display_name: 'Gemini 3 Pro (Ultra)',
    capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true },
    context_window: 2000000,
    cost_tier: 'medium',
    speed_tier: 'balanced'
  },
  {
    model_id: 'gemini-3-flash-preview',
    provider_id: 'google',
    display_name: 'Gemini 3 Flash (Speed)',
    capabilities: { reasoning: false, coding: true, vision: true, long_context: true, tool_calling: true },
    context_window: 1000000,
    cost_tier: 'low',
    speed_tier: 'fast'
  },
  {
    model_id: 'gpt-o3-mini',
    provider_id: 'openai',
    display_name: 'GPT-o3-mini (Reasoning)',
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
  { tool_id: 'web_search', name: 'Web Search', description: 'Live internet access for real-time intel retrieval.', enabled: false },
  { tool_id: 'code_interpreter', name: 'Sandbox Engine', description: 'Execute and test complex Python or JS snippets safely.', enabled: false },
  { tool_id: 'visual_renderer', name: 'Visual Processor', description: 'Deep image analysis and spatial data rendering.', enabled: false },
  { tool_id: 'network_probe', name: 'Network Probe', description: 'Analyze external API endpoints and status payloads.', enabled: false },
  { tool_id: 'rag_vault', name: 'Knowledge Vault', description: 'Query proprietary encrypted documentation datasets.', enabled: false },
  { tool_id: 'file_sys', name: 'FS Interface', description: 'Read and write to a virtual persistent file system.', enabled: false },
  { tool_id: 'crypto_gate', name: 'Crypto Gateway', description: 'Verify blockchain transactions and wallet signatures.', enabled: false },
];

export const BOT_TEMPLATES = [
  {
    name: 'Neural Architect',
    description: 'Expert in system design and React application development.',
    system_instructions: 'You are a master software architect. When asked to build apps, provide high-quality code in artifacts. Use Tailwind CSS for styling.',
    icon: '🏗️'
  },
  {
    name: 'OSINT Analyst',
    description: 'Specialized in gathering open-source intelligence and web data.',
    system_instructions: 'You are a senior OSINT analyst. Provide structured reports and use web search tools effectively.',
    icon: '🔍'
  },
  {
    name: 'Cyber Sentinel',
    description: 'Security-focused bot for code auditing and vulnerability scans.',
    system_instructions: 'You are a cybersecurity expert. Audit code for OWASP vulnerabilities and provide remediation steps.',
    icon: '🛡️'
  }
];
