import React, { InputHTMLAttributes } from "react";
import { useField } from "formik";
import {
  Textarea as ChakraTextarea,
  FormErrorMessage,
  TextareaProps as ChakraTextareaProps,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
}

const Input: React.FC<InputProps & ChakraTextareaProps> = ({
  label,
  size: _,
  isRequired,
  ...props
}) => {
  const [field, meta] = useField(props);

  return (
    <FormControl
      isRequired={isRequired}
      isInvalid={Boolean(meta.touched && meta.error)}
    >
      <FormLabel>
        {label && <label htmlFor={props.id || props.name}>{label}</label>}
      </FormLabel>
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
