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
  const { colorMode } = useColorMode();
  const notStarted = useColorModeValue("#808080", "#d3d3d3"); // Gray / LightGray
  const published = useColorModeValue("#0000ff", "#add8e6"); // Blue / LightBlue
  const running = useColorModeValue("#008000", "#90ee90"); // Green / LightGreen
  const defeated = useColorModeValue("#ff0000", "#f08080"); // Red / LightCoral
  const queued = useColorModeValue("#ffa500", "#ffa07a"); // Orange / LightSalmon
  const readyToExecute = useColorModeValue("#800080", "#9370db"); // Purple / MediumPurple
  const executed = useColorModeValue("#008080", "#48d1cc"); // Teal / MediumTurquoise
  const expired = useColorModeValue('#d32f2f', '#ff6347'); // DarkRed / Tomato

  const mapProposalStatusToBadge = (title: ProposalStatus) => {
    switch (title) {
      case ProposalStatus.NOT_STARTED:
        return notStarted;
      case ProposalStatus.RUNNING:
        return running;
      case ProposalStatus.DEFEATED:
        return defeated;
      case ProposalStatus.EXECUTED:
        return executed;
      case ProposalStatus.PUBLISHED:
        return published;
      case ProposalStatus.QUEUED:
        return queued;
      case ProposalStatus.READY_TO_EXECUTE:
        return readyToExecute;
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
      px={"1"}
      py={"0.2"}
      color={""}
      textColor={colorMode === "dark" ? "black" : "white"}
      textTransform={"uppercase"}
    >
      {title}
    </Badge>
  );
};

export default ProposalStatusBadge;
