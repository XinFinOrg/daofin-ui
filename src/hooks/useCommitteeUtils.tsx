import { ReactElement, useMemo } from "react";
import {
  JudiciaryCommittee,
  MasterNodeCommittee,
  PeoplesHouseCommittee,
} from "../utils/networks";
import MasterNodeDelegateeSenateIcon from "../utils/assets/icons/MasterNodeDelegateeSenateIcon";
import JudiciariesIcon from "../utils/assets/icons/JudiciariesIcon";
import PeopleHouseIcon from "../utils/assets/icons/PeopleHouseIcon";
import { useColorModeValue } from "@chakra-ui/react";

export type CommitteeGlobal = {
  id: string;
  name: string;
  link: string;
  bgGradient?: string;
  Icon?: ReactElement;
};

export function useCommitteeUtils() {
  const bgGradientJudiciaries = useColorModeValue(
    "linear(to-b, #FFC8D8, #FFE8EF)",
    "linear(to-b, #FFC8D8, #FFE8EF)"
  );
  const bgGradientMasterNode = useColorModeValue(
    "linear(to-b, #96E6FF, #D6F8FF)",
    "linear(to-b, #96E6FF, #D6F8FF)"
  );
  const bgGradientPeoplesHouse = useColorModeValue(
    "linear(to-b, #FFE49F, #FFF5DC)",
    "linear(to-b, #FFE49F, #FFF5DC)"
  );
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
  const committeeIdToBgGradient = (id: string) => {
    switch (id) {
      case MasterNodeCommittee:
        return bgGradientMasterNode;
      case JudiciaryCommittee:
        return bgGradientJudiciaries;
      case PeoplesHouseCommittee:
        return bgGradientPeoplesHouse;
    }
  };

  const committeesList: CommitteeGlobal[] = useMemo(
    () => [
      {
        id: PeoplesHouseCommittee,
        name: "House",
        link: "/community/peoples-house",
      },
      {
        id: JudiciaryCommittee,
        name: "Judiciaries",
        link: "/community/judiciary",
      },
      {
        id: MasterNodeCommittee,
        name: "Senate",
        link: "/community/masternode-delegatee-senate",
      },
    ],
    []
  );
  const committeesListWithIcon = useMemo(
    () =>
      committeesList.map((item) => ({
        ...item,
        Icon: committeeIdToIcon(item.id),
        bgGradient: committeeIdToBgGradient(item.id),
      })),
    []
  );
  return { committeeIdToIcon, committeesList, committeesListWithIcon };
}
