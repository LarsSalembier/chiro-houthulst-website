export class EventStillReferencedError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class EventWithSameFacebookEventUrlAlreadyExistsError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class EventNotFoundError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class GroupNotLinkedToEventError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class GroupAlreadyLinkedToEventError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}
