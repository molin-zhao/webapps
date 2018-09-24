module.exports = {
    // signature on token
    'secretKey': 'mockgram.molinz.com',
    // mongoDB url
    'mongoUrl': 'mongodb://localhost:27017/mockgram',
    // redisDb url
    'redisUrl': {
        port: 6379,
        host: 'localhost'
    },
    // facebook Oauth callback
    'facebook': {
        clientID: '328004181080220',
        clientSecret: '6ca8e960afa81c9956f1fd32cea0d11e',
        callbackURL: 'https://api.mockgram.molinz.com/users/auth/facebook/callback'
    }
};