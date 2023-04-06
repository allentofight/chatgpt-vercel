import { createStore } from 'solid-js/store';

interface Store {
  message: string;
  updateMessage: (newMessage: string) => void;
}

const [store, setStore] = createStore<Store>({
  message: '',
  updateMessage: (newMessage: string) => {
    setStore('message', newMessage);
  },
});

export default store;
