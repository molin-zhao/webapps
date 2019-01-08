exports.getUserAvatar = () => {
    let avatar = '';
    if (global.userinfo && gloabal.userinfo.user.avatar !== '') {
        avatar = global.userinfo.user.avatar;
    }
    return avatar;
}