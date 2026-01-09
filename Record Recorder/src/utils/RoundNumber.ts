export const RoundNumber = (inputNumber: number, decimal: number = 2) => {
  const factor = 10 ** decimal;
  return Math.round(inputNumber * factor) / factor; 
}