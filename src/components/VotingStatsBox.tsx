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
  Flex,
} from "@chakra-ui/react";
import { FC, useMemo } from "react";
import DefaultProgressBar from "./DefaultProgressBar";
import { useCommitteeUtils } from "../hooks/useCommitteeUtils";

import {
  convertProposalTypeSettingsToPercentage,
  numberWithCommaSeparate,
  toStandardPercentage,
} from "../utils/numbers";
import useTotalNumberOfVoters from "../hooks/useTotalNumberOfVoters";
import useVoteStats from "../hooks/useVoteStats";
import { Proposal } from "../utils/types";
import { Cell, Pie, PieChart, Tooltip } from "recharts";
import { useContractReads } from "wagmi";
import useVotingStatsContract from "../hooks/contractHooks/useVotingStatsContract";
import { applyRatioCeiled } from "../utils/vote-utils";
import { CheckCircleIcon } from "@chakra-ui/icons";

interface VotingStatsBoxProps {
  currentVoters?: number;
  proposal: Proposal;
}

const VotingStatsBox: FC<VotingStatsBoxProps> = ({ proposal }) => {
  const { committeesListWithIcon } = useCommitteeUtils();
  const votingStatsHook = useVotingStatsContract(
    BigInt(proposal.pluginProposalId),
    BigInt(proposal.proposalType.proposalTypeId)
  );

  const allVotersNumber = useMemo(
    () =>
      votingStatsHook.data
        ? votingStatsHook.data.reduce(
            (acc, { totalVotes }) => (totalVotes ? acc + totalVotes : acc),
            0n
          )
        : 0n,
    [proposal]
  );
  console.log(votingStatsHook.data);

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
        <Text>
          {/* Current voters {numberWithCommaSeparate(allVotersNumber.toString())} */}
        </Text>
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
          {votingStatsHook &&
            votingStatsHook?.data?.map(
              ({
                abstainVotes,
                name,
                noVotes,
                totalVotes,
                yesVotes,
                currentQuorumNumberRatio,
                requiredQuorumNumberRatio,
                requiredPassrateNumberRatio,
                currentPassrateNumberRatio,
                requiredPassrateNumber,
                currentPassrateNumber,
                currentQuorumNumber,
                requiredQuorumNumber,
                currentPassrateRatio,
              }) => (
                <TabPanel key={name} p={["1", "6"]}>
                  <HStack
                    justifyContent={"space-between"}
                    alignItems={"flex-start"}
                    py={"4"}
                    flexDirection={["column", "column", "row"]}
                    fontSize={["xs", "sm"]}
                    fontWeight={"semibold"}
                  >
                    <Text>
                      <Text>
                        {`${totalVotes} `}
                        <Text as="p" display={"inline-block"}>
                          Voted
                        </Text>{" "}
                      </Text>
                    </Text>
                    <HStack
                      alignItems={"flex-start"}
                      flexDirection={["column", "column", "row"]}
                    >
                      <Text>
                        <Text as="p" display={"inline-block"}>
                          {yesVotes.toString()}
                        </Text>{" "}
                        {"YES"}
                      </Text>
                      <Text>
                        <Text as="p" display={"inline-block"}>
                          {noVotes.toString()}
                        </Text>{" "}
                        {"NO"}
                      </Text>
                      <Text>
                        <Text as="p" display={"inline-block"}>
                          {abstainVotes.toString()}
                        </Text>{" "}
                        {"ABSTAIN"}
                      </Text>
                    </HStack>
                  </HStack>
                  <VStack alignItems={"flex-start"}>
                    <DefaultProgressBar
                      percentage={+currentQuorumNumberRatio.toString()}
                      threshold={+requiredQuorumNumberRatio.toString()}
                      height={"2"}
                      ProgressLabel={
                        <HStack>
                          {currentQuorumNumberRatio >=
                            requiredQuorumNumberRatio &&
                            (currentQuorumNumberRatio === 0n &&
                            currentQuorumNumber == 0n ? (
                              <CheckCircleIcon color={"black"} />
                            ) : (
                              <CheckCircleIcon color={"green"} />
                            ))}

                          {currentQuorumNumberRatio <
                            requiredQuorumNumberRatio && (
                            <CheckCircleIcon color={"black"} />
                          )}
                          <Text fontSize={["xs", "sm"]} fontWeight={"semibold"}>
                            Quorum
                          </Text>
                        </HStack>
                      }
                      tooltipLabel={
                        <Box>
                          <Text>
                            Required: {requiredQuorumNumber.toString()}
                          </Text>
                        </Box>
                      }
                    />
                    <DefaultProgressBar
                      percentage={+currentPassrateNumberRatio.toString()}
                      threshold={+requiredPassrateNumberRatio.toString()}
                      tooltipLabel={
                        <Box>
                          <Text>
                            Required: {requiredPassrateNumber.toString()}
                          </Text>
                        </Box>
                      }
                      ProgressLabel={
                        <HStack>
                          {currentPassrateNumberRatio >=
                            requiredPassrateNumberRatio &&
                            (currentPassrateNumberRatio === 0n &&
                              currentPassrateRatio == 0n ? (
                              <CheckCircleIcon color={"black"} />
                            ) : (
                              <CheckCircleIcon color={"green"} />
                            ))}
                          {currentPassrateNumberRatio <
                            requiredPassrateNumberRatio && (
                            <CheckCircleIcon color={"black"} />
                          )}

                          <Text fontWeight={"semibold"} fontSize={["xs", "sm"]}>
                            Passrate
                          </Text>
                        </HStack>
                      }
                    />
                  </VStack>
                </TabPanel>
              )
            )}
        </TabPanels>
      </Tabs>
    </>
  );
};

export default VotingStatsBox;
