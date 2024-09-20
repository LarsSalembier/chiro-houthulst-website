export class AuthenticationError extends Error {
  constructor() {
    super("You must be authenticated to perform this action");
  }
}

export class AuthorizationError extends Error {
  constructor() {
    super("You are not authorized to perform this action");
  }
}
