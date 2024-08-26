import { SunIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Icon,
  Image,
  Text,
  createIcon,
  useColorMode,
} from "@chakra-ui/react";

import XdcCoinLogo from "../utils/assets/xdc-coin.svg";
import { DefaultBox } from "./Box";
import { Link } from "react-router-dom";
const Footer = () => {
  const { colorMode } = useColorMode();
  return (
    <DefaultBox
      w={"full"}
      position={"absolute"}
      right={0}
      py={2}
      bottom={0}
      borderRadius={0}
    >
      <Flex justifyContent={"center"}>
        <a href="https://xinfin.org" target="_blank">
          <Flex>
            {colorMode === "light" ? (
              <Image w={5} h={5} src="/xdc-coin.svg" />
            ) : (
              <Image w={5} h={5} src="/xdc-coin.svg" />
            )}

            <Box p={1}></Box>
            <Text fontWeight={"bold"}>Powered by XDC Network</Text>
          </Flex>
        </a>
      </Flex>
    </DefaultBox>
  );
};

export default Footer;
