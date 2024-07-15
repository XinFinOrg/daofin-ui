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
import { FC, useMemo } from "react";
import DefaultProgressBar from "./DefaultProgressBar";
import { useCommitteeUtils } from "../hooks/useCommitteeUtils";

import {
  convertProposalTypeSettingsToPercentage,
  numberWithCommaSeparate,
} from "../utils/numbers";
import useTotalNumberOfVoters from "../hooks/useTotalNumberOfVoters";
import useVoteStats from "../hooks/useVoteStats";
import { Proposal } from "../utils/types";
import { Cell, Pie, PieChart, Tooltip } from "recharts";
import { useContractReads } from "wagmi";
import useVotingStatsContract from "../hooks/contractHooks/useVotingStatsContract";

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
        <Text>Current voters {numberWithCommaSeparate(allVotersNumber.toString())}</Text>
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
                currentQuroumNumberRatio,
                requiredQuroumNumberRatio,
                requiredPassrateNumberRatio,
                currentPassrateRatio,
                currentPassrateNumberRatio
              }) => (
                <TabPanel key={name} p={"6"}>
                  <HStack
                    justifyContent={"space-between"}
                    alignItems={"flex-start"}
                    py={"4"}
                    flexDirection={["column", "column", "row"]}
                  >
                    <Text fontWeight={"semibold"}>
                      <Text>
                        {`${totalVotes} `}
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
                      percentage={+currentQuroumNumberRatio.toString()}
                      threshold={+requiredQuroumNumberRatio.toString()}
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
                      +currentPassrateNumberRatio.toString()
                    }
                    threshold={
                      +requiredPassrateNumberRatio.toString()
                    }
                    ProgressLabel={
                      <Text fontWeight={"normal"} fontSize={["xs", "sm", "md"]}>
                        Threshold
                      </Text>
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
