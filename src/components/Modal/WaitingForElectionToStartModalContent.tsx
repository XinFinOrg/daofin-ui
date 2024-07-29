import { Text, VStack } from "@chakra-ui/react";
import { FC } from "react";
import { DefaultButton } from "../Button";
import { appFormatDistance, toDate } from "../../utils/date";

const WaitingForElectionToStartModalContent: FC<{
  startDate: number;
  callbackFunction?: () => void;
}> = ({ startDate, callbackFunction }) => {
  console.log({ now: toDate(Date.now()), startDate: toDate(startDate / 1000) });

  return (
    <VStack>
      <Text>
        The remaining time is:{" "}
        {appFormatDistance(toDate(Date.now()), toDate(startDate / 1000))}
      </Text>
      <DefaultButton onClick={callbackFunction}> Keep waiting..</DefaultButton>
    </VStack>
  );
};

export default WaitingForElectionToStartModalContent;
