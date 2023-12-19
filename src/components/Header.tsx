import {
  Box,
  Flex,
  HStack,
  IconButton,
  useDisclosure,
  useColorModeValue,
  Stack,
  Text,
  Heading,
  Button,
  useColorMode,
  Switch,
  Icon,
  Container,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  SunIcon,
  MoonIcon,
  InfoIcon,
  BellIcon,
} from "@chakra-ui/icons";
import { Navigate } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
import WrongNetwork from "./WrongNetwork";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  DashboardIcon,
  CommunityIcon,
  TreasuryIcon,
  BlockIcon,
} from "../utils/assets/icons";
import { useBlockNumber } from "wagmi";
import { CHAIN_METADATA } from "../utils/networks";
import { useNetwork } from "../contexts/network";
import { useState } from "react";
import { XdcIcon } from "../utils/assets/icons/XdcIcon";
interface Props {
  children: React.ReactNode;
  href: string;
  asButton?: boolean;
}

const Links = [
  { location: "/", name: "Dashboard", icon: <DashboardIcon /> },
  { location: "/community", name: "Community", icon: <CommunityIcon /> },
  { location: "/treasury", name: "Treasury", icon: <TreasuryIcon /> },
];

export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const { network } = useNetwork();
  const { data } = useBlockNumber({
    watch: true,
    chainId: CHAIN_METADATA[network].id,
  });
  const handleSwitchTheme = () => {
    toggleColorMode();
  };
  const bgColorModeLinks = useColorModeValue("blue.100", "blue.800");
  return (
    <>
      <Flex
        py="1"
        px={"4"}
        justifyContent={"space-around"}
        bgColor={useColorModeValue("blue.50", "blue.800")}
      >
        <HStack>
          <Box mx={"4"}>
            {data ? (
              <a
                href={`${
                  CHAIN_METADATA[network].explorer
                }/blocks/${data.toString()}`}
                target={"_blank"}
              >
                <HStack>
                  <BlockIcon />

                  <Text fontWeight={"medium"}>{data.toString()}</Text>
                </HStack>
              </a>
            ) : (
              ""
            )}
          </Box>
          <Box mx={"4"}>
            <HStack>
              <XdcIcon />
              <Text fontWeight={"medium"}>$0.01</Text>
            </HStack>
          </Box>
        </HStack>
        <HStack>
          <Box mx={"4"}>
            <Text fontWeight="semibold">
              <a href={"https://xdc.dev"} target={"_blank"}>
                XDC.DEV
              </a>
            </Text>
          </Box>
          <Box mx={"4"}>
            <Text fontWeight="semibold">
              <a href={"https://docs.xdc.community"} target={"_blank"}>
                DOCS
              </a>
            </Text>
          </Box>
          <Box mx={"4"}>
            <Switch
              id="isChecked"
              isChecked={colorMode === "dark"}
              onChange={handleSwitchTheme}
              size={"lg"}
            />{" "}
            {/* <Button
              onClick={toggleColorMode}
              color={"darkcyan"}
              variant={"outline"}
            >
              {colorMode === "light" ? (
                <Icon as={SunIcon} />
              ) : (
                <Icon as={MoonIcon} />
              )}
            </Button> */}
          </Box>
        </HStack>
      </Flex>

      <Box px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-around"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Link to={""}>
              <Heading>DAOFIN</Heading>
            </Link>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map((link) => (
                <Box
                  fontSize={"md"}
                  fontWeight={"bold"}
                  px={3}
                  py={1}
                  borderRadius={"md"}
                  transition="background-color .1s ease-in-out"
                  _hover={{
                    bgColor: bgColorModeLinks,
                  }}
                >
                  <Link
                    to={link.location}

                    // className="border-1 py-2 pl-3 pr-4 font-bold hover:text-blue-600 ease-in-out duration-300"
                  >
                    <HStack>
                      <>{link.icon}</>
                      <Text>{link.name}</Text>
                    </HStack>
                  </Link>
                </Box>
              ))}
            </HStack>
          </HStack>
          <HStack>
            <IconButton
              aria-label="FAQ"
              isRound
              icon={<InfoIcon />}
              bg="trasparent"
            />
            <IconButton
              aria-label="Search database"
              isRound
              icon={<BellIcon />}
              bg="trasparent"
            />

            {/* <Web3Button balance='show' icon="hide"/> */}
            <ConnectButton chainStatus="icon" />
          </HStack>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <Link to={link.location}>{link.name}</Link>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
      <WrongNetwork />
    </>
  );
}
