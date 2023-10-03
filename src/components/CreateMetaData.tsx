import { FormControl, FormLabel } from "@chakra-ui/form-control";
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
        <Box className="mb-2">
          <FormLabel>Title</FormLabel>
          <Input
            {...register("metaData.title", {
              required: true,
            })}
            onChange={handleOnChange}
          />
        </Box>
        <Box className="mb-2">
          <FormLabel>Summary</FormLabel>

          <Textarea
            {...register("metaData.summary", {
              required: true,
            })}
            onChange={handleOnChange}
            placeholder="Here is a sample placeholder"
          />
        </Box>
        <Box className="mb-2">
          <FormLabel>Description</FormLabel>
          <Tiptap
            name="metaData.description"
            setValue={setValue}
            handleOnChange={handleOnChange}
          />
        </Box>
      </FormControl>
    </>
  );
};
export default CreateMetaData;
