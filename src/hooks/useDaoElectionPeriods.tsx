import { useEffect, useMemo, useState } from "react";
import { useClient } from "./useClient";
import { toStandardTimestamp } from "../utils/date";
import { Address, useContractRead } from "wagmi";
import { DaofinABI } from "../utils/abis/daofin.abi";
import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
export type ElectionPeriod = { startDate: number; endDate: number; id: string };
function useDaoElectionPeriods() {
  const [electionPeriods, setElectionPeriods] = useState<ElectionPeriod[]>([]);
  const { daofinClient } = useClient();
  const { pluginAddress } = useAppGlobalConfig();
  // const [isLoading, setIsLoading] = useState(false);
  const { data, isLoading } = useContractRead({
    abi: DaofinABI,
    address: pluginAddress as Address,
    functionName: "getElectionPeriods",
  });

  console.log("ep",data);
  
  useEffect(() => {
    if (data && electionPeriods.length == 0) {
      const modifiedData = (data as ElectionPeriod[]).map((item, index) => ({
        ...item,
        id: `${index}`,
        startDate: toStandardTimestamp(item.startDate.toString()),
        endDate: toStandardTimestamp(item.endDate.toString()),
      }));

      setElectionPeriods(modifiedData);
    }
    // if (!daofinClient) return;
    // setIsLoading(true);

    // daofinClient.methods
    //   .getElectionPeriods()
    //   .then((data: ElectionPeriod[]) => {
    //     const modifiedData = data.map((item, index) => ({
    //       ...item,
    //       id: `${index}`,
    //       startDate: toStandardTimestamp(item.startDate.toString()),
    //       endDate: toStandardTimestamp(item.endDate.toString()),
    //     }));
    //     setElectionPeriods(modifiedData as unknown as ElectionPeriod[]);
    //     setIsLoading(false);
    //   })
    //   .catch((e: any) => {
    //     setIsLoading(false);
    //     console.log("error", e);
    //   });
  }, [data]);

  return { data: electionPeriods, isLoading };
}

export function useDaoNotStartedElectionPeriods() {
  const { data, isLoading } = useDaoElectionPeriods();

  const notStartedPeriods = useMemo(() => {
    if (!data) return [];
    const now = Date.now();

    return data.filter(
      ({ startDate, endDate }) => now < startDate && now < endDate
    );
  }, [data]);

  return {
    data: notStartedPeriods,
    isLoading,
    isActive: !!notStartedPeriods.length,
  };
}

export function useFindProposalElectionPeriod(proposalStartDate?: number) {
  const { data, isLoading } = useDaoElectionPeriods();

  const proposalPeriod = useMemo(() => {
    if (!data || !proposalStartDate) return undefined;
    return data.find(({ startDate }) => proposalStartDate === startDate);
  }, [data, proposalStartDate]);

  return {
    data: proposalPeriod,
    isLoading,
    isActive: !!proposalPeriod,
  };
}

export default useDaoElectionPeriods;
