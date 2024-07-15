import { Badge, useColorModeValue } from "@chakra-ui/react";
import React, { FC } from "react";

interface ProposalTypeBadgeProps {
  id: string;
}
const ProposalTypeBadge: FC<ProposalTypeBadgeProps> = ({ id }) => {
  const bgColor = useColorModeValue("gray.800", "#586E84");
  const getTitleFromId = () => {
    switch (id) {
      case "0x0":
        return "Grants"
        case '0x1':
          return "Decision-making"
      default:
        return ""
    }
  };
  return (
    <Badge
      fontSize="x-small"
      borderRadius={"lg"}
      bgColor={bgColor}
      textColor={"gray.50"}
      px={"1"}
      py={'0.2'}
      textTransform={"uppercase"}
    >
      {getTitleFromId()}
    </Badge>
  );
};

export default ProposalTypeBadge;
