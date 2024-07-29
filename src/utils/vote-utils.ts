import { BigNumber, BigNumberish } from "ethers";

// The base value to encode real-valued ratios on the interval [0, 1] as integers on the interval 0 to 10^6.
export const RATIO_BASE: BigNumberish = BigNumber.from(10).pow(6);

// Thrown if a ratio value exceeds the maximal value of 10^6.
class RatioOutOfBounds extends Error {
  constructor(limit: BigNumberish, actual: BigNumberish) {
    super(
      `Ratio out of bounds. Limit: ${limit.toString()}, Actual: ${actual.toString()}`
    );
  }
}

// Applies a ratio to a value and ceils the remainder.
export function applyRatioCeiled(
  _value: BigNumber,
  _ratio: BigNumber
): BigNumber {
  if (_ratio.gt(RATIO_BASE)) {
    throw new RatioOutOfBounds(RATIO_BASE, _ratio);
  }

  _value = _value.mul(_ratio);
  const remainder: BigNumber = _value.mod(RATIO_BASE);
  let result: BigNumber = _value.div(RATIO_BASE);

  // Check if ceiling is needed
  if (!remainder.isZero()) {
    result = result.add(BigNumber.from(1));
  }

  return result;
}
