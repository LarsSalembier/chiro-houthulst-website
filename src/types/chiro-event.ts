export enum ChiroEventType {
  CHIRO = "chiro",
  VRIENDJESDAG = "vriendjesdag",
  CINEMA = "cinema",
  SINT_MAARTEN = "sintmaarten",
  KERSTFEESTJE = "kerstfeestje",
  KERSTMARKT = "kerstmarkt",
  CHIROCAFE = "chirocafe",
  VOETBALCOMPETITIE = "voetbalcompetitie",
  GROEPSUITSTAP = "groepsuitstap",
  KAMP = "kamp",
  INSCHRIJVINGEN = "inschrijvingen",
  VALIEZEN = "valiezen",
  CAMION = "camion",
  NAWACHT = "nawacht",
}

export interface ChiroEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  type: ChiroEventType;
}
