import { Button, ButtonProps } from "@chakra-ui/react";
import { FC, PropsWithChildren } from "react";

export type DefaultButtonProps = PropsWithChildren & ButtonProps & {};

const DefaultButton: FC<DefaultButtonProps> = (props) => {
  return <Button {...props}>{props.children}</Button>;
};

export default DefaultButton;
