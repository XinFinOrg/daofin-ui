import { createIcon, useColorModeValue } from "@chakra-ui/react";

export const CommunityIconChakraA = createIcon({
  displayName: "CommunityIconChakra",
  viewBox: "0 0 17 16",
  d: "M7.52783 14C7.52783 14 6.52783 14 6.52783 13C6.52783 12 7.52783 9 11.5278 9C15.5278 9 16.5278 12 16.5278 13C16.5278 14 15.5278 14 15.5278 14H7.52783ZM11.5278 8C12.3235 8 13.0865 7.68393 13.6492 7.12132C14.2118 6.55871 14.5278 5.79565 14.5278 5C14.5278 4.20435 14.2118 3.44129 13.6492 2.87868C13.0865 2.31607 12.3235 2 11.5278 2C10.7322 2 9.96912 2.31607 9.40651 2.87868C8.8439 3.44129 8.52783 4.20435 8.52783 5C8.52783 5.79565 8.8439 6.55871 9.40651 7.12132C9.96912 7.68393 10.7322 8 11.5278 8Z",
});
const CommunityIconChakraB = createIcon({
  displayName: "CommunityIconChakra",
  viewBox: "0 0 17 16",
  d: "M5.74383 14C5.59559 13.6878 5.52166 13.3455 5.52783 13C5.52783 11.645 6.20783 10.25 7.46383 9.28C6.83692 9.08684 6.18378 8.99237 5.52783 9C1.52783 9 0.527832 12 0.527832 13C0.527832 14 1.52783 14 1.52783 14H5.74383Z",
});
const CommunityIconChakraC = createIcon({
  displayName: "CommunityIconChakra",
  viewBox: "0 0 17 16",
  d: "M5.02783 8C5.69087 8 6.32676 7.73661 6.7956 7.26777C7.26444 6.79893 7.52783 6.16304 7.52783 5.5C7.52783 4.83696 7.26444 4.20107 6.7956 3.73223C6.32676 3.26339 5.69087 3 5.02783 3C4.36479 3 3.72891 3.26339 3.26007 3.73223C2.79122 4.20107 2.52783 4.83696 2.52783 5.5C2.52783 6.16304 2.79122 6.79893 3.26007 7.26777C3.72891 7.73661 4.36479 8 5.02783 8Z",
});
const CommunityIcon = () => {
  return (
    <>
      <CommunityIconChakraA
        position={"absolute"}
        color={useColorModeValue("black", "white")}
      />
      <CommunityIconChakraB
        position={"absolute"}
        color={useColorModeValue("black", "white")}
      />
      <CommunityIconChakraC color={useColorModeValue("black", "white")} />
    </>
  );
};
export default CommunityIcon;
