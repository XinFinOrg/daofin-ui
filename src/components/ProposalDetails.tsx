import React, { FC, useMemo } from "react";
import { Proposal } from "../utils/types";
import { Box, Flex, Heading, Text } from "@chakra-ui/layout";
import {
  CHAIN_METADATA,
  JudiciaryCommittee,
  KNOWN_FORMATS,
  MasterNodeCommittee,
  PeoplesHouseCommittee,
  applyRatioCeiled,
  convertCommitteeToPlainText,
  convertVoteOptionToItsColor,
  convertVoteOptionToText,
  formatDate,
  getFormattedUtcOffset,
  shortenAddress,
} from "../utils/networks";
import { styled } from "styled-components";
import { FormLabel } from "@chakra-ui/form-control";
import BoxWrapper from "./BoxWrapper";
import { formatEther } from "@ethersproject/units";
import { useNetwork } from "../contexts/network";
import useIsUserDeposited from "../hooks/useIsUserDeposited";
import { useWallet } from "../hooks/useWallet";
import { Button } from "@chakra-ui/button";
import { Tooltip } from "@chakra-ui/tooltip";
import useIsUserVotedOnProposal from "../hooks/useIsUserVotedOnProposal";
import { useClient } from "../hooks/useClient";
import { InputGroup } from "@chakra-ui/input";
import { useDisclosure } from "@chakra-ui/hooks";
import { useForm } from "react-hook-form";
import { Progress, Select, Tag } from "@chakra-ui/react";
import { VoteOption, VoteSteps } from "@xinfin/osx-daofin-sdk-client";
import useFetchVotersOnProposal from "../hooks/useFetchVotersOnProposal";
import { daoAddress, pluginAddress } from "../utils/constants";
import useVoteStats from "../hooks/useVoteStats";
import useFetchProposalTallyDetails from "../hooks/useFetchProposalTallyDetails";
import useFetchGlobalCommitteeToVotingSettings from "../hooks/useFetchGlobalCommitteeToVotingSettings";
import { parseEther } from "viem";
import { BigNumber } from "@ethersproject/bignumber";
import useFetchTotalNumbersByCommittee from "../hooks/useFetchTotalNumbersByCommittee";
import useMinParticipationVotingStatsPerCommittee from "../hooks/useMinParticipationVotingStatsPerCommittee";
import useThresholdVotingStatsPerCommittee from "../hooks/useThresholdVotingStatsPerCommittee";
const ProposalWrapper = styled.div.attrs({
  className: "",
})``;

const ActionsWrapper = styled(BoxWrapper).attrs({
  className: "h-fit",
})``;
const DurationWrapper = styled(BoxWrapper).attrs({
  className: "h-fit",
})``;
const DepositStatusWrapper = styled(BoxWrapper).attrs({
  className: "h-fit",
})``;
const InfoWrapper = styled(BoxWrapper).attrs({
  className: "",
})``;

const VotersOnProposalWrapper = styled(BoxWrapper).attrs({
  className: "h-fit",
})``;
const ProposalDetails: FC<{ proposal: Proposal }> = ({ proposal }) => {
  const {
    actions,
    creator,
    dao,
    endDate,
    executed,
    id,
    metadata,
    pluginProposalId,
    potentiallyExecutable,
    startDate,
  } = proposal;

  const { isOpen, onClose, onOpen } = useDisclosure();
  const { network } = useNetwork();
  const { address: voterAddress } = useWallet();
  const isUserDeposited = useIsUserDeposited(voterAddress ? voterAddress : "");
  const isUserVotedOnProposal = useIsUserVotedOnProposal(
    pluginProposalId,
    voterAddress ? voterAddress : ""
  );

  const { setValue, getValues, register, watch } = useForm({
    defaultValues: {
      depositAmount: 0,
      voteOption: VoteOption.NONE,
    },
  });
  const { daofinClient } = useClient();
  const voteOption = watch("voteOption");

  const { data: votersOnProposal } = useFetchVotersOnProposal(
    daoAddress,
    pluginAddress,
    pluginProposalId
  );
  const {
    judiciaryVoteListLength,
    masterNodeVoteListLength,
    peoplesHouseVoteListLength,
  } = useVoteStats(pluginProposalId);
  const committeesList = useMemo(
    () => [MasterNodeCommittee, PeoplesHouseCommittee, JudiciaryCommittee],
    []
  );
  const handleVote = async () => {
    const iterator = daofinClient?.methods.vote(
      pluginProposalId,
      voteOption,
      false
    );
    if (!iterator) return;
    try {
      for await (const step of iterator) {
        switch (step.key) {
          case VoteSteps.WAITING:
            console.log("Key:", step.key);
            console.log("Tx:", step.txHash);

            break;
          case VoteSteps.DONE:
            console.log("Key:", step.key);
            break;
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const convertCommitteeBytesToVoteLength = (committee: string) => {
    switch (committee) {
      case MasterNodeCommittee:
        return masterNodeVoteListLength;
      case PeoplesHouseCommittee:
        return peoplesHouseVoteListLength;
      case JudiciaryCommittee:
        return judiciaryVoteListLength;
    }
  };

  const mnStats = useMinParticipationVotingStatsPerCommittee(
    pluginProposalId,
    MasterNodeCommittee
  );

  const judiciaryStats = useMinParticipationVotingStatsPerCommittee(
    pluginProposalId,
    JudiciaryCommittee
  );
  const peopleStats = useMinParticipationVotingStatsPerCommittee(
    pluginProposalId,
    PeoplesHouseCommittee
  );

  const convertCommitteeBytesToVotingStats = (
    committee: string
  ):
    | {
        current: BigNumber;
        minParticipations: BigNumber;
        percentage: string;
      }
    | undefined => {
    switch (committee) {
      case MasterNodeCommittee:
        return mnStats;
      case PeoplesHouseCommittee:
        return peopleStats
          ? {
              current: BigNumber.from(
                parseInt(formatEther(peopleStats.current))
              ),
              percentage: peopleStats.percentage,
              minParticipations: BigNumber.from(
                parseInt(formatEther(peopleStats.minParticipations))
              ),
            }
          : {
              current: BigNumber.from(0),
              minParticipations: BigNumber.from(0),
              percentage: "0",
            };
      case JudiciaryCommittee:
        return judiciaryStats;
    }
  };

  const mnThresholdStats = useThresholdVotingStatsPerCommittee(
    pluginProposalId,
    MasterNodeCommittee
  );

  const judiciaryThresholdStats = useThresholdVotingStatsPerCommittee(
    pluginProposalId,
    JudiciaryCommittee
  );
  const peopleThresholdStats = useThresholdVotingStatsPerCommittee(
    pluginProposalId,
    PeoplesHouseCommittee
  );
  const convertCommitteeBytesToSupportTresholdStats = (
    committee: string
  ):
    | {
        current: BigNumber;
        supportThreshold: BigNumber;
        percentage: string;
      }
    | undefined => {
    switch (committee) {
      case MasterNodeCommittee:
        return mnThresholdStats;
      case PeoplesHouseCommittee:
        return peopleThresholdStats;
      case JudiciaryCommittee:
        return judiciaryThresholdStats;
    }
  };
  const minParticipationStats = useMemo(
    () =>
      committeesList && peopleStats && mnStats && judiciaryStats
        ? committeesList.map((committee) =>
            convertCommitteeBytesToVotingStats(committee)
          )
        : [],
    [committeesList, peopleStats, mnStats, judiciaryStats]
  );

  const supportThresholdStats = useMemo(
    () =>
      committeesList &&
      peopleThresholdStats &&
      mnThresholdStats &&
      judiciaryThresholdStats
        ? committeesList.map((committee) =>
            convertCommitteeBytesToSupportTresholdStats(committee)
          )
        : [],
    [committeesList, peopleStats, mnStats, judiciaryStats]
  );

  return (
    <>
      {proposal && (
        <ProposalWrapper className="grid grid-cols-12  w-100 p-4 gap-4">
          <InfoWrapper className=" col-span-12 md:col-span-8">
            <Flex direction={"column"}>
              <Flex justifyContent={"start"} alignItems={"center"}>
                <Box>
                  <Heading>{metadata.title}</Heading>
                  <Flex className="my-1">
                    {metadata.resources.map(({ name, url }) => (
                      <Tag>
                        <a
                          href={url}
                          target="_blank"
                          className="pr-2 hover:text-blue-500"
                        >
                          {name}
                        </a>
                      </Tag>
                    ))}
                  </Flex>
                </Box>
              </Flex>

              <Flex
                justifyContent={"space-between"}
                mt={"1.5"}
                alignItems={"center"}
              >
                <Text color={"gray"}>
                  Published By{" "}
                  <Text display={"inline-block"}>
                    {" "}
                    {shortenAddress(creator)}
                  </Text>
                </Text>
              </Flex>
              <Flex
                direction="column"
                justifyContent={"start"}
                alignItems={"start"}
                mt={"2"}
              >
                <Text>
                  <strong>Summary:</strong>
                </Text>
                <Text textAlign={"left"}>{metadata.summary}</Text>
              </Flex>
              <Flex
                direction="column"
                justifyContent={"start"}
                alignItems={"start"}
                mt={"1.5"}
              >
                <Text>
                  <strong>Description:</strong>
                </Text>
                <Text
                  textAlign={"left"}
                  dangerouslySetInnerHTML={{
                    __html: metadata.description,
                  }}
                />
              </Flex>
            </Flex>
          </InfoWrapper>
          <Box className="col-span-12 md:col-span-4">
            {voterAddress ? (
              <>
                <DepositStatusWrapper className="col-span-4 row-span-3 col-start-9 row-start-auto">
                  <Flex direction={"column"}>
                    <Flex justifyContent={"center"} alignItems={"center"}>
                      <Box>
                        <Heading>Voting Eligibility</Heading>
                      </Box>
                    </Flex>
                    <Flex className="mt-4 flex-col justify-start items-start">
                      <Text>
                        <strong>Has Deposit? </strong>
                        {isUserDeposited ? "Yes" : "No"}
                      </Text>
                      <Text>
                        <strong>
                          Has Voted on proposal no. {pluginProposalId}?{" "}
                        </strong>
                        {isUserVotedOnProposal ? "Yes" : "No"}
                      </Text>
                    </Flex>
                    <Flex
                      className="mt-4"
                      justifyContent={"space-around"}
                      alignItems={"center"}
                    >
                      <Box>
                        <FormLabel>Vote Option</FormLabel>
                        <InputGroup className="m-1">
                          <Select {...register("voteOption", {})}>
                            {Object.keys(VoteOption)
                              .filter((option) => isNaN(Number(option)))
                              .map((option, index) => (
                                <option value={index}>
                                  {convertVoteOptionToText(index as VoteOption)}
                                </option>
                              ))}
                          </Select>
                        </InputGroup>
                      </Box>
                    </Flex>
                    <Flex
                      className="mt-4"
                      justifyContent={"space-around"}
                      alignItems={"center"}
                    >
                      <Tooltip
                        // isDisabled={isUserVotedOnProposal}
                        aria-label="Coming"
                      >
                        <Button
                          colorScheme="green"
                          onClick={handleVote}
                          isDisabled={voteOption === VoteOption.NONE}
                        >
                          Vote
                        </Button>
                      </Tooltip>
                    </Flex>
                  </Flex>
                </DepositStatusWrapper>
              </>
            ) : (
              <></>
            )}
            <ActionsWrapper className="col-span-4 row-span-3 col-start-9 row-start-auto">
              <Flex direction={"column"}>
                <Flex justifyContent={"center"} alignItems={"center"}>
                  <Box>
                    <Heading>Actions</Heading>
                  </Box>
                </Flex>
                <Flex justifyContent={"start"} alignItems={"center"}>
                  {actions.map(({ data, to, value }) => (
                    <BoxWrapper className="w-full">
                      <Text>
                        {`${formatEther(value)} ${
                          CHAIN_METADATA[network].nativeCurrency.symbol
                        }`}{" "}
                        {"->"} {shortenAddress(to)}
                      </Text>
                      <Text color={"red"}>
                        {" "}
                        {data.toString() === "0x" ? (
                          <></>
                        ) : (
                          `${"invalid Action"} ${data.toString()}`
                        )}
                      </Text>
                    </BoxWrapper>
                  ))}
                </Flex>
              </Flex>
            </ActionsWrapper>
            {/* <DurationWrapper className="col-span-4 row-span-3 col-start-9 row-start-auto">
              <Flex direction={"column"}>
                <Flex justifyContent={"center"} alignItems={"center"}>
                  <Box>
                    <Heading>Duration</Heading>
                  </Box>
                </Flex>
                <Flex className="flex-col justify-start items-start">
                  <Text>Now: {new Date().toUTCString()}</Text>
                  <Text>Start Date: {new Date(startDate).toUTCString()}</Text>
                  <Text>End Date: {new Date(endDate).toUTCString()}</Text>
                </Flex>
              </Flex>
            </DurationWrapper> */}
          </Box>
          {committeesList.map((c, i) => (
            <VotersOnProposalWrapper
              key={c}
              className="col-span-4 row-start-auto"
            >
              <Flex direction={"column"}>
                <Flex justifyContent={"center"} alignItems={"center"}>
                  <Box>
                    <Heading fontSize={"2xl"}>
                      {convertCommitteeToPlainText(c)} Votes{" "}
                      {`(${convertCommitteeBytesToVoteLength(c)})`}
                    </Heading>
                  </Box>
                </Flex>
                {minParticipationStats[i] && (
                  <Box className="text-start my-2">
                    {
                      <Text fontWeight={500}>
                        <Text>
                          {`(Quruam - % ${parseFloat(
                            minParticipationStats[i]!.percentage
                          ).toFixed(3)}) | ${minParticipationStats[
                            i
                          ]?.current.toString()}  ${
                            c === PeoplesHouseCommittee
                              ? CHAIN_METADATA[network].nativeCurrency.symbol
                              : "Address"
                          } (Current) Of ${minParticipationStats[
                            i
                          ]?.minParticipations.toString()} ${
                            c === PeoplesHouseCommittee
                              ? CHAIN_METADATA[network].nativeCurrency.symbol
                              : "Address"
                          }`}
                        </Text>
                      </Text>
                    }

                    <Progress
                      colorScheme="blue"
                      size="sm"
                      value={+minParticipationStats[i]!.percentage}
                    />
                  </Box>
                )}

                {supportThresholdStats[i] && (
                  <Box className="text-start my-2">
                    {minParticipationStats[i] && (
                      <Text fontWeight={500}>
                        <Text>{`Support Threshold: % ${parseFloat(
                          supportThresholdStats[i]!.percentage
                        ).toFixed(3)}  
                         `}</Text>
                      </Text>
                    )}

                    <Progress
                      colorScheme="blue"
                      size="sm"
                      value={+supportThresholdStats[i]!.percentage}
                    />
                  </Box>
                )}

                <Flex
                  direction={"column"}
                  justifyContent={"start"}
                  alignItems={"center"}
                >
                  {votersOnProposal?.length > 0 ? (
                    votersOnProposal.filter((item) => item.committee == c)
                      .length === 0 ? (
                      <BoxWrapper className="w-full">
                        <Text color={"gray"}>No Item</Text>
                      </BoxWrapper>
                    ) : (
                      votersOnProposal
                        .filter((item) => item.committee == c)
                        .map(
                          ({
                            committee,
                            creationDate,
                            id,
                            option,
                            pluginProposalId,
                            txHash,
                            voter,
                            snapshotBlock,
                          }) => (
                            <BoxWrapper className="w-full" key={id}>
                              <Text>
                                {shortenAddress(voter)} -{" "}
                                <Text color={"blue"} as={"span"}>
                                  {convertCommitteeToPlainText(committee)}{" "}
                                </Text>
                              </Text>
                              <Text color={"gray"} as={"span"}>
                                {`@ ${snapshotBlock} - `}
                                <Text
                                  color={convertVoteOptionToItsColor(option)}
                                  as={"span"}
                                >
                                  {convertVoteOptionToText(option)}
                                </Text>
                              </Text>
                            </BoxWrapper>
                          )
                        )
                    )
                  ) : (
                    <BoxWrapper className="w-full">
                      <Text color={"gray"}>No Item</Text>
                    </BoxWrapper>
                  )}
                </Flex>
              </Flex>
            </VotersOnProposalWrapper>
          ))}
        </ProposalWrapper>
      )}
    </>
  );
};

export default ProposalDetails;
