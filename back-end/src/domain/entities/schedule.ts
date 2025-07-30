export interface Schedule {
  id: string;
  title: string;
  packageId: string;
  fromDate: Date;
  toDate: Date;
  amount: number;
  description: string;
  photos: string[];
  createdAt: Date;
  updatedAt: Date;
}