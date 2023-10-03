import { useEffect, useMemo, useState } from "react";
import { useClient } from "./useClient";
import { useNetwork } from "../contexts/network";
import { GlobalSettings } from "@xinfin/osx-daofin-sdk-client";
import { DaofinPlugin } from "@xinfin/osx-daofin-contracts-ethers";
type ElectionPeriod = { startDate: number; endDate: number };
function useDaoElectionPeriods() {
  const [electionPeriods, setElectionPeriods] = useState<ElectionPeriod[]>();
  const { daofinClient, client } = useClient();
  const { network } = useNetwork();
  const [error, setError] = useState<Error>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!daofinClient) return;
    setIsLoading(true);

    daofinClient.methods
      .getElectionPeriods()
      .then((data) => {
        setIsLoading(false);
        const modifiedData = data.map((item) => ({
          ...item,
          startDate: +item.startDate.toString() * 1000,
          endDate: +item.endDate.toString() * 1000,
        }));
        setElectionPeriods(modifiedData as unknown as ElectionPeriod[]);
      })
      .catch((e) => {
        setIsLoading(false);
        console.log("error", e);
      });
  }, [daofinClient]);

  return electionPeriods;
}
export default useDaoElectionPeriods;
