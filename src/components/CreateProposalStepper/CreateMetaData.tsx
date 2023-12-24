import {
  FormControl,
  FormHelperText,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Textarea } from "@chakra-ui/textarea";
import { ChangeEvent, FC, useState } from "react";
import Tiptap from "../Tiptap";
import { Box, Flex, Text, HStack } from "@chakra-ui/layout";
import {
  Alert,
  AlertIcon,
  Button,
  Editable,
  EditablePreview,
  EditableTextarea,
} from "@chakra-ui/react";
import { v4 as uuid } from "uuid";
import { DefaultInput, DefaultTextarea } from "../index";
import {
  FieldArray,
  FormikContext,
  FormikProps,
  useFormikContext,
} from "formik";
import { CreateProposalFormData } from "../../pages/CreateProposal";
type MetaDataProps = {};
const CreateMetaData: FC<MetaDataProps> = ({}) => {
  const { values, resetForm, setFieldValue, errors } =
    useFormikContext<CreateProposalFormData>();

  return (
    <>
      <FormControl>
        <Box className="mb-2 text-start">
          <DefaultInput isRequired={true} name="metaData.title" label="Title" />
          <FormHelperText>
            Title will describe the proposal in the first look.
          </FormHelperText>
        </Box>
        <Box className="mb-2 text-start">
          <DefaultTextarea
            isRequired={true}
            name="metaData.summary"
            label="Summary"
            placeholder="Here is a sample placeholder"
          />
          <FormHelperText>
            2 or 3 sentences that give a motivation of the proposal
          </FormHelperText>
        </Box>
        <Box className="mb-4 text-start">
          <FormLabel>Description</FormLabel>
          <Tiptap name="metaData.description" label="description" />
          <FormHelperText>
            Write a detailed information that help voters to understand the
            proposal better.
          </FormHelperText>
        </Box>

        <Box className="mb-2 text-start">
          {/* <HStack>
              <Box className="w-1/4">
                <DefaultInput
                  isRequired
                  w="sm"
                  placeholder="Label"
                  name="metaData.resource.name"
                  label="Label"
                />
              </Box>
              <Box className="w-full">
                <DefaultInput
                  isRequired
                  placeholder="https//..."
                  name="metaData.resource.url"
                  label="Resources(Link)"
                  leftAddon="https://"
                />
              </Box>
            </HStack> */}
          <FormControl>
            <Flex flexDirection={"column"}>
              <FieldArray name="metaData.resources">
                {({ push }) => (
                  <>
                    {values.metaData.resources.length > 0 &&
                      values.metaData.resources.map((_, index) => (
                        <>
                          <HStack className="py-1">
                            <Box className="w-2/5">
                              <DefaultInput
                                noErrorMessage
                                w="sm"
                                placeholder="Label"
                                name={`metaData.resources.${index}.name`}
                                leftAddon="Label"
                              />
                            </Box>
                            <Box className="w-full">
                              <DefaultInput
                                noErrorMessage
                                placeholder="Resource(Link)"
                                name={`metaData.resources.${index}.url`}
                                leftAddon="Link"
                              />
                            </Box>
                          </HStack>
                        </>
                      ))}

                    <Button
                      className={"mt-2"}
                      colorScheme="gray"
                      isDisabled={Boolean(errors?.metaData?.resources)}
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
            {errors?.metaData?.resources && (
              <FormErrorMessage>
                {errors?.metaData?.resources.length}
              </FormErrorMessage>
            )}
          </FormControl>
          <Flex className="flex-col mt-2"></Flex>
          <FormHelperText>
            <Alert status="info">
              <AlertIcon />
              <Text fontWeight={"bold"} fontSize={"xs"}>
                {" "}
                Put any related links to proposal, might be social media,
                article, discussion,...
              </Text>
            </Alert>
          </FormHelperText>
        </Box>
      </FormControl>
    </>
  );
};
export default CreateMetaData;
