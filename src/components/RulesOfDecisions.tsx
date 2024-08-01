import React, { FC } from "react";
import { DefaultBox } from "./Box";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { DefaultAlert } from "./Alerts";
import DefaultProgressBar from "./DefaultProgressBar";
import { CommitteeVotingSettings } from "@xinfin/osx-daofin-sdk-client";
import { ProposalType, ProposalTypeEnum } from "../utils/types";
import { toStandardPercentage, uuid } from "../utils/numbers";
interface RulesOfDecisionsType {
  summary: string;
  proposalTypes: ProposalType[] | undefined;
  communityName: string;
}
const RulesOfDecisions: FC<RulesOfDecisionsType> = ({
  proposalTypes,
  summary,
  communityName,
}) => {
  const mapProposalTypeIdToItsName = (proposalTypeId: number) => {
    switch (proposalTypeId) {
      case ProposalTypeEnum.Grant:
        return "Grant / Decision";
      case ProposalTypeEnum.NewProposalType:
        return "New ProposalType";
      case ProposalTypeEnum.UpdateElectionPeriods:
        return "Modify Election Periods";
      case ProposalTypeEnum.UpdateJudiciary:
        return "Change Judiciaries";
      case ProposalTypeEnum.UpdateSettings:
        return "Update Voting Settings";
      case ProposalTypeEnum.UpdateProposalCosts:
        return "Update Proposal Costs";
      default:
        return "N/A";
    }
  };  
  return (
    <Accordion>
      <DefaultAlert fontSize={"sm"} mb={4}>
        <VStack alignItems={"flex-start"}>
          <Text fontWeight={"semibold"}>Rules of Decisions</Text>
          <Text>{summary}</Text>
        </VStack>
      </DefaultAlert>
      {proposalTypes &&
        proposalTypes.map(({ proposalTypeId, settings }) => (
          <AccordionItem key={uuid()}>
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  <Text fontWeight={"bold"}>
                    {mapProposalTypeIdToItsName(+proposalTypeId)}
                  </Text>
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} fontSize={"xs"} fontWeight={"semibold"}>
              {settings
                .filter(({ name }) => name === communityName)
                .map(({ minParticipation, supportThreshold }) => (
                  <>
                    <HStack justifyContent={"space-between"}>
                      <DefaultProgressBar
                        percentage={
                          +toStandardPercentage(minParticipation.toString())
                        }
                        threshold={null}
                        ProgressLabel={<Text>Quorum</Text>}
                      />
                      <Text>
                        {`${+toStandardPercentage(minParticipation)}`}
                        {"%"}
                      </Text>
                    </HStack>
                    <HStack>
                      <DefaultProgressBar
                        percentage={
                          +toStandardPercentage(supportThreshold.toString())
                        }
                        threshold={null}
                        ProgressLabel={<Text>Threshold</Text>}
                      />
                      <Text>
                        {`${toStandardPercentage(supportThreshold.toString())}`}
                        {"%"}
                      </Text>
                    </HStack>
                  </>
                ))}
            </AccordionPanel>
          </AccordionItem>
        ))}
    </Accordion>
  );
};

export default RulesOfDecisions;
