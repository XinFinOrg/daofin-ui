import { FC, useState } from "react";
import DaoHeader from "../components/DaoHeader";
import { styled } from "styled-components";
import useDaoProposals from "../hooks/useDaoProposals";
import { useClient } from "../hooks/useClient";
import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
import PeoplesHouseDeposits from "../components/PeoplesHouseDeposits";
import usePeoplesHouseDeposits from "../hooks/useDeposits";
import {
  CHAIN_METADATA,
  getPluginInstallationId,
  shortenAddress,
} from "../utils/networks";
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
import { Link, useLocation, useNavigate } from "react-router-dom";
import Proposals from "../components/Proposals";
import CommunityCards from "../components/CommunityCards";
import { useCommitteeUtils } from "../hooks/useCommitteeUtils";
import {
  ArrowForwardIcon,
  CheckCircleIcon,
  CheckIcon,
  ExternalLinkIcon,
} from "@chakra-ui/icons";
import { zeroAddress } from "viem";
import { IoBarChart } from "react-icons/io5";
import useFetchDaoBalance from "../hooks/useFetchDaoBalance";
import { weiBigNumberToFormattedNumber } from "../utils/numbers";
import { fetchTokenPrice } from "../services/prices";
import { useNetwork } from "../contexts/network";
import { EmptyBoxIcon } from "../utils/assets/icons/EmptyBoxIcon";
import CoinIcon from "../utils/assets/icons/CoinIcon";
import { WalletAuthorizedButton } from "../components/Button/AuthorizedButton";
import { DefaultBox } from "../components/Box";
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
  const nativeBalanceOfDao = useFetchDaoBalance();
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
  const { network } = useNetwork();
  return (
    <Page>
      <HStack>
        <IoBarChart />

        <Text fontWeight={"semibold"} fontSize={"lg"}>
          Overview
        </Text>
      </HStack>
      <Flex mb={6}>
        <DefaultBox mr={4} w={"50%"}>
          <HStack justifyContent={"space-between"}>
            <VStack alignItems={"flex-start"}>
              <Text fontSize="sm" fontWeight={"normal"}>
                Total Proposals
              </Text>

              <Text fontSize="large" fontWeight={"bold"}>
                {proposals.length}
              </Text>
            </VStack>
            <Box>
              <WalletAuthorizedButton
                variant="outline"
                onClick={() => onToggle()}
              >
                New Proposal
              </WalletAuthorizedButton>
            </Box>
          </HStack>
        </DefaultBox>
        <DefaultBox w={"50%"}>
          <HStack justifyContent={"space-between"}>
            <VStack alignItems={"flex-start"}>
              <Text fontSize="sm" fontWeight={"normal"}>
                Balance in Treasury
              </Text>
              <Text fontSize="large" fontWeight={"bold"}>
                {nativeBalanceOfDao
                  ? weiBigNumberToFormattedNumber(nativeBalanceOfDao)
                  : 0}{" "}
                {CHAIN_METADATA[network].nativeCurrency.symbol}
              </Text>
            </VStack>
            <Box>
              <Button variant="outline" colorScheme="blue">
                + Add fund
              </Button>
            </Box>
          </HStack>
        </DefaultBox>
      </Flex>

      <Flex mb={6}>
        <CommunityCards />
      </Flex>
      <Flex mb={4} justifyContent={"space-between"}>
        <Box w={["100%", "60%"]} mr={"6"}>
          <Text fontSize={"md"} fontWeight={"semibold"} mb={"4"}>
            🔥 Ready to Execute
          </Text>
          <DefaultBox borderStyle={"dashed"}>
            <HStack justifyContent={"space-between"}>
              {/* <VStack alignItems={"flex-start"}>
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
            </Box> */}

              <VStack w={"100%"} alignItems="center" alignSelf={"center"} p={6}>
                <Text fontSize={"xs"} fontWeight={"500"} opacity={"0.5"}>
                  {"There is no proposal yet."}
                </Text>
              </VStack>
            </HStack>
          </DefaultBox>
        </Box>
        <Box w={"40%"} mb={"4"}>
          <Text fontSize={"md"} fontWeight={"semibold"} mb={"4"}>
            ✅ Executed Proposals
          </Text>
          <DefaultBox borderStyle={"dashed"}>
            <HStack justifyContent={"space-between"}>
              {/* <VStack alignItems={"flex-start"}>
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
            </VStack> */}
              <VStack w={"100%"} alignItems="center" alignSelf={"center"} p={6}>
                {/* <EmptyBoxIcon /> */}
                <Text fontSize={"xs"} fontWeight={"500"} opacity={"0.5"}>
                  {"There is no proposal yet."}
                </Text>
              </VStack>
            </HStack>
          </DefaultBox>
        </Box>
      </Flex>

      <VStack w={"full"}>
        <Text
          alignSelf={"flex-start"}
          fontSize={"md"}
          fontWeight={"semibold"}
          mb={"4"}
        >
          Most Recent Proposals
        </Text>
        <Flex justifyContent={"center"} w={"full"}>
          <Box w={"full"}>{<Proposals proposals={proposals} />}</Box>
        </Flex>
        <Link to={"/proposals"}>
          <Button variant={"link"}>
            View all proposals <ArrowForwardIcon />
          </Button>
        </Link>
      </VStack>
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
