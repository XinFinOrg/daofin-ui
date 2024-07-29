import { Box, useColorModeValue } from "@chakra-ui/react";
import React, { FC, PropsWithChildren, useEffect } from "react";

const Page: FC<PropsWithChildren & { title?: string }> = ({
  children,
  title,
}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = title ? title : "XDCDAO";
  }, []);
  return (
    <Box h={"full"} w={"100%"}>
      <Box w={["100%", "100%","100%", "90%"]} p={"4"} m={"auto"}>
        {children}
      </Box>
    </Box>
  );
};

export default Page;
