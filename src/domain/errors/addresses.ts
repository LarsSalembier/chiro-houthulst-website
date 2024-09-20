import { NotFoundError } from "./common";

export class AddressNotFoundError extends NotFoundError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class AddressAlreadyExistsError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class AddressStillReferencedError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}
