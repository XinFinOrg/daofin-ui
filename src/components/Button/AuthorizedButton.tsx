import { FC, PropsWithChildren, useEffect, useState } from "react";
import DefaultButton, { DefaultButtonProps } from "./DefaultButton";
import { useWallet } from "../../hooks/useWallet";
import { isAddress, zeroAddress } from "viem";
import useIsXDCValidatorCandidate from "../../hooks/useIsXDCValidatorCandidate";
import useIsUserDeposited from "../../hooks/useIsUserDeposited";
import useIsJudiciaryMember from "../../hooks/useIsJudiciaryMember";
import useIsMasterNodeDelegatee from "../../hooks/useIsMasterNodeDelegatee";
import useIsUserVotedOnProposal from "../../hooks/useIsUserVotedOnProposal";
import { FetchProposalStatusType } from "../../hooks/useFetchProposalStatus";
import { Modal } from "../Modal";

export type WalletAuthorizedButtonProps = PropsWithChildren &
  DefaultButtonProps & {};

const WalletAuthorizedButton: FC<WalletAuthorizedButtonProps> = (props) => {
  const { address, isOnWrongNetwork, network } = useWallet();
  const [isDisabled, setIsDisabled] = useState(false);

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

  const isDisabled =
    !address || isMasterNode || isDelegatee || isJury || isUserDeposited;

  return (
    <WalletAuthorizedButton {...props} isDisabled={isDisabled}>
      {props.children}
    </WalletAuthorizedButton>
  );
};

type VoteButtonProps = PropsWithChildren &
  DefaultButtonProps & {
    proposalId?: string;
    status: FetchProposalStatusType;
  };

const VoteButton: FC<VoteButtonProps> = (props) => {
  const { address } = useWallet();
  const { status } = props;
  const isMasterNode = useIsXDCValidatorCandidate(
    address ? address : zeroAddress
  );
  const isDelegatee = useIsMasterNodeDelegatee(address ? address : zeroAddress);
  const isJury = useIsJudiciaryMember(address ? address : zeroAddress);

  const isUserDeposited = useIsUserDeposited(address ? address : zeroAddress);

  const isUserVoted = useIsUserVotedOnProposal(props?.proposalId);

  const isDisabled =
    address &&
    status.isOpen &&
    !isMasterNode &&
    !isUserVoted &&
    (isDelegatee || isJury || isUserDeposited);

  return (
    <DefaultButton {...props} /*isDisabled={!isDisabled}*/>
      {props.children}
    </DefaultButton>
  );
};

type ExecuteProposalButtonProps = PropsWithChildren &
  DefaultButtonProps & {
    status: FetchProposalStatusType;
  };

const ExecuteProposalButton: FC<ExecuteProposalButtonProps> = (props) => {
  const { address } = useWallet();

  const { status } = props;

  const isDisabled = address && status && !status.executed && status.canExecute;

  return <DefaultButton {...props}>{props.children}</DefaultButton>;
};
export {
  WalletAuthorizedButton,
  MasterNodeAuthorizedButton,
  PeopleButton,
  VoteButton,
  ExecuteProposalButton,
};
