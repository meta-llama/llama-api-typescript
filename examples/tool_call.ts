#!/usr/bin/env -S npm run tsn -T

import { LlamaAPIClient } from 'llama-api-client';
import { Message } from 'llama-api-client/resources/chat';
import { CompletionCreateParams } from 'llama-api-client/resources/chat';

const client = new LlamaAPIClient();

const tools: CompletionCreateParams.Tool[] = [
  {
    type: 'function',
    function: {
      name: 'get_weather',
      description: 'Get current weather for a given location.',
      parameters: {
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description: 'City and country e.g. Bogotá, Colombia',
          },
        },
        required: ['location'],
        additionalProperties: false,
      },
      strict: true,
    },
  },
];

async function getWeather(location: string): Promise<string> {
  return `The weather in ${location} is sunny.`;
}

interface getWeatherArgs {
  location: string;
}

async function run_streaming(): Promise<void> {
  const messages: Message[] = [
    {
      role: 'system',
      content: 'You are a helpful assistant.',
    },
    {
      role: 'user',
      content: 'Is it raining in Bellevue?',
    },
  ];

  const response = await client.chat.completions.create({
    model: 'Llama-3.3-70B-Instruct',
    messages: messages,
    tools: tools,
    stream: true,
  });

  let stopReason: string = 'stop';
  let toolCall: any = { function: { arguments: '' } };

  for await (const chunk of response) {
    if (chunk.event.delta.type === 'tool_call' && chunk.event.delta.id) {
      toolCall.id = chunk.event.delta.id;
    }
    if (chunk.event.delta.type === 'tool_call' && chunk.event.delta.function?.name) {
      console.log(`Using tool_id=${chunk.event.delta.id} with name=${chunk.event.delta.function.name}`);
      toolCall.function.name = chunk.event.delta.function.name;
    } 
    if (chunk.event.delta.type === 'tool_call' && chunk.event.delta.function?.arguments) {
      toolCall.function.arguments += chunk.event.delta.function.arguments;
      process.stdout.write(chunk.event.delta.function.arguments);
    }

    if (chunk.event.stop_reason) {
      stopReason = chunk.event.stop_reason;
    }
  }

  const completionMessage: Message = {
    role: 'assistant',
    content: '',
    tool_calls: [toolCall],
    stop_reason: stopReason as 'stop' | 'tool_calls' | 'length',
  };

  messages.push(completionMessage);
  if (toolCall.function.name === 'get_weather') {
    const getWeatherArgs: getWeatherArgs = JSON.parse(toolCall.function.arguments);
    const toolResult: string = await getWeather(getWeatherArgs.location);
    toolCall.function.arguments = toolResult;
    messages.push({
      role: 'tool',
      tool_call_id: toolCall.id,
      content: toolResult,
    });
    console.log(`\nTool result: ${toolResult}`);
  }

  const nextResponse = await client.chat.completions.create({
    model: 'Llama-3.3-70B-Instruct',
    messages: messages,
    tools: tools,
    stream: true,
  });

  for await (const chunk of nextResponse) {
    if (chunk.event.delta.type === 'text') {
      process.stdout.write(chunk.event.delta.text || '');
    }
  }
  process.stdout.write('\n');
}

async function run(): Promise<void> {
  const messages: Message[] = [
    {
      role: 'system',
      content: 'You are a helpful assistant.',
    },
    {
      role: 'user',
      content: 'Is it raining in Bellevue?',
    },
  ];

  const response = await client.chat.completions.create({
    model: 'Llama-3.3-70B-Instruct',
    messages: messages,
    tools: tools,
    max_completion_tokens: 2048,
    temperature: 0.9,
    stream: false,
  });

  messages.push(response.completion_message);

  if (response.completion_message.tool_calls) {
    console.log(response.completion_message.tool_calls);
    const toolCall = response.completion_message.tool_calls[0];
    if (toolCall) {
      const toolName: string = toolCall.function.name;
      if (toolName === 'get_weather') {
        const getWeatherArgs: getWeatherArgs = JSON.parse(toolCall.function.arguments);
        const toolResult: string = await getWeather(getWeatherArgs.location);
        console.log(`Tool result: ${toolResult}`);
        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: toolResult,
        });
      } else {
        console.log(`Unknown tool: ${toolName}`);
      }
    }
  }
  // Next Turn
  const nextResponse = await client.chat.completions.create({
    model: 'Llama-3.3-70B-Instruct',
    messages: messages,
    tools: tools,
    max_completion_tokens: 2048,
    temperature: 0.9,
    stream: false,
  });

  console.log(nextResponse);
}

async function main() {
  await run_streaming();
  await run();
}

main();
