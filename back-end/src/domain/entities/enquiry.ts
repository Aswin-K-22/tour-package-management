export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  packageId?: string;
  scheduleId?: string;
  createdAt: Date;
  updatedAt: Date;
}