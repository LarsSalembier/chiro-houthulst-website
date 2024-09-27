import { startSpan } from "@sentry/nextjs";
import { injectable } from "inversify";
import { IWorkYearsRepository } from "~/application/repositories/work-years.repository.interface";
import {
  WorkYear,
  WorkYearInsert,
  WorkYearUpdate,
} from "~/domain/entities/work-year";
import {
  WorkYearNotFoundError,
  WorkYearStillReferencedError,
  WorkYearWithThatStartAndEndDateAlreadyExistsError,
} from "~/domain/errors/work-years";
import { mockData } from "~/infrastructure/mock-data";

@injectable()
export class MockWorkYearsRepository implements IWorkYearsRepository {
  private workYears: WorkYear[] = mockData.workYears;
  private autoIncrementId: number =
    this.workYears.reduce((maxId, workYear) => {
      return workYear.id > maxId ? workYear.id : maxId;
    }, 0) + 1;

  private isWorkYearReferenced(workYearId: number): boolean {
    const yearlyMembershipWithWorkYearExists = mockData.yearlyMemberships.some(
      (ym) => ym.workYearId === workYearId,
    );

    const sponsorshipAgreementWithWorkYearExists =
      mockData.sponsorshipAgreements.some((sa) => sa.workYearId === workYearId);

    return (
      yearlyMembershipWithWorkYearExists ||
      sponsorshipAgreementWithWorkYearExists
    );
  }

  async createWorkYear(workYear: WorkYearInsert): Promise<WorkYear> {
    return startSpan(
      { name: "MockWorkYearsRepository > createWorkYear" },
      () => {
        const existingWorkYear = this.workYears.find(
          (wy) =>
            wy.startDate.getTime() === workYear.startDate.getTime() &&
            wy.endDate.getTime() === workYear.endDate.getTime(),
        );
        if (existingWorkYear) {
          throw new WorkYearWithThatStartAndEndDateAlreadyExistsError(
            "Work year already exists",
          );
        }

        const newWorkYear: WorkYear = {
          id: this.autoIncrementId++,
          ...workYear,
        };
        this.workYears.push(newWorkYear);
        return newWorkYear;
      },
    );
  }

  async getWorkYearById(id: number): Promise<WorkYear | undefined> {
    return startSpan(
      { name: "MockWorkYearsRepository > getWorkYearById" },
      () => {
        return this.workYears.find((wy) => wy.id === id);
      },
    );
  }

  async getWorkYearByStartAndEndDate(
    startDate: Date,
    endDate: Date,
  ): Promise<WorkYear | undefined> {
    return startSpan(
      { name: "MockWorkYearsRepository > getWorkYearByStartAndEndDate" },
      () => {
        return this.workYears.find(
          (wy) =>
            wy.startDate.getTime() === startDate.getTime() &&
            wy.endDate.getTime() === endDate.getTime(),
        );
      },
    );
  }

  async getAllWorkYears(): Promise<WorkYear[]> {
    return startSpan(
      { name: "MockWorkYearsRepository > getAllWorkYears" },
      () => {
        return this.workYears;
      },
    );
  }

  async updateWorkYear(
    id: number,
    workYear: WorkYearUpdate,
  ): Promise<WorkYear> {
    return startSpan(
      { name: "MockWorkYearsRepository > updateWorkYear" },
      () => {
        const existingWorkYearIndex = this.workYears.findIndex(
          (wy) => wy.id === id,
        );
        if (existingWorkYearIndex === -1) {
          throw new WorkYearNotFoundError("Work year not found");
        }

        const existingWorkYearWithStartAndEndDate = this.workYears.find(
          (wy) =>
            wy.startDate.getTime() === workYear.startDate?.getTime() &&
            wy.endDate.getTime() === workYear.endDate?.getTime() &&
            wy.id !== id,
        );
        if (existingWorkYearWithStartAndEndDate) {
          throw new WorkYearWithThatStartAndEndDateAlreadyExistsError(
            "Work year already exists",
          );
        }

        this.workYears[existingWorkYearIndex] = {
          ...this.workYears[existingWorkYearIndex]!,
          ...workYear,
        };
        return this.workYears[existingWorkYearIndex];
      },
    );
  }

  async deleteWorkYear(id: number): Promise<void> {
    return startSpan(
      { name: "MockWorkYearsRepository > deleteWorkYear" },
      () => {
        if (this.isWorkYearReferenced(id)) {
          throw new WorkYearStillReferencedError("Work year still referenced");
        }

        const workYearIndex = this.workYears.findIndex((wy) => wy.id === id);
        if (workYearIndex === -1) {
          throw new WorkYearNotFoundError("Work year not found");
        }

        this.workYears.splice(workYearIndex, 1);
      },
    );
  }

  async deleteAllWorkYears(): Promise<void> {
    return startSpan(
      { name: "MockWorkYearsRepository > deleteAllWorkYears" },
      () => {
        if (
          this.workYears.some((workYear) =>
            this.isWorkYearReferenced(workYear.id),
          )
        ) {
          throw new WorkYearStillReferencedError("Work year still referenced");
        }

        this.workYears = [];
      },
    );
  }
}
