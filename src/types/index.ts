export enum UserRole {
  DOCTOR = 'médico'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  crm?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  symptoms: string;
  treatment: string;
  date: string;
  doctorId: string;
  doctorName: string;
  doctorCrm: string;
}

export interface DosageCalculation {
  id: string;
  medicationName: string;
  calculation: string;
  result: string;
  date: string;
  userId: string;
}