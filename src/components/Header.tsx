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
  useTheme,
  Select,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  MoonIcon,
  SunIcon,
  InfoIcon,
  WarningIcon,
} from "@chakra-ui/icons";
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
import { langs, useGlobalState } from "../contexts/GlobalStateContext";
import { uuid } from "../utils/numbers";
import { LangType } from "../contexts/GlobalStateContext";
import { useTranslation } from "react-i18next";
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
  const { switchLanguage } = useGlobalState();
  const bgColorModeLinks = useColorModeValue("blue.100", "blue.800");
  const { t } = useTranslation();
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

                      <Text fontWeight={"medium"} fontSize={"sm"}>
                        {data.toString()}
                      </Text>
                    </HStack>
                  </a>
                ) : (
                  ""
                )}
              </Box>
              <Box mx={"4"}>
                <HStack>
                  <Box w={"20px"}>
                    {colorMode === "light" ? (
                      <Image w={5} h={5} src="/xdc-coin.svg" />
                    ) : (
                      <Image w={5} h={5} src="/xdc-coin-dark.svg" />
                    )}
                    {/* <XdcIcon /> */}
                  </Box>
                  <Text fontWeight={"medium"} fontSize={"sm"}>
                    ${tokenPrice.toFixed(4)}
                  </Text>
                </HStack>
              </Box>
            </HStack>
            <HStack>
              <Box mx={"4"}>
                <Text fontWeight="semibold" fontSize={"sm"}>
                  <a href={"https://forum.xinfin.org/"} target={"_blank"}>
                    {t("header.forum")}
                  </a>
                </Text>
              </Box>
              <Box mx={"4"}>
                <Text fontWeight="semibold" fontSize={"sm"}>
                  <a
                    href={"https://docs.xdc.community/daofin"}
                    target={"_blank"}
                  >
                    {t("header.docs")}
                  </a>
                </Text>
              </Box>
              <Box>
                <Select
                  size={"sm"}
                  variant="unstyled"
                  onChange={(e) => {
                    switchLanguage(e.target.value);
                  }}
                >
                  {langs.map((lang) => (
                    <option value={lang}>{lang.toUpperCase()}</option>
                  ))}
                </Select>
              </Box>
              <Box ml={"4"}>
                <Switch
                  isChecked={colorMode === "dark"}
                  onChange={handleSwitchTheme}
                  size="md"
                />
              </Box>
            </HStack>
          </Flex>
        </Box>
      </DefaultBox>
      <Box w={"100%"}>
        <Box px={4} w={["full", null, "90%"]} m={"auto"}>
          <Flex
            h={16}
            py={2}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <IconButton
              size={"md"}
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              aria-label={"Open Menu"}
              display={{ md: "none" }}
              mr={"4"}
              onClick={isOpen ? onClose : onOpen}
            />
            <HStack spacing={8} alignItems={"center"}>
              <Box w={"full"} m={"auto"}>
                <Link to={""}>
                  {/* <Image src="/logo.svg" /> */}
                  {colorMode === "light" ? (
                    <Image
                      src="/new-logo.png"
                      alt=""
                      width={["400px", "230px"]}
                    />
                  ) : (
                    <Image src="/new-logo-dark.png" alt="" width={"230px"} />
                  )}
                </Link>
              </Box>
              <HStack
                as={"nav"}
                spacing={[2, 3, 4]}
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
                      transition="background-color .2s ease-in-out"
                      _hover={{
                        bgColor: bgColorModeLinks,
                      }}
                    >
                      <HStack alignItems={"center"} w={["100px"]}>
                        <>{link.icon}</>
                        <Text>
                          {t(`header.${link.name.toLocaleLowerCase()}`)}
                        </Text>
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
              <ConnectButton chainStatus="icon" accountStatus="address" />
            </HStack>
          </Flex>
          <Divider m={"auto"} w={"full"} />
          {network === "apothem" ? (
            <Box
              w={"full"}
              bgColor={"lightsalmon"}
              py={2}
              borderRadius={4}
              my={2}
              textAlign={"center"}
            >
              <Text fontWeight={"semibold"} color={"black"}>
                <WarningIcon mr={"2"} />
                You are connected to {network.toLocaleUpperCase()} Testnet
              </Text>
            </Box>
          ) : (
            <></>
          )}
          {isOpen ? (
            <Box pb={4} display={{ md: "none" }}>
              <Box my={"4"}>
                <ConnectButton chainStatus="icon" accountStatus="address" />
              </Box>

              <Stack as={"nav"} spacing={4}>
                {Links.map((link) => (
                  <Link
                    key={uuid()}
                    to={link.location}
                    onClick={() => onClose()}
                  >
                    <Text>{t(`header.${link.name.toLocaleLowerCase()}`)}</Text>
                  </Link>
                ))}
              </Stack>
              <Box my={4}>
                <Select
                  size={"sm"}
                  variant="unstyled"
                  onChange={(e) => {
                    switchLanguage(e.target.value);
                  }}
                >
                  {langs.map((lang) => (
                    <option value={lang}>{lang.toUpperCase()}</option>
                  ))}
                </Select>
              </Box>
              {/* <Switch
                id="isChecked"
                isChecked={colorMode === "dark"}
                onChange={handleSwitchTheme}
                size={"lg"}
                mb={4}
              /> */}
            </Box>
          ) : null}
        </Box>
      </Box>
    </>
  );
}
