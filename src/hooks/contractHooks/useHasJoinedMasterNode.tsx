import { useEffect, useMemo, useState } from "react";
import { useClient } from "../useClient";
import { useWallet } from "../useWallet";
import { Address, erc20ABI, useContractRead } from "wagmi";
import DaofinABI from "../../utils/abis/daofin.abi.json";
import { useGlobalState } from "../../contexts/GlobalStateContext";
import { useAppGlobalConfig } from "../../contexts/AppGlobalConfig";
import { zeroAddress } from "viem";

interface MasterNodeDelegateeMappings {
  masterNodeToDelegatee: { [key: string]: string }; // Mapping from address to address
  delegateeToMasterNode: { [key: string]: string }; // Mapping from address to address
  lastModificationBlocknumber: number; // uint256
  numberOfJointMasterNodes: number; // uint256
}

function useHasJoinedMasterNode() {
  const { address: masternodeAddress } = useWallet();
  const { pluginAddress } = useAppGlobalConfig();
  
  const { data, error } = useContractRead<
    typeof DaofinABI,
    string,
    MasterNodeDelegateeMappings
  >({
    abi: DaofinABI,
    address: pluginAddress as Address,
    functionName: "_masterNodeDelegatee",
    args: [],
  });
  
  return (
    !error &&
    masternodeAddress &&
    (data as MasterNodeDelegateeMappings) &&
    data?.masterNodeToDelegatee &&
    data.masterNodeToDelegatee[masternodeAddress] === zeroAddress
  );
}
export default useHasJoinedMasterNode;
