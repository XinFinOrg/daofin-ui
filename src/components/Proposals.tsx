import { FC, ReactElement, useEffect, useState } from "react";
import { Proposal, ProposalStatus } from "../utils/types";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { HStack, Skeleton } from "@chakra-ui/react";
import BaseTable from "./BaseTable";
import ProposalTypeBadge from "./ProposalTypeBadge";
import ProposalStatusBadge from "./ProposalStatusBadge";
import { InfoOutlineIcon, TimeIcon } from "@chakra-ui/icons";
import DefaultProgressBar from "./DefaultProgressBar";

import { Link, useNavigate } from "react-router-dom";
import Jazzicon from "react-jazzicon/dist/Jazzicon";
import { jsNumberForAddress } from "react-jazzicon";
import {
  proposalTimeStatus,
  toNormalDate,
  toStandardFormatString,
} from "../utils/date";
import useVoteStats from "../hooks/useVoteStats";

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
            }) => ({
              name: (
                <ProposalSummary
                  title={metadata.title}
                  proposalId={parseInt(pluginProposalId)}
                  type="Grant"
                  publishedDate={toNormalDate(createdAt)}
                  status={proposalTimeStatus(
                    toNormalDate(startDate),
                    toNormalDate(endDate)
                  )}
                  creatorAddress={creator}
                  startDate={toNormalDate(startDate)}
                  endDate={toNormalDate(endDate)}
                  creationTxHash={creationTxHash}
                />
              ),
              // threshold: (
              //   <CommitteesSupportThresholdVoteStatsProgressBar
              //     proposalId={pluginProposalId}
              //   />
              // ),
              // quorum: (
              //   <CommitteesMinParticipationVoteStatsProgressBar
              //     proposalId={pluginProposalId}
              //   />
              // ),
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
              w: "80%",
            },
            // {
            //   label: "Threshold",
            //   accessor: "threshold",
            //   w: "20%",
            // },
            // {
            //   label: "Quorum",
            //   accessor: "quorum",
            //   w: "20%",
            // },
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
  status: ProposalStatus;
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
  creationTxHash,
}) => {
  return (
    <HStack>
      <Box minW={"50px"}>
        <Jazzicon diameter={50} seed={jsNumberForAddress(creationTxHash)} />
      </Box>
      <Flex flexDirection={"column"}>
        <Text fontWeight={"semibold"}>
          <Link to={`/proposals/${proposalId}/details`}>{title}</Link>
        </Text>
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
          {/* <Box color={"orange"} fontSize={"sm"}>
            <TimeIcon display={"inline-block"} mr={"2"} />
            <Text display={"inline-block"}>
              {new Date(Date.now()) > startDate &&
                new Date(Date.now()) < endDate &&
                `Expired in ${expirationDistance(
                  new Date(Date.now()),
                  endDate
                )}`}
              {new Date(Date.now()) < startDate &&
                new Date(Date.now()) < endDate &&
                `Starts in ${expirationDistance(
                  new Date(Date.now()),
                  startDate
                )}`}

              {new Date(Date.now()) > startDate &&
                new Date(Date.now()) > endDate &&
                `Already Expired`}
            </Text>
          </Box> */}
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
