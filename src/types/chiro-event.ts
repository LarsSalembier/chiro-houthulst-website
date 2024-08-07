export enum ChiroEventType {
  CHIRO = "chiro",
  SPECIAL_CHIRO = "special_chiro",
  EVENT = "event",
  CAMP = "camp",
}

export interface ChiroEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  type: ChiroEventType;
}
