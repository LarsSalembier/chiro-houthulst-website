import {
  type WorkYear,
  type WorkYearInsert,
} from "../models/entities/work-year";

export interface IWorkYearsRepository {
  createWorkYear(workYear: WorkYearInsert): Promise<WorkYear>;
  getWorkYear(workYearId: number): Promise<WorkYear>;
  getWorkYears(): Promise<WorkYear[]>;
  updateWorkYear(workYear: WorkYear): Promise<WorkYear>;
}
