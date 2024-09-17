import { useEffect, useState } from "react";
import { useClient } from "./useClient";
import { Address, useConnect, useContractRead } from "wagmi";
import { DaofinABI } from "../utils/abis/daofin.abi";
import { useGlobalState } from "../contexts/GlobalStateContext";
import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
function useIsXDCValidatorCandidate(member: string) {
  const [isXDCValidatorCandidate, setIsXDCValidatorCandidate] =
    useState<boolean>();
  const { daofinClient } = useClient();
  const { pluginAddress } = useAppGlobalConfig();

  // const [error, setError] = useState<Error>();
  const [, setIsLoading] = useState(false);
  if (!member) return false;

  const { data,error } = useContractRead({
    abi: DaofinABI,
    address: pluginAddress as Address,
    functionName: "isXDCValidatorCandidate",
    args: [member],
  });
  console.log({data,error});
  
  return data as boolean;
  // useEffect(() => {
  //   if (!daofinClient || !member) return;
  //   setIsLoading(true);

  //   daofinClient.methods
  //     .isXDCValidatorCadidate(member)
  //     .then((data: boolean) => {
  //       setIsLoading(false);
  //       console.log(data);

  //       setIsXDCValidatorCandidate(data);
  //     })
  //     .catch((e: any) => {
  //       setIsLoading(false);
  //       console.log("error", e);
  //     });
  // }, [daofinClient]);
  // if (!member) return false;

  // return isXDCValidatorCandidate;
}
export default useIsXDCValidatorCandidate;
