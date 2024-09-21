import {
  type WorkyearUpdate,
  type Workyear,
  type WorkyearInsert,
} from "~/domain/entities/workyear";

export interface IWorkyearsRepository {
  /**
   * Creates a new work year.
   *
   * @param workYear The work year data to insert.
   * @returns The created work year.
   * @throws {WorkyearAlreadyExistsError} If a work year with overlapping dates already exists.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  createWorkyear(workYear: WorkyearInsert): Promise<Workyear>;

  /**
   * Gets a work year by its ID.
   *
   * @param workYearId The ID of the work year to retrieve.
   * @returns The work year if found, undefined otherwise.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  getWorkyear(workYearId: number): Promise<Workyear | undefined>;

  /**
   * Gets a work year by a specific date.
   *
   * @param date The date to check for.
   * @returns The work year if found, undefined otherwise.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  getWorkyearByDate(date: Date): Promise<Workyear | undefined>;

  /**
   * Gets all work years.
   *
   * @returns An array of work years.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  getWorkyears(): Promise<Workyear[]>;

  /**
   * Updates a work year.
   *
   * @param id The ID of the work year to update.
   * @param input The data to update.
   * @returns The updated work year.
   * @throws {WorkyearNotFoundError} If the work year is not found.
   * @throws {WorkyearAlreadyExistsError} If the updated dates overlap with an existing work year.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  updateWorkyear(id: number, input: WorkyearUpdate): Promise<Workyear>;

  /**
   * Deletes a work year.
   *
   * @param id The ID of the work year to delete.
   * @throws {WorkyearNotFoundError} If the work year is not found.
   * @throws {WorkyearStillReferencedError} If the work year is still referenced by other entities.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  deleteWorkyear(id: number): Promise<void>;
}
