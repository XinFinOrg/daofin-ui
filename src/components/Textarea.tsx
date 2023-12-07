import React, { InputHTMLAttributes } from "react";
import { useField } from "formik";
import {
  Textarea as ChakraTextarea,
  FormErrorMessage,
  TextareaProps as ChakraTextareaProps,
  FormControl,
} from "@chakra-ui/react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
}

const Input: React.FC<InputProps & ChakraTextareaProps> = ({
  label,
  size: _,
  ...props
}) => {
  const [field, meta] = useField(props);

  return (
    <FormControl isRequired={props.isRequired}>
      {label && <label htmlFor={props.id || props.name}>{label}</label>}
      <ChakraTextarea
        {...field}
        {...props}
        id={props.id || props.name}
        placeholder={props.placeholder || ""}
      />
      {meta.touched && meta.error ? (
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      ) : null}
    </FormControl>
  );
};

export default Input;
