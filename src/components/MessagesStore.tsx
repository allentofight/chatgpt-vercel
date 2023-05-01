
import { createStore } from 'solid-js/store';

export interface Message {
  type: string;
  info: Object;
}

const initialState = {
  message: null as Message | null,
};

// Create the store
const [sharedStore, setSharedStore] = createStore(initialState);

// Export the shared store and setSharedStore function
export { sharedStore, setSharedStore };
