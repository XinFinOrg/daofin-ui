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
import {
  JudiciaryCommittee,
  MasterNodeCommittee,
  PeoplesHouseCommittee,
  getPluginInstallationId,
} from "../utils/networks";
import useFetchMasterNodeDelegatee from "../hooks/useFetchMasterNodeDelegatee";
import useFetchVoterDepositAmount from "../hooks/useFetchVoterDepositAmount";
import usePeoplesHouseDeposits from "../hooks/useDeposits";
import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
import useTotalNumberOfVoters from "../hooks/useTotalNumberOfVoters";

const CommunityCards = () => {
  const navigate = useNavigate();
  const { daoAddress, pluginAddress } = useAppGlobalConfig();
  const { committeesListWithIcon } = useCommitteeUtils();
  const { mapCommitteeToTotalNumber } = useTotalNumberOfVoters();

  return (
    <HStack w={"full"}>
      {committeesListWithIcon.map(({ bgGradient, Icon, id, name, link }) => (
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
            {Icon && Icon}
          </Box>
          <VStack flexGrow="1" alignSelf={"stretch"} alignItems={"start"}>
            <Text fontSize={"sm"} fontWeight={"normal"}>
              Number of {name}
            </Text>
            <Text fontSize={"lg"} fontWeight={"bold"}>
              {mapCommitteeToTotalNumber(id)}
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
