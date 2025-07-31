export interface CreatePackageDTO {
  title: string;
  description: string;
 terms: string[];

  source: {
    country: string;
    city: string;
  };
  destination: {
    country: string;
    city: string;
  };
  imageKeys: string[];
}
