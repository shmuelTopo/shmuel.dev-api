export enum errorType {
  SERVER_ERROR = "server error",
  ALREADY_EXISTS = "already exists",
  NOT_FOUND = "not found",
  BAD_REQUEST = "bad request",
}

export default class ApiError extends Error {
  statusCode: number;
  type: errorType;

  constructor(
    type: errorType = errorType.SERVER_ERROR,
    message?: string,
    statusCode?: number
  ) {
    switch (type) {
      case errorType.ALREADY_EXISTS:
        statusCode ??= 409;
        message ??= "already exists";
      case errorType.SERVER_ERROR:
        statusCode ??= 500;
        message ??= "something went wrong";
      case errorType.NOT_FOUND:
        statusCode ??= 404;
        message ??= "not found";
      case errorType.BAD_REQUEST:
        statusCode ??= 400;
        message ??= "bad request";
    }
    super(message);
    this.type = type;
    this.statusCode = statusCode;
  }
}
