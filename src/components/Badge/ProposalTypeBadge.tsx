import { Badge, useColorMode, useColorModeValue } from "@chakra-ui/react";
import React, { FC } from "react";

interface ProposalTypeBadgeProps {
  id: string;
}
const ProposalTypeBadge: FC<ProposalTypeBadgeProps> = ({ id }) => {
  const { colorMode } = useColorMode();
  const grant =   useColorModeValue('#ffc107', '#ff8c00'); // Amber / DarkOrange
  const decisionMaking = useColorModeValue("#1e90ff", "#4682b4"); // LightSkyBlue / SteelBlue

  const getTitleFromId = () => {
    switch (id) {
      case "0x0":
        return "Grants";
      case "0x1":
        return "Decision-making";
      default:
        return "";
    }
  };
  const getColorFromId = () => {
    switch (id) {
      case "0x0":
        return grant;
      case "0x1":
        return decisionMaking;
      default:
        return "";
    }
  };
  return (
    <Badge
      fontSize="x-small"
      borderRadius={"lg"}
      bgColor={getColorFromId()}
      px={"1"}
      py={"0.2"}
      textColor={colorMode === "dark" ? "black" : "white"}
      textTransform={"uppercase"}
    >
      {getTitleFromId()}
    </Badge>
  );
};

export default ProposalTypeBadge;
