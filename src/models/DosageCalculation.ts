export class DosageCalculation {
  id: string;
  medicationName: string;
  calculation: string;
  result: string;
  date: Date;
  userId: string;

  constructor(data: {
    id: string;
    medicationName: string;
    calculation: string;
    result: string;
    date: Date;
    userId: string;
  }) {
    this.id = data.id;
    this.medicationName = data.medicationName;
    this.calculation = data.calculation;
    this.result = data.result;
    this.date = data.date;
    this.userId = data.userId;
  }

  static fromJSON(json: any): DosageCalculation {
    return new DosageCalculation({
      ...json,
      date: new Date(json.date),
    });
  }

  toJSON() {
    return {
      id: this.id,
      medicationName: this.medicationName,
      calculation: this.calculation,
      result: this.result,
      date: this.date.toISOString(),
      userId: this.userId,
    };
  }
}