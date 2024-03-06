import { Text, VStack } from "@chakra-ui/react";
import { FC } from "react";
import { DefaultButton } from "../Button";
import { Link } from "react-router-dom";

const BecomeVoterModalContent: FC<{ callbackFunction: () => void }> = () => {
  return (
    <VStack>
      <Text>Do you want to become a voter?</Text>

      <Link to={"/community"} target="_blank">
        <DefaultButton> Go to Community page</DefaultButton>
      </Link>
    </VStack>
  );
};

export default BecomeVoterModalContent;
