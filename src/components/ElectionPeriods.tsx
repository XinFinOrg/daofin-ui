import { Box, Flex, HStack, Text, VStack } from "@chakra-ui/layout";
import { Skeleton } from "@chakra-ui/skeleton";
import React, { FC } from "react";
import { Link } from "react-router-dom";
import { DefaultBox } from "./Box";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import ProposalStatusBadge from "./Badge/ProposalStatusBadge";
import {
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

type ElectionPeriodsProps = {
  isLoading: boolean;
  periods: ElectionPeriod[] | undefined;
};
const ElectionPeriods: FC<ElectionPeriodsProps> = ({ isLoading, periods }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <>
      <HStack
        w={["full", "full",]}
        justifyContent={"space-between"}
        mb={2}
      >
        <Text fontWeight={"semibold"} fontSize={"lg"}>
          Election Periods
        </Text>

        <DefaultButton variant={"link"} size={"sm"} onClick={onOpen}>
          View all <ArrowForwardIcon />
        </DefaultButton>
      </HStack>
      <Skeleton
        isLoaded={!isLoading}
        w={["full", "full",]}
        alignItems={"flex-start"}
      >
        <VStack>
          {periods?.map((period, index) => (
            <ElectionPeriodCard period={period} index={index} />
          ))}
        </VStack>
      </Skeleton>

      <Modal title="Election Periods" isOpen={isOpen} onClose={onClose}>
        {periods?.map((period, index) => (
          <ElectionPeriodCard period={period} index={index} />
        ))}
      </Modal>
    </>
  );
};

export const ElectionPeriodCard: FC<{
  period: ElectionPeriod;
  index: number;
}> = ({ index, period }) => {
  const { endDate, id, startDate } = period;
  return (
    <DefaultBox key={uuid()} p={2} w="full" mb={1}>
      <Flex
        w={"full"}
        justifyContent="flex-start"
        alignItems={"center"}
        textAlign={"center"}
        mb={1}
        fontSize={["xs", "xs", "xs", "sm"]}
      >
        <Text p={"1"}>{index + 1}- </Text>
        <HStack
          margin={"1"}
          p={"1"}
          maxW={"40%"}
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
        <Box>
          <ProposalStatusBadge
            variant={"subtle"}
            title={proposalTimeStatus(toDate(startDate), toDate(endDate))}
          />
        </Box>
      </Flex>
    </DefaultBox>
  );
};

export default ElectionPeriods;
