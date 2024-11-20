import { useEffect, useMemo, useState } from "react";
import { useClient } from "./useClient";
import { useNetwork } from "../contexts/network";
import {
  CommitteeVotingSettings,
  GlobalSettings,
} from "@xinfin/osx-daofin-sdk-client";
import { BigNumberish } from "@ethersproject/bignumber";
import { DaofinABI } from "../utils/abis/daofin.abi";
import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
import { Address, useContractRead } from "wagmi";

function useFetchTotalNumbersByCommittee(
  committee: string
): BigNumberish | undefined {
  const [total, setTotal] = useState<BigNumberish>(0);
  const { daofinClient } = useClient();
  // const { network } = useNetwork();
  // const [error, setError] = useState<Error>();
  const [, setIsLoading] = useState(false);
  const { pluginAddress } = useAppGlobalConfig();

  // const { data,error } = useContractRead({
  //   abi: DaofinABI,
  //   address: pluginAddress as Address,
  //   functionName: "getTotalNumberOfMembersByCommittee",
  //   args: [committee],
  // });
  // console.log({error});
  
  // useEffect(()=>{
  //   setTotal(data as bigint)
  // },[data])
  useEffect(() => {
    if (!daofinClient || !committee) return;
    setIsLoading(true);

    
    daofinClient.methods
      .getTotalNumberOfMembersByCommittee(committee)
      .then((data: BigNumberish) => {
        setIsLoading(false);
        setTotal(data);
      })
      .catch((e: any) => {
        setIsLoading(false);
        setTotal(0);
        console.log("error", e);
      });
  }, [daofinClient]);

  return total;
}
export default useFetchTotalNumbersByCommittee;
