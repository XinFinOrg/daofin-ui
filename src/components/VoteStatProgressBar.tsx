import { TimeIcon } from "@chakra-ui/icons";
import {
  Box,
  BoxProps,
  Divider,
  HStack,
  Progress,
  ProgressProps,
} from "@chakra-ui/react";
import React, {
  Component,
  ComponentType,
  FC,
  ReactElement,
  ReactNode,
} from "react";
import MasterNodeDelegateeSenateIcon from "../utils/assets/icons/MasterNodeDelegateeSenateIcon";

interface VoteStatProgressBarProps extends ProgressProps {
  percentage: number;
  threshold: number;
  Icon?: ComponentType;
  ProgressLabel?: ReactElement;
}
const VoteStatProgressBar: FC<VoteStatProgressBarProps> = ({
  percentage,
  threshold,
  Icon,
  ProgressLabel,
  w = "90%",
  size = "sm",
}) => {
  return (
    <HStack alignItems={"center"} w={"full"}>
      <Box w={'20%'}>
        {Icon ? (
          <Box w={"5"} h={"5"}>
            {<Icon />}
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
          bg="gray.900"
        />
      </Progress>
    </HStack>
  );
};

export default VoteStatProgressBar;
