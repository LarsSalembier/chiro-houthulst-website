export interface Event {
  src: string;
  title: string;
  date: Date;
  location?: string;
  price?: number;
  canSignUp?: boolean;
  facebookEventUrl?: string;
}
