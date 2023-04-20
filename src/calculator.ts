class Calculator {
  private actions = {
    "+": (a: number, b: number) => a + b,
    "-": (a: number, b: number) => a - b,

    "*": (a: number, b: number) => a * b,
    "/": (a: number, b: number) => a / b,
  } as const

  private parse(expression: string) {
    // Normalize string by removing all whitespaces.
    expression = expression.replace(/\s/g, "")
    // Split expression by formula (a, action, b),
    // where `action` is a character that is not a number or an english word.
    const [, a, action, b,] = expression.split(/(.+)([^\d\w])(.+)/)
    // Return with converting `a`, `b` to numbers and adding a bit of typization to `action`.
    return {
      a: Number(a),
      action: action as keyof typeof this.actions,
      b: Number(b)
    }
  }

  private validateOperands(...operands: number[]) {
    for (const operand of operands) {
      if (operand > 10) {
        return new Error(`Operand ${operand} can't be more than 10.`)
      }

      if (operand < 1) {
        return new Error(`Operand ${operand} can't be less than 1.`)
      }

      if (!Number.isInteger(operand)) {
        return new Error(`Operand ${operand} can't have fractional digits.`)
      }

      if (isNaN(operand)) {
        return new Error(`Something went wrong with operand ${operand}.`)
      }
    }

    return null
  }

  /**
   * @throws if expression is wrong
   */
  public calculate(expression: string): number {
    const { a, action, b } = this.parse(expression)

    const operandsError = this.validateOperands(a, b)
    if (operandsError) throw operandsError

    // Apply action to parsed expression.
    const result = this.actions[action](a, b)
    // Remove fractional digits if have.
    return Math.trunc(result)
  }
}

class RomanConverter {
  private romanNumeralMap: Record<string, number> = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000
  }

  /**
   * [Code reference](https://www.educative.io/answers/the-roman-to-integer-problem)
   */
  public toInteger(romanNumber: string): number {
    let integerNumber = 0

    for (const numeric of romanNumber) {
      const numericIndex = romanNumber.indexOf(numeric)
      const nextNumeric = romanNumber[numericIndex + 1]

      const digit = this.romanNumeralMap[numeric]
      const nextDigit = this.romanNumeralMap[nextNumeric]


      if (digit >= (nextDigit ?? 0)) {
        integerNumber += digit
      } else {
        integerNumber -= digit
      }
    }

    return integerNumber
  }

  private thousands = ["", "M", "MM", "MMM"]
  private hundreds = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"]
  private tens = ["", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"]
  private units = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"]

  /**
   * [Code reference](https://www.javatpoint.com/convert-integer-to-roman-numerals-in-java)
   */
  public fromInteger(number: number): string {
    const totalThousands = this.thousands[Math.trunc(number / 1000)] ?? ""
    const totalHundreds = this.hundreds[Math.trunc((number % 1000) / 100)] ?? ""
    const totalTens = this.tens[Math.trunc((number % 100) / 10)] ?? ""
    const totalUnits = this.units[Math.trunc(number % 10)] ?? ""

    return totalThousands + totalHundreds + totalTens + totalUnits
  }
}

class RomanCalculator {
  private integerCalculator = new Calculator
  private romanConverter = new RomanConverter

  replaceRomanWithInteger(string: string) {
    // Normalize string by removing all whitespaces.
    string = string.replace(/\s/g, "")
    const integerString = string.replace(/(\w+)/g, group1 => {
      return this.romanConverter.toInteger(group1).toString()
    })

    return integerString
  }

  public calculate(romanExpression: string): string {
    const integerExpression = this.replaceRomanWithInteger(romanExpression)
    const integerExpressionResult = this.integerCalculator.calculate(integerExpression)

    // As we get one number here, we can convert it directly.
    const romanExpressionResult = this.romanConverter.fromInteger(integerExpressionResult)
    return romanExpressionResult
  }
}

function calculateIntegers(expression: string): number {
  const calculator = new Calculator
  return calculator.calculate(expression)
}

function calculateRoman(expression: string): string {
  const romanCalculator = new RomanCalculator
  return romanCalculator.calculate(expression)
}

function calculator(expression: string): string | number {
  // If `expression` DOESN'T contain any roman numerics, this is not roman expression.
  if (/[IVXLCDM]/.test(expression) === false) {
    return calculateIntegers(expression).toString()
  }

  return calculateRoman(expression)
}

export default calculator
