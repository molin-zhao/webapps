import { Permissions, SecureStore } from 'expo';
const allowCameraAccess = async () => {
    const CAMERA_PERMISSION = await Permissions.askAsync(Permissions.CAMERA);
    const CAMERA_ROLL_PERMISSION = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (CAMERA_ROLL_PERMISSION.status === 'granted' && CAMERA_PERMISSION.status === 'granted') {
        await SecureStore.setItemAsync('permission_camera', JSON.stringify({ CAMERA: true, CAMERA_ROLL: true }));
        return true;
    }
    return false;
}

export default allowPermissions = {
    allowCameraAccess: allowCameraAccess
}