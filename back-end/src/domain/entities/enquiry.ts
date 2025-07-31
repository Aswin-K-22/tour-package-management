// domain/entities/enquiry.ts

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  packageId: string | null;     
  scheduleId?: string | null;  
  createdAt: Date;
  updatedAt: Date;
}
