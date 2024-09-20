import { NotFoundError } from "./common";

export class EventIsStillReferencedError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class EventNotFoundError extends NotFoundError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class GroupNotLinkedToEventError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class EventWithSameFacebookEventUrlAlreadyExistsError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class GroupAlreadyLinkedToEventError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}
