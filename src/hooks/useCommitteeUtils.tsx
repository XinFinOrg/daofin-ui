import { useMemo } from "react";
import {
  JudiciaryCommittee,
  MasterNodeCommittee,
  PeoplesHouseCommittee,
} from "../utils/networks";
import MasterNodeDelegateeSenateIcon from "../utils/assets/icons/MasterNodeDelegateeSenateIcon";
import JudiciariesIcon from "../utils/assets/icons/JudiciariesIcon";
import PeopleHouseIcon from "../utils/assets/icons/PeopleHouseIcon";

export function useCommitteeUtils() {
  const committeeIdToIcon = (id: string) => {
    switch (id) {
      case MasterNodeCommittee:
        return <MasterNodeDelegateeSenateIcon />;
      case JudiciaryCommittee:
        return <JudiciariesIcon />;
      case PeoplesHouseCommittee:
        return <PeopleHouseIcon />;
    }
  };
  const committeesList = useMemo(
    () => [
      { id: MasterNodeCommittee, name: "Master Node Senate" },
      { id: PeoplesHouseCommittee, name: "People's House" },
      { id: JudiciaryCommittee, name: "Judiciaries" },
    ],
    []
  );
  const committeesListWithIcon = useMemo(
    () =>
      committeesList.map(({ id, name }) => ({
        id,
        name,
        icon: committeeIdToIcon(id),
      })),
    []
  );
  return { committeeIdToIcon, committeesList, committeesListWithIcon };
}
