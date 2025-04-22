export const useSendMessage = async (
  prompt: string,
  chatId: string,
  contentId: string | number
) => {
  try {
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

    const data = await response.json();

    return data.messages[0].content;
  } catch (error) {
    throw error;
  }
};
