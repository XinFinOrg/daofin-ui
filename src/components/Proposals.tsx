import { DaoAction } from "@xinfin/osx-client-common";
import React, { ComponentType, FC, useEffect, useRef } from "react";
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
import { TimeIcon } from "@chakra-ui/icons";
import VoteStatProgressBar from "./VoteStatProgressBar";
import MasterNodeDelegateeSenateIcon from "../utils/assets/icons/MasterNodeDelegateeSenateIcon";
import JudiciariesIcon from "../utils/assets/icons/JudiciariesIcon";
import PeopleHouseIcon from "../utils/assets/icons/PeopleHouseIcon";
const jazzicon = require("@metamask/jazzicon");

const Proposals: FC<{ proposals?: Proposal[] }> = ({ proposals }) => {
  return (
    <>
      <BaseTable
        data={new Array(5).fill(5).map((_) => ({
          name: (
            <ProposalSummary
              title="Lorem ipsum dolor sit amet consectetur ellus adipiscing"
              proposalId={12}
              type="Grant"
              publishedDate={new Date()}
              status="Open to vote"
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
          action: <Button variant={"outline"}>Vote</Button>,
        }))}
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
    </>
  );
};

interface ProposalSummaryProps {
  title: string;
  type: string;
  publishedDate: Date;
  proposalId: number;
  status: string;
}
const ProposalSummary: FC<ProposalSummaryProps> = ({
  title,
  type,
  publishedDate,
  proposalId,
  status,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current && !ref.current.hasChildNodes()) {
      ref.current.appendChild(jazzicon(40, Math.round(Math.random() * 1000)));
    }
  }, []);
  return (
    <HStack>
      <Box ref={ref} mr={"2"} />
      <Flex flexDirection={"column"}>
        <Text fontWeight={"semibold"}>{title}</Text>
        <HStack fontSize={"sm"} my={"2"}>
          <Text>At: {publishedDate.toISOString()}</Text>
          <Text>ID: {proposalId}</Text>
        </HStack>
        <HStack alignItems={"center"}>
          <ProposalTypeBadge title={type} />
          <ProposalStatusBadge title={status} />
          <Box color={"orange"}  fontSize={"sm"}>
            <TimeIcon display={"inline-block"} mr={"2"} />
            <Text display={"inline-block"}>Expired in 3h 34m </Text>
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
