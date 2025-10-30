export const geminiService = {
  /**
   * Generates a content stream from the backend's AI chat endpoint.
   * @param prompt The user's input prompt.
   * @returns An async generator that yields string chunks of the AI's response.
   */
  async *generateContentStream(prompt: string): AsyncGenerator<string> {
    try {
      // Use the configured apiClient instance from api.ts
      // The interceptor in api.ts will automatically add the Authorization header if a token exists
      const response = await fetch('/api/chat/stream', { // Keep fetch for SSE stream handling
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add Authorization header manually if needed, or rely on interceptor
          // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ prompt }), // Send only the prompt
      });

      if (!response.ok) { // Check for HTTP errors
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      // Process the stream
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });

        // Process Server-Sent Events (SSE) data format
        const lines = chunk.split('\n\n');
        for (const line of lines) {
            if (line.startsWith('data: ')) {
                try {
                    const jsonData = JSON.parse(line.substring(6));
                    if (jsonData.text) {
                        yield jsonData.text;
                    }
                } catch (e) {
                     console.error("Failed to parse SSE data chunk:", line, e);
                }
            } else if (line.startsWith('event: done')) {
               // Optional: Handle stream completion event if needed
               console.log("AI stream finished.");
               return; // Stop the generator
            } else if (line.startsWith('event: error')) {
                // Optional: Handle error events from the stream
                try {
                   const errorData = JSON.parse(line.substring(6));
                   console.error("AI stream error event:", errorData.message);
                   yield `\n\n[Error from AI: ${errorData.message || 'Unknown error'}]`;
                } catch(e) {
                   console.error("Failed to parse SSE error event:", line, e);
                   yield "\n\n[Received an unparseable error event from AI]";
                }
                return; // Stop on error
            }
        }
      }

    } catch (error) {
      console.error("Error fetching or processing AI content stream:", error);
      yield `I'm sorry, but I encountered an error connecting to the AI assistant (${error instanceof Error ? error.message : String(error)}). Please try again later.`;
    }
  },
};
