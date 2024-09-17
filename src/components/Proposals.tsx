import { FC, ReactElement, useEffect, useState } from "react";
import { Proposal, ProposalStatus } from "../utils/types";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { HStack, Skeleton } from "@chakra-ui/react";
import BaseTable from "./BaseTable";
import ProposalTypeBadge from "./Badge/ProposalTypeBadge";
import ProposalStatusBadge from "./Badge/ProposalStatusBadge";
import { InfoOutlineIcon, TimeIcon } from "@chakra-ui/icons";
import DefaultProgressBar from "./DefaultProgressBar";

import { Link, useNavigate } from "react-router-dom";
import Jazzicon from "react-jazzicon/dist/Jazzicon";
import { jsNumberForAddress } from "react-jazzicon";
import {
  proposalStatus,
  proposalTimeStatus,
  toNormalDate,
  toStandardFormatString,
} from "../utils/date";
import useVoteStats from "../hooks/useVoteStats";
import { useCommitteeUtils } from "../hooks/useCommitteeUtils";
import { useTranslation } from "react-i18next";

const Proposals: FC<{ proposals: Proposal[] }> = ({ proposals }) => {
  const navigate = useNavigate();
  const { committeesListWithIcon } = useCommitteeUtils();
  const { t } = useTranslation();
  return (
    <>
      {
        <BaseTable
          emptyText={t("common.thereIsNoProposalYet")}
          data={proposals?.map(
            ({
              metadata,
              pluginProposalId,
              createdAt,
              creator,
              endDate,
              startDate,
              creationTxHash,
              tallyDetails,
              executed,
              proposalType,
              canExecute,
            }) => ({
              name: (
                <ProposalSummary
                  title={metadata.title}
                  proposalId={parseInt(pluginProposalId)}
                  type={proposalType.proposalTypeId}
                  publishedDate={toNormalDate(createdAt)}
                  status={proposalStatus(
                    toNormalDate(startDate),
                    toNormalDate(endDate),
                    executed,
                    canExecute
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
              //     data={tallyDetails.map(
              //       ({
              //         passrateRequiredVote,
              //         passrateActiveVote,
              //         committee,
              //       }) => ({
              //         percentage: +passrateActiveVote as number,
              //         threshold: +passrateRequiredVote as number,
              //         Icon: committeesListWithIcon.find(
              //           ({ id }) => id === committee
              //         )?.Icon as ReactElement,
              //       })
              //     )}
              //   />
              // ),
              // quorum: (
              //   <CommitteesMinParticipationVoteStatsProgressBar
              //     proposalId={pluginProposalId}
              //     data={tallyDetails.map(
              //       ({
              //         quorumRequiredVote,
              //         quorumActiveVote,
              //         totalMembers,
              //         committee,
              //       }) => ({
              //         percentage: +quorumActiveVote as number,
              //         threshold: +quorumRequiredVote as number,
              //         Icon: committeesListWithIcon.find(
              //           ({ id }) => id === committee
              //         )?.Icon as ReactElement,
              //       })
              //     )}
              //   />
              // ),
              action: (
                <Button
                  variant={"outline"}
                  onClick={() =>
                    navigate(`/proposals/${parseInt(pluginProposalId)}/details`)
                  }
                >
                  {t('common.view')}
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
          <ProposalTypeBadge id={type} />
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
> = ({ data }) => {
  return (
    <Box>
      {data && data?.length > 0 ? (
        data.map(({ Icon, percentage, threshold }) => (
          <Box mb={1}>
            <DefaultProgressBar
              percentage={percentage ? +percentage : 0}
              threshold={threshold ? +threshold : 0}
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
> = ({ data }) => {
  return (
    <Box>
      {data && data?.length > 0 ? (
        data.map(({ Icon, percentage, threshold }) => (
          <Box mb={1}>
            <DefaultProgressBar
              percentage={percentage ? +percentage : 0}
              threshold={threshold ? +threshold : 0}
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
