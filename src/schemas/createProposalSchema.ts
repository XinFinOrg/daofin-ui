import * as Yup from "yup";
import { CreateProposalFormData } from "../pages/CreateProposal";

export const MetaDataSchema = Yup.object().shape({
  title: Yup.string().required("Must not be empty"),
  summary: Yup.string().required("Must not be empty"),
  description: Yup.string(),
  resources: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required(),
      url: Yup.string().required().url(),
    })
  ),
});

export const GrantActionSchema = Yup.object().shape({
  amount: Yup.string().optional(),
  recipient: Yup.string().optional(),
});
export const CreationFormSchema = Yup.object().shape({
  metaData: MetaDataSchema,
  action: GrantActionSchema,
});
