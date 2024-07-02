import {
  FC,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
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
import { Box, HStack, Text } from "@chakra-ui/layout";
import { InfoTooltip } from "../Tooltip";
import { Link } from "react-router-dom";
import DefaultLink from "../DefaultLink";
import { getPluginInstallationId } from "../../utils/networks";
import useHasJoinedMasterNode from "../../hooks/contractHooks/useHasJoinedMasterNode";

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
  const hasJointoSenate = useHasJoinedMasterNode();
  const isValid = isMasterNode || hasJointoSenate;
  return (
    <WalletAuthorizedButton {...props} isDisabled={!isValid}>
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
    proposalId: string;
    status: FetchProposalStatusType;
    expired: boolean;
  };

const VoteButton: FC<VoteButtonProps> = (props) => {
  const { address, isOnWrongNetwork } = useWallet();
  const { status, proposalId, expired } = props;
  const isMasterNode = useIsXDCValidatorCandidate(
    address ? address : zeroAddress
  );
  const isDelegatee = useIsMasterNodeDelegatee(address ? address : zeroAddress);
  const isJury = useIsJudiciaryMember(address ? address : zeroAddress);
  const isUserDeposited = useIsUserDeposited(address ? address : zeroAddress);

  const isUserVoted = useIsUserVotedOnProposal(proposalId);

  const isDisabled =
    address &&
    status.isOpen &&
    !isMasterNode &&
    !isUserVoted &&
    !expired &&
    (isDelegatee || isJury || isUserDeposited);

  const { message, tooltip }: { message: ReactNode | string; tooltip: string } =
    useMemo(() => {
      if (!address)
        return {
          tooltip:
            "Wallet must be connected to be able to initiate the transaction",
          message: <Text>Wallet is not connected</Text>,
        };

      if (isOnWrongNetwork)
        return {
          tooltip: "Try to switch your network to supported networks",
          message: <Text>Wrong network</Text>,
        };
      if (expired)
        return {
          tooltip: "This proposal is no longer accepting any vote.",
          message: <Text>Voting is not available</Text>,
        };
      if (isUserVoted)
        return {
          tooltip:
            "Congrats! You have succussfully managed to participate on this proposal.",
          message: <Text>You have voted already.</Text>,
        };
      if (isMasterNode)
        return {
          tooltip:
            "Master Nodes must be onboarded in DAOFIN community first and then start voting.",
          message: (
            <DefaultLink to="/community/masternode-delegatee-senate">
              Would you like to join to Master Node Senate?
            </DefaultLink>
          ),
        };

      if (!(isDelegatee || isJury || isUserDeposited))
        return {
          tooltip:
            "Every individual wallet address that holds a cetain minimum amount XDC token can become a voter.",
          message: (
            <DefaultLink to="/community/peoples-house">
              Not part of Senate or Jury? Join people's House!
            </DefaultLink>
          ),
        };

      if (isDelegatee)
        return {
          tooltip:
            "If you vote as Senate member, your vote will capture in Master Node Senate community.",
          message: <Text>Your wallet has connected as a Senate member!</Text>,
        };

      if (isJury)
        return {
          tooltip:
            "If you vote as Jury, your vote will capture in Judiciaries community.",
          message: <Text>Your wallet has connected as a Jury member!</Text>,
        };

      if (isUserDeposited)
        return {
          tooltip:
            "If you vote as a House member, your vote will capture in People's House community.",
          message: <Text>Your wallet has connected as a House member!</Text>,
        };

      return {
        message: "",
        tooltip: "",
      };
    }, [
      address,
      status,
      isUserVoted,
      isMasterNode,
      isDelegatee,
      isJury,
      isUserVoted,
    ]);
  return (
    <Box>
      <DefaultButton {...props} isDisabled={!isDisabled} mb={2}>
        {props.children}
      </DefaultButton>
      {(tooltip || message) && (
        <HStack fontSize={"xs"}>
          <InfoTooltip label={tooltip} asLink hasArrow /> {message}
        </HStack>
      )}
    </Box>
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
