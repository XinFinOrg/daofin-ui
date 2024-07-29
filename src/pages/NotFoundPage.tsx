
import { Page } from "../components";
import { DefaultBox } from "../components/Box";
import { Box, Image, Text, VStack } from "@chakra-ui/react";
import { NoProposalIcon } from "../utils/assets/icons/NoProposalIcon";
import { DefaultButton } from "../components/Button";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <Page>
      <DefaultBox w={"full"} m={"auto"}>
        <VStack>
          <NoProposalIcon />
          <Text>Not Found {":)"}</Text>
          <Link to={"/"}>
            <DefaultButton variant={'outline'}>Dashboard</DefaultButton>
          </Link>
        </VStack>
      </DefaultBox>
    </Page>
  );
};

export default NotFoundPage;
