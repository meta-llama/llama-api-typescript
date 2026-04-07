#!/usr/bin/env -S npm run tsn -T

import LlamaAPIClient from 'llama-api-client';

const client = new LlamaAPIClient();

async function main() {
  // List all available models
  const models = await client.models.list();
  console.log('Available models:');
  for (const model of models) {
    console.log(`  - ${model.id} (owned by: ${model.owned_by})`);
  }

  // Retrieve a specific model
  const model = await client.models.retrieve('Llama-3.3-70B-Instruct');
  console.log(`\nModel details:`);
  console.log(`  ID: ${model.id}`);
  console.log(`  Object: ${model.object}`);
  console.log(`  Owned by: ${model.owned_by}`);
  console.log(`  Created: ${model.created}`);
}

main();
