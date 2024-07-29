import * as Yup from "yup";

export const JoinHouseFormSchema = Yup.object().shape({
  amount: Yup.number()
    .min(1, "Must be greater that 10")
    .required("Must not be empty"),
});
