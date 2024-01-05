import { useEffect, useMemo, useState } from "react";
import { useClient } from "./useClient";
import { useNetwork } from "../contexts/network";
function useIsUserDeposited(voterAddress: string | null) {
  const [isUserDeposited, setIsUserDeposited] = useState<boolean>();
  const { daofinClient } = useClient();
  const [error, setError] = useState<Error>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!daofinClient || !voterAddress) return;
    setIsLoading(true);

    daofinClient.methods
      .isPeopleHouse(voterAddress)
      .then((data) => {
        setIsLoading(false);
        setIsUserDeposited(data);
      })
      .catch((e) => {
        setIsLoading(false);
        console.log("error", e);
      });
  }, [daofinClient]);
  if (!voterAddress) return false;

  return isUserDeposited;
}
export default useIsUserDeposited;
