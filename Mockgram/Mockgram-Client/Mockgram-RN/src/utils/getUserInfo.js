export const userAvatar = (dataSource) => {
    if (dataSource && dataSource.avatar) {
        return { uri: dataSource.avatar }
    }
    return require('../static/user.png')
}