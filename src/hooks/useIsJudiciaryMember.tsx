import { useEffect, useMemo, useState } from "react";
import { useClient } from "./useClient";
import { useNetwork } from "../contexts/network";
import { da } from "date-fns/locale";
function useIsJudiciaryMember(member: string) {
  const [isJudiciaryMember, setIsJudiciaryMember] = useState<boolean>();
  const { daofinClient } = useClient();
  const [error, setError] = useState<Error>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!daofinClient || !member) return;
    setIsLoading(true);

    daofinClient.methods
      .isJudiciaryMember(member)
      .then((data) => {
        setIsLoading(false);

        setIsJudiciaryMember(data);
      })
      .catch((e) => {
        setIsLoading(false);
        console.log("error", e);
      });
  }, [daofinClient]);
  if (!member) return false;

  return isJudiciaryMember;
}
export default useIsJudiciaryMember;
