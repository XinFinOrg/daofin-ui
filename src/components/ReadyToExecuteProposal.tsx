import { CheckCircleIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import React, { FC } from "react";
import { jsNumberForAddress } from "react-jazzicon";
import Jazzicon from "react-jazzicon/dist/Jazzicon";
import { timestampToStandardFormatString } from "../utils/date";
import { shortenAddress } from "../utils/networks";
import { WalletAuthorizedButton } from "./Button/AuthorizedButton";
import { Proposal } from "../utils/types";
import { v4 as uuid } from "uuid";
import { DefaultBox } from "./Box";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
export type ReadyToExecuteProposalType = Pick<
  Proposal,
  "createdAt" | "metadata" | "creationTxHash" | "pluginProposalId" | "creator"
>;

const ReadyToExecuteProposals: FC<{ data: ReadyToExecuteProposalType[] }> = ({
  data,
}) => {
  const { t } = useTranslation();
  return (
    <>
      {data.length > 0 ? (
        data
          .slice(-3)
          .map(
            ({
              creationTxHash,
              createdAt,
              creator,
              metadata,
              pluginProposalId,
            }) => (
              <ReadyToExecuteProposal
                key={uuid()}
                proposal={{
                  creationTxHash,
                  createdAt,
                  creator,
                  metadata,
                  pluginProposalId,
                }}
              />
            )
          )
      ) : (
        <DefaultBox borderStyle={"dashed"}>
          <VStack w={"100%"} alignItems="center" alignSelf={"center"} p={6}>
            <Text fontSize={"xs"} fontWeight={"500"} opacity={"0.5"}>
              {t("common.thereIsNoProposalYet")}
            </Text>
          </VStack>
        </DefaultBox>
      )}
    </>
  );
};

const ReadyToExecuteProposal: FC<{ proposal: ReadyToExecuteProposalType }> = ({
  proposal,
}) => {
  const { creationTxHash, createdAt, creator, metadata, pluginProposalId } =
    proposal;
  return (
    <DefaultBox w={"full"} mb={2}>
      <HStack justifyContent={"flex-start"}>
        <Box minW={"20px"}>
          <Jazzicon diameter={40} seed={jsNumberForAddress(creationTxHash)} />
        </Box>
        <VStack alignItems={"flex-start"}>
          <Text as={"h1"} fontSize={"sm"} fontWeight={"bold"}>
            {metadata.title}
          </Text>
          <HStack justifyContent={"space-between"}>
            <Text fontSize={"xs"}>
              <CheckCircleIcon color={"green"} mr={"1"} />
              {timestampToStandardFormatString(createdAt)}
            </Text>
            <Text fontSize={"xs"}>ID: {pluginProposalId}</Text>
            <Text fontSize={"xs"}>
              Published by: {shortenAddress(creator)} <ExternalLinkIcon />
            </Text>
          </HStack>
        </VStack>
        <Box flexGrow={1} textAlign={"end"}>
          <Link to={`/proposals/${pluginProposalId}/details`}>
            <WalletAuthorizedButton variant={"outline"} size={"sm"}>
              Execute Now
            </WalletAuthorizedButton>
          </Link>
        </Box>
      </HStack>
    </DefaultBox>
  );
};

export { ReadyToExecuteProposals };
