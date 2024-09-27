export class SponsorAlreadyHasSponsorshipAgreementForWorkYearError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class SponsorshipAgreementNotFoundError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}
