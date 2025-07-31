export interface Package {
  id: string;
  title: string;
  sourceCountryId: string;
  sourceCityId: string;
  destinationCountryId: string;
  destinationCityId: string;
  description: string;
  terms: string[];
  photos: string[];
  createdAt: Date;
  updatedAt: Date;
}