import {
  Badge,
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

import useDaoElectionPeriods, {
  ElectionPeriod,
} from "../../hooks/useDaoElectionPeriods";
import { v4 as uuid } from "uuid";
import {
  expirationDistance,
  timestampToStandardFormatString,
  toDate,
  toNormalDate,
  toStandardFormatString,
} from "../../utils/date";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { DefaultBox } from "../Box";
import { CreateProposalFormData } from "../../pages/CreateProposal";
import { DarkGrayBox } from "../Box/DefaultBox";
const ElectionPeriodsForm: FC<{ periods: ElectionPeriod[] }> = ({
  periods,
}) => {
  const { values, setFieldValue } = useFormikContext<CreateProposalFormData>();
  const filteredPeriods = useMemo(
    () => periods,
    // .length > 0
    //   ? periods.filter(({ endDate }) => Date.now() >= endDate)
    //   : []
    [periods]
  );
  const handleRadioChange = (value: any) => {
    setFieldValue("selectedElectionPeriod", value);
  };

  return (
    <Box>
      <Form>
        <Box mb={4}>
          <RadioGroup
            name="selectedElectionPeriod"
            value={values.selectedElectionPeriod.toString()}
          >
            <Stack spacing={5} direction="column">
              {filteredPeriods &&
                filteredPeriods.map(({ startDate, endDate, id }, index) => (
                  <DefaultBox
                    key={uuid()}
                    onClick={() => handleRadioChange(id.toString())}
                  >
                    <Text mb={2}>
                      <Radio value={id.toString()}>
                        <HStack>
                          <Text>
                            {index === 0
                              ? "Upcoming voting period"
                              : "Next voting period"}
                          </Text>

                          <Badge
                            textTransform={"initial"}
                            fontWeight={"normal"}
                            fontSize={"xs"}
                            borderRadius={"lg"}
                          >
                            Fixed duration -{" "}
                            {expirationDistance(
                              toDate(startDate),
                              toDate(endDate)
                            )}
                          </Badge>
                        </HStack>
                      </Radio>
                    </Text>
                    <Flex
                      w={"full"}
                      justifyContent="flex-start"
                      alignItems={"center"}
                      textAlign={"center"}
                      mb={1}
                      fontSize={["xs", "xs", "xs", "sm"]}
                    >
                      {/* <Text p={"1"}>{index + 1}- </Text> */}
                      <DarkGrayBox py={2} w={"45%"}>
                        <HStack
                          borderRadius="md"
                          justifyContent={"center"}
                          flexDirection={["column", "column", "column"]}
                        >
                          <Text fontWeight={"normal"} alignSelf={"flex-start"}>
                            From
                          </Text>
                          <Text fontWeight={"semibold"}>
                            {toStandardFormatString(toDate(startDate))}
                          </Text>
                        </HStack>
                      </DarkGrayBox>
                      <Box w={"10%"}>
                        <ArrowForwardIcon />
                      </Box>
                      <DarkGrayBox py={2} w={"45%"}>
                        <HStack
                          borderRadius="md"
                          justifyContent={"center"}
                          flexDirection={["column", "column", "column"]}
                        >
                          <Text fontWeight={"normal"} alignSelf={"flex-start"}>
                            To
                          </Text>
                          <Text fontWeight={"semibold"}>
                            {toStandardFormatString(toDate(endDate))}
                          </Text>
                        </HStack>
                      </DarkGrayBox>
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
