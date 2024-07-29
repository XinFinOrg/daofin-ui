import { useColorModeValue } from "@chakra-ui/color-mode";
import { Tooltip, TooltipProps } from "@chakra-ui/tooltip";
import { FC, ReactNode } from "react";

export type DefaultToolTipProps = TooltipProps & {
  label: string| ReactNode;
};

const DefaultToolTip: FC<DefaultToolTipProps> = (props) => {
  const bg = useColorModeValue("black", "white");
  return (
    <Tooltip {...props} label={props.label} bg={bg}>
      {props.children}
    </Tooltip>
  );
};

export default DefaultToolTip;
