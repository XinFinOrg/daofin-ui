import { Box, Flex, HStack, Text, VStack } from "@chakra-ui/layout";
import { Skeleton } from "@chakra-ui/skeleton";
import React, { FC, useMemo } from "react";
import { Link } from "react-router-dom";
import { DefaultBox } from "./Box";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import ProposalStatusBadge from "./Badge/ProposalStatusBadge";
import {
  dateNow,
  proposalTimeStatus,
  toDate,
  toStandardFormatString,
} from "../utils/date";
import { DefaultButton } from "./Button";
import { uuid } from "../utils/numbers";
import { ElectionPeriod } from "../hooks/useDaoElectionPeriods";
import { Modal } from ".";
import { useDisclosure } from "@chakra-ui/hooks";
import { Button } from "@chakra-ui/button";
import ProposalStatusStepper from "./ProposalStatusStepper";
import ProposalSessionStepper from "./ProposalSessionStepper";

type ElectionPeriodsProps = {
  isLoading: boolean;
  periods: ElectionPeriod[] | undefined;
};
const ElectionPeriods: FC<ElectionPeriodsProps> = ({ isLoading, periods }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const highlightedPeriod = useMemo(
    () =>
      periods
        ? periods.filter(
            ({ endDate, startDate }) => dateNow().getTime() < startDate
          )
        : [],
    [periods]
  );
  return (
    <>
      <HStack w={["full", "full"]} justifyContent={"space-between"} mb={2}>
        <Text fontWeight={"semibold"} fontSize={"lg"}>
          🗓 Voting Periods
        </Text>

        <DefaultButton variant={"link"} size={"sm"} onClick={onOpen}>
          View all <ArrowForwardIcon />
        </DefaultButton>
      </HStack>
      <Skeleton
        isLoaded={!isLoading}
        w={["full", "full"]}
        alignItems={"flex-start"}
      >
        {/* <VStack>
          {highlightedPeriod.length > 0 && (
            <>
              <ProposalSessionStepper

                endDate={highlightedPeriod[0].endDate }
                startDate={highlightedPeriod[0].startDate}
              />
            </>
          )}
        </VStack> */}
      </Skeleton>

      <Modal title="Voting Periods" isOpen={isOpen} onClose={onClose}>
        {periods?.map((period) => (
          <ElectionPeriodCard period={period} />
        ))}
      </Modal>
    </>
  );
};

export const ElectionPeriodCard: FC<{
  period: ElectionPeriod;
}> = ({ period }) => {
  const { endDate, id, startDate } = period;
  return (
    <DefaultBox key={uuid()} p={1} w="full" mb={1}>
      <Box>
        <ProposalStatusBadge
          variant={"subtle"}
          title={proposalTimeStatus(toDate(startDate), toDate(endDate))}
        />
      </Box>
      <Flex
        w={"full"}
        justifyContent="flex-start"
        alignItems={"center"}
        textAlign={"center"}
        mb={1}
        fontSize={["xs", "xs", "xs", "xs"]}
      >
        {/* <Text p={"1"}>{index + 1}- </Text> */}
        <HStack
          margin={"1"}
          p={"1"}
          maxW={"45%"}
          borderRadius="md"
          justifyContent={"flex-start"}
          flexDirection={["column", "column", "row"]}
        >
          <Text fontWeight={"semibold"}>
            {toStandardFormatString(toDate(startDate))}
          </Text>
        </HStack>
        <Box>
          <ArrowForwardIcon />
        </Box>
        <HStack
          margin={"1"}
          p={"1"}
          borderRadius="md"
          justifyContent={"center"}
          flexDirection={["column", "column", "row"]}
        >
          <Text fontWeight={"semibold"}>
            {toStandardFormatString(toDate(endDate))}
          </Text>
        </HStack>
      </Flex>
    </DefaultBox>
  );
};

export default ElectionPeriods;
