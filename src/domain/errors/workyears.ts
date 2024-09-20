import { NotFoundError } from "./common";

export class WorkyearAlreadyExistsError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class WorkyearStillReferencedError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class WorkyearNotFoundError extends NotFoundError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}
