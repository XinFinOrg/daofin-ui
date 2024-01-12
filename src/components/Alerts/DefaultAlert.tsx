import { Alert, AlertProps } from "@chakra-ui/react";
import { FC, PropsWithChildren } from "react";

export type DefaultAlertProps = AlertProps & PropsWithChildren & {};
const DefaultAlert: FC<DefaultAlertProps> = (props) => {
  return (
    <Alert p={"6"} borderRadius={"md"} status="info" {...props}>
      {props.children}
    </Alert>
  );
};
export { DefaultAlert };
