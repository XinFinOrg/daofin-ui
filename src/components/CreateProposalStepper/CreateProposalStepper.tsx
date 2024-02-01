import { Box, Flex, Stack } from "@chakra-ui/layout";
import React, { ChangeEvent, FC, useEffect, useState } from "react";
import CreateMetaData from "./CreateMetaData";
import { Button } from "@chakra-ui/button";
import { styled } from "styled-components";
import {
  Card,
  CardBody,
  CardHeader,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  Heading,
  StackDivider,
  CardFooter,
  Badge,
  useDisclosure,
} from "@chakra-ui/react";
import useDaoElectionPeriods from "../../hooks/useDaoElectionPeriods";
import { useClient } from "../../hooks/useClient";
import { GasFeeEstimation } from "@xinfin/osx-client-common";
import { useCreateProposalContext } from "../../contexts/CreateProposalContext";
import { DefaultBox } from "../Box";
import {
  CreationFormSchema,
  GrantActionSchema,
  MetaDataSchema,
} from "../../schemas/createProposalSchema";
import { Form, Formik, FormikProps } from "formik";
import { CreateProposalFormData } from "../../pages/CreateProposal";
import { DefaultButton } from "../Button";
import { GrantsProposalTypeForm } from "../actions";
import ElectionPeriodsForm from "./ElectionPeriodsForm";
import ProposalPreview from "./ProposalPreview";
import ProposalCosts from "./ProposalCosts";
type CreateProposalStepperProps = {
  proposalTypeId: string | undefined;
};

const CreateProposalStepperWrapper = styled.div.attrs({
  className: "max-w-full",
})``;

const CreateProposalStepper: FC<CreateProposalStepperProps> = ({
  proposalTypeId,
}) => {
  const [gasEstimationData, setGasEstimationData] =
    useState<GasFeeEstimation>();

  const { steps, defaultSteps, setFormData, handleSubmit } =
    useCreateProposalContext();
  const { activeStep, goToPrevious, goToNext } = steps;

  const lastStep = defaultSteps.length - 2;
  const { data: periods } = useDaoElectionPeriods();

  const { daofinClient } = useClient();
  const handleProceedButton = () => {
    if (activeStep === lastStep) {
      // handleOpenPublishModal();
    } else {
      goToNext();
    }
    window.scrollTo(0, 0);
  };
  const [schema, setSchema] = useState(MetaDataSchema);

  const getCurrentSchema = (activeStep: number) => {
    switch (activeStep) {
      case 0:
        return CreationFormSchema.pick(["metaData"]);
      case 1:
        return CreationFormSchema.pick(["action"]);
      default:
        return undefined;
    }
  };
  useEffect(() => {
    if (proposalTypeId !== undefined) {
      setFormData((prev) => ({
        ...prev,
        proposalTypeId,
      }));
    }
  }, []);
  return (
    <>
      <Formik
        key={"my-form-1"}
        initialValues={{
          metaData: {
            title: "",
            summary: "",
            description: "",
            resources: [{ name: "", url: "" }],
          },
          action: { amount: "", recipient: "" },
          selectedElectionPeriod: "0",
          // proposalTypeId: proposalTypeId ? proposalTypeId.toString() : "0",
        }}
        validationSchema={getCurrentSchema(activeStep)}
        validateOnChange={true}
        onSubmit={handleSubmit}
      >
        {({
          submitForm,
          errors,
          touched,
        }: FormikProps<CreateProposalFormData>) => (
          <Form>
            <CreateProposalStepperWrapper className="mt-4 px-4">
              <Flex>
                <Box w={["40%", "40%", "40%", "40%", "40%"]}>
                  <Flex
                    flexDirection={"column"}
                    alignItems={"center"}
                    pos={"relative"}
                  >
                    <Stepper
                      position={"initial"}
                      index={activeStep}
                      colorScheme="blue"
                      orientation="vertical"
                      gap="0"
                      height={"md"}
                    >
                      {defaultSteps.map((step, index) => (
                        <Step key={index}>
                          <StepIndicator>
                            <StepStatus
                              complete={<StepIcon />}
                              incomplete={<StepNumber />}
                              active={<StepNumber />}
                            />
                          </StepIndicator>

                          <Box flexShrink="0" maxWidth={"full"}>
                            <StepTitle>{step.title}</StepTitle>
                            <StepDescription className="max-w-xs	">
                              {/* {step.description} */}
                            </StepDescription>
                          </Box>
                          <StepSeparator />
                        </Step>
                      ))}
                    </Stepper>
                  </Flex>
                </Box>
                <Box w={["40%", "40%", "60%"]}>
                  <Card shadow={"2xl"}>
                    <DefaultBox p={0}>
                      <CardHeader>
                        <Badge mb={"4"}>GRANT</Badge>
                        <Heading size="md">
                          {defaultSteps[activeStep].title}
                        </Heading>
                      </CardHeader>

                      <CardBody>
                        <Stack divider={<StackDivider />} spacing="4">
                          {activeStep === 0 && <CreateMetaData />}
                          {activeStep === 1 && <GrantsProposalTypeForm />}
                          {activeStep === 2 && (
                            <ElectionPeriodsForm
                              periods={periods ? periods : []}
                            />
                          )}
                          {activeStep === 3 && <ProposalPreview />}
                          {activeStep === 4 && <ProposalCosts />}
                        </Stack>
                      </CardBody>
                      {/* <ProposalCardFooter
                      handleProceedButton={handleProceedButton}
                      goToPrevious={goToPrevious}
                      activeStep={activeStep}
                      lastStep={defaultSteps.length}
                    /> */}
                      <CardFooter justifyContent={"space-between"}>
                        <Button
                          isDisabled={activeStep === 0}
                          onClick={() => goToPrevious()}
                          variant={"unstyled"}
                        >
                          {"<-"} Back
                        </Button>

                        <DefaultButton
                          isDisabled={
                            !(Object.keys(touched).length > 0) ||
                            Object.keys(errors).length > 0
                          }
                          onClick={() => submitForm()}
                          colorScheme="blue"
                          mx={1}
                        >
                          Proceed
                        </DefaultButton>
                      </CardFooter>
                    </DefaultBox>
                  </Card>
                </Box>
              </Flex>
            </CreateProposalStepperWrapper>
          </Form>
        )}
      </Formik>
    </>
  );
};

export interface ProposalCardFooterProps {
  activeStep: number;
  lastStep: number;
  handleProceedButton: () => void;
  goToPrevious: () => void;
}

const ProposalCardFooter: FC<ProposalCardFooterProps> = ({
  activeStep,
  goToPrevious,
  handleProceedButton,
  lastStep,
}) => {
  // const { values, errors, dirty, handleSubmit } =
  //   useFormikContext<CreateProposalFormData>();

  const isDisabledProceedButton = activeStep === lastStep;

  const handleSubmitForm = () => {
    // handleSubmit();
    handleProceedButton();
  };
  return (
    <CardFooter justifyContent={"space-between"}>
      <Button
        isDisabled={activeStep === 0}
        onClick={() => goToPrevious()}
        variant={"unstyled"}
      >
        {"<-"} Back
      </Button>

      <Button
        isDisabled={isDisabledProceedButton}
        // onClick={handleSubmitForm}
        colorScheme={"blue"}
        mx={1}
        type="submit"
      >
        Proceed
      </Button>
    </CardFooter>
  );
};

export default CreateProposalStepper;
