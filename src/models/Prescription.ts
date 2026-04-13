export class Prescription {
  id: string;
  patientName: string;
  patientAge: number;
  symptoms: string;
  treatment: string;
  date: Date;
  doctorId: string;
  doctorName: string;

  constructor(data: {
    id: string;
    patientName: string;
    patientAge: number;
    symptoms: string;
    treatment: string;
    date: Date;
    doctorId: string;
    doctorName: string;

  }) {
    this.id = data.id;
    this.patientName = data.patientName;
    this.patientAge = data.patientAge;
    this.symptoms = data.symptoms;
    this.treatment = data.treatment;
    this.date = data.date;
    this.doctorId = data.doctorId;
    this.doctorName = data.doctorName;
  }

  static fromJSON(json: any): Prescription {
    return new Prescription({
      ...json,
      date: new Date(json.date),
    });
  }

  toJSON() {
    return {
      id: this.id,
      patientName: this.patientName,
      patientAge: this.patientAge,
      symptoms: this.symptoms,
      treatment: this.treatment,
      date: this.date.toISOString(),
      doctorId: this.doctorId,
      doctorName: this.doctorName,
    };
  }
}