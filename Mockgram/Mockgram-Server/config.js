module.exports = {
    // app name
    'name': 'mockgram',
    // cookie settings
    'cookie': {
        maxAge: 60 * 1000 * 60, // one hour 
        httpOnly: true
    },
    // image storage location
    'image': {
        post: './public/upload/image/post/',
        avatar: './public/upload/image/avatar/',
        postQuery: 'http://10.13.2.116:3032/post/',
        avatarQuery: 'http://10.13.2.116:3032/avatar/',
        limit: 1024 * 1024
    },
    // signature on token
    'secretKey': 'mockgram.molinz.com',
    // mongoDB url
    'mongoUrl': {
        port: 27017,
        host: 'localhost',
        db: 'mockgram'
    },
    // redisDb url
    'redisUrl': {
        port: 6379,
        host: 'localhost'
    },
    // facebook Oauth callback
    'facebook': {
        clientID: '328004181080220',
        clientSecret: '6ca8e960afa81c9956f1fd32cea0d11e',
        callbackURL: 'https://api.mockgram.molinz.com/user/auth/facebook/callback'
    },
    'serverNodes': {
        socketServer: 'http://10.13.2.116:3033',
        uploadServer: 'http://10.13.2.116:3032',
    }
};