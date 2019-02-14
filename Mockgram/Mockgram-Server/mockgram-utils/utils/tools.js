exports.normalizePort = (val) => {
    let port = parseInt(val, 10);
    if (isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        // port number
        return port;
    }
    return false;
}

exports.getRemoteIpAddress = (req) => {
    if (req.header || req.connection) {
        return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    }
    return null;
}

exports.getRemoteDeviceType = (useragent) => {
    let os = useragent.os;
    let platform = useragent.platform;
    if (useragent.isiPhone) {
        return `iphone-${platform}-${os}`;
    } else if (useragent.isAndroid) {
        return `android-${platform}-${os}`;
    } else {
        return `unknown`;
    }
}