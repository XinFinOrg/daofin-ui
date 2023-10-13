import {
  FormControl,
  FormHelperText,
  FormLabel,
} from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Textarea } from "@chakra-ui/textarea";
import { ChangeEvent, FC, useState } from "react";
import Tiptap from "./Tiptap";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import { v4 as uuid } from "uuid";
type MetaDataProps = {
  handleOnChange: (
    e: ChangeEvent<HTMLDivElement | HTMLTextAreaElement>
  ) => void;
};
const CreateMetaData: FC<MetaDataProps> = ({ handleOnChange }) => {
  const { register, setValue, watch, resetField } = useFormContext();

  const resources: Array<{
    url: string;
    name: string;
  }> = watch("metaData.resources");

  const resource = watch(["metaData.resource.name", "metaData.resource.url"]);

  const { remove, append } = useFieldArray({
    name: "metaData.resources",
  });

  return (
    <>
      <FormControl>
        <Box className="mb-2 text-start">
          <FormLabel>Title</FormLabel>
          <Input
            {...register("metaData.title", {
              required: true,
            })}
            onChange={handleOnChange}
          />
          <FormHelperText>
            Title will describe the proposal in the first look.
          </FormHelperText>
        </Box>
        <Box className="mb-2 text-start">
          <FormLabel>Summary</FormLabel>

          <Textarea
            {...register("metaData.summary", {
              required: true,
            })}
            onChange={handleOnChange}
            placeholder="Here is a sample placeholder"
          />
          <FormHelperText>
            2 or 3 sentences that give a motivation of the proposal
          </FormHelperText>
        </Box>
        <Box className="mb-2 text-start">
          <FormLabel>Description</FormLabel>
          <Tiptap
            name="metaData.description"
            setValue={setValue}
            handleOnChange={handleOnChange}
          />
          <FormHelperText>
            Write a detailed information that help voters to understand the
            proposal better.
          </FormHelperText>
        </Box>

        <Box className="mb-2 text-start">
          <FormLabel>Resources</FormLabel>
          <Flex>
            <Box className="w-1/5 px-2">
              <Input
                placeholder="Label"
                {...register("metaData.resource.name", {
                  required: true,
                })}
              />
            </Box>
            <Box className="w-1/2 px-2">
              <Input
                placeholder="https//..."
                {...register("metaData.resource.url", {
                  required: true,
                })}
              />
            </Box>
            <Button
              colorScheme="green"
              onClick={() => {
                append({
                  name: resource[0],
                  url: resource[1],
                });
                resetField("metaData.resource.name");
                resetField("metaData.resource.url");
              }}
            >
              +
            </Button>
          </Flex>
          <Flex className="flex-col mt-2">
            {resources &&
              resources.map(({ name, url }, index) => (
                <Flex key={uuid()} className="mt-2">
                  <Box className="w-1/5 px-2">
                    <Input isDisabled={true} value={name} />
                  </Box>
                  <Box className="w-1/2 px-2">
                    <Input isDisabled={true} value={url} />
                  </Box>
                  <Box>
                    <Button
                      colorScheme="red"
                      onClick={() => {
                        remove(index);
                      }}
                    >
                      -
                    </Button>
                  </Box>
                </Flex>
              ))}
          </Flex>
          <FormHelperText>
            Put any related links to proposal, might be social media, article,
            discussion,...
          </FormHelperText>
        </Box>
      </FormControl>
    </>
  );
};
export default CreateMetaData;
