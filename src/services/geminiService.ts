import { Product } from '../types';

export const geminiService = {
  /**
   * Generates a content stream from the backend's AI chat endpoint.
   * @param prompt The user's input prompt.
   * @param products The list of products to provide as context.
   * @returns An async generator that yields string chunks of the AI's response.
   */
  async *generateContentStream(prompt: string, products: Product[]): AsyncGenerator<string> {
    try {
      // We assume the vite proxy will catch this
      const response = await fetch('/api/chat/stream', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add Authorization header if your chat requires users to be logged in
          // 'Authorization': \Bearer \\
        },
        body: JSON.stringify({ prompt, products }),
      });

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          yield chunk;
        }
      }
    } catch (error) {
      console.error("Error in AI content stream:", error);
      yield "I'm sorry, but I'm experiencing a temporary issue. Please try your question again in a moment.";
    }
  },
};
