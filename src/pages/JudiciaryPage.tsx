import React from "react";
import ManageJudiciary from "../components/ManageJudiciary";
import { Box, HStack, VStack } from "@chakra-ui/layout";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  Button,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Page } from "../components";
import JudiciariesIcon from "../utils/assets/icons/JudiciariesIcon";
import { zeroAddress } from "viem";

import DefaultProgressBar from "../components/DefaultProgressBar";
import {
  WalletAddressCard,
  WalletAddressCardWithDate,
} from "../components/WalletAddressCard";
import useFetchJudiciaries from "../hooks/useFetchJudiciaries";
import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
import useFetchTotalNumbersByCommittee from "../hooks/useFetchTotalNumbersByCommittee";
import { JudiciaryCommittee } from "../utils/networks";
import {
  timestampToStandardFormatString,
  toStandardFormatString,
  toStandardTimestamp,
} from "../utils/date";
import { EmptyBoxIcon } from "../utils/assets/icons/EmptyBoxIcon";
import { DefaultButton } from "../components/Button";
import { DefaultBox } from "../components/Box";
import { DefaultAlert } from "../components/Alerts";
import RulesOfDecisions from "../components/RulesOfDecisions";
import useFetchPluginProposalTypeDetails from "../hooks/useFetchPluginProposalTypeDetails";

const JudiciaryPage = () => {
  const { daoAddress, pluginAddress } = useAppGlobalConfig();
  const { data: juries, error } = useFetchJudiciaries(
    daoAddress,
    pluginAddress
  );
  const communityName = JudiciaryCommittee;
  const totalNumberOfJudiciaries =
    useFetchTotalNumbersByCommittee(JudiciaryCommittee);

  const { data: proposalTypes } = useFetchPluginProposalTypeDetails();
  return (
    <Page>
      <DefaultBox mb={6}>
        <VStack>
          <HStack justifyContent={"space-between"} w={"full"} mb={4}>
            <Box>
              <HStack>
                <Box w={"50px"} flexShrink={1}>
                  <JudiciariesIcon />
                </Box>
                <Box>
                  <Text fontSize={"xl"} fontWeight={"bold"}>
                    {" "}
                    Judiciaries
                  </Text>
                  <Text fontSize={"xs"}>
                    This is the group of expert people who are selected during
                    initial deployment
                  </Text>
                </Box>
              </HStack>
            </Box>
            <Box>
              <DefaultButton colorScheme="blue" isDisabled={true}>
                Modify Members
              </DefaultButton>
            </Box>
          </HStack>
          <HStack>
            <VStack
              borderRadius={"md"}
              p={6}
              w={["50%"]}
              fontSize={"sm"}
              alignSelf={"normal"}
              alignItems={"flex-start"}
              justifyContent={"center"}
            >
              <Text>Total Judiciaries</Text>
              <Text fontSize={"lg"} fontWeight={"bold"}>
                {totalNumberOfJudiciaries?.toString()}
              </Text>
            </VStack>

            <Box w={"50%"}>
              <DefaultAlert>
                <VStack alignItems={"flex-start"} fontSize={"sm"}>
                  <Text fontWeight={"semibold"}>
                    How to modify one or multiple member?
                  </Text>
                  <Text>
                    Lorem ipsum dolor sit amet consectetur. Senectus elementum
                    erat pellentesque nisl nibh. Vitae diam dolor convallis
                    porta lacus. Rhoncus cursus a viverra cursus lobortis ut
                    amet pulvinar. Sit mauris lectus libero lectus...
                  </Text>
                </VStack>
              </DefaultAlert>
            </Box>
          </HStack>
        </VStack>
      </DefaultBox>
      <HStack>
        <DefaultBox w={["60%"]} alignSelf={"flex-start"}>
          <VStack>
            {juries.length > 0 ? (
              juries.map(({ member, creationDate }) => (
                <WalletAddressCardWithDate
                  address={member}
                  date={new Date(toStandardTimestamp(creationDate.toString()))}
                />
              ))
            ) : (
              <>
                <VStack
                  w={"100%"}
                  alignItems="center"
                  alignSelf={"center"}
                  p={6}
                >
                  <EmptyBoxIcon />
                  <Text fontSize={"xs"} fontWeight={"500"} opacity={"0.5"}>
                    {"There is no member yet."}
                  </Text>
                </VStack>
              </>
            )}
          </VStack>
        </DefaultBox>
        {proposalTypes && proposalTypes?.length > 0 && (
          <DefaultBox w={["40%"]} alignSelf={"flex-start"}>
            <RulesOfDecisions
              communityName={communityName}
              summary={"All below info demostrate how voting rules work."}
              proposalTypes={proposalTypes}
            />
          </DefaultBox>
        )}
      </HStack>
    </Page>
  );
};

export default JudiciaryPage;
