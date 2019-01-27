import { SecureStore } from 'expo';
export default clearSecureStore = (keys) => {
    keys.map(key => {
        SecureStore.deleteItemAsync(key).then(() => {
            console.log(`successfully removed ${key}`);
        });
    })
    keys.map(key => {
        SecureStore.getItemAsync(key).then((data) => {
            console.log(`key: ${key} associated with data: ${data}`);
        })
    })
}