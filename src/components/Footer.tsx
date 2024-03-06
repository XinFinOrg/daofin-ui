import { SunIcon } from "@chakra-ui/icons";
import { Box, Flex, Icon, Image, Text, createIcon } from "@chakra-ui/react";

import XdcCoinLogo from "../utils/assets/xdc-coin.svg";
const Footer = () => {
  return (
    <Box w={'full'} m={'full'}>
      <Flex justifyContent={"center"}>
        <a href="https://xinfin.org" target="_blank">
          <Flex>
            <Image w={5} h={5} src="/xdc-coin.svg" />
            <Box p={1}></Box>
            <Text fontWeight={"bold"}>Powered by XDC Network</Text>
          </Flex>
        </a>
      </Flex>
    </Box>
  );
};

export default Footer;
