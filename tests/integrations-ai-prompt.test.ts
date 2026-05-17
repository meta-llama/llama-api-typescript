import type { LanguageModelV3Prompt, SharedV3Warning } from '@ai-sdk/provider';
import { llamaPromptToMessages } from 'llama-api-client/ai';

describe('llamaPromptToMessages', () => {
  test('maps system and simple user assistant text turns', () => {
    const prompt = [
      { role: 'system' as const, content: 'You are terse.' },
      { role: 'user' as const, content: [{ type: 'text' as const, text: 'Hi' }] },
      { role: 'assistant' as const, content: [{ type: 'text' as const, text: 'Hello.' }] },
    ] satisfies LanguageModelV3Prompt;

    const warns: SharedV3Warning[] = [];
    const msgs = llamaPromptToMessages(prompt, warns);

    expect(msgs.map((m) => m.role)).toEqual(['system', 'user', 'assistant']);

    expect(msgs).toHaveLength(3);
    expect(warns).toHaveLength(0);

    const sys = msgs.find((x) => x.role === 'system');
    expect(sys && sys.role === 'system' ? sys.content : '').toMatch(/terse/);

    const user = msgs.find((x) => x.role === 'user');
    expect(user && user.role === 'user' ? user.content : '').toEqual('Hi');
  });
});
