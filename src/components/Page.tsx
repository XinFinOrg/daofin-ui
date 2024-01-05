import { Box, useColorModeValue } from "@chakra-ui/react";
import React, { FC, PropsWithChildren } from "react";
import Header from "./Header";
import Footer from "./Footer";

const Page: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Box
      h={"full"}
    >
      <Box w={"90%"} p={"4"} m={"auto"}>
        {children}
      </Box>
    </Box>
  );
};

export default Page;
