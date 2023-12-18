import { Box, useColorModeValue } from "@chakra-ui/react";
import React, { FC, PropsWithChildren } from "react";
import Header from "./Header";
import Footer from "./Footer";

const Page: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Box
      // bgGradient={useColorModeValue(
      //   "linear(to-b, #D9EDF7, #BFE1F2)",
      //   "linear(to-b, #001018, #BFE1F2)"
      // )}
      h={"full"}
    >
      <Header />
      <Box className="m-4 w-100">{children}</Box>
      <Box p={5}>
        <Footer />
      </Box>
    </Box>
  );
};

export default Page;
