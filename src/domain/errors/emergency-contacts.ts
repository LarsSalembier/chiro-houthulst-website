import { NotFoundError } from "./common";

export class EmergencyContactNotFoundError extends NotFoundError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class MemberAlreadyHasEmergencyContactError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}
