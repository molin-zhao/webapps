import { SecureStore } from 'expo';
export default clearSecureStore = (keys) => {
    keys.map(key => {
        SecureStore.deleteItemAsync(key);
    })
}