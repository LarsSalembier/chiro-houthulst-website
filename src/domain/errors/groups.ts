export class GroupStillReferencedError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class GroupWithThatNameAlreadyExistsError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class GroupNotFoundError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}
