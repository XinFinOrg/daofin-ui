import { Text } from "@chakra-ui/layout";
import React, { FC, useState } from "react";
import { DefaultButton } from "../Button";
interface ExpandableTextProps {
  text: string;
  lines?: number;
}
const ExpandableText: FC<ExpandableTextProps> = ({ text, lines = 7 }) => {
  const [noOfLines, setNoOfLines] = useState<number | undefined>(lines);

  return (
    <>
      <Text
        dangerouslySetInnerHTML={{
          __html: text,
        }}
        // style={{ wordBreak: "break-all" }}
        noOfLines={noOfLines}
      ></Text>
      <DefaultButton
        variant={"link"}
        onClick={() => {
          setNoOfLines((prev) => (typeof prev === "number" ? undefined : 7));
        }}
      >
        {typeof noOfLines !== "number" ? "Show less" : "Read more"}
      </DefaultButton>
    </>
  );
};

export default ExpandableText;
