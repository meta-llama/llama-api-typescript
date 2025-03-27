# Shared

Types:

- <code><a href="./src/resources/shared.ts">CompletionMessage</a></code>
- <code><a href="./src/resources/shared.ts">Message</a></code>
- <code><a href="./src/resources/shared.ts">SystemMessage</a></code>
- <code><a href="./src/resources/shared.ts">ToolResponseMessage</a></code>
- <code><a href="./src/resources/shared.ts">UserMessage</a></code>

# Inference

Types:

- <code><a href="./src/resources/inference.ts">ChatCompletionRequest</a></code>
- <code><a href="./src/resources/inference.ts">ChatCompletionResponse</a></code>
- <code><a href="./src/resources/inference.ts">ChatCompletionResponseEvent</a></code>
- <code><a href="./src/resources/inference.ts">ChatCompletionResponseStreamChunk</a></code>
- <code><a href="./src/resources/inference.ts">ContentDelta</a></code>
- <code><a href="./src/resources/inference.ts">ImageContentItem</a></code>
- <code><a href="./src/resources/inference.ts">ReasoningContentItem</a></code>
- <code><a href="./src/resources/inference.ts">TextContentItem</a></code>

Methods:

- <code title="post /v1/inference/chat-completion">client.inference.<a href="./src/resources/inference.ts">chatCompletion</a>({ ...params }) -> ChatCompletionResponse</code>

# Models

Types:

- <code><a href="./src/resources/models.ts">AIModel</a></code>
- <code><a href="./src/resources/models.ts">ModelListResponse</a></code>

Methods:

- <code title="get /v1/models/{model_id}">client.models.<a href="./src/resources/models.ts">retrieve</a>(modelID) -> AIModel</code>
- <code title="get /v1/models">client.models.<a href="./src/resources/models.ts">list</a>() -> ModelListResponse</code>
