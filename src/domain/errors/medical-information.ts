import { NotFoundError } from "./common";

export class MemberAlreadyHasMedicalInformationError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class MedicalInformationNotFoundError extends NotFoundError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}
