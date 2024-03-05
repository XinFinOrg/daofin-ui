import { useEffect, useMemo, useState } from "react";
import { useClient } from "./useClient";
import { useNetwork } from "../contexts/network";
import { useWallet } from "./useWallet";
function useIsUserVotedOnProposal(proposalId: string | undefined) {
  const [isUserVotedOnProposal, setIsUserVotedOnProposal] = useState<boolean>();
  const { daofinClient } = useClient();
  const [error, setError] = useState<Error>();
  const [isLoading, setIsLoading] = useState(false);
  const { address: voterAddress } = useWallet();

  useEffect(() => {
    if (!daofinClient || !voterAddress || !proposalId) return;
    setIsLoading(true);

    daofinClient.methods
      .isVotedOnProposal(proposalId, voterAddress)
      .then((data) => {
        setIsLoading(false);
        setIsUserVotedOnProposal(data);
      })
      .catch((e) => {
        setIsLoading(false);
        console.log("error", e);
      });
  }, [daofinClient, voterAddress, proposalId]);
  if (!voterAddress) return false;

  return !!isUserVotedOnProposal;
}
export default useIsUserVotedOnProposal;
