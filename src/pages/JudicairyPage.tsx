import React from "react";
import ManageJudiciary from "../components/ManageJudiciary";
import { Box } from "@chakra-ui/layout";

const JudicairyPage = () => {
  return (
    <Box className="grid grid-cols-3 grid-rows-12 gap-4">
      <Box className=" col-start-2">
        <ManageJudiciary />
      </Box>
    </Box>
  );
};

export default JudicairyPage;
