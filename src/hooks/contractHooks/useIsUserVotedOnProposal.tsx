import { useEffect, useMemo, useState } from "react";
import { useClient } from "../useClient";
import { useWallet } from "../useWallet";
import { Address, erc20ABI, useContractRead } from "wagmi";
import {DaofinABI} from "../../utils/abis/daofin.abi";
import { useGlobalState } from "../../contexts/GlobalStateContext";
import { useAppGlobalConfig } from "../../contexts/AppGlobalConfig";
function useIsValidVoter() {
  const { address: voterAddress } = useWallet();
  const { pluginAddress } = useAppGlobalConfig();

  return useContractRead({
    abi: DaofinABI,
    address: pluginAddress as Address,
    functionName: "isValidVoter",
    args: [voterAddress],
  });
}
export default useIsValidVoter;
