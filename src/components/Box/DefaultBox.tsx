import { Box, BoxProps, useColorModeValue } from "@chakra-ui/react";
import { FC, PropsWithChildren } from "react";

export type DefaultBoxProps = PropsWithChildren & BoxProps & {};

const DefaultBox: FC<DefaultBoxProps> = (props) => {
  return (
    <Box
      bgColor={useColorModeValue("#F6F7F9", "#151F29")}
      p={"6"}
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
export const BlueBox: FC<DefaultBoxProps> = (props) => {
  return (
    <Box
      colorScheme={"blue"}
      // bgColor={useColorModeValue("#F6F7F9", "#151F29")}
      p={"6"}
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
export const DarkGrayBox: FC<DefaultBoxProps> = (props) => {
  return (
    <Box
      colorScheme={"blue"}
      bgColor={useColorModeValue("#DDE1E7", "#151F29")}
      p={"6"}
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

export const WhiteBox: FC<DefaultBoxProps> = (props) => {
  return (
    <Box
      p={"6"}
      borderRadius={"lg"}
      border={"1px"}
      borderColor={useColorModeValue("#D7DEE4", "#2d3a47")}
      boxShadow={"sm"}
      {...props}
    >
      {props.children}
    </Box>
  );
};
export default DefaultBox;
