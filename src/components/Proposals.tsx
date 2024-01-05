import { DaoAction } from "@xinfin/osx-client-common";
import React, {
  ComponentType,
  FC,
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useDaoProposals from "../hooks/useDaoProposals";
import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
import { Proposal } from "../utils/types";
import { Box, Flex, Heading, Text } from "@chakra-ui/layout";
import { shortenAddress } from "../utils/networks";
import { styled } from "styled-components";
import { Button } from "@chakra-ui/button";
import {
  HStack,
  VStack,
  Badge,
  Image,
  Skeleton,
  CircularProgress,
  Progress,
} from "@chakra-ui/react";
import BaseTable from "./BaseTable";
import ProposalTypeBadge from "./ProposalTypeBadge";
import ProposalStatusBadge from "./ProposalStatusBadge";
import { InfoIcon, InfoOutlineIcon, TimeIcon } from "@chakra-ui/icons";
import DefaultProgressBar from "./DefaultProgressBar";
import MasterNodeDelegateeSenateIcon from "../utils/assets/icons/MasterNodeDelegateeSenateIcon";
import JudiciariesIcon from "../utils/assets/icons/JudiciariesIcon";
import PeopleHouseIcon from "../utils/assets/icons/PeopleHouseIcon";
import { useNavigate } from "react-router-dom";
import Jazzicon from "react-jazzicon/dist/Jazzicon";
import { jsNumberForAddress } from "react-jazzicon";
import { zeroAddress } from "viem";
import {
  expirationDistance,
  toNormalDate,
  toStandardFormatString,
  toStandardTimestamp,
} from "../utils/date";
import { IoIdCardOutline } from "react-icons/io5";
import { NoProposalIcon } from "../utils/assets/icons/NoProposalIcon";
import { EmptyBoxIcon } from "../utils/assets/icons/EmptyBoxIcon";
import useVoteStats from "../hooks/useVoteStats";
const jazzicon = require("@metamask/jazzicon");

const Proposals: FC<{ proposals: Proposal[] }> = ({ proposals }) => {
  const navigate = useNavigate();

  return (
    <>
      {
        <BaseTable
          emptyText={"There is no proposal yet. Be the first to make change"}
          data={proposals?.map(
            ({
              metadata,
              pluginProposalId,
              createdAt,
              creator,
              endDate,
              startDate,
              creationTxHash,
              committeesVotes,
            }) => ({
              name: (
                <ProposalSummary
                  title={metadata.title}
                  proposalId={parseInt(pluginProposalId)}
                  type="Grant"
                  publishedDate={toNormalDate(createdAt)}
                  status="Open to vote"
                  creatorAddress={creator}
                  startDate={toNormalDate(startDate)}
                  endDate={toNormalDate(endDate)}
                  creationTxHash={creationTxHash}
                />
              ),
              threshold: (
                <CommitteesSupportThresholdVoteStatsProgressBar
                  proposalId={pluginProposalId}
                  // data={committeesVotes?.map(({ supportThreshold, Icon }) => ({
                  //   threshold: supportThreshold?.supportThresholdPercentage
                  //     ? +supportThreshold?.supportThresholdPercentage
                  //     : 0,
                  //   Icon: Icon ? Icon : <></>,
                  //   percentage: supportThreshold?.numberOfVotesPercentage
                  //     ? +supportThreshold?.numberOfVotesPercentage
                  //     : 0,
                  // }))}
                />
              ),
              quorum: (
                <CommitteesMinParticipationVoteStatsProgressBar
                  proposalId={pluginProposalId}
                  // data={committeesVotes?.map(({ minParticipation, Icon }) => ({
                  //   threshold: minParticipation?.minParticipationPercentage
                  //     ? +minParticipation?.minParticipationPercentage
                  //     : 0,
                  //   Icon: Icon ? Icon : <></>,
                  //   percentage: minParticipation?.numberOfVotesPercentage
                  //     ? +minParticipation?.numberOfVotesPercentage
                  //     : 0,
                  // }))}
                />
              ),
              action: (
                <Button
                  variant={"outline"}
                  onClick={() =>
                    navigate(`/proposals/${parseInt(pluginProposalId)}/details`)
                  }
                >
                  Vote
                </Button>
              ),
            })
          )}
          columns={[
            {
              label: "Proposals",
              accessor: "name",
              w: "40%",
            },
            {
              label: "Threshold",
              accessor: "threshold",
            },
            {
              label: "Quorum",
              accessor: "quorum",
            },
            {
              label: "",
              accessor: "action",
              type: "btn",
            },
          ]}
        />
      }
    </>
  );
};

interface ProposalSummaryProps {
  title: string;
  type: string;
  publishedDate: Date;
  proposalId: number;
  status: string;
  creatorAddress: string;
  creationTxHash: string;
  startDate: Date;
  endDate: Date;
}
const ProposalSummary: FC<ProposalSummaryProps> = ({
  title,
  type,
  publishedDate,
  proposalId,
  status,
  creatorAddress,
  startDate,
  endDate,
  creationTxHash,
}) => {
  return (
    <HStack>
      <Box minW={"50px"}>
        <Jazzicon diameter={50} seed={jsNumberForAddress(creationTxHash)} />
      </Box>
      <Flex flexDirection={"column"}>
        <Text fontWeight={"semibold"}>{title}</Text>
        <HStack fontSize={"sm"} my={"2"}>
          <Text>
            <TimeIcon /> {toStandardFormatString(publishedDate)}
          </Text>
          <Text>
            <InfoOutlineIcon mr={1} />
            ID: {proposalId}
          </Text>
        </HStack>
        <HStack alignItems={"center"}>
          <ProposalTypeBadge title={type} />
          <ProposalStatusBadge title={status} />
          <Box color={"orange"} fontSize={"sm"}>
            <TimeIcon display={"inline-block"} mr={"2"} />
            <Text display={"inline-block"}>
              Expired in {expirationDistance(new Date(), endDate)}{" "}
            </Text>
          </Box>
        </HStack>
      </Flex>
    </HStack>
  );
};

interface CommitteesVoteStatsProgressBarsProps {
  proposalId: string;
  data?: {
    percentage: number;
    threshold: number;
    Icon: ReactElement;
  }[];
}
const CommitteesMinParticipationVoteStatsProgressBar: FC<
  CommitteesVoteStatsProgressBarsProps
> = ({ data, proposalId }) => {
  const stats = useVoteStats(proposalId);
  const [isFetched, setIsFetched] = useState(false);
  useEffect(() => {
    if (
      stats.length > 0 &&
      stats.filter(
        ({ minParticipation, supportThreshold }) =>
          minParticipation !== undefined && supportThreshold !== undefined
      ).length > 0
    ) {
      setIsFetched(true);
    }
  }, [stats]);
  return (
    <Box>
      {stats?.length > 0 && isFetched ? (
        stats.map(({ minParticipation, Icon }) => (
          <Box mb={1}>
            <DefaultProgressBar
              percentage={
                minParticipation?.numberOfVotesPercentage
                  ? +minParticipation?.numberOfVotesPercentage
                  : 0
              }
              threshold={
                minParticipation?.minParticipationPercentage
                  ? +minParticipation?.minParticipationPercentage
                  : 0
              }
              Icon={Icon}
            />
          </Box>
        ))
      ) : (
        <ThreeLineSkeleton />
      )}
    </Box>
  );
};
const CommitteesSupportThresholdVoteStatsProgressBar: FC<
  CommitteesVoteStatsProgressBarsProps
> = ({ data, proposalId }) => {
  const stats = useVoteStats(proposalId);
  const [isFetched, setIsFetched] = useState(false);
  useEffect(() => {
    if (
      stats.length > 0 &&
      stats.filter(
        ({ minParticipation, supportThreshold }) =>
          minParticipation !== undefined && supportThreshold !== undefined
      ).length > 0
    ) {
      setIsFetched(true);
    }
  }, [stats]);
  return (
    <Box>
      {stats?.length > 0 && isFetched ? (
        stats.map(({ supportThreshold, Icon }) => (
          <Box mb={1}>
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
              Icon={Icon}
            />
          </Box>
        ))
      ) : (
        <ThreeLineSkeleton />
      )}
    </Box>
  );
};

const ThreeLineSkeleton = () => {
  return (
    <Box>
      <Skeleton height="15px" mb={"1"} />
      <Skeleton height="15px" mb={"1"} />
      <Skeleton height="15px" mb={"1"} />
    </Box>
  );
};
export default Proposals;
