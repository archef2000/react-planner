/** @description Return float fixed to desired precision
 *  @param num Float to fix
 *  @param precision Desired precision, or 6 if not specified
 *  @return Fixed float
*/
export function toFixedFloat(num: string | number, precision = 6) {
  if (num && precision) {
    return parseFloat(parseFloat((num as string)).toFixed(precision));
  }
  return 0;
}

/** @description Return absolute value of a number
 *  @param {number} n Number of wich get value without sign
 *  @return {number}
*/
export const fAbs = (n: number): number => { let x = n; (x < 0) && (x = ~x + 1); return x; };

/** @description Multiply two matrices
 *  @param {Array} m1 Matrix 1
 *  @param {Array} m2 Matrix 2
 *  @return {Array}
*/
export const multiplyMatrices = (m1, m2) => {
  const result = [];
  for (let i = 0; i < m1.length; i++) {
    result[i] = [];
    for (let j = 0; j < m2[0].length; j++) {
      let sum = 0;
      for (let k = 0; k < m1[0].length; k++) {
        sum += m1[i][k] * m2[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
};
