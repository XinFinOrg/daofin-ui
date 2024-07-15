import { TimeIcon } from "@chakra-ui/icons";
import {
  Box,
  BoxProps,
  Divider,
  HStack,
  Progress,
  ProgressProps,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import React, {
  Component,
  ComponentType,
  FC,
  ReactElement,
  ReactNode,
} from "react";
import MasterNodeDelegateeSenateIcon from "../utils/assets/icons/MasterNodeDelegateeSenateIcon";
import { IconBase } from "react-icons/lib";
import { Tooltip } from "recharts";
import { DefaultToolTip } from "./Tooltip";

interface VoteStatProgressBarProps extends ProgressProps {
  percentage: number;
  threshold: number | null;
  Icon?: ReactElement;
  ProgressLabel?: ReactElement;
}
const DefaultProgressBar: FC<VoteStatProgressBarProps> = ({
  percentage,
  threshold,
  Icon,
  ProgressLabel,
  w = "90%",
  size = "sm",
}) => {
  return (
    <HStack alignItems={"center"} w={"full"}>
      <Box w={"20%"}>
        {Icon ? (
          <Box w={["4", "4", "5", "7"]} h={["4", "4", "5", "7"]}>
            {Icon}
          </Box>
        ) : (
          <></>
        )}
        {ProgressLabel ? (
          <Box alignSelf={"baseline"}>{ProgressLabel}</Box>
        ) : (
          <></>
        )}
      </Box>
      <DefaultToolTip label={``}>
        <Progress
          w={["full"]}
          size={size}
          value={Number(percentage)}
          borderRadius={"md"}
        >
           
          {threshold !== null && <ThresholdLine threshold={threshold} />}  
        </Progress>
      </DefaultToolTip>
    </HStack>
  );
};

const ThresholdLine: FC<Pick<VoteStatProgressBarProps, "threshold">> = ({
  threshold,
}) => {
  return (
    <>
      {" "}
      <Box
        position="absolute"
        top="0"
        left={`${threshold}%`}
        transform={`translateX(-${threshold}%)`}
        width="3px"
        height="100%"
        bg={useColorModeValue("black", "white")}
      />
    </>
  );
};
export default DefaultProgressBar;
