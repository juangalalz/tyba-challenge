export const RESPONSES = {
  MISSING_FIELDS_OR_WRONG_INPUTS: { success: false, message: "Missing fields or wrong inputs" },
  USER_NOT_FOUND: { success: false, message: "User not registered" },
  USER_NOT_AUTHORIZED: { success: false, message: "User not auth" }
}

// tratar de seguir los de twitter: https://dev.twitter.com/overview/api/response-codes
export const ERROR_CODES = {
  HTTP_STATUS: {
    OK: 200,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
  },
  MESSAGES: {
    COULD_NOT_AUTHENTICATE_YOU: 32,
    NOT_EXIST: 34,
    INTERNAL_ERROR: 131,
    STATUS_IS_A_DUPLICATE: 187
      // ...
  }
}
