import {
  type WorkYearInsert,
  type WorkYear,
  type WorkYearUpdate,
} from "~/domain/entities/work-year";

/**
 * Repository interface for accessing and managing work years.
 */
export interface IWorkYearsRepository {
  /**
   * Creates a new work year.
   *
   * @param workYear - The work year data to insert.
   * @returns The created work year.
   *
   * @throws {WorkYearWithThatStartAndEndDateAlreadyExistsError} If a work year with the same start and end date already exists.
   * @throws {DatabaseOperationError} If the operation fails for any other reason.
   */
  createWorkYear(workYear: WorkYearInsert): Promise<WorkYear>;

  /**
   * Retrieves a work year by its unique identifier.
   *
   * @param id - The ID of the work year to retrieve.
   * @returns The work year matching the given ID, or `undefined` if not found.
   *
   * @throws {DatabaseOperationError} If the operation fails for any reason.
   */
  getWorkYearById(id: number): Promise<WorkYear | undefined>;

  /**
   * Retrieves a work year by its start and end date.
   *
   * @param startDate - The start date of the work year.
   * @param endDate - The end date of the work year.
   * @returns The work year matching the given dates, or `undefined` if not found.
   *
   * @throws {DatabaseOperationError} If the operation fails for any reason.
   */
  getWorkYearByStartAndEndDate(
    startDate: Date,
    endDate: Date,
  ): Promise<WorkYear | undefined>;

  /**
   * Retrieves all work years.
   *
   * @returns A list of all work years.
   *
   * @throws {DatabaseOperationError} If the operation fails for any reason.
   */
  getAllWorkYears(): Promise<WorkYear[]>;

  /**
   * Updates an existing work year.
   *
   * @param id - The ID of the work year to update.
   * @param workYear - The work year data to apply as updates.
   * @returns The updated work year.
   *
   * @throws {WorkYearNotFoundError} If no work year with the given ID exists.
   * @throws {WorkYearAlreadyExistsError} If the updated work year dates would create a duplicate.
   * @throws {DatabaseOperationError} If the operation fails for any other reason.
   */
  updateWorkYear(id: number, workYear: WorkYearUpdate): Promise<WorkYear>;

  /**
   * Deletes a work year by its unique identifier.
   *
   * @param id - The ID of the work year to delete.
   *
   * @throws {WorkYearNotFoundError} If no work year with the given ID exists.
   * @throws {WorkYearStillReferencedError} If the work year is still referenced by other entities and cannot be deleted.
   * @throws {DatabaseOperationError} If the operation fails for any other reason.
   */
  deleteWorkYear(id: number): Promise<void>;

  /**
   * Deletes all work years.
   *
   * @throws {WorkYearStillReferencedError} If any work year is still referenced by other entities and cannot be deleted.
   * @throws {DatabaseOperationError} If the operation fails for any reason.
   */
  deleteAllWorkYears(): Promise<void>;
}
