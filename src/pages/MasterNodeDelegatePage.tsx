import React, { FC } from "react";
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
  MasterNodeSenateCard,
  WalletAddressCard,
  WalletAddressCardWithDate,
} from "../components/WalletAddressCard";
import MasterNodeDelegateeSenateIcon from "../utils/assets/icons/MasterNodeDelegateeSenateIcon";
import {
  MasterNodeDelegateeSentateProvider,
  useMasterNodeDelegateeSentateContext,
} from "../contexts/MasterNodeDelegateeSentateContext";
import { Formik } from "formik";
import useFetchMasterNodeDelegatee from "../hooks/useFetchMasterNodeDelegatee";
import { toNormalDate, toStandardTimestamp } from "../utils/date";
import useFetchTotalNumbersByCommittee from "../hooks/useFetchTotalNumbersByCommittee";
import { MasterNodeCommittee } from "../utils/networks";
import { EmptyBoxIcon } from "../utils/assets/icons/EmptyBoxIcon";
import {
  MasterNodeAuthorizedButton,
  WalletAuthorizedButton,
} from "../components/Button/AuthorizedButton";

export type UpdateOrJoinMasterNodeDelegateeType = {
  delegateeAddress: string;
};
const MasterNodeDelegatePage = () => {
  const { data: delegatees } = useFetchMasterNodeDelegatee();
  const totalMasterNodes = useFetchTotalNumbersByCommittee(MasterNodeCommittee);
  const bgColor = useColorModeValue("gray.50", "gray.900");

  return (
    <Page>
      <Formik
        initialValues={{
          delegateeAddress: "",
        }}
        onSubmit={() => {}}
      >
        <MasterNodeDelegateeSentateProvider>
          <>
            <VStack
              boxShadow={"sm"}
              bgColor={useColorModeValue("gray.50", "gray.900")}
              borderRadius={"md"}
              p={6}
              mb={6}
            >
              {totalMasterNodes != undefined && (
                <MasterNodeDelegateeHeader
                  totalMasterNodes={parseInt(totalMasterNodes?.toString())}
                  totalJoined={delegatees.length}
                />
              )}
            </VStack>
            <HStack>
              <VStack w={["70%"]} alignSelf={"flex-start"}>
                {delegatees.length > 0 ? (
                  delegatees.map(
                    ({
                      member,
                      masterNode,
                      snapshotBlock,
                      txHash,
                      id,
                      creationDate,
                    }) => (
                      <MasterNodeSenateCard
                        key={id}
                        address={member}
                        joinedDate={toNormalDate(creationDate.toString())}
                        blockNumber={parseInt(snapshotBlock.toString())}
                        masterNodeAddress={masterNode}
                      />
                    )
                  )
                ) : (
                  <>
                    <VStack
                      p={"6"}
                      bgColor={bgColor}
                      borderRadius={"md"}
                      w={"100%"}
                      alignItems="center"
                      alignSelf={"center"}
                    >
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
                      This is where judiciaries can decide on how rules of
                      decisions are differentiated between various proposal
                      types
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
          </>
        </MasterNodeDelegateeSentateProvider>
      </Formik>
    </Page>
  );
};
interface MasterNodeDelegateeHeaderProps {
  totalJoined: number;
  totalMasterNodes: number;
}
const MasterNodeDelegateeHeader: FC<MasterNodeDelegateeHeaderProps> = ({
  totalJoined,
  totalMasterNodes,
}) => {
  const { handleToggleFormModal } = useMasterNodeDelegateeSentateContext();

  return (
    <>
      <HStack justifyContent={"space-between"} w={"full"} mb={4}>
        <Box>
          <HStack>
            <Box w={"40px"} flexShrink={1}>
              <MasterNodeDelegateeSenateIcon />
            </Box>
            <Box>
              <Text fontSize={"md"} fontWeight={"bold"}>
                {" "}
                Master Nodes Delegatee Senate
              </Text>
              <Text fontSize={"xs"}>
                This is the group of expert people who are selected during
                initial deployment
              </Text>
            </Box>
          </HStack>
        </Box>
        <Box>
          <MasterNodeAuthorizedButton
            colorScheme="blue"
            onClick={handleToggleFormModal}
          >
            Delegate a member
          </MasterNodeAuthorizedButton>
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
          <Text>Total Master Nodes</Text>
          <Text fontSize={"lg"} fontWeight={"bold"}>
            {totalMasterNodes}
          </Text>
        </VStack>{" "}
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
          <Text>Joined Master Nodes</Text>
          <Text fontSize={"lg"} fontWeight={"bold"}>
            {totalJoined}
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
    </>
  );
};
export default MasterNodeDelegatePage;
