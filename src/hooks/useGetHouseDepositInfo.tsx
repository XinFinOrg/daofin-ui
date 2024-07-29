import { useEffect, useState } from "react";
import { useClient } from "./useClient";
import { DaofinPlugin } from "@xinfin/osx-daofin-contracts-ethers";
import { useContractRead, useContractWrite } from "wagmi";
import { useWallet } from "./useWallet";
import { DaofinABI } from "../utils/abis/daofin.abi";
import { Address } from "viem";
import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";

type GetHouseDepositInfo = {
  amount: bigint;
  blockNumber: bigint;
  isActive: boolean;
  startOfCooldownPeriod: bigint;
  endOfCooldownPeriod: bigint;
};
type GetHouseDepositInfoResponse = [
  GetHouseDepositInfo["amount"],
  GetHouseDepositInfo["blockNumber"],
  GetHouseDepositInfo["isActive"],
  GetHouseDepositInfo["startOfCooldownPeriod"],
  GetHouseDepositInfo["endOfCooldownPeriod"]
];
function useGetHouseDepositInfo() {
  const { address, chainId } = useWallet();
  const { pluginAddress } = useAppGlobalConfig();
  const { data, ...rest } = useContractRead<
    typeof DaofinABI,
    string,
    GetHouseDepositInfoResponse
  >({
    abi: DaofinABI,
    functionName: "_voterToLockedAmounts",
    account: address as Address,
    address: pluginAddress as Address,
    chainId,
    args: [address as Address],
  });
  
  return {
    data: {
      amount: data?.[0],
      blockNumber: data?.[1],
      isActive: data?.[2],
      startOfCooldownPeriod: data?.[3],
      endOfCooldownPeriod: data?.[4],
    } as GetHouseDepositInfo,
    ...rest,
  };
}
export default useGetHouseDepositInfo;
