
import { createStore } from 'solid-js/store';

export interface Message {
  type: string;
  info: string;
}

// Define your store's initial state
const initialState = {
  message: {
    type: '123',
    info: 'Hello, world!',
  } as Message,
};

// Create the store
const [sharedStore, setSharedStore] = createStore(initialState);

// Export the shared store and setSharedStore function
export { sharedStore, setSharedStore };
