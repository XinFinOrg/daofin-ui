import { Box, BoxProps, useColorModeValue } from "@chakra-ui/react";
import { FC, PropsWithChildren } from "react";
import { DefaultButtonProps } from "../Button/DefaultButton";

type WalletCardBoxProps = PropsWithChildren & DefaultButtonProps & {};

const WalletCardBox: FC<WalletCardBoxProps> = (props) => {
  return (
    <Box
      bgColor={useColorModeValue("#FFF", "#151F29")}
      px={4}
      py={2}
      borderRadius={"lg"}
      border={"1px"}
      borderColor={useColorModeValue("#D7DEE4", "#1F2E3D")}
      boxShadow={"sm"}
      {...props}
    >
      {props.children}
    </Box>
  );
};
export default WalletCardBox;
