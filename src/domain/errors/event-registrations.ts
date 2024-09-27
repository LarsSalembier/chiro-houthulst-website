export class EventRegistrationNotFoundError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class MemberAlreadyRegisteredForEventError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}
