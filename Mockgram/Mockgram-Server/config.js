module.exports = {
  // app name
  name: "mockgram",
  // cookie settings
  cookie: {
    maxAge: 60 * 1000 * 60, // one hour
    httpOnly: true
  },
  // image storage location
  image: {
    post: "./public/upload/image/post/",
    avatar: "./public/upload/image/avatar/",
    tmp: "./public/upload/image/tmp/",
    postQuery: "http://172.20.10.11:3032/post/",
    avatarQuery: "http://172.20.10.11:3032/avatar/",
    tmpQuery: "http://172.20.10.11:3032/tmp/",
    limit: 1024 * 1024
  },
  // signature on token
  secretKey: "mockgram.molinz.com",
  // mongoDB url
  mongoUrl: {
    port: 27017,
    host: "localhost",
    db: "mockgram"
  },
  // redisDb url
  redisUrl: {
    port: 6379,
    host: "localhost"
  },
  // facebook Oauth callback
  facebook: {
    clientID: "328004181080220",
    clientSecret: "6ca8e960afa81c9956f1fd32cea0d11e",
    callbackURL: "https://api.mockgram.molinz.com/user/auth/facebook/callback"
  },
  serverNodes: {
    apiServer: "http://172.20.10.11:3031",
    uploadServer: "http://172.20.10.11:3032",
    socketServer: "http://172.20.10.11:3033",
    webServer: "http://172.20.10.11:3030",
    mlServer: "http://172.20.10.11:8000"
  }
};
