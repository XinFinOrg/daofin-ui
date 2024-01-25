import {
  Badge,
  BadgeProps,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { FC } from "react";
import { ProposalStatus } from "../utils/types";

interface ProposalStatusBadgeProps extends BadgeProps {
  title: ProposalStatus;
}
const ProposalStatusBadge: FC<ProposalStatusBadgeProps> = ({
  title,
  variant = "solid",
  ...props
}) => {
  const notStarted = useColorModeValue("#D7DEE4", "#151F29");
  const active = useColorModeValue("#BFEED1", "#04AA46");
  const mapProposalStatusToBadge = (title: ProposalStatus) => {
    switch (title) {
      case ProposalStatus.EXPIRED:
        return notStarted;
        case ProposalStatus.ACTIVE:
        return active;

      default:
        break;
    }
  };
  return (
    <Badge
      {...props}
      fontSize="x-small"
      borderRadius={"lg"}
      bgColor={mapProposalStatusToBadge(title)}
      px={"2"}
      py={"0.5"}
      textTransform={"uppercase"}
    >
      {title}
    </Badge>
  );
};

export default ProposalStatusBadge;
