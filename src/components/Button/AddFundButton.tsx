import { FC, PropsWithChildren } from "react";
import DefaultButton, { DefaultButtonProps } from "./DefaultButton";
import {
  WalletAuthorizedButton,
  WalletAuthorizedButtonProps,
} from "./AuthorizedButton";
import {
  DaoTreasuryProvider,
  useDaoTreasury,
} from "../../contexts/DaoTreasuryContext";
import { Formik } from "formik";

export interface AddFundButtonProps extends WalletAuthorizedButtonProps {}

export const AddFund: FC<PropsWithChildren> = (props) => {
  return (
    <Formik
      initialValues={{
        amount: "",
      }}
      onSubmit={() => {}}
    >
      <DaoTreasuryProvider>
        <AddFundButton variant="outline" w={'full'}>+ Add fund</AddFundButton>
      </DaoTreasuryProvider>
    </Formik>
  );
};
const AddFundButton: FC<AddFundButtonProps> = (props) => {
  const { handleToggleFormModal } = useDaoTreasury();

  return (
    <WalletAuthorizedButton {...props} onClick={handleToggleFormModal}>
      {props.children}
    </WalletAuthorizedButton>
  );
};
export default AddFundButton;
