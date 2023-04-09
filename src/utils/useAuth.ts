
export const useAuth = () => {


  const showLogin = () => {
    const storageKey = 'cnt_of_experience';
    const currentValue = parseInt(localStorage.getItem(storageKey) || '0');
    console.log('currentValue = ', currentValue)
    if (currentValue < 5) {
      return false
    }

    let sessionId = localStorage.getItem('sessionId')
    if (!sessionId) {
      return true
    }
    return false

  };

  return { showLogin };
};