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
import React from "react";
import VoteStatProgressBar from "./VoteStatProgressBar";
import { useCommitteeUtils } from "../hooks/useCommitteeUtils";

interface VotingStatsBoxProps {
  currentVoters: number;
}
const VotingStatsBox = () => {
  const { committeesListWithIcon, committeesList } = useCommitteeUtils();

  return (
    <>
      <HStack justifyContent={"space-between"} mb={"6"} p={"6"}>
        <Text fontSize={"lg"} fontWeight={"bold"}>
          Voting
        </Text>
        <Text>Current voters 99</Text>
      </HStack>
      <Tabs isFitted>
        <TabList>
          {committeesListWithIcon.map(({ icon, id, name }) => (
            <Tab key={id}>
              <HStack>
                <Box w={"25px"} h={"25px"}>
                  {icon}
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
          {committeesListWithIcon.map(({ id, name }) => (
            <TabPanel key={id} p={"6"}>
              <HStack justifyContent={"space-between"} py={"4"}>
                <Text fontWeight={"semibold"} textColor={"gray.600"}>
                  <Text>
                    2312{" "}
                    <Text as="p" color="gray.500" display={"inline-block"}>
                      Voted
                    </Text>{" "}
                  </Text>
                </Text>
                <HStack fontWeight={"semibold"} textColor={"gray.600"}>
                  <Text>
                    <Text as="p" color="green" display={"inline-block"}>
                      1231
                    </Text>{" "}
                    For
                  </Text>
                  <Text>
                    <Text as="p" color="red" display={"inline-block"}>
                      1231
                    </Text>{" "}
                    Against
                  </Text>
                  <Text>
                    <Text as="p" display={"inline-block"}>
                      2
                    </Text>{" "}
                    Abstain
                  </Text>
                </HStack>
              </HStack>
              <VStack alignItems={"flex-start"}>
                <VoteStatProgressBar
                  percentage={80}
                  threshold={70}
                  height={"2"}
                  ProgressLabel={
                    <Text fontWeight={"semibold"} color={"gray.600"}>
                      Quorum
                    </Text>
                  }
                />
                <VoteStatProgressBar
                  percentage={40}
                  threshold={30}
                  ProgressLabel={
                    <Text fontWeight={"semibold"} color={"gray.600"}>
                      Threshold
                    </Text>
                  }
                />
              </VStack>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </>
  );
};

export default VotingStatsBox;
