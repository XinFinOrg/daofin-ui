import Big from "big.js";
import { utils, BigNumberish, BigNumber } from "ethers";
import { v4 as uuidV4 } from "uuid";
export function toEther(value: string) {
  return utils.formatEther(value);
}

export function toWei(value: string) {
  return utils.parseEther(value);
}

export function numberWithCommaSeparate(value: number | string) {
  return typeof value === "number"
    ? value.toLocaleString("en-US")
    : parseFloat(value).toLocaleString("en-US");
}

export function weiBigNumberToFormattedNumber(value: BigNumberish) {
  return numberWithCommaSeparate(toEther(value.toString()).toString());
}
// percentageBase: Up to 10^6
export function toStandardPercentage(percentage: string) {
  return BigNumber.from(percentage).mul(100).div(1000000).toString();
}

export function uuid() {
  return uuidV4();
}