import { DaoAction } from "@xinfin/osx-client-common";
import React, { ComponentType, FC, useEffect, useMemo, useRef } from "react";
import useDaoProposals from "../hooks/useDaoProposals";
import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
import { Proposal } from "../utils/types";
import { Box, Flex, Heading, Text } from "@chakra-ui/layout";
import { shortenAddress } from "../utils/networks";
import { styled } from "styled-components";
import { Button } from "@chakra-ui/button";
import { HStack, VStack, Badge, Image } from "@chakra-ui/react";
import BaseTable from "./BaseTable";
import ProposalTypeBadge from "./ProposalTypeBadge";
import ProposalStatusBadge from "./ProposalStatusBadge";
import { InfoIcon, InfoOutlineIcon, TimeIcon } from "@chakra-ui/icons";
import VoteStatProgressBar from "./VoteStatProgressBar";
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
const jazzicon = require("@metamask/jazzicon");

const Proposals: FC<{ proposals: Proposal[] }> = ({ proposals }) => {
  const navigate = useNavigate();
  const date = useMemo(() => new Date(), []);
  console.log("proposals", proposals.slice(2));

  return (
    <>
      {proposals.length > 0 && (
        <BaseTable
          data={proposals.map(
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
                  status="Open to vote"
                  creatorAddress={creator}
                  startDate={toNormalDate(startDate)}
                  endDate={toNormalDate(endDate)}
                  creationTxHash={creationTxHash}
                />
              ),
              threshold: (
                <CommitteesVoteStatsProgressBar
                  data={[
                    {
                      threshold: 23,
                      Icon: MasterNodeDelegateeSenateIcon,
                      percentage: 40,
                    },
                    {
                      threshold: 23,
                      Icon: JudiciariesIcon,
                      percentage: 40,
                    },
                    {
                      threshold: 50,
                      Icon: PeopleHouseIcon,
                      percentage: 10,
                    },
                  ]}
                />
              ),
              quorum: (
                <CommitteesVoteStatsProgressBar
                  data={[
                    {
                      threshold: 23,
                      Icon: MasterNodeDelegateeSenateIcon,
                      percentage: 40,
                    },
                    {
                      threshold: 23,
                      Icon: JudiciariesIcon,
                      percentage: 40,
                    },
                    {
                      threshold: 50,
                      Icon: PeopleHouseIcon,
                      percentage: 100,
                    },
                  ]}
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
              w: "50%",
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
            },
          ]}
        />
      )}
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
  creationTxHash
}) => {
  return (
    <HStack>
      <Jazzicon diameter={50} seed={jsNumberForAddress(creationTxHash)} />
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
              Expired in {expirationDistance(startDate, endDate)}{" "}
            </Text>
          </Box>
        </HStack>
      </Flex>
    </HStack>
  );
};

interface CommitteesVoteStatsProgressBarsProps {
  data: {
    percentage: number;
    threshold: number;
    Icon: ComponentType;
  }[];
}
const CommitteesVoteStatsProgressBar: FC<
  CommitteesVoteStatsProgressBarsProps
> = ({ data }) => {
  return (
    <Box>
      {data.length > 0 &&
        data.map(({ percentage, threshold, Icon }) => (
          <Box mb={1}>
            <VoteStatProgressBar
              percentage={percentage}
              threshold={threshold}
              Icon={Icon}
            />
          </Box>
        ))}
    </Box>
  );
};
export default Proposals;
