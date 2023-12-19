import { TimeIcon } from "@chakra-ui/icons";
import { Box, Divider, HStack, Progress } from "@chakra-ui/react";
import React, { Component, ComponentType, FC, ReactNode } from "react";
import MasterNodeDelegateeSenateIcon from "../utils/assets/icons/MasterNodeDelegateeSenateIcon";

interface VoteStatProgressBarProps {
  percentage: number;
  threshold: number;
  Icon: ComponentType;
}
const VoteStatProgressBar: FC<VoteStatProgressBarProps> = ({
  percentage,
  threshold,
  Icon,
}) => {
  return (
    <HStack alignItems={'center'}>
      <Box w={'5'} h={'5'}>
        <Icon />
      </Box>

      <Progress
        size={"xs"}
        w="50%"
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
