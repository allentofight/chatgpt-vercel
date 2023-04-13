
export const useAuth = () => {

  const showLogin = () => {
    const storageKey = 'cnt_of_experience';
    const currentValue = parseInt(localStorage.getItem(storageKey) || '0');
    if (currentValue < 10) {
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

  const isExpired = () => {
    let expireDate = localStorage.getItem('expireDay')
    if (!expireDate) {
      return true
    } else {
      let date = new Date(parseInt(expireDate))
      return date < new Date()
    }
  }
  return { showLogin, isLogin, isExpired };
};