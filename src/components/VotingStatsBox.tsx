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

interface VotingStatsBoxProps {
  currentVoters?: number;
  proposal: Proposal;
}

const VotingStatsBox: FC<VotingStatsBoxProps> = ({ proposal }) => {
  const { committeesListWithIcon } = useCommitteeUtils();

  const {} = useTotalNumberOfVoters();

  const allVotersNumber = useMemo(
    () =>
      proposal.tallyDetails
        ? proposal.tallyDetails.reduce(
            (acc, { totalVotes }) => (totalVotes ? acc + +totalVotes : acc),
            0
          )
        : 0,
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
          {proposal.tallyDetails.map(
            ({
              id,
              yesVotes,
              noVotes,
              abstainVotes,
              totalVotes,
              quorumActiveVote,
              quorumRequiredVote,
              passrateActiveVote,
              passrateRequiredVote,
              totalMembers,
            }) => (
              <TabPanel key={id} p={"6"}>
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
                        {yesVotes}
                      </Text>{" "}
                      {"YES"}
                    </Text>
                    <Text>
                      <Text as="p" display={"inline-block"}>
                        {noVotes}
                      </Text>{" "}
                      {"NO"}
                    </Text>
                    <Text>
                      <Text as="p" display={"inline-block"}>
                        {abstainVotes}
                      </Text>{" "}
                      {"ABSTAIN"}
                    </Text>
                  </HStack>
                </HStack>
                <VStack alignItems={"flex-start"}>
                  <DefaultProgressBar
                    percentage={
                      +quorumActiveVote == 0
                        ? 0
                        : +((+quorumActiveVote / +totalMembers) * 100)
                    }
                    threshold={+proposal == 0
                      ? 0
                      : +((+quorumRequiredVote / +totalMembers) * 100)}
                    height={"2"}
                    ProgressLabel={
                      <Text fontSize={["xs", "sm", "md"]} fontWeight={"normal"}>
                        Quorum
                      </Text>
                    }
                  />
                  <DefaultProgressBar
                    percentage={
                      +passrateActiveVote == 0
                        ? 0
                        : +((+passrateActiveVote / +totalMembers) * 100)
                    }
                    threshold={
                      passrateRequiredVote
                        ? (+passrateRequiredVote / +totalMembers) * 100
                        : 0
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
