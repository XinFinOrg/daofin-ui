import {
  HStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  VStack,
  Text,
  Box,
} from "@chakra-ui/react";
import React, { FC, useEffect, useMemo } from "react";
import DefaultProgressBar from "./DefaultProgressBar";
import { useCommitteeUtils } from "../hooks/useCommitteeUtils";
import {
  JudiciaryCommittee,
  MasterNodeCommittee,
  PeoplesHouseCommittee,
} from "../utils/networks";
import useThresholdVotingStatsPerCommittee from "../hooks/useThresholdVotingStatsPerCommittee";
import useMinParticipationVotingStatsPerCommittee from "../hooks/useMinParticipationVotingStatsPerCommittee";
import { BigNumber, utils } from "ethers";
import {
  numberWithCommaSeparate,
  toEther,
  weiBigNumberToFormattedNumber,
} from "../utils/numbers";
import useTotalNumberOfVoters from "../hooks/useTotalNumberOfVoters";
import useFetchVotersOnProposal from "../hooks/useFetchVotersOnProposal";
import useVoteStats from "../hooks/useVoteStats";
import { VoteOption } from "@xinfin/osx-daofin-sdk-client";

interface VotingStatsBoxProps {
  currentVoters?: number;
  proposalId: string;
}
const VotingStatsBox: FC<VotingStatsBoxProps> = ({ proposalId }) => {
  const { committeesListWithIcon, committeesList } = useCommitteeUtils();

  const { mapCommitteeToTotalNumber } = useTotalNumberOfVoters();

  const stats = useVoteStats(proposalId);
  // useEffect(() => call(proposalId), []);
  const allVotersNumber = useMemo(
    () =>
      stats
        ? stats.reduce(
            (acc, { voters }) => (voters ? acc + voters?.data.length : acc),
            0
          )
        : 0,
    [stats]
  );
  return (
    <>
      <HStack
        justifyContent={["space-between"]}
        mb={"6"}
        p={"6"}
        flexDirection={["column", "column", "row"]}
      >
        <Text fontSize={"lg"} fontWeight={"bold"}>
          Voting
        </Text>
        <Text>Current voters {numberWithCommaSeparate(allVotersNumber)}</Text>
      </HStack>
      <Tabs isFitted>
        <TabList flexDirection={["column", "column", "row"]} gap={4}>
          {committeesListWithIcon.map(({ Icon, id, name }) => (
            <Tab key={id}>
              <HStack>
                <Box w={"25px"} h={"25px"}>
                  {Icon && Icon}
                </Box>
                <Text
                  fontSize={"sm"}
                  fontWeight={"semibold"}
                  whiteSpace={"nowrap"}
                >
                  {name}
                </Text>
              </HStack>
            </Tab>
          ))}
        </TabList>

        <TabPanels>
          {stats.map(({ id, name, voters }) => (
            <TabPanel key={id} p={"6"}>
              <HStack
                justifyContent={"space-between"}
                alignItems={"flex-start"}
                py={"4"}
                flexDirection={["column", "column", "row"]}
              >
                <Text fontWeight={"semibold"}>
                  <Text>
                    {
                      stats.find(({ id: committeeId }) => id === committeeId)
                        ?.voters?.data.length
                    }{" "}
                    <Text as="p" display={"inline-block"}>
                      Voted
                    </Text>{" "}
                  </Text>
                </Text>
                <HStack
                  fontWeight={"semibold"}
                  alignItems={"flex-start"}
                  flexDirection={["column", "column", "row"]}
                >
                  {stats
                    .find(({ id: committeeId }) => id === committeeId)
                    ?.options.map(({ value, text }) => (
                      <Text>
                        <Text as="p" display={"inline-block"}>
                          {value}
                        </Text>{" "}
                        {text}
                      </Text>
                    ))}
                </HStack>
              </HStack>
              {stats
                .filter(({ id: committeeId }) => id === committeeId)
                .map(({ minParticipation, supportThreshold }) => (
                  <VStack alignItems={"flex-start"}>
                    <DefaultProgressBar
                      percentage={
                        minParticipation?.numberOfVotesPercentage
                          ? +minParticipation.numberOfVotesPercentage.toString()
                          : 0
                      }
                      threshold={
                        minParticipation?.minParticipationPercentage
                          ? +minParticipation.minParticipationPercentage.toString()
                          : 0
                      }
                      height={"2"}
                      ProgressLabel={
                        <Text
                          fontSize={["xs", "sm", "md"]}
                          fontWeight={"normal"}
                        >
                          Quorum
                        </Text>
                      }
                    />
                    <DefaultProgressBar
                      percentage={
                        supportThreshold?.numberOfVotesPercentage
                          ? +supportThreshold?.numberOfVotesPercentage
                          : 0
                      }
                      threshold={
                        supportThreshold?.supportThresholdPercentage
                          ? +supportThreshold?.supportThresholdPercentage
                          : 0
                      }
                      ProgressLabel={
                        <Text
                          fontWeight={"normal"}
                          fontSize={["xs", "sm", "md"]}
                        >
                          Threshold
                        </Text>
                      }
                    />
                  </VStack>
                ))}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </>
  );
};

export default VotingStatsBox;
