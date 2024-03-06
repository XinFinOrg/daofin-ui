import { useEffect, useState } from "react";
import { useClient } from "./useClient";
import { DaofinPlugin } from "@xinfin/osx-daofin-contracts-ethers";

function useGetHouseDepositInfo(voterAddress: string | null) {
  const { daofinClient } = useClient();
  const [depositInfo, setDepositInfo] =
    useState<ReturnType<DaofinPlugin["_voterToLockedAmounts"]>>();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!daofinClient || !voterAddress) return;
    setIsLoading(true);

    daofinClient.methods
      .getHouseDeposit(voterAddress)
      .then((data: ReturnType<DaofinPlugin["_voterToLockedAmounts"]>) => {
        setIsLoading(false);
        setDepositInfo(data);
      })
      .catch((e: any) => {
        setIsLoading(false);
        console.log("error", e);
      });
  }, [daofinClient]);

  return { data: depositInfo, isLoading };
}
export default useGetHouseDepositInfo;
