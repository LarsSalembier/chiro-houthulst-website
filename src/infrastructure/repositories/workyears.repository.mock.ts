import { injectable } from "inversify";
import { type IWorkyearsRepository } from "~/application/repositories/workyears.repository.interface";
import {
  type Workyear,
  type WorkyearInsert,
  type WorkyearUpdate,
} from "~/domain/entities/workyear";
import {
  WorkyearAlreadyExistsError,
  WorkyearStillReferencedError,
  WorkyearNotFoundError,
} from "~/domain/errors/workyears";

@injectable()
export class MockWorkyearsRepository implements IWorkyearsRepository {
  private _workyears = new Map<number, Workyear>();
  private _nextWorkyearId = 1;
  private _workyearReferences = new Map<number, number>(); // workYearId -> reference count

  /**
   * Creates a new work year.
   *
   * @param workYear The work year data to insert.
   * @returns The created work year.
   * @throws {WorkyearAlreadyExistsError} If a work year with overlapping dates already exists.
   */
  async createWorkyear(workYear: WorkyearInsert): Promise<Workyear> {
    // Check for overlapping dates
    for (const existingWorkyear of this._workyears.values()) {
      if (
        (workYear.startDate >= existingWorkyear.startDate &&
          workYear.startDate <= existingWorkyear.endDate) ||
        (workYear.endDate >= existingWorkyear.startDate &&
          workYear.endDate <= existingWorkyear.endDate) ||
        (workYear.startDate <= existingWorkyear.startDate &&
          workYear.endDate >= existingWorkyear.endDate)
      ) {
        throw new WorkyearAlreadyExistsError(
          "A work year with overlapping dates already exists",
        );
      }
    }

    const newWorkyear: Workyear = {
      ...workYear,
      id: this._nextWorkyearId++,
    };

    this._workyears.set(newWorkyear.id, newWorkyear);
    this._workyearReferences.set(newWorkyear.id, 0); // Initialize reference count

    return newWorkyear;
  }

  /**
   * Gets a work year by its ID.
   *
   * @param workYearId The ID of the work year to retrieve.
   * @returns The work year if found, undefined otherwise.
   */
  async getWorkyear(workYearId: number): Promise<Workyear | undefined> {
    return this._workyears.get(workYearId);
  }

  /**
   * Gets a work year by a specific date.
   *
   * @param date The date to check for.
   * @returns The work year if found, undefined otherwise.
   */
  async getWorkyearByDate(date: Date): Promise<Workyear | undefined> {
    for (const workYear of this._workyears.values()) {
      if (workYear.startDate <= date && workYear.endDate >= date) {
        return workYear;
      }
    }
    return undefined;
  }

  /**
   * Gets all work years.
   *
   * @returns An array of work years.
   */
  async getWorkyears(): Promise<Workyear[]> {
    return Array.from(this._workyears.values());
  }

  /**
   * Updates a work year.
   *
   * @param id The ID of the work year to update.
   * @param input The data to update.
   * @returns The updated work year.
   * @throws {WorkyearNotFoundError} If the work year is not found.
   * @throws {WorkyearAlreadyExistsError} If the updated dates overlap with an existing work year.
   */
  async updateWorkyear(id: number, input: WorkyearUpdate): Promise<Workyear> {
    const existingWorkyear = this._workyears.get(id);

    if (!existingWorkyear) {
      throw new WorkyearNotFoundError("Work year not found");
    }

    // Prepare the updated work year for overlap checking
    const updatedWorkyear: Workyear = {
      ...existingWorkyear,
      ...input,
    };

    // Check for overlapping dates with other work years
    for (const otherWorkyear of this._workyears.values()) {
      if (otherWorkyear.id === id) {
        continue; // Skip the work year being updated
      }

      if (
        (updatedWorkyear.startDate >= otherWorkyear.startDate &&
          updatedWorkyear.startDate <= otherWorkyear.endDate) ||
        (updatedWorkyear.endDate >= otherWorkyear.startDate &&
          updatedWorkyear.endDate <= otherWorkyear.endDate) ||
        (updatedWorkyear.startDate <= otherWorkyear.startDate &&
          updatedWorkyear.endDate >= otherWorkyear.endDate)
      ) {
        throw new WorkyearAlreadyExistsError(
          "A work year with overlapping dates already exists",
        );
      }
    }

    this._workyears.set(id, updatedWorkyear);
    return updatedWorkyear;
  }

  /**
   * Deletes a work year.
   *
   * @param id The ID of the work year to delete.
   * @throws {WorkyearNotFoundError} If the work year is not found.
   * @throws {WorkyearStillReferencedError} If the work year is still referenced by other entities.
   */
  async deleteWorkyear(id: number): Promise<void> {
    const existingWorkyear = this._workyears.get(id);

    if (!existingWorkyear) {
      throw new WorkyearNotFoundError("Work year not found");
    }

    const referenceCount = this._workyearReferences.get(id) ?? 0;
    if (referenceCount > 0) {
      throw new WorkyearStillReferencedError(
        "Work year is still referenced by other entities",
      );
    }

    this._workyears.delete(id);
    this._workyearReferences.delete(id);
  }

  /**
   * Increments the reference count for a work year.
   *
   * @param workYearId The work year ID.
   * @throws {WorkyearNotFoundError} If the work year is not found.
   */
  async incrementReference(workYearId: number): Promise<void> {
    const workYear = this._workyears.get(workYearId);
    if (!workYear) {
      throw new WorkyearNotFoundError(
        `Work year with ID ${workYearId} not found`,
      );
    }

    const count = this._workyearReferences.get(workYearId) ?? 0;
    this._workyearReferences.set(workYearId, count + 1);
  }

  /**
   * Decrements the reference count for a work year.
   *
   * @param workYearId The work year ID.
   * @throws {WorkyearNotFoundError} If the work year is not found.
   */
  async decrementReference(workYearId: number): Promise<void> {
    const workYear = this._workyears.get(workYearId);
    if (!workYear) {
      throw new WorkyearNotFoundError(
        `Work year with ID ${workYearId} not found`,
      );
    }

    const count = this._workyearReferences.get(workYearId) ?? 0;
    if (count > 0) {
      this._workyearReferences.set(workYearId, count - 1);
    }
  }
}
