import React, { InputHTMLAttributes } from "react";
import { useField } from "formik";
import {
  Input as ChakraInput,
  FormErrorMessage,
  InputProps as ChakraInputProps,
  FormControl,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  leftAddon?: string;
}

const Input: React.FC<InputProps & ChakraInputProps> = ({
  label,
  size: _,
  leftAddon,
  ...props
}) => {
  const [field, meta] = useField(props);

  return (
    <FormControl isRequired={props.isRequired}>
      {label && <label htmlFor={props.id || props.name}>{label}</label>}
      <InputGroup>
        {leftAddon && <InputLeftAddon children={leftAddon} />}
        <ChakraInput
          {...field}
          {...props}
          id={props.id || props.name}
          placeholder={props.placeholder || ""}
        />
      </InputGroup>
      {meta.touched && meta.error ? (
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      ) : null}
    </FormControl>
  );
};

export default Input;
