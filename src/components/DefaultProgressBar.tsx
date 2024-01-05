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

interface VoteStatProgressBarProps extends ProgressProps {
  percentage: number;
  threshold: number;
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
          <Box w={"7"} h={"7"}>
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

      <Progress
        w={"full"}
        size={size}
        value={Number(percentage)}
        borderRadius={"md"}
      >
        <Box
          position="absolute"
          top="0"
          left={`${threshold}%`}
          transform={`translateX(-${threshold}%)`}
          width="3px"
          height="100%"
          bg={useColorModeValue('black','white')}

        />
      </Progress>
    </HStack>
  );
};

export default DefaultProgressBar;
