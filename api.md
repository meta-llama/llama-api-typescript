# Chat

Types:

- <code><a href="./src/resources/chat/chat.ts">CompletionMessage</a></code>
- <code><a href="./src/resources/chat/chat.ts">CreateChatCompletionResponse</a></code>
- <code><a href="./src/resources/chat/chat.ts">CreateChatCompletionResponseStreamChunk</a></code>
- <code><a href="./src/resources/chat/chat.ts">Message</a></code>
- <code><a href="./src/resources/chat/chat.ts">MessageImageContentItem</a></code>
- <code><a href="./src/resources/chat/chat.ts">MessageTextContentItem</a></code>
- <code><a href="./src/resources/chat/chat.ts">SystemMessage</a></code>
- <code><a href="./src/resources/chat/chat.ts">ToolResponseMessage</a></code>
- <code><a href="./src/resources/chat/chat.ts">UserMessage</a></code>

## Completions

Methods:

- <code title="post /chat/completions">client.chat.completions.<a href="./src/resources/chat/completions.ts">create</a>({ ...params }) -> CreateChatCompletionResponse</code>

# Models

Types:

- <code><a href="./src/resources/models.ts">LlamaModel</a></code>
- <code><a href="./src/resources/models.ts">ModelListResponse</a></code>

Methods:

- <code title="get /models/{model}">client.models.<a href="./src/resources/models.ts">retrieve</a>(model) -> LlamaModel</code>
- <code title="get /models">client.models.<a href="./src/resources/models.ts">list</a>() -> ModelListResponse</code>

# Moderations

Types:

- <code><a href="./src/resources/moderations.ts">ModerationCreateResponse</a></code>

Methods:

- <code title="post /moderations">client.moderations.<a href="./src/resources/moderations.ts">create</a>({ ...params }) -> ModerationCreateResponse</code>
