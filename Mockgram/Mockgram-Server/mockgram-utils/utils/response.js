const ERROR = {
    REGISTER_FAILURES: {
        FORMAT: ({
            location,
            msg,
            param,
            value,
            nestedErrors
        }) => {
            return {
                type: "Error",
                name: "Register Failure",
                location: location,
                message: msg,
                param: param,
                value: value,
                nestedErrors: nestedErrors
            };
        },
        CODE: 400,
        MSG: "register format error."
    },
    UNAUTHORIZED: {
        CODE: 401,
        MSG: "unauthorized request, permission denied."
    },
    FORBIDDEN: {
        CODE: 403,
        MSG: "resource forbidden, no permission for this action."
    },
    NO_TOKEN_PROVIDED: {
        CODE: 401,
        MSG: "no token provided."
    },
    NOT_FOUND: {
        CODE: 404,
        MSG: "requested resource not found."
    },
    SERVER_ERROR: {
        CODE: 500,
        MSG: "server occured errors."
    },
    NO_IMAGE_PROVIDED: {
        CODE: 406,
        MSG: "post image is required."
    },
    USER_UNSPECIFIED: {
        CODE: 406,
        MSG: "user is unspecified."
    },
    DATA_PERSISTENCE_ERROR: {
        CODE: 500,
        MSG: "data persistence error, cannot write data to the database."
    }
};

const SUCCESS = {
    OK: {
        CODE: 200,
        MSG: "success!"
    },
    ACCEPTED: {
        CODE: 201,
        MSG: "server accepted the request."
    }
};

module.exports = {
    ERROR: ERROR,
    SUCCESS: SUCCESS
};