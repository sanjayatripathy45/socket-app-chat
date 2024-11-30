import { PersistConfig } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Default storage is localStorage


// Define the persist configuration
const persistConfig: PersistConfig<any> = {
  key: 'root',
  storage,
  whitelist: ['profile']
};

export default persistConfig;
