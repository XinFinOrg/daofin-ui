import {
  Box,
  Flex,
  FormControl,
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
  toStandardFormatString,
} from "../../utils/date";
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
                  <Box key={uuid()}>
                    <Text onClick={() => handleRadioChange(index.toString())} mb={2}>
                      <Radio value={index.toString()}>
                        {index === 0
                          ? "Upcoming voting period"
                          : "Next voting period"}
                      </Radio>
                    </Text>
                    <Flex
                      w={"full"}
                      justifyContent="center"
                      textAlign={"center"}
                      mb={1}
                      fontSize={"sm"}
                    >
                      <Box
                        bgColor={"blue.50"}
                        margin={"1"}
                        p={"1"}
                        borderRadius="md"
                      >
                        <Text color={"gray"}>
                          From: {toStandardFormatString(new Date(startDate))}
                        </Text>
                      </Box>
                      <Box
                        bgColor={"blue.50"}
                        margin={"1"}
                        p={"1"}
                        borderRadius="md"
                      >
                        <Text color={"gray"}>
                          To: {toStandardFormatString(new Date(endDate))}
                        </Text>
                      </Box>
                    </Flex>
                  </Box>
                ))}
            </Stack>
          </RadioGroup>
        </Box>
      </Form>
    </Box>
  );
};

export default ElectionPeriodsForm;
