import {
  Box,
  Flex,
  HStack,
  IconButton,
  useDisclosure,
  useColorModeValue,
  Stack,
  Text,
  useColorMode,
  Image,
  Divider,
  Switch,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
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
import { useMemo } from "react";
import { XdcIcon } from "../utils/assets/icons/XdcIcon";
import { DefaultBox } from "./Box";
import { useGlobalState } from "../contexts/GlobalStateContext";
import { uuid } from "../utils/numbers";

interface Props {
  children: React.ReactNode;
  href: string;
  asButton?: boolean;
}

// const Links = ;

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
  const Links = useMemo(
    () => [
      { location: "/", name: "Dashboard", icon: <DashboardIcon /> },
      { location: "/community", name: "Community", icon: <CommunityIcon /> },
      { location: "/treasury", name: "Treasury", icon: <TreasuryIcon /> },
    ],
    []
  );
  const tokenPrice = useGlobalState().xdcPrice;
  const bgColorModeLinks = useColorModeValue("blue.100", "blue.800");

  return (
    <>
      <DefaultBox
        w={["0", "0", "100%"]}
        py={["0", "0", "1"]}
        px={["0", "0", "4"]}
        overflowX={["hidden", "hidden", "visible"]}
        overflowY={["hidden", "hidden", "visible"]}
        borderEndRadius={0}
        borderStartRadius={0}
      >
        <Box w={["0", "0", "90%"]} margin={"auto"}>
          <Flex justifyContent={"space-between"}>
            <HStack>
              <Box mr={"4"}>
                {data ? (
                  <a
                    href={`${
                      CHAIN_METADATA[network].explorer
                    }/blocks/${data.toString()}`}
                    target={"_blank"}
                  >
                    <HStack>
                      <BlockIcon w={"20px"} />

                      <Text fontWeight={"medium"}>{data.toString()}</Text>
                    </HStack>
                  </a>
                ) : (
                  ""
                )}
              </Box>
              <Box mx={"4"}>
                <HStack>
                  <Box w={"25px"}>
                    <XdcIcon />
                  </Box>
                  <Text fontWeight={"medium"}>${tokenPrice.toFixed(4)}</Text>
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
                  <a href={"https://docs.xdc.community/daofin"} target={"_blank"}>
                    DOCS
                  </a>
                </Text>
              </Box>
              <Box ml={"4"}>
                <Switch
                  isChecked={colorMode === "dark"}
                  onChange={handleSwitchTheme}
                  size="lg"
                />
                {/* <Box position="relative" display="inline-block">
                  <Box
                    position="absolute"
                    top="50%"
                    left={colorMode === "dark" ? "30%" : "70%"}
                    transform="translate(-50%, -50%)"
                    pointerEvents="none"
                  >
                    {colorMode === "dark" ? <MoonIcon /> : <SunIcon />}
                  </Box>
                </Box> */}
                {/* <IconButton
                    aria-label=""
                    onClick={handleSwitchTheme}
                    variant={'ghost'}
                    icon={colorMode === "dark" ? <MoonIcon /> : <SunIcon />}
                  /> */}
              </Box>
            </HStack>
          </Flex>
        </Box>
      </DefaultBox>
      <Box w={"100%"}>
        <Box px={4} w={["full", null, "90%"]} m={"auto"}>
          <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
            <IconButton
              size={"md"}
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              aria-label={"Open Menu"}
              display={{ md: "none" }}
              onClick={isOpen ? onClose : onOpen}
            />
            <HStack spacing={8} alignItems={"center"}>
              <Box ml={[0, 0, 0, "auto"]}>
                <Link to={""}>
                  {/* <Image src="/logo.svg" /> */}
                  <img src="/new-logo.png" alt="" width={"250px"} />
                </Link>
              </Box>
              <HStack
                as={"nav"}
                spacing={4}
                display={{ base: "none", md: "flex" }}
              >
                {Links.map((link) => (
                  <Link to={link.location} key={uuid()}>
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
                      <HStack alignItems={"center"}>
                        <>{link.icon}</>
                        <Text>{link.name}</Text>
                      </HStack>
                    </Box>
                  </Link>
                ))}
              </HStack>
            </HStack>
            <HStack
              visibility={["hidden", "visible"]}
              overflow={["hidden", "visible"]}
            >
              <ConnectButton chainStatus="icon" />
            </HStack>
          </Flex>
          <Divider m={"auto"} w={"full"} />
          {isOpen ? (
            <Box pb={4} display={{ md: "none" }}>
              <Stack as={"nav"} spacing={4} mb={"4"}>
                {Links.map((link) => (
                  <Link
                    key={uuid()}
                    to={link.location}
                    onClick={() => onClose()}
                  >
                    <Text fontWeight={"semibold"}>{link.name}</Text>
                  </Link>
                ))}
              </Stack>

              <Switch
                id="isChecked"
                isChecked={colorMode === "dark"}
                onChange={handleSwitchTheme}
                size={"lg"}
                mb={4}
              />
              <ConnectButton chainStatus="icon" />
            </Box>
          ) : null}
        </Box>
      </Box>
    </>
  );
}
