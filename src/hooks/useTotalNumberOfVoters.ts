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

  const mapCommitteeToTotalNumber = (committeeName: string) => {
    switch (committeeName) {
      case JudiciaryCommittee:
        return judiciariesTotalMembers?.toString();
      case MasterNodeCommittee:
        return delegatees.length;

      case PeoplesHouseCommittee:
        return deposits.length;
      default:
        return "0";
    }
  };
  return {
    mapCommitteeToTotalNumber,
    isLoading: isLoadingDeposits && isLoadingDelegatees,
  };
};
export default useTotalNumberOfVoters;