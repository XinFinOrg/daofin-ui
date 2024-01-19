import { Badge, useColorModeValue } from "@chakra-ui/react";
import React, { FC } from "react";

interface ProposalTypeBadgeProps {
  title: string;
}
const ProposalTypeBadge: FC<ProposalTypeBadgeProps> = ({ title }) => {
  const bgColor = useColorModeValue("gray.800", "#586E84");
  return (
    <Badge
      fontSize="x-small"
      borderRadius={"lg"}
      bgColor={bgColor}
      textColor={"gray.50"}
      px={"1"}
      textTransform={"uppercase"}
    >
      {title}
    </Badge>
  );
};

export default ProposalTypeBadge;
