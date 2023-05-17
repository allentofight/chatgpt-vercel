import { isLocalStorageAvailable } from './localStorageCheck'

export const useAuth = () => {

  const showLogin = () => {
    if (!isLocalStorageAvailable()) {
      return
    }

    const storageKey = 'cnt_of_experience';
    const currentValue = parseInt(localStorage.getItem(storageKey) || '0');
    if (currentValue < 3) {
      return false
    }

    let sessionId = localStorage.getItem('sessionId')
    if (!sessionId) {
      return true
    }
    return false

  };

  const isLogin = () => {
    if (!isLocalStorageAvailable()) {
      return
    }
    let sessionId = localStorage.getItem('sessionId')
    if (!sessionId) {
      return false
    }
    return true
  };

  const isPaiedUser = () => {
    if (!isLocalStorageAvailable()) {
      return
    }
    let sessionId = localStorage.getItem('isPaiedUser')
    if (!sessionId) {
      return false
    }
    return true
  };

  const isExpired = () => {
    if (!isLocalStorageAvailable()) {
      return
    }
    let expireDate = localStorage.getItem('gpt3ExpireDay')
    if (!expireDate) {
      return true
    } else {
      let date = new Date(parseInt(expireDate))
      return date < new Date()
    }
  }

  const isGPT4Expired = () => {
    if (!isLocalStorageAvailable()) {
      return
    }
    let expireDate = localStorage.getItem('gpt4ExpireDay')
    if (!expireDate) {
      return true
    } else {
      let date = new Date(parseInt(expireDate))
      return date < new Date()
    }
  }

  const isMjExpired = () => {
    if (!isLocalStorageAvailable()) {
      return
    }
    let expireDate = localStorage.getItem('midjourneyExpireDay')
    if (!expireDate) {
      return true
    } else {
      let date = new Date(parseInt(expireDate))
      return date < new Date()
    }
  }

  return { showLogin, isLogin, isExpired, isGPT4Expired, isMjExpired, isPaiedUser };
};