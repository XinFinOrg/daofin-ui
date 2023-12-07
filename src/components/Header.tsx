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
} from "../utils/assets/icons";
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

  return (
    <>
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
                <Link
                  to={link.location}
                  className="border-1 py-2 pl-3 pr-4 font-bold hover:text-blue-600 ease-in-out duration-300"
                >
                  <HStack>
                    <>{link.icon}</>
                    <Text>{link.name}</Text>
                  </HStack>
                </Link>
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

            <Button
              onClick={toggleColorMode}
              color={"darkcyan"}
              variant={"outline"}
            >
              {colorMode === "light" ? (
                <Icon as={SunIcon} />
              ) : (
                <Icon as={MoonIcon} />
              )}
            </Button>
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
