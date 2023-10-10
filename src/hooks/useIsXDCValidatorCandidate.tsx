import { useEffect, useMemo, useState } from "react";
import { useClient } from "./useClient";
import { useNetwork } from "../contexts/network";
import { da } from "date-fns/locale";
function useIsXDCValidatorCandidate(member: string) {
  const [isXDCValidatorCandidate, setIsXDCValidatorCandidate] =
    useState<boolean>();
  const { daofinClient } = useClient();
  const [error, setError] = useState<Error>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!daofinClient || !member) return;
    setIsLoading(true);

    daofinClient.methods
      .isXDCValidatorCadidate(member)
      .then((data) => {
        setIsLoading(false);
        console.log(data);

        setIsXDCValidatorCandidate(data);
      })
      .catch((e) => {
        setIsLoading(false);
        console.log("error", e);
      });
  }, [daofinClient]);
  if (!member) return false;

  return isXDCValidatorCandidate;
}
export default useIsXDCValidatorCandidate;
