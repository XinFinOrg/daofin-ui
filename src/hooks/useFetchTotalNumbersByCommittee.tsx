import { useEffect, useMemo, useState } from "react";
import { useClient } from "./useClient";
import { useNetwork } from "../contexts/network";
import {
  CommitteeVotingSettings,
  GlobalSettings,
} from "@xinfin/osx-daofin-sdk-client";
import { BigNumberish } from "@ethersproject/bignumber";

function useFetchTotalNumbersByCommittee(
  committee: string
): BigNumberish | undefined {
  const [total, setTotal] = useState<BigNumberish>(0);
  const { daofinClient } = useClient();
  // const { network } = useNetwork();
  // const [error, setError] = useState<Error>();
  const [, setIsLoading] = useState(false);

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
