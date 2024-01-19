import { useEffect, useState } from "react";
import { useClient } from "./useClient";
import { TallyDetails } from "@xinfin/osx-daofin-sdk-client";

function useFetchProposalTallyDetails(
  proposalId: string,
  committee: string
): { data: TallyDetails | undefined; error: string; isLoading: boolean } {
  const { daofinClient } = useClient();

  const [tallyDetails, setTallyDetails] = useState<TallyDetails>();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!daofinClient || !proposalId || !committee) return;
    setIsLoading(true);

    daofinClient.methods
      .getProposalTallyDetails(proposalId, committee)
      .then((data) => {
        setTallyDetails(data as unknown as TallyDetails);
      })
      .catch((e) => {
        setIsLoading(false);
        setError(e);
        console.log("error", e);
      });
  }, [daofinClient, proposalId]);

  return { data: tallyDetails, error: error, isLoading };
}
export default useFetchProposalTallyDetails;
