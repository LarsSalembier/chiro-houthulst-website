import { NotFoundError } from "./common";

export class MemberAlreadyHasYearlyMembershipError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class YearlyMembershipNotFoundError extends NotFoundError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}
