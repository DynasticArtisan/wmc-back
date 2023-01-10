type Status = 400 | 401 | 402;

export default class ApiError extends Error {
  status;
  constructor(status: Status, message: string) {
    super(message);
    this.status = status;
  }

  static BadRequest(message: string) {
    return new ApiError(400, message);
  }
}
