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

  const data = useVoteStats(proposalId);
  // useEffect(() => call(proposalId), []);
  const allVotersNumber = useMemo(
    () =>
      data
        ? data.reduce(
            (acc, { voters }) => (voters ? acc + voters?.data.length : acc),
            0
          )
        : 0,
    [data]
  );
  return (
    <>
      <HStack justifyContent={"space-between"} mb={"6"} p={"6"}>
        <Text fontSize={"lg"} fontWeight={"bold"}>
          Voting
        </Text>
        <Text>Current voters {numberWithCommaSeparate(allVotersNumber)}</Text>
      </HStack>
      <Tabs isFitted>
        <TabList>
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
          {data.map(({ id, name, voters }) => (
            <TabPanel key={id} p={"6"}>
              <HStack justifyContent={"space-between"} py={"4"}>
                <Text fontWeight={"semibold"} textColor={"gray.600"}>
                  <Text>
                    {
                      data.find(({ id: committeeId }) => id === committeeId)
                        ?.voters?.data.length
                    }{" "}
                    <Text as="p" color="gray.500" display={"inline-block"}>
                      Voted
                    </Text>{" "}
                  </Text>
                </Text>
                <HStack fontWeight={"semibold"} textColor={"gray.600"}>
                  {data
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
              {data
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
                        <Text fontWeight={"semibold"} color={"gray.600"}>
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
                        <Text fontWeight={"semibold"} color={"gray.600"}>
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
