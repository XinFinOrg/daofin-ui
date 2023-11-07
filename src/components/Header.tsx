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
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { Web3Button } from "@web3modal/react";
import { Navigate } from "react-router";
import { Link } from "react-router-dom";
interface Props {
  children: React.ReactNode;
  href: string;
  asButton?: boolean;
}

const Links = [
  { location: "/", name: "Dashboard" },
  { location: "/proposals", name: "List of Proposals" },
  { location: "/create", name: "Make a new Proposal" },
  { location: "/committees", name: "Committees" },
];

export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
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
                  <Box>
                    <Text>{link.name}</Text>
                  </Box>
                </Link>
              ))}
              <Button colorScheme="blue">
                <a
                  href="https://github.com/XinFinOrg/osx-daofin/issues"
                  target="_blank"
                >
                  FAQs
                </a>
              </Button>
              <Button colorScheme="green">
                <a
                  href="https://github.com/XinFinOrg/osx-daofin/issues/new"
                  target="_blank"
                >
                  Ask a question
                </a>
              </Button>
            </HStack>
          </HStack>
          <Web3Button />
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
    </>
  );
}
