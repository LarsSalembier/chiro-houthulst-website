import {
  type WorkyearUpdate,
  type Workyear,
  type WorkyearInsert,
} from "~/domain/entities/workyear";

export interface IWorkyearsRepository {
  createWorkyear(workYear: WorkyearInsert): Promise<Workyear>;
  getWorkyear(workYearId: number): Promise<Workyear | undefined>;
  getWorkyearByDate(date: Date): Promise<Workyear | undefined>;
  getWorkyears(): Promise<Workyear[]>;
  updateWorkyear(id: number, input: WorkyearUpdate): Promise<Workyear>;
  deleteWorkyear(id: number): Promise<void>;
}
