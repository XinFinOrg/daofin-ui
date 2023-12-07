import {
  FormControl,
  FormHelperText,
  FormLabel,
} from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Textarea } from "@chakra-ui/textarea";
import { ChangeEvent, FC, useState } from "react";
import Tiptap from "./Tiptap";
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
import { DefaultInput, DefaultTextarea } from "./index";
import {
  FieldArray,
  FormikContext,
  FormikProps,
  useFormikContext,
} from "formik";
import { CreateProposalFormData } from "../pages/CreateProposal";
type MetaDataProps = {
  handleOnChange: (
    e: ChangeEvent<HTMLDivElement | HTMLTextAreaElement>
  ) => void;
};
const CreateMetaData: FC<MetaDataProps> = ({ handleOnChange }) => {
  const { values, resetForm, setFieldValue } =
    useFormikContext<CreateProposalFormData>();
  console.log({ values });

  return (
    <>
      <FormControl isRequired>
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
        <Box className="mb-2 text-start">
          <FormLabel>Description</FormLabel>
          <Tiptap name="metaData.description" label="escription" />
          <FormHelperText>
            Write a detailed information that help voters to understand the
            proposal better.
          </FormHelperText>
        </Box>

        <Box className="mb-2 text-start">
          {/* <FormLabel>Resources</FormLabel> */}
          <Flex flexDirection={"column"}>
            {/* <Box className="w-1/5 px-2">
              <Input
                placeholder="Label"
                // {...register("metaData.resource.name", {
                //   required: true,
                // })}
              />
            </Box> */}
            <HStack>
              <Box className="w-1/4">
                <DefaultInput
                  w="sm"
                  placeholder="Label"
                  name="metaData.resource.label"
                  label="Label"
                />
              </Box>
              <Box className="w-full">
                <DefaultInput
                  placeholder="https//..."
                  name="metaData.resource.link"
                  label="Resources(Link)"
                  leftAddon="https://"
                />
              </Box>
            </HStack>
            <FieldArray name="metaData.resources">
              {({ insert, remove, push }) => (
                <>
                  {values.metaData.resources.map((res, index) => (
                    <>
                      <HStack className="py-1">
                        <Box className="w-1/4">
                          <DefaultInput
                            w="sm"
                            placeholder="Label"
                            name={`metaData.resources.${index}.label`}
                          />
                        </Box>
                        <Box className="w-full">
                          <DefaultInput
                            placeholder="https//..."
                            name={`metaData.resources.${index}.link`}
                            leftAddon="https://"
                          />
                        </Box>
                      </HStack>
                    </>
                  ))}
                  <Button
                    className={"mt-2"}
                    colorScheme="gray"
                    onClick={() => {
                      push({
                        label: values.metaData.resource.label,
                        link: values.metaData.resource.link,
                      });
                      setFieldValue("metaData.resource.label", "");
                      setFieldValue("metaData.resource.link", "");
                    }}
                  >
                    + Add More
                  </Button>
                </>
              )}
            </FieldArray>
          </Flex>
          <Flex className="flex-col mt-2"></Flex>
          <FormHelperText>
            <Alert status="info">
              <AlertIcon />
              <Text fontWeight={'bold'} fontSize={'xs'}>
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
