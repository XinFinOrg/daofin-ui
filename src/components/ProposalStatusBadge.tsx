import { Badge, useColorMode, useColorModeValue } from "@chakra-ui/react";
import React, { FC } from "react";
import { ProposalStatus } from "../utils/types";

interface ProposalStatusBadgeProps {
  title: ProposalStatus;
}
const ProposalStatusBadge: FC<ProposalStatusBadgeProps> = ({ title }) => {
  return (
    <Badge
      fontSize="x-small"
      borderRadius={"lg"}
      colorScheme={useColorModeValue('blue','red')}
      px={"1"}
      textTransform={"uppercase"}
      variant={"outline"}
    >
      {title}
    </Badge>
  );
};

export default ProposalStatusBadge;
