import {
  Badge,
  BadgeProps,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { FC } from "react";
import { ProposalStatus } from "../../utils/types";

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
  const expired = useColorModeValue("#FAD6D6", "#ad2727");
  const mapProposalStatusToBadge = (title: ProposalStatus) => {
    switch (title) {
      case ProposalStatus.NOT_STARTED:
        return notStarted;
      case ProposalStatus.ACTIVE:
        return active;
      case ProposalStatus.EXPIRED:
        return expired;

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
      color={""}
      textTransform={"uppercase"}
    >
      {title}
    </Badge>
  );
};

export default ProposalStatusBadge;
