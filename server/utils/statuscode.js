export const HTTP_STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    SERVICE_UNAVAILABLE: 503,
  };
  
  // Optionally, export individual status codes as well
  export const { 
    OK, 
    CREATED, 
    ACCEPTED, 
    BAD_REQUEST, 
    UNAUTHORIZED ,
    INTERNAL_SERVER_ERROR,
    NOT_FOUND,
    NO_CONTENT,
    CONFLICT
  } = HTTP_STATUS_CODES;
  