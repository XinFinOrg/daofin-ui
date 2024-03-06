
import { Box, HStack, VStack } from "@chakra-ui/layout";
import {

  Text,
} from "@chakra-ui/react";
import { Page } from "../components";
import JudiciariesIcon from "../utils/assets/icons/JudiciariesIcon";

import {
  WalletAddressCardWithDate,
} from "../components/WalletAddressCard";
import useFetchJudiciaries from "../hooks/useFetchJudiciaries";
import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
import useFetchTotalNumbersByCommittee from "../hooks/useFetchTotalNumbersByCommittee";
import { JudiciaryCommittee } from "../utils/networks";
import {
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
  const { data: juries, } = useFetchJudiciaries(
    daoAddress,
    pluginAddress
  );
  const communityName = JudiciaryCommittee;
  const totalNumberOfJudiciaries =
    useFetchTotalNumbersByCommittee(JudiciaryCommittee);

  const { data: proposalTypes } = useFetchPluginProposalTypeDetails();
  return (
    <Page>
      <DefaultBox mb={4}>
        <VStack>
          <HStack
            justifyContent={"space-between"}
            w={"full"}
            mb={4}
            flexDirection={["column", "column", "column", "row"]}
          >
            <Box>
              <HStack>
                <Box w={["60px", "50px"]} flexShrink={1}>
                  <JudiciariesIcon />
                </Box>
                <Box>
                  <Text fontSize={["lg", "xl"]} fontWeight={"bold"}>
                    {" "}
                    Judiciaries
                  </Text>
                  <Text fontSize={"xs"}>
                    A set of pre-selected well-known community leaders.
                  </Text>
                </Box>
              </HStack>
            </Box>
            <Box w={["full", "full", "fit-content"]}>
              <DefaultButton
                w={["full", "full", "fit-content"]}
                isDisabled={true}
              >
                Modify Members
              </DefaultButton>
            </Box>
          </HStack>
          <HStack
            flexDirection={["column", "column", "column", "row"]}
            w={"full"}
            justifyContent={"flex-start"}
          >
            <DefaultBox w={["full", "full", "50%"]}>
              <VStack
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
            </DefaultBox>
            <DefaultAlert w={["full", "full", "50%"]}>
              <VStack alignItems={"flex-start"} fontSize={"sm"}>
                <Text fontWeight={"semibold"}>
                  How to modify one or multiple member?
                </Text>
                <Text>
                  Lorem ipsum dolor sit amet consectetur. Senectus elementum
                  erat pellentesque nisl nibh. nisl nibh. nisl nibh.
                </Text>
              </VStack>
            </DefaultAlert>
          </HStack>
        </VStack>
      </DefaultBox>
      <HStack flexDirection={["column", "column", "column", "row"]}>
        <Box w={["full", "full", "60%"]} alignSelf={"flex-start"} mr={2}>
          <VStack>
            {juries.length > 0 ? (
              juries.map(({ member, creationDate }) => (
                <WalletAddressCardWithDate
                  address={member}
                  date={new Date(toStandardTimestamp(creationDate.toString()))}
                />
              ))
            ) : (
              <DefaultBox w={"full"}>
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
              </DefaultBox>
            )}
          </VStack>
        </Box>
        {proposalTypes && proposalTypes?.length > 0 && (
          <DefaultBox w={["full", "full", "40%"]} alignSelf={"flex-start"}>
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
