import { useEffect, useMemo, useState } from "react";
import { useClient } from "./useClient";
import { useNetwork } from "../contexts/network";
import { BigNumberish } from "ethers";
function useFetchVoterDepositAmount(voterAddress: string) {
  const [amount, setAmount] = useState<BigNumberish>();
  const { daofinClient } = useClient();
  const [error, setError] = useState<Error>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!daofinClient) return;
    setIsLoading(true);

    daofinClient.methods
      .voterToLockedAmount(voterAddress)
      .then((data) => {
        setIsLoading(false);
        setAmount(data);
      })
      .catch((e) => {
        setIsLoading(false);
        console.log("error", e);
      });
  }, [daofinClient]);
  if (!voterAddress) return false;

  return amount;
}
export default useFetchVoterDepositAmount;
