
export const useAuth = () => {

  const showLogin = () => {
    const storageKey = 'cnt_of_experience';
    const currentValue = parseInt(localStorage.getItem(storageKey) || '0');
    if (currentValue < 2) {
      return false
    }

    let sessionId = localStorage.getItem('sessionId')
    if (!sessionId) {
      return true
    }
    return false

  };

  const isLogin = () => {
    let sessionId = localStorage.getItem('sessionId')
    if (!sessionId) {
      return false
    }
    return true
  };

  return { showLogin, isLogin };
};