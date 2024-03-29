import * as Yup from "yup";
import { ethereumAddressRegex } from "./common";

export const MasterNodeDelegationSchema = Yup.object().shape({
  delegateeAddress: Yup.string()
    .matches(ethereumAddressRegex, "Invalid address")
    .required("Address is required"),
});
