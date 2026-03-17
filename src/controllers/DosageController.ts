import { DosageCalculation } from '../models/DosageCalculation';

export class DosageController {
  static async calculateDosage(
    medicationName: string,
    calculation: string,
    userId: string
  ): Promise<DosageCalculation> {
    try {
      // Safely evaluate the calculation
      // eslint-disable-next-line no-new-func
      const result = new Function(`return ${calculation}`)();
      
      if (isNaN(result)) {
        throw new Error('O resultado não é um número válido');
      }

      const formattedResult = Number.isInteger(result) 
        ? result.toString() 
        : result.toFixed(2);

      const dosageCalculation = new DosageCalculation({
        id: Date.now().toString(),
        medicationName,
        calculation,
        result: formattedResult,
        date: new Date(),
        userId,
      });

      // In a real application, this would save to a database
      const savedCalculations = JSON.parse(localStorage.getItem('dosageCalculations') || '[]');
      savedCalculations.push(dosageCalculation.toJSON());
      localStorage.setItem('dosageCalculations', JSON.stringify(savedCalculations));

      return dosageCalculation;
    } catch (error) {
      throw new Error('Cálculo inválido. Por favor, verifique a fórmula.');
    }
  }

  static async getCalculations(userId: string): Promise<DosageCalculation[]> {
    // In a real application, this would fetch from a database
    const savedCalculations = JSON.parse(localStorage.getItem('dosageCalculations') || '[]');
    return savedCalculations
      .filter((c: any) => c.userId === userId)
      .map((c: any) => DosageCalculation.fromJSON(c));
  }
}