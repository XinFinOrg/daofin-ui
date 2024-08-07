import * as Yup from "yup";
import { ethereumAddressRegex } from "./common";

const urlWithoutProtocolRegex =
  /^(https?:\/\/)?([\w\d-]+\.)+[\w\d-]+(\/[\w\d- .\/?%&=]*)?/i;

export const MetaDataSchema = Yup.object().shape({
  title: Yup.string().required("Must not be empty"),
  summary: Yup.string()
  .min(30, "Must be greater that 30 characters")
  .max(200, "Must be less that 200 characters")
  .required("Must not be empty"),
  description: Yup.string(),
  resources: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required(),
      url: Yup.string()
        .required()
        .matches(urlWithoutProtocolRegex, "Invalid URL")
        .required("Website is required"),
    })
  ),
});

export const GrantActionSchema = Yup.object().shape({
  amount: Yup.number()
    .min(1, "Must be greater that 10")
    .max(1000000, "Must be less that 1000000")
    .required("Must not be empty"),
  recipient: Yup.string()
    .matches(ethereumAddressRegex, "Invalid address")
    .required("Address is required"),
});
export const CreationFormSchema = Yup.object().shape({
  metaData: MetaDataSchema,
  action: GrantActionSchema,
});
