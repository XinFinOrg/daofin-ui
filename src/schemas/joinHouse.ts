import * as Yup from "yup";

export const JoinHouseFormSchema = Yup.object().shape({
  amount: Yup.number()
    .min(10000, "Must be greater than 10000")
    .required("Must not be empty"),
});
