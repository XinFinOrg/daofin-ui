import { FC, useState } from "react";
import DaoHeader from "../components/DaoHeader";
import DaofinSettingsCard from "../components/DaofinSettingsCard";
import { styled } from "styled-components";
import useDaoProposals from "../hooks/useDaoProposals";
import { useClient } from "../hooks/useClient";
import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
import PeoplesHouseDeposits from "../components/PeoplesHouseDeposits";
import usePeoplesHouseDeposits from "../hooks/useDeposits";
import { getPluginInstallationId, shortenAddress } from "../utils/networks";
import { Box } from "@chakra-ui/layout";
import ManageJudiciary from "../components/ManageJudiciary";
import ManageMasterNodeDelegatee from "../components/ManageMasterNodeDelegatee";
import WrongNetwork from "../components/WrongNetwork";

import {
  Button,
  useDisclosure,
  VStack,
  Text,
  Badge,
  HStack,
  Flex,
  Container,
  useColorModeValue,
  Skeleton,
} from "@chakra-ui/react";
import { Modal, Page } from "../components";
import { v4 as uuid } from "uuid";
import { useLocation, useNavigate } from "react-router-dom";
import Proposals from "../components/Proposals";
import CommunityCards from "../components/CommunityCards";
import { useCommitteeUtils } from "../hooks/useCommitteeUtils";
import { CheckCircleIcon, CheckIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { zeroAddress } from "viem";
import { IoBarChart } from "react-icons/io5";
const DashboardWrapper = styled.div.attrs({
  className: "grid grid-cols-12 grid-rows-12 gap-4",
})``;

const Dashboard: FC = () => {
  const { daofinClient, client } = useClient();
  const navigate = useNavigate();
  const { daoAddress, pluginAddress } = useAppGlobalConfig();
  const {
    data: proposals,
    error,
    isLoading,
  } = useDaoProposals(daoAddress, pluginAddress);

  const { isOpen, onClose, onToggle } = useDisclosure();

  const [proposalTypes, setProposalTypes] = useState([
    {
      id: uuid(),
      name: "Grant",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      isComingSoon: false,
      proposalId: 1,
    },
    {
      id: uuid(),
      name: "Update Settings",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      isComingSoon: true,
    },
    {
      id: uuid(),
      name: "Modify Voting Period",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      isComingSoon: true,
    },
  ]);
  const { committeesListWithIcon } = useCommitteeUtils();
  return (
    <Page>
      <HStack>
        <IoBarChart />

        <Text fontWeight={"semibold"} fontSize={"lg"}>
          Overview
        </Text>
      </HStack>
      <Flex mb={4}>
        <HStack
          bgColor={useColorModeValue("gray.50", "gray.900")}
          p={"6"}
          mr={4}
          borderRadius={"lg"}
          border={"1px"}
          borderColor={"blue.50"}
          boxShadow={"sm"}
          w={"50%"}
          justifyContent={"space-between"}
        >
            <VStack alignItems={"flex-start"}>
              <Text fontSize="sm" fontWeight={"normal"}>
                Total Proposals
              </Text>

              <Text fontSize="large" fontWeight={"bold"}>
                {proposals.length}
              </Text>
            </VStack>
          <Box>
            <Button
              variant="outline"
              colorScheme="blue"
              onClick={() => onToggle()}
            >
              New Proposal
            </Button>
          </Box>
        </HStack>
        <HStack
          bgColor={useColorModeValue("gray.50", "gray.900")}
          p={"6"}
          borderRadius={"lg"}
          border={"1px"}
          borderColor={"blue.50"}
          boxShadow={"sm"}
          w={"50%"}
          justifyContent={"space-between"}
        >
          <VStack alignItems={"flex-start"}>
            <Text fontSize="sm" fontWeight={"normal"}>
              Balance in Treasury
            </Text>
            <Text fontSize="large" fontWeight={"bold"}>
              430,000
            </Text>
          </VStack>
          <Box>
            <Button variant="outline" colorScheme="blue">
              + Add fund
            </Button>
          </Box>
        </HStack>
      </Flex>

      <Flex mb={6}>
        <CommunityCards />
      </Flex>
      <Flex mb={4} justifyContent={"space-between"}>
        <Box w={["100%", "60%"]} mr={"6"}>
          <Text fontSize={"md"} fontWeight={"semibold"} mb={"4"}>
            🔥 Ready to Execute
          </Text>
          <HStack
            justifyContent={"space-between"}
            p={"6"}
            bgColor={useColorModeValue("gray.50", "gray.900")}
            borderRadius={"md"}
          >
            <VStack alignItems={"flex-start"}>
              <Text as={"h1"} fontSize={"sm"} fontWeight={"bold"}>
                Lorem ipsum dolor sit amet consectetur ellus adipiscing
              </Text>
              <HStack justifyContent={"space-between"}>
                <Text fontSize={"xs"}>
                  <CheckCircleIcon color={"green"} mr={"1"} />
                  {new Date().toISOString()}
                </Text>
                <Text fontSize={"xs"}>ID: 12</Text>
                <Text fontSize={"xs"}>
                  Published by: {shortenAddress(zeroAddress)}{" "}
                  <ExternalLinkIcon />
                </Text>
              </HStack>
            </VStack>
            <Box>
              <Button variant={"outline"} colorScheme="blue" size={"sm"}>
                Execute Now
              </Button>
            </Box>
          </HStack>
        </Box>
        <Box w={"40%"} mb={"4"}>
          <Text fontSize={"md"} fontWeight={"semibold"} mb={"4"}>
            ✅ Executed Proposals
          </Text>
          <HStack
            justifyContent={"space-between"}
            p={"6"}
            bgColor={useColorModeValue("gray.50", "gray.900")}
            borderRadius={"md"}
          >
            <VStack alignItems={"flex-start"}>
              <Text as={"h1"} fontSize={"sm"} fontWeight={"bold"}>
                Lorem ipsum dolor sit amet consectetur ellus adipiscing
              </Text>
              <HStack justifyContent={"space-between"}>
                <Text fontSize={"xs"}>
                  <CheckCircleIcon color={"green"} mr={"1"} />
                  {new Date().toISOString()}
                </Text>
                <Text fontSize={"xs"}>ID: 12</Text>
                <Text fontSize={"xs"}>
                  Published by: {shortenAddress(zeroAddress)}{" "}
                  <ExternalLinkIcon />
                </Text>
              </HStack>
            </VStack>
          </HStack>
        </Box>
      </Flex>

      <Flex justifyContent={"center"}>
        <Box w={"100%"}>{<Proposals proposals={proposals} />}</Box>
      </Flex>
      {isOpen && (
        <Modal
          title="What would like to propose?"
          isOpen={isOpen}
          onClose={onClose}
          size="lg"
        >
          <VStack w={"full"}>
            {proposalTypes.map(
              ({ name, description, isComingSoon, id, proposalId }) => (
                <Flex
                  className={
                    "transition hover:ease-in duration-300 hover:opacity-80	"
                  }
                  direction={"column"}
                  p={2}
                  cursor={"pointer"}
                  w={"full"}
                  onClick={() => {
                    if (isComingSoon) return;
                    navigate(`/create/${proposalId}`);
                  }}
                >
                  <Text fontWeight={"bold"}>
                    {name} {isComingSoon && <Badge>Coming Soon</Badge>}
                  </Text>

                  <Text>{description}</Text>
                </Flex>
              )
            )}
          </VStack>
        </Modal>
      )}
    </Page>
  );
};
export default Dashboard;
