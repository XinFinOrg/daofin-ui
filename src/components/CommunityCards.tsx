import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Box,
  HStack,
  IconButton,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { FC, useMemo } from "react";
import JudiciariesIcon from "../utils/assets/icons/JudiciariesIcon";
import { CommitteeGlobal, useCommitteeUtils } from "../hooks/useCommitteeUtils";
import { useNavigate } from "react-router-dom";
import useFetchTotalNumbersByCommittee from "../hooks/useFetchTotalNumbersByCommittee";

const CommunityCards = () => {
  const navigate = useNavigate();
  const { committeesListWithIcon } = useCommitteeUtils();

  return (
    <HStack w={"full"}>
      {committeesListWithIcon.map(({ bgGradient, icon, id, name, link }) => (
        <HStack
          key={id}
          w={"full"}
          boxShadow={"sm"}
          bgGradient={bgGradient}
          opacity={0.9}
          borderRadius={"md"}
          p={4}
        >
          <Box w={"50px"} flexShrink={1}>
            {icon}
          </Box>
          <VStack flexGrow="1" alignSelf={"stretch"} alignItems={"start"}>
            <Text fontSize={"sm"} fontWeight={"normal"}>
              Number of {name}
            </Text>
            <Text fontSize={"lg"} fontWeight={"bold"}>
              20
            </Text>
          </VStack>
          <IconButton
            aria-label=""
            variant={"unstyled"}
            icon={<ArrowForwardIcon />}
            onClick={() => {
              navigate(link);
            }}
          />
        </HStack>
      ))}
    </HStack>
  );
};

export default CommunityCards;
