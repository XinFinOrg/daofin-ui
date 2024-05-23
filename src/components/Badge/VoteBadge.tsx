import { Badge, useColorModeValue } from "@chakra-ui/react";
import React, { FC } from "react";

interface VoteBadgeProps {
  option: number;
}
const VoteBadge: FC<VoteBadgeProps> = ({ option }) => {
  const abstain = useColorModeValue("#D7DEE4", "#151F29");
  const yes = useColorModeValue("#BFEED1", "#04AA46");
  const no = useColorModeValue("#FAD6D6", "#ad2727");
  const mapOptionToBadge = (option: number) => {
    switch (option) {
      case 1:
        return  "#151F29";
      case 2:
        return "#04AA46";
      case 3:
        return "#ad2727";

      default:
        break;
    }
  };
  const mapOptionToString = (option: number) => {
    switch (option) {
      case 1:
        return "Abstain";
      case 2:
        return "Yes";
      case 3:
        return "No";

      default:
        break;
    }
  };
  return (
    <Badge
      fontSize="x-small"
      borderRadius={"lg"}
      bgColor={mapOptionToBadge(option)}
      textColor={"gray.50"}
      px={"1"}
      textTransform={"uppercase"}
    >
      {mapOptionToString(option)}
    </Badge>
  );
};

export default VoteBadge;
