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
        MSG: "Resource forbidden, no permission for this action."
    },
    NO_TOKEN_PROVIDED: {
        CODE: 401,
        MSG: "No token provided."
    },
    NOT_FOUND: {
        CODE: 404,
        MSG: "Requested resource not found."
    },
    SERVER_ERROR: {
        CODE: 500,
        MSG: "Server occured errors."
    },
    NO_IMAGE_PROVIDED: {
        CODE: 406,
        MSG: "Post image is required."
    },
    USER_UNSPECIFIED: {
        CODE: 406,
        MSG: "User is unspecified."
    },
    DATA_PERSISTENCE_ERROR: {
        CODE: 500,
        MSG: "Data persistence error, cannot write data to the database."
    },
    FILE_SIZE_EXCEEDED: {
        CODE: 406,
        MSG: "File size exceeded."
    },
    SAVING_FILE_ERROR: {
        CODE: 500,
        MSG: "Saving file error."
    },
    FILE_TYPE_ERROR: {
        CODE: 406,
        MSG: "File type is not acceptable."
    },
    EMAIL_ADDRESS_OR_USERNAME_EXISTS: {
        CODE: 400,
        MSG: "Email address or username already registered."
    },
    USER_PASSWORD_INCORRECT: {
        CODE: 400,
        MSG: "Password incorrect."
    },
    USER_NAME_NOT_FOUND: {
        CODE: 400,
        MSG: "Username or email address not found."
    },
    SOCKET_CONNECTION_FAILED: {
        CODE: 400,
        MSG: "Cannot connecte to the server."
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