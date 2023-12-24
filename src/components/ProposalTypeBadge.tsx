import { Badge } from "@chakra-ui/react";
import React, { FC } from "react";

interface ProposalTypeBadgeProps {
  title: string;
}
const ProposalTypeBadge: FC<ProposalTypeBadgeProps> = ({ title }) => {
  return (
    <Badge
      fontSize="x-small"
      borderRadius={"lg"}
      bgColor={"gray.800"}
      textColor={"gray.50"}
      px={"1"}
      textTransform={"uppercase"}
    >
      {title}
    </Badge>
  );
};

export default ProposalTypeBadge;
