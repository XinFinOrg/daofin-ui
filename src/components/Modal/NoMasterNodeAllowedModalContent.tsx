import { Text, VStack } from "@chakra-ui/react";
import { FC } from "react";
import { DefaultButton } from "../Button";
import { Link } from "react-router-dom";

const NoMasterNodeAllowedModalContent: FC<{
  callbackFunction?: () => void;
}> = () => {
  return (
    <VStack>
      <Text>Do you want to become a Master Node Deletegatee Senate?</Text>

      <Link to={"/community/senate"} target="_blank">
        <DefaultButton> Go to the Senate page</DefaultButton>
      </Link>
    </VStack>
  );
};

export default NoMasterNodeAllowedModalContent;
