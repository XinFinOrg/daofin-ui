import {
  FormControl,
  FormHelperText,
  FormLabel,
} from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Textarea } from "@chakra-ui/textarea";
import { ChangeEvent, FC } from "react";
import Tiptap from "./Tiptap";
import { useFormContext } from "react-hook-form";
import { Box } from "@chakra-ui/layout";

type MetaDataProps = {
  handleOnChange: (
    e: ChangeEvent<HTMLDivElement | HTMLTextAreaElement>
  ) => void;
};
const CreateMetaData: FC<MetaDataProps> = ({ handleOnChange }) => {
  const { register, setValue } = useFormContext();
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
            Write a detailed information that help voters to understand the proposal better.
          </FormHelperText>
        </Box>
      </FormControl>
    </>
  );
};
export default CreateMetaData;
