import { isLocalStorageAvailable } from "~/utils/localStorageCheck"
import { RootStore } from "~/store"
const { store, setStore } = RootStore
import axios, { AxiosResponse } from 'axios';

// api.js or api.ts
const apiHost = import.meta.env.CLIENT_API_HOST;

const token = import.meta.env.CLIENT_IMAGE_TOKEN;

interface MjPromptBody {
  // Define the properties and their types here
  prompt?: string;
  button?: string;
  ref?: string;
  messageId?: string;
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
      console.log('sendMJPrompt error...')
      return await response.json()
    }
    return response.json();
  } catch (error) {
    console.log('sendMJPrompt error = ')
    throw error;
  }
};

export const mjUpscale = async (body: MjPromptBody) => {
  try {
    let sessionId = localStorage.getItem('sessionId')
    const response = await fetch(`${apiHost}/api/mj/upscale`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionId}`,
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      console.log('sendMJPrompt error...')
      return await response.json()
    }
    return response.json();
  } catch (error) {
    console.log('sendMJPrompt error = ')
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

export const fetchMjTemplateList = async (earliestGmtCreate: string | undefined) => {
  try {
    let sessionId = localStorage.getItem('sessionId')
    let url = `${apiHost}/api/mj/templateList`
    if (earliestGmtCreate?.length) {
      url = `${url}?earliestGmtCreate=${earliestGmtCreate}`
    }
    const response = await fetch(url, {
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

export const fetchMjMessageList = async (earliestGmtCreate: string | undefined) => {
  try {
    let sessionId = localStorage.getItem('sessionId')
    let url = `${apiHost}/api/mj/messageList`
    if (earliestGmtCreate?.length) {
      url = `${url}?earliestGmtCreate=${earliestGmtCreate}`
    }
    const response = await fetch(url, {
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
    if (data.isQualifyFor4) {
      localStorage.setItem('isQualifyFor4', '1')
    } else {
      localStorage.removeItem('isQualifyFor4')
    }


    if (data.leftGpt4Cnt) {
      localStorage.setItem('leftGpt4Cnt', data.leftGpt4Cnt)
      setStore('leftGPT4Cnt', data.leftGpt4Cnt)
    }

    localStorage.removeItem('email')
    if (data.isPaiedUser) {
      localStorage.setItem('isPaiedUser', data.isPaiedUser);
    } else {
      localStorage.removeItem('isPaiedUser');
    }

    if (data.gpt3ExpireDay) {
      localStorage.setItem('gpt3ExpireDay', data.gpt3ExpireDay.toString())
    }

    if (data.gpt4ExpireDay) {
      localStorage.setItem('gpt4ExpireDay', data.gpt4ExpireDay.toString())
      let date = toBeijingTime(new Date(data.gpt4ExpireDay))
      setStore('gpt4ExpireDate', date)
    }

    if (data.midjourneyExpireDay) {
      localStorage.setItem('midjourneyExpireDay', data.midjourneyExpireDay.toString())
    }


    if (data.phone) {
      localStorage.setItem('phone', data.phone);
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

function toBeijingTime(date: Date): string {
  // 转换为北京时间的偏移
  const offset = 8;
  let localTime = date.getTime();
  let localOffset = date.getTimezoneOffset() * 60000;
  let utc = localTime + localOffset;
  let beijingTime = new Date(utc + (3600000 * offset));

  let year = beijingTime.getFullYear();
  let month = ("0" + (beijingTime.getMonth() + 1)).slice(-2); // 月份从0开始，所以+1
  let day = ("0" + beijingTime.getDate()).slice(-2);
  let hours = ("0" + beijingTime.getHours()).slice(-2);
  let minutes = ("0" + beijingTime.getMinutes()).slice(-2);

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export async function gpt4Check(sessionId: string) {
  if (!sessionId || !sessionId.length) {
    return { success: false }
  }
  const response = await fetch(`${apiHost}/api/auth/checkGpt4`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionId}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    return { success: false }
  }
  return data
}

export async function incrGPT4Cnt() {
  if (isLocalStorageAvailable()) {
    let sessionId = localStorage.getItem('sessionId')
    if (!sessionId) {
      return
    }
    const response = await fetch(`${apiHost}/api/auth/gpt4Consume`, {
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
  } else {
    throw new Error('LocalStorage is not available.');
  }
}

export async function createOrUpdatePrompt(body: string) {
  let sessionId = localStorage.getItem('sessionId')
  const response = await fetch(`${apiHost}/api/chat/createPrompt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionId}`,
    },
    body,
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message);
  } else {
    return await response.json();
  }
}

export async function listPrompt() {
  let sessionId = localStorage.getItem('sessionId')
  const response = await fetch(`${apiHost}/api/chat/listPrompt`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionId}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message);
  } else {
    return await response.json();
  }
}


export const delPrompt = async (id: string) => {
  let sessionId = localStorage.getItem('sessionId')
  await fetch(`${apiHost}/api/chat/delPrompt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionId}`
    },
    body: JSON.stringify({
      id,
    }),
  }).then((response) => {
    console.log('response = ', response)
    // Check if the response status is OK (200)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    // Parse the response as JSON
    return true;
  }).catch((error) => {
    console.error('Error delete chat:', error);
  });
}

export const requestPayment = async (productId: string, options: string) => {
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
        options,
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

export const uploadImage = async (messageId: string, imageUrl: string) => {
  // Fetch the image
  const response = await axios({
    method: 'get',
    url: imageUrl,
    responseType: 'arraybuffer',
  });

  // Create form data
  let form = new FormData();

  let blob = new Blob([response.data], { type: 'image/png' });

  // Append the image stream to the form data
  form.append('file', blob, 'demo3.png');
  // Send to the third-party API
  const uploadResponse = await axios.post(`https://api.superbed.cn/upload?token=${token}`, form)

  let sessionId = localStorage.getItem('sessionId')
  fetch(`${apiHost}/api/mj/updateCloudUrl`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionId}`
    },
    body: JSON.stringify({
      cloudUrl: uploadResponse.data.url,
      messageId
    }),
  }).then((response) => {
    console.log('response = ', response)
    // Check if the response status is OK (200)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    // Parse the response as JSON
    return true;
  }).catch((error) => {
    console.error('Error delete chat:', error);
    return false
  });

  console.log('url = ', uploadResponse.data.url)
  return uploadResponse.data.url

}

export const createPrompt = async (body: string) => {
  let sessionId = localStorage.getItem('sessionId')
  return await fetch(`${apiHost}/api/mj/createPrompt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionId}`
    },
    body,
  }).then((response) => {
    console.log('response = ', response)
    // Check if the response status is OK (200)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    // Parse the response as JSON
    return true;
  }).catch((error) => {
    console.error('Error delete chat:', error);
    return false
  });
}

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

export const fetchSeed = async (messageId: string) => {
  try {
    let sessionId = localStorage.getItem('sessionId')
    const response = await fetch(`${apiHost}/api/mj/getSeed?messageId=${messageId}`, {
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

export const sendMjTranslate = async (body: MjPromptBody) => {
  try {
    let sessionId = localStorage.getItem('sessionId')
    const response = await fetch(`${apiHost}/api/mj/translate`, {
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