import { NotFoundError } from "./common";

export class SponsorshipAgreementAlreadyExistsError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class SponsorshipAgreementNotFoundError extends NotFoundError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}
