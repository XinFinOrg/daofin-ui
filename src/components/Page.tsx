import { Box, useColorModeValue } from "@chakra-ui/react";
import React, { FC, PropsWithChildren, useEffect } from "react";

const Page: FC<PropsWithChildren> = ({ children }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <Box h={"full"} w={"100%"}>
      <Box w={["full", "full", "90%"]} p={"4"} m={"auto"}>
        {children}
      </Box>
    </Box>
  );
};

export default Page;
