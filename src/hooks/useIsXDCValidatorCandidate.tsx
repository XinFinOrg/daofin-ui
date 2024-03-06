import { useEffect, useState } from "react";
import { useClient } from "./useClient";
function useIsXDCValidatorCandidate(member: string) {
  const [isXDCValidatorCandidate, setIsXDCValidatorCandidate] =
    useState<boolean>();
  const { daofinClient } = useClient();
  // const [error, setError] = useState<Error>();
  const [, setIsLoading] = useState(false);

  useEffect(() => {
    if (!daofinClient || !member) return;
    setIsLoading(true);

    daofinClient.methods
      .isXDCValidatorCadidate(member)
      .then((data: boolean) => {
        setIsLoading(false);
        console.log(data);

        setIsXDCValidatorCandidate(data);
      })
      .catch((e: any) => {
        setIsLoading(false);
        console.log("error", e);
      });
  }, [daofinClient]);
  if (!member) return false;

  return isXDCValidatorCandidate;
}
export default useIsXDCValidatorCandidate;
