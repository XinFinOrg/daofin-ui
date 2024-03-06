import { useEffect, useState } from "react";
import { useClient } from "./useClient";

function useIsMasterNodeDelegatee(member: string) {
  const [isMasterNodeDelegatee, setisMasterNodeDelegatee] = useState<boolean>();
  const { daofinClient } = useClient();
  const [, setIsLoading] = useState(false);

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
