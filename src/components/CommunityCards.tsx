import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, HStack, IconButton, Text, VStack } from "@chakra-ui/react";
import { useCommitteeUtils } from "../hooks/useCommitteeUtils";
import { useNavigate } from "react-router-dom";

import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
import useTotalNumberOfVoters from "../hooks/useTotalNumberOfVoters";

const CommunityCards = () => {
  const navigate = useNavigate();
  const { committeesListWithIcon } = useCommitteeUtils();
  const { mapCommitteeToTotalNumber } = useTotalNumberOfVoters();

  return (
    <HStack w={"full"} flexDirection={["column", "column", "column", "row"]}>
      {committeesListWithIcon.map(({ bgGradient, Icon, id, name, link }) => (
        // <Skeleton
        //   isLoaded={!mapCommitteeToTotalNumberLoadings(id) && !isLoading}
        //   w={["100%", "100%", "100%", "33%"]}
        // >
        <HStack
          key={id}
          boxShadow={"sm"}
          bgGradient={bgGradient}
          opacity={0.9}
          flexWrap={"wrap"}
          borderRadius={"md"}
          p={4}
          mb={4}
          w={["100%", "100%", "100%", "33%"]}
          borderColor={bgGradient}
          borderWidth={'thin'}
        >
          <Box w={"50px"} flexShrink={1}>
            {Icon && Icon}
          </Box>
          <VStack
            flexGrow="1"
            alignSelf={"stretch"}
            alignItems={"start"}
            color={"black"}
          >
            <Text fontSize={"sm"} fontWeight={"normal"}>
              Number of {name}
            </Text>
            <Text fontSize={"lg"} fontWeight={"bold"}>
              {mapCommitteeToTotalNumber(id)}
            </Text>
          </VStack>
          <IconButton
            aria-label=""
            variant={"unstyled"}
            icon={<ArrowForwardIcon color={"black"} />}
            onClick={() => {
              navigate(link);
            }}
          />
        </HStack>
        // </Skeleton>
      ))}
    </HStack>
  );
};

export default CommunityCards;
