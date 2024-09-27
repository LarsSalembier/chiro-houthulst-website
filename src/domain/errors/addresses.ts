export class AddressNotFoundError extends Error {
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
