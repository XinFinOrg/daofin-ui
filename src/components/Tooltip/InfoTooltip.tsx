import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { Tooltip, TooltipProps } from "@chakra-ui/tooltip";
import { FC } from "react";
import DefaultToolTip from "./DefaultToolTip";
import { useColorModeValue } from "@chakra-ui/color-mode";

export type InfoTooltipProps = Omit<TooltipProps, "children"> & {
  label: string;
  asLink?: true;
};
const InfoTooltip: FC<InfoTooltipProps> = (props) => {
  const textColor = useColorModeValue("#006da3", "lightBlue");

  return (
    <DefaultToolTip {...props} label={props.label}>
      <QuestionOutlineIcon color={props.asLink ? textColor : undefined} />
    </DefaultToolTip>
  );
};

export default InfoTooltip;
