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
                    <Text onClick={() => handleRadioChange(index.toString())}>
                      <Radio value={index.toString()}>
                        {index === 0
                          ? "Upcoming voting period"
                          : "Next voting period"}
                      </Radio>
                    </Text>
                    <Flex w={"full"} textAlign={"center"} mb={1}>
                      <Box
                        bgColor={"blue.50"}
                        margin={"1"}
                        p={"1"}
                        borderRadius="md"
                      >
                        <Text color={"gray"}>
                          From {new Date(startDate).toString()}
                        </Text>
                      </Box>
                      <Box
                        bgColor={"blue.50"}
                        margin={"1"}
                        p={"1"}
                        borderRadius="md"
                      >
                        <Text color={"gray"}>
                          To {new Date(endDate).toString()}
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
