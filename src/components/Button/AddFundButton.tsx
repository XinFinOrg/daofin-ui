import { FC, PropsWithChildren } from "react";
import {
  WalletAuthorizedButton,
  WalletAuthorizedButtonProps,
} from "./AuthorizedButton";
import {
  DaoTreasuryProvider,
  useDaoTreasury,
} from "../../contexts/DaoTreasuryContext";
import { Formik } from "formik";
import { useTranslation } from "react-i18next";

export interface AddFundButtonProps extends WalletAuthorizedButtonProps {}

export const AddFund: FC<PropsWithChildren> = () => {
  const { t } = useTranslation();
  return (
    <Formik
      initialValues={{
        amount: "",
      }}
      onSubmit={() => {}}
    >
      <DaoTreasuryProvider>
        <AddFundButton variant="outline" w={"full"}>
          + {t("dashboard.addFund")}
        </AddFundButton>
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
