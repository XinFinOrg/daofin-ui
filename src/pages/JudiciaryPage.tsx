import React from "react";
import ManageJudiciary from "../components/ManageJudiciary";
import { Box, HStack, VStack } from "@chakra-ui/layout";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
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

const JudiciaryPage = () => {
  const { daoAddress, pluginAddress } = useAppGlobalConfig();
  const { data: juries, error } = useFetchJudiciaries(
    daoAddress,
    pluginAddress
  );
  const totalNumberOfJudiciaries =
    useFetchTotalNumbersByCommittee(JudiciaryCommittee);
  return (
    <Page>
      <VStack
        boxShadow={"sm"}
        bgColor={useColorModeValue("gray.50", "gray.900")}
        borderRadius={"md"}
        p={6}
        mb={6}
      >
        <HStack justifyContent={"space-between"} w={"full"} mb={4}>
          <Box>
            <HStack>
              <Box w={"40px"} flexShrink={1}>
                <JudiciariesIcon />
              </Box>
              <Box>
                <Text fontSize={"md"} fontWeight={"bold"}>
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
            border={"1px"}
            borderColor={"gray.100"}
            alignSelf={"normal"}
            alignItems={"flex-start"}
            justifyContent={"center"}
          >
            <Text>Total Judiciaries</Text>
            <Text fontSize={"lg"} fontWeight={"bold"}>
              {totalNumberOfJudiciaries?.toString()}
            </Text>
          </VStack>
          <Box
            borderRadius={"md"}
            p={6}
            w={["50%"]}
            bg={"blue.100"}
            fontSize={"sm"}
          >
            <Text fontWeight={"semibold"}>
              How to modify one or multiple member?
            </Text>
            <Text>
              Lorem ipsum dolor sit amet consectetur. Senectus elementum erat
              pellentesque nisl nibh. Vitae diam dolor convallis porta lacus.
              Rhoncus cursus a viverra cursus lobortis ut amet pulvinar. Sit
              mauris lectus libero lectus...
            </Text>
          </Box>
        </HStack>
      </VStack>
      <HStack>
        <VStack w={["70%"]} alignSelf={"flex-start"}>
          {juries.length > 0 ? (
            juries.map(({ member, creationDate }) => (
              <WalletAddressCardWithDate
                address={member}
                date={new Date(toStandardTimestamp(creationDate.toString()))}
              />
            ))
          ) : (
            <>
              <VStack w={"100%"} alignItems="center" alignSelf={"center"} p={6}>
                <EmptyBoxIcon />
                <Text fontSize={"xs"} fontWeight={"500"} opacity={"0.5"}>
                  {"There is no member yet."}
                </Text>
              </VStack>
            </>
          )}
        </VStack>
        <Box
          alignSelf={"flex-start"}
          boxShadow={"sm"}
          bgColor={useColorModeValue("gray.50", "gray.900")}
          opacity={0.9}
          borderRadius={"md"}
          p={6}
        >
          <Accordion>
            <Box
              borderRadius={"md"}
              p={6}
              bg={"blue.100"}
              fontSize={"sm"}
              mb={4}
            >
              <Text fontWeight={"semibold"}>Rules of Decisions</Text>
              <Text>
                This is where judiciaries can decide on how rules of decisions
                are differentiated between various proposal types
              </Text>
            </Box>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    <Text fontWeight={"semibold"}>Grant</Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <HStack justifyContent={"space-between"}>
                  <DefaultProgressBar
                    percentage={10}
                    threshold={50}
                    ProgressLabel={<Text fontSize={"sm"}>Threshold</Text>}
                  />
                  <Text fontSize={"sm"}>10%</Text>
                </HStack>
                <HStack>
                  <DefaultProgressBar
                    percentage={60}
                    threshold={50}
                    ProgressLabel={<Text fontSize={"sm"}>Pass Rate</Text>}
                  />
                  <Text fontSize={"sm"}>60%</Text>
                </HStack>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    <Text fontWeight={"semibold"}>Update Settings</Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <HStack justifyContent={"space-between"}>
                  <DefaultProgressBar
                    percentage={50}
                    threshold={60}
                    ProgressLabel={<Text fontSize={"sm"}>Threshold</Text>}
                  />
                  <Text fontSize={"sm"}>50%</Text>
                </HStack>
                <HStack>
                  <DefaultProgressBar
                    percentage={80}
                    threshold={70}
                    ProgressLabel={<Text fontSize={"sm"}>Pass Rate</Text>}
                  />
                  <Text fontSize={"sm"}>80%</Text>
                </HStack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>
      </HStack>
    </Page>
  );
};

export default JudiciaryPage;
