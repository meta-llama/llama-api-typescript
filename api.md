# Chat

Types:

- <code><a href="./src/resources/chat/chat.ts">CompletionMessage</a></code>
- <code><a href="./src/resources/chat/chat.ts">CreateChatCompletionRequest</a></code>
- <code><a href="./src/resources/chat/chat.ts">CreateChatCompletionResponse</a></code>
- <code><a href="./src/resources/chat/chat.ts">CreateChatCompletionResponseStreamChunk</a></code>
- <code><a href="./src/resources/chat/chat.ts">Message</a></code>
- <code><a href="./src/resources/chat/chat.ts">MessageImageContentItem</a></code>
- <code><a href="./src/resources/chat/chat.ts">MessageReasoningContentItem</a></code>
- <code><a href="./src/resources/chat/chat.ts">MessageTextContentItem</a></code>
- <code><a href="./src/resources/chat/chat.ts">SystemMessage</a></code>
- <code><a href="./src/resources/chat/chat.ts">ToolResponseMessage</a></code>
- <code><a href="./src/resources/chat/chat.ts">UserMessage</a></code>

## Completions

Methods:

- <code title="post /v1/chat/completions">client.chat.completions.<a href="./src/resources/chat/completions.ts">create</a>({ ...params }) -> CreateChatCompletionResponse</code>

# Models

Types:

- <code><a href="./src/resources/models.ts">LlamaModel</a></code>
- <code><a href="./src/resources/models.ts">ModelListResponse</a></code>

Methods:

- <code title="get /v1/models/{model}">client.models.<a href="./src/resources/models.ts">retrieve</a>(model) -> LlamaModel</code>
- <code title="get /v1/models">client.models.<a href="./src/resources/models.ts">list</a>() -> ModelListResponse</code>

# Moderations

Types:

- <code><a href="./src/resources/moderations.ts">CompletionMessage</a></code>
- <code><a href="./src/resources/moderations.ts">Message</a></code>
- <code><a href="./src/resources/moderations.ts">SystemMessage</a></code>
- <code><a href="./src/resources/moderations.ts">ToolResponseMessage</a></code>
- <code><a href="./src/resources/moderations.ts">UserMessage</a></code>
- <code><a href="./src/resources/moderations.ts">ModerationCreateResponse</a></code>

Methods:

- <code title="post /v1/moderations">client.moderations.<a href="./src/resources/moderations.ts">create</a>({ ...params }) -> ModerationCreateResponse</code>
