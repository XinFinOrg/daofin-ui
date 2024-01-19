import {
  Box,
  Flex,
  FormControl,
  HStack,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useClipboard,
  useRadio,
} from "@chakra-ui/react";
import { Form, useField, useFormikContext } from "formik";
import { FC, useMemo } from "react";
import { DefaultInput } from "..";
import { CreateProposalFormData } from "../../pages/CreateProposal";

import useDaoElectionPeriods, {
  ElectionPeriod,
} from "../../hooks/useDaoElectionPeriods";
import { v4 as uuid } from "uuid";
import {
  timestampToStandardFormatString,
  toNormalDate,
  toStandardFormatString,
} from "../../utils/date";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { DefaultBox } from "../Box";
const ElectionPeriodsForm: FC<{ periods: ElectionPeriod[] }> = ({
  periods,
}) => {
  const { values, setFieldValue } = useFormikContext<CreateProposalFormData>();
  const filteredPeriods = useMemo(
    () =>
      periods.length > 0
        ? periods.filter(({ startDate }) => Date.now() <= startDate).slice(0, 2)
        : [],
    [periods]
  );
  const handleRadioChange = (value: any) => {
    setFieldValue("selectedElectionPeriod", value);
  };
  console.log(filteredPeriods);

  return (
    <Box>
      <Form>
        <Box className="mb-4">
          <RadioGroup
            name="selectedElectionPeriod"
            value={values.selectedElectionPeriod.toString()}
          >
            <Stack spacing={5} direction="column">
              {filteredPeriods &&
                filteredPeriods.map(({ startDate, endDate }, index) => (
                  <DefaultBox key={uuid()}>
                    <Text
                      onClick={() => handleRadioChange(index.toString())}
                      mb={2}
                    >
                      <Radio value={index.toString()}>
                        {index === 0
                          ? "Upcoming voting period"
                          : "Next voting period"}
                      </Radio>
                    </Text>
                    <Flex
                      w={"full"}
                      justifyContent="space-around"
                      alignItems={"center"}
                      textAlign={"center"}
                      mb={1}
                      fontSize={["xs", "xs", "xs", "sm"]}
                    >
                      {/* <Text p={"1"}>{index + 1}- </Text> */}
                      <HStack
                        margin={"1"}
                        p={"1"}
                        borderRadius="md"
                        w={"45%"}
                        justifyContent={"center"}
                        flexDirection={["column", "column", "row"]}
                      >
                        <Text fontWeight={"semibold"}>
                          {toStandardFormatString(toNormalDate(startDate))}
                        </Text>
                      </HStack>
                      <Box>
                        <ArrowForwardIcon />
                      </Box>
                      <HStack
                        margin={"1"}
                        p={"1"}
                        borderRadius="md"
                        w={"45%"}
                        justifyContent={"center"}
                        flexDirection={["column", "column", "row"]}
                      >
                        <Text fontWeight={"semibold"}>
                          {toStandardFormatString(toNormalDate(endDate))}
                        </Text>
                      </HStack>
                    </Flex>
                  </DefaultBox>
                ))}
            </Stack>
          </RadioGroup>
        </Box>
      </Form>
    </Box>
  );
};

export default ElectionPeriodsForm;
