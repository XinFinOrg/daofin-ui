import {
  FormControl,
  FormHelperText,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/form-control";
import { FC, PropsWithChildren, useState } from "react";
import Tiptap from "../Tiptap";
import { Box, Flex, Text, HStack } from "@chakra-ui/layout";
import { AlertIcon, Button, IconButton } from "@chakra-ui/react";
import { v4 as uuid } from "uuid";
import { DefaultInput, DefaultTextarea } from "../index";
import {
  FieldArray,
  Formik,
  Form,
  FormikErrors,
  useFormikContext,
  Field,
} from "formik";
import { DefaultAlert } from "../Alerts";
import { MetaDataSchema } from "../../schemas/createProposalSchema";
import { useCreateProposalContext } from "../../contexts/CreateProposalContext";
import { DefaultButton } from "../Button";
import { CreateProposalFormData } from "../../pages/CreateProposal";
import { DeleteIcon } from "@chakra-ui/icons";
type MetaDataProps = {};
const CreateMetaData: FC<MetaDataProps> = ({}) => {
  const { setFormData, handleSubmit } = useCreateProposalContext();
  const { values, errors, submitForm, isSubmitting } =
    useFormikContext<CreateProposalFormData>();

  return (
    <>
      {/* <InputBox> */}
      <FormControl>
        <Box textAlign={"start"} mb={6}>
          <DefaultInput isRequired={true} name="metaData.title" label="Title" />
          <FormHelperText>
            Title will describe the proposal in the first look.
          </FormHelperText>
        </Box>
      </FormControl>
      {/* </InputBox> */}
      <InputBox>
        <DefaultTextarea
          isRequired={true}
          name="metaData.summary"
          label="Summary"
          placeholder="Here is a sample placeholder"
        />
        <FormHelperText>
          2 or 3 sentences that give a motivation of the proposal
        </FormHelperText>
      </InputBox>
      <InputBox>
        <FormLabel fontSize={["sm", "sm", "md"]}>Description</FormLabel>
        <Tiptap name="metaData.description" label="description" />
        <FormHelperText>
          Write a detailed information that help voters to understand the
          proposal better.
        </FormHelperText>
      </InputBox>
      {/* <Resources values={values} errors={errors} /> */}

      <FormControl>
        <Flex flexDirection={"column"}>
          <FieldArray name="metaData.resources">
            {({ push, form, handleReplace, remove }) => (
              <>
                {values.metaData.resources.length > 0 &&
                  values.metaData.resources.map(({ url, name }, index) => (
                    <>
                      <HStack
                        key={index}
                        className="py-1"
                        flexDirection={["column", "column", "column", "row"]}
                      >
                        <Box w={["full", "full", "full", "40%"]}>
                          <DefaultInput
                            noErrorMessage
                            w="sm"
                            placeholder="Label"
                            name={`metaData.resources.${index}.name`}
                            leftAddon="Label"
                          />
                        </Box>
                        <Box w={["full", "full", "full", "60%"]}>
                          <DefaultInput
                            noErrorMessage
                            placeholder="Resource(Link)"
                            name={`metaData.resources.${index}.url`}
                            leftAddon="Https://"
                          />
                        </Box>
                        <Box mt={'2'}>
                          {index !== 0 && (
                            <IconButton
                              aria-label=""
                              icon={<DeleteIcon />}
                              onClick={() => {
                                remove(index);
                              }}
                            />
                          )}
                        </Box>
                      </HStack>
                    </>
                  ))}

                <Button
                  mt={"4"}
                  className={"w-full mt-2"}
                  colorScheme="gray"
                  isDisabled={Boolean(errors?.metaData?.resources)}
                  onClick={() => {
                    push({
                      name: "",
                      url: "",
                    });
                  }}
                >
                  + Add more
                </Button>
              </>
            )}
          </FieldArray>
        </Flex>
        {errors?.metaData?.resources && (
          <FormErrorMessage>
            {errors?.metaData?.resources?.length}
          </FormErrorMessage>
        )}

        <FormHelperText>
          <DefaultAlert status="info" p={4}>
            <AlertIcon />
            <Text fontWeight={"bold"} fontSize={"xs"}>
              {" "}
              Put any related links to proposal, might be social media, article,
              discussion,...
            </Text>
          </DefaultAlert>
        </FormHelperText>
      </FormControl>
    </>
    // </Form>
    // )}
    // </Formik>
  );
};

const InputBox: FC<PropsWithChildren> = ({ children }) => {
  return (
    <FormControl>
      <Box textAlign={"start"} mb={6}>
        {children}
      </Box>
    </FormControl>
  );
};
const Resources: FC<
  PropsWithChildren & {
    values: {
      resources: { name: string; url: string }[];
    };
    errors: FormikErrors<{ resources: { name: string; url: string }[] }>;
  }
> = ({ children, values, errors }) => {
  return (
    <FormControl>
      <Flex flexDirection={"column"}>
        <FieldArray name="resources">
          {({ push }) => (
            <>
              {values.resources.length > 0 &&
                values.resources.map((_, index) => (
                  <HStack
                    key={uuid()}
                    className="py-1"
                    flexDirection={["column", "column", "column", "row"]}
                  >
                    <Box w={["full", "full", "full", "40%"]}>
                      <DefaultInput
                        noErrorMessage
                        w="sm"
                        placeholder="Label"
                        name={`resources.${index}.name`}
                        leftAddon="Label"
                      />
                    </Box>
                    <Box w={["full", "full", "full", "60%"]}>
                      <DefaultInput
                        noErrorMessage
                        placeholder="Resource(Link)"
                        name={`resources.${index}.url`}
                        leftAddon="Https://"
                      />
                    </Box>
                  </HStack>
                ))}

              <Button
                className={"mt-2"}
                colorScheme="gray"
                isDisabled={Boolean(errors?.resources)}
                onClick={() => {
                  push({
                    name: "",
                    url: "",
                  });
                }}
              >
                + Add
              </Button>
            </>
          )}
        </FieldArray>
      </Flex>
      {errors?.resources && (
        <FormErrorMessage>{errors?.resources.length}</FormErrorMessage>
      )}
    </FormControl>
  );
};
export default CreateMetaData;
