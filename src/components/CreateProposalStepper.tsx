import {
  Box,
  Container,
  Divider,
  Flex,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/layout";
import { Progress } from "@chakra-ui/progress";
import React, { ChangeEvent, FC, useState } from "react";
import CreateMetaData from "./CreateMetaData";
import { Button } from "@chakra-ui/button";
import { ProposalMetadata } from "@xinfin/osx-client-common";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightAddon } from "@chakra-ui/input";
import { method } from "lodash";
import { styled } from "styled-components";
import useDaoElectionPeriods from "../hooks/useDaoElectionPeriods";
import { Radio, RadioGroup } from "@chakra-ui/radio";
import { v4 as uuid } from "uuid";
import BoxWrapper from "./BoxWrapper";
import { CHAIN_METADATA } from "../utils/networks";
import { useNetwork } from "../contexts/network";
type CreateProposalStepperProps = {
  handleOnChange: (
    e: ChangeEvent<HTMLDivElement | HTMLTextAreaElement>
  ) => void;
  handleSubmitProposal: (data: any) => void;
};

const CreateProposalStepperWrapper = styled.div.attrs({
  className:
    "w-2/3 border border-2 p-4 mt-4 rounded outline outline-offset-2 outline-2 ",
})``;
const CreateProposalStepper: FC<CreateProposalStepperProps> = ({
  handleOnChange,
  handleSubmitProposal,
}) => {
  const [step, setStep] = useState({
    initialStep: 1,
    currentStep: 1,
    totalSteps: 3,
  });
  const { initialStep, currentStep, totalSteps } = step;
  const [progress, setProgress] = useState(50);
  const { network } = useNetwork();
  const goToNext = () => {
    setStep((prev) => ({ ...prev, currentStep: prev.currentStep + 1 }));
    setProgress((prev) => prev + 50);
  };
  const goToPrevious = () => {
    setStep((prev) => ({ ...prev, currentStep: prev.currentStep - 1 }));
    setProgress((prev) => prev - 50);
  };
  const { getValues, formState, register, handleSubmit, setValue } =
    useFormContext();
  const { errors } = formState;
  const { metaData, actions } = getValues();
  const electionPeriods = useDaoElectionPeriods();
  const onCreateProposal = handleSubmit(handleSubmitProposal);
  return (
    <>
      <CreateProposalStepperWrapper className="mt-4">
        <Progress
          hasStripe
          value={progress}
          mb="5%"
          mx="5%"
          isAnimated
        ></Progress>
        {currentStep === 1 && (
          <CreateMetaData handleOnChange={handleOnChange} />
        )}
        {currentStep === 2 && (
          <>
            Action
            <FormControl>
              <FormLabel>Recipient</FormLabel>
              <Input
                className="m-1"
                {...register("withdrawAction.to", {
                  required: true,
                })}
                placeholder="0x...."
                onChange={handleOnChange}
              />

              <FormLabel>Amount</FormLabel>
              <InputGroup className="m-1">
                <Input
                  {...register("withdrawAction.value", {
                    valueAsNumber: true,
                  })}
                  placeholder="amount"
                  onChange={handleOnChange}
                />
                <InputRightAddon
                  children={CHAIN_METADATA[network].nativeCurrency.symbol}
                />
              </InputGroup>
            </FormControl>
          </>
        )}
        {currentStep === 3 && (
          <>
            Choose the Election Period:
            <RadioGroup
              onChange={(value) => {
                setValue("electionPeriodIndex", value);
              }}
              defaultValue={"0"}
            >
              <Stack direction="column">
                {electionPeriods?.map(({ startDate, endDate }, index) => (
                  <Box className="p-4 text-start">
                    <Radio value={`${index}`} key={uuid()}>
                      <Text>
                        <strong>From: </strong>
                        {new Date(startDate).toUTCString()}{" "}
                      </Text>
                      <Text>
                        <strong>To: </strong>
                        {new Date(endDate).toUTCString()}
                      </Text>
                    </Radio>
                  </Box>
                ))}
              </Stack>
            </RadioGroup>
          </>
        )}

        <Button
          isDisabled={currentStep === initialStep}
          onClick={() => goToPrevious()}
        >
          Previous
        </Button>
        <Button
          isDisabled={currentStep === totalSteps}
          onClick={() => goToNext()}
        >
          Next
        </Button>
        <Button
          type={"submit"}
          isDisabled={currentStep !== totalSteps}
          onClick={onCreateProposal}
        >
          Create
        </Button>
      </CreateProposalStepperWrapper>
    </>
  );
};

export default CreateProposalStepper;
