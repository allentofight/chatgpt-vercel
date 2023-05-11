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
    const response = await fetch(`${apiHost}/api/mj/sendToTemp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionId}`,
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      let error = await response.json()
      throw new Error(error.message);
    }
    return response.json();
  } catch (error) {
    console.log('sendMJPrompt error = ', error)
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

export const delMjMessage = async (id: string) => {
  let sessionId = localStorage.getItem('sessionId')
  fetch(`${apiHost}/api/mj/delete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionId}`
    },
    body: JSON.stringify({
      id,
    }),
  }).then((response) => {
    // Check if the response status is OK (200)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    // Parse the response as JSON
    return response.json();
  }).catch((error) => {
    console.error('Error delete chat:', error);
  });
}

export const queryPromptStatus = async (messageId: string) => {
  try {
    let sessionId = localStorage.getItem('sessionId')
    const response = await fetch(`${apiHost}/api/mj/queryImageProcess?messageId=${messageId}`, {
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
    if (data.email) {
      localStorage.setItem('email', data.email);
    } else {
      localStorage.removeItem('email')
    }
    if (data.isPaiedUser) {
      localStorage.setItem('isPaiedUser', data.isPaiedUser);
    } else {
      localStorage.removeItem('isPaiedUser');
    }

    if (data.isTelBinded) {
      localStorage.setItem('isTelBinded', '1');
    } else {
      localStorage.removeItem('isTelBinded');
    }

  } else {
    throw new Error('LocalStorage is not available.');
  }
}

export async function gpt4Check() {
  if (isLocalStorageAvailable()) {
    let sessionId = localStorage.getItem('sessionId')
    if (!sessionId) {
      return
    }
    const response = await fetch(`${apiHost}/api/auth/gpt4Check`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionId}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }
    return data
  } else {
    throw new Error('LocalStorage is not available.');
  }
}

export async function incrGPT4Cnt() {
  if (isLocalStorageAvailable()) {
    let sessionId = localStorage.getItem('sessionId')
    if (!sessionId) {
      return
    }
    const response = await fetch(`${apiHost}/api/auth/vipConsume`, {
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
  } else {
    throw new Error('LocalStorage is not available.');
  }
}

export const requestPayment = async (productId: string) => {
  try {
    let sessionId = localStorage.getItem('sessionId')
    const response = await fetch(`${apiHost}/api/alipay/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionId}`,
      },
      body: JSON.stringify({
        productId,
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

export const queryPaymentStatus = async (outTradeNo: string) => {
  try {
    let sessionId = localStorage.getItem('sessionId')
    const response = await fetch(`${apiHost}/api/alipay/query?outTradeNo=${outTradeNo}`, {
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