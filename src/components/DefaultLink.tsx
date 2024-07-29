import { useColorModeValue } from "@chakra-ui/color-mode";
import { Text } from "@chakra-ui/layout";
import { FC, PropsWithChildren } from "react";
import { Link } from "react-router-dom";

type DefaultLinkProps = PropsWithChildren & {
  to: string;
};
const DefaultLink: FC<DefaultLinkProps> = ({ children, to }) => {
    const textColor=useColorModeValue('#006da3','lightBlue')
  return (
    <Link to={to}>
      <Text color={textColor}>{children}</Text>
    </Link>
  );
};

export default DefaultLink;
