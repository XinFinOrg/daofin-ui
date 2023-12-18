import { constants } from "ethers";

export const isNativeToken = (tokenAddress: string) => {
  return tokenAddress === constants.AddressZero;
};
