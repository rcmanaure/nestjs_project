export interface CodesI {
  id: number;
  lat: string;
  lon: string;
  nearest_postcodes: string[];
}

export interface PostCodesI {
  nearest_postcodes: string[];
}
