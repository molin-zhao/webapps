const ERROR = {
  NOT_FOUND: "Requested resource not found.",
  UNAUTHORIZED: "unauthorized request, permission denied.",
  FORBIDDEN: "Resource forbidden, no permission for this action.",
  NO_TOKEN_PROVIDED: "No token provided.",
  NOT_FOUND: "Requested resource not found.",
  SERVER_ERROR: "Server occured errors.",
  NO_IMAGE_PROVIDED: "Post image is required.",
  USER_UNSPECIFIED: "User is unspecified.",
  DATA_PERSISTENCE_ERROR:
    "Data persistence error, cannot write data to the database.",
  FILE_SIZE_EXCEEDED: "File size exceeded.",
  SAVING_FILE_ERROR: "Saving file error.",
  FILE_TYPE_ERROR: "File type is not acceptable.",
  EMAIL_ADDRESS_OR_USERNAME_EXISTS:
    "Email address or username already registered.",
  USER_PASSWORD_INCORRECT: "Password incorrect.",
  USER_NAME_NOT_FOUND: "Username or email address not found.",
  SOCKET_CONNECTION_FAILED: "Cannot connecte to the server."
};
const SUCCESS = {
  OK: "success.",
  ACCEPTED: "server accepted the request."
};

module.exports = {
  ERROR,
  SUCCESS
};
