import { useCallback } from "react";
import {
  JudiciaryCommittee,
  MasterNodeCommittee,
  PeoplesHouseCommittee,
} from "../utils/networks";
import usePeoplesHouseDeposits from "./useDeposits";
import useFetchMasterNodeDelegatee from "./useFetchMasterNodeDelegatee";
import useFetchTotalNumbersByCommittee from "./useFetchTotalNumbersByCommittee";

const useTotalNumberOfVoters = () => {
  const judiciariesTotalMembers =
    useFetchTotalNumbersByCommittee(JudiciaryCommittee);

  const { data: delegatees, isLoading: isLoadingDelegatees } =
    useFetchMasterNodeDelegatee();
  const { data: deposits, isLoading: isLoadingDeposits } =
    usePeoplesHouseDeposits();

  const mapCommitteeToTotalNumber = useCallback(
    (committeeName: string) => {
      switch (committeeName) {
        case JudiciaryCommittee:
          return judiciariesTotalMembers
            ? +judiciariesTotalMembers.toString()
            : 0;
        case MasterNodeCommittee:
          return delegatees.length;

        case PeoplesHouseCommittee:
          return deposits.length;
        default:
          return 0;
      }
    },
    [delegatees, deposits, judiciariesTotalMembers]
  );

  const mapCommitteeToTotalNumberLoadings = useCallback(
    (committeeName: string) => {
      switch (committeeName) {
        case JudiciaryCommittee:
          return false;
        case MasterNodeCommittee:
          return isLoadingDelegatees;

        case PeoplesHouseCommittee:
          return isLoadingDeposits;
        default:
          return false;
      }
    },
    [isLoadingDelegatees, isLoadingDeposits]
  );
  return {
    mapCommitteeToTotalNumber,
    mapCommitteeToTotalNumberLoadings,
    isLoading: isLoadingDeposits || isLoadingDelegatees,
  };
};
export default useTotalNumberOfVoters;
