import { Prescription } from '../models/Prescription';
import { User } from '../models/User';

export class PrescriptionController {
  static async createPrescription(
    patientName: string,
    patientAge: number,
    symptoms: string,
    treatment: string,
    doctor: User
  ): Promise<Prescription> {
    if (!doctor.crm) {
      throw new Error('Apenas médicos podem criar prescrições');
    }

    const prescription = new Prescription({
      id: Date.now().toString(),
      patientName,
      patientAge,
      symptoms,
      treatment,
      date: new Date(),
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorCrm: doctor.crm,
    });

    // In a real application, this would save to a database
    const savedPrescriptions = JSON.parse(localStorage.getItem('prescriptions') || '[]');
    savedPrescriptions.push(prescription.toJSON());
    localStorage.setItem('prescriptions', JSON.stringify(savedPrescriptions));

    return prescription;
  }

  static async getPrescriptions(doctorId: string): Promise<Prescription[]> {
    // In a real application, this would fetch from a database
    const savedPrescriptions = JSON.parse(localStorage.getItem('prescriptions') || '[]');
    return savedPrescriptions
      .filter((p: any) => p.doctorId === doctorId)
      .map((p: any) => Prescription.fromJSON(p));
  }
}