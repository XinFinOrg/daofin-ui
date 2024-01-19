import {
  Button,
  ButtonProps,
  Tooltip,
  useColorModeValue,
  useTheme,
} from "@chakra-ui/react";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import DefaultButton, { DefaultButtonProps } from "./DefaultButton";
import { useWallet } from "../../hooks/useWallet";
import { isAddress, zeroAddress } from "viem";
import useIsXDCValidatorCandidate from "../../hooks/useIsXDCValidatorCandidate";
import useIsUserDeposited from "../../hooks/useIsUserDeposited";
import useIsJudiciaryMember from "../../hooks/useIsJudiciaryMember";
import useIsMasterNodeDelegatee from "../../hooks/useIsMasterNodeDelegatee";

export type WalletAuthorizedButtonProps = PropsWithChildren &
  DefaultButtonProps & {};

const WalletAuthorizedButton: FC<WalletAuthorizedButtonProps> = (props) => {
  const { address, isOnWrongNetwork, network } = useWallet();
  const [isDisabled, setIsDisabled] = useState(false);
  const [disabledMessage, setDisabledMessage] = useState("");

  useEffect(() => {
    if (!(address && isAddress(address)) || isOnWrongNetwork) {
      setIsDisabled(true);
    }
  }, [address, network]);

  useEffect(() => {
    setIsDisabled(!!props.isDisabled);
  }, [props.isDisabled]);
  return (
    <DefaultButton isDisabled={isDisabled} colorScheme={"blue"} {...props}>
      {props.children}
    </DefaultButton>
  );
};

type MasterNodeAuthorizedButtonProps = PropsWithChildren &
  DefaultButtonProps & {};

const MasterNodeAuthorizedButton: FC<MasterNodeAuthorizedButtonProps> = (
  props
) => {
  const { address } = useWallet();

  const isMasterNode = useIsXDCValidatorCandidate(
    address ? address : zeroAddress
  );

  return (
    <WalletAuthorizedButton {...props} isDisabled={!isMasterNode}>
      {props.children}
    </WalletAuthorizedButton>
  );
};

type PeopleButtonProps = PropsWithChildren & DefaultButtonProps & {};

const PeopleButton: FC<PeopleButtonProps> = (props) => {
  const { address } = useWallet();

  const isMasterNode = useIsXDCValidatorCandidate(
    address ? address : zeroAddress
  );
  const isDelegatee = useIsMasterNodeDelegatee(address ? address : zeroAddress);
  const isJury = useIsJudiciaryMember(address ? address : zeroAddress);

  const isUserDeposited = useIsUserDeposited(address ? address : zeroAddress);

  const isDisabled = isMasterNode || isDelegatee || isJury || isUserDeposited;
  return (
    <WalletAuthorizedButton {...props} isDisabled={isDisabled}>
      {props.children}
    </WalletAuthorizedButton>
  );
};

export { WalletAuthorizedButton, MasterNodeAuthorizedButton, PeopleButton };
