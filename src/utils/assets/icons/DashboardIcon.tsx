import { createIcon, useColorModeValue } from "@chakra-ui/react";

export const DashboardIconChakra = createIcon({
  displayName: "UpDownIcon",
  viewBox: "0 0 17 16",
  d: "M2.52783 8.66667H7.86117V2H2.52783V8.66667ZM2.52783 14H7.86117V10H2.52783V14ZM9.1945 14H14.5278V7.33333H9.1945V14ZM9.1945 2V6H14.5278V2H9.1945Z",
});
const DashboardIcon = () => {
  return <DashboardIconChakra color={useColorModeValue("black", "white")} />;
};
export default DashboardIcon;
