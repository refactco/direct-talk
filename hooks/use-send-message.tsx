export const useSendMessage = async (
  prompt: string,
  chatId: string,
  contentId: string | number
) => {
  try {
    console.log('Sending message to API:', { prompt, chatId, contentId });
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt,
        chat_id: chatId,
        content_id: contentId
      })
    });

    console.log('API response status:', response.status);
    const data = await response.json();
    console.log('API response data:', data);
    return data.messages[0].content;
  } catch (error) {
    console.error('Error in sendMessage:', error);
    throw error;
  }
};
