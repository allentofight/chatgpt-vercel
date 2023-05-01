import { isLocalStorageAvailable } from "~/utils/localStorageCheck"

// api.js or api.ts
const apiHost = import.meta.env.CLIENT_API_HOST;

interface MjPromptBody {
  // Define the properties and their types here
  prompt?: string;
  button?: string;
  ref?: string;
  buttonMessageId?: string;
}

interface MjUpdateChatMessage {
  messageId: string;
  clickedEvent: string;
}

export const sendMjPrompt = async (body: MjPromptBody) => {
  try {
    let sessionId = localStorage.getItem('sessionId')
    const response = await fetch(`${apiHost}/api/mj/sendPrompt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionId}`,
      },
      body: JSON.stringify(body)
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


export const updateMjMessage = async (body: MjUpdateChatMessage) => {
  try {
    let sessionId = localStorage.getItem('sessionId')
    const response = await fetch(`${apiHost}/api/mj/updateMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionId}`,
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error udpate Mj chat:", error);
    throw error;
  }
};

export const fetchMjMessageList = async () => {
  try {
    let sessionId = localStorage.getItem('sessionId')
    const response = await fetch(`${apiHost}/api/mj/messageList`, {
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
    console.error("Error udpate Mj chat:", error);
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

export async function fetchUserInfo() {
  if (isLocalStorageAvailable()) {
    let sessionId = localStorage.getItem('sessionId')
    if (!sessionId) {
      return
    }
    const response = await fetch(`${apiHost}/api/auth/getUserInfo`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionId}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message);
    }
    const data = await response.json();
    localStorage.setItem('expireDay', data.expiredDay.toString());
    localStorage.setItem('inviteCode', data.inviteCode);
    localStorage.setItem('sessionId', data.token);
  } else {
    throw new Error('LocalStorage is not available.');
  }
}