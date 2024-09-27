export class MemberWithThatNameAndBirthDateAlreadyExistsError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class MemberWithThatEmailAddressAlreadyExistsError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class MemberNotFoundError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class MemberStillReferencedError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class ParentIsNotLinkedToMemberError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class ParentIsAlreadyLinkedToMemberError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}
