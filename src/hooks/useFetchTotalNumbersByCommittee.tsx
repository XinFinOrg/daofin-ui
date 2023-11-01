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
  const [total, setTotal] = useState<BigNumberish>();
  const { daofinClient, client } = useClient();
  const { network } = useNetwork();
  const [error, setError] = useState<Error>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!daofinClient || !committee) return;
    setIsLoading(true);

    daofinClient.methods
      .getTotalNumberOfMembersByCommittee(committee)
      .then((data) => {
        setIsLoading(false);
        setTotal(data);
      })
      .catch((e) => {
        setIsLoading(false);
        console.log("error", e);
      });
  }, [daofinClient]);

  return total;
}
export default useFetchTotalNumbersByCommittee;
