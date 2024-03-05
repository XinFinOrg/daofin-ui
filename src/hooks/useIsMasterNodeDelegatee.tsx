import { useEffect, useMemo, useState } from "react";
import { useClient } from "./useClient";
import { useNetwork } from "../contexts/network";
import { da } from "date-fns/locale";
function useIsMasterNodeDelegatee(member: string) {
  const [isMasterNodeDelegatee, setisMasterNodeDelegatee] = useState<boolean>();
  const { daofinClient } = useClient();
  const [error, setError] = useState<Error>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!daofinClient || !member) return;
    setIsLoading(true);

    daofinClient.methods
      .isMasterNodeDelegatee(member)
      .then((data) => {
        setIsLoading(false);

        setisMasterNodeDelegatee(data);
      })
      .catch((e) => {
        setIsLoading(false);
        console.log("error", e);
      });
  }, [daofinClient]);
  if (!member) return false;

  return isMasterNodeDelegatee;
}
export default useIsMasterNodeDelegatee;
