// api.js or api.ts
const apiHost = import.meta.env.PUBLIC_API_HOST;

export const sendMjPrompt = async (prompt: string) => {
  try {
    let sessionId = localStorage.getItem('sessionId')
    const response = await fetch(`${apiHost}/api/mj/sendPrompt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionId}`,
      },
      body: JSON.stringify({
        prompt
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching chat:", error);
    throw error;
  }
};


export const queryPromptStatus = async (messageId: string) => {
  try {
    let sessionId = localStorage.getItem('sessionId')
    const response = await fetch(`${apiHost}/api/mj/queryPromptStatus?messageId=${messageId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionId}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching chat:", error);
    throw error;
  }
};