import React, { InputHTMLAttributes } from "react";
import { Field, useField } from "formik";
import {
  Input as ChakraInput,
  FormErrorMessage,
  InputProps as ChakraInputProps,
  FormControl,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  FormLabel,
} from "@chakra-ui/react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  leftAddon?: string;
  rightAddon?: string;
  onClickRightAddon?: any;
  noErrorMessage?: true;
}

const Input: React.FC<InputProps & ChakraInputProps> = ({
  label,
  size: _,
  leftAddon,
  rightAddon,
  onClickRightAddon,
  isRequired,
  value,
  noErrorMessage,
  name,
  ...props
}) => {
  const [field, meta] = useField(name);

  return (
    <FormControl
      isRequired={isRequired}
      isInvalid={Boolean(meta.touched && meta.error)}
    >
      <FormLabel fontSize={["sm", "sm", "md"]}>{label && label}</FormLabel>

      <InputGroup>
        {leftAddon && (
          <InputLeftAddon fontSize={["sm", "sm", "md"]} children={leftAddon} />
        )}
        <Field
          as={ChakraInput}
          {...field}
          {...props}
          id={props.id || name}
          placeholder={props.placeholder || ""}
          
        />
        {rightAddon && (
          <InputRightAddon
            className={onClickRightAddon ? "cursor-pointer" : ""}
            children={rightAddon}
            onClick={onClickRightAddon}
          />
        )}
      </InputGroup>
      {noErrorMessage === undefined && meta.touched && meta.error ? (
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      ) : null}
    </FormControl>
  );
};

export default Input;
