import { extendTheme } from "@chakra-ui/react";
import { colors } from "./colors";

export const theme = extendTheme({
  colors,
  fonts: {
    body: `'Inter',sans-serif`,
  },
});
