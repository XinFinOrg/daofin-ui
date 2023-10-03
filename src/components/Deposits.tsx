import React, { FC } from "react";
import { Deposit } from "../utils/types";
import { Box, Flex, Heading, Text } from "@chakra-ui/layout";
import {
  CHAIN_METADATA,
  getPluginInstallationId,
  shortenAddress,
} from "../utils/networks";
import { formatEther, parseEther } from "@ethersproject/units";
import BoxWrapper from "./BoxWrapper";
import { styled } from "styled-components";
import { Button } from "@chakra-ui/button";
import useIsUserDeposited from "../hooks/useIsUserDeposited";
import useIsUserVotedOnProposal from "../hooks/useIsUserVotedOnProposal";
import { useWallet } from "../hooks/useWallet";
import { Tooltip } from "@chakra-ui/tooltip";
import { useForm } from "react-hook-form";
import { useDisclosure } from "@chakra-ui/hooks";
import { useClient } from "../hooks/useClient";
import { DepositSteps } from "@xinfin/osx-daofin-sdk-client";
import useDeposits from "../hooks/useDeposits";
import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
import { FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightAddon } from "@chakra-ui/input";
import { useNetwork } from "../contexts/network";
import Modal from "./Modal";

const DepositWrapper = styled(BoxWrapper).attrs({
  className: "m-4 w-100",
})``;

const Deposits: FC = () => {
  const { daoAddress, pluginAddress } = useAppGlobalConfig();

  const { address: voterAddress } = useWallet();

  const { daofinClient } = useClient();
  const { network } = useNetwork();
  const isUserDeposited = useIsUserDeposited(voterAddress ? voterAddress : "");

  const { isOpen, onClose, onOpen } = useDisclosure();

  const { setValue, getValues, register } = useForm({
    defaultValues: {
      depositAmount: 0,
    },
  });

  const { data: deposits } = useDeposits(
    getPluginInstallationId(daoAddress, pluginAddress)
  );

  const handleDeposit = async () => {
    const { depositAmount } = getValues();
    const parsedAmount = parseEther(String(depositAmount));
    const depositIterator = daofinClient?.methods.deposit(parsedAmount);
    if (!depositIterator) return;
    try {
      for await (const step of depositIterator) {
        switch (step.key) {
          case DepositSteps.DEPOSITING:
            console.log(step.txHash);

            break;
          case DepositSteps.DONE: {
            console.log("DONE", step.key, step.key);
            onClose();
            break;
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnChange = (e: any) => {
    const name = e.target.name;
    const value = e.target.value;
    setValue(name, value);
  };
  return (
    <>
      {
        <BoxWrapper>
          <Heading size="md">Deposits</Heading>
          <Box className="m-4 text-end">
            <Tooltip isDisabled={isUserDeposited} aria-label="A tooltip">
              <Button
                colorScheme="green"
                isDisabled={isUserDeposited}
                onClick={onOpen}
              >
                +
              </Button>
            </Tooltip>
          </Box>
          {deposits && deposits.length > 0 ? (
            deposits.map(({ amount, id, snapshotBlock, voter }) => (
              <DepositWrapper>
                <Flex key={id} className="flex-col justify-start items-start">
                  <Text>Voter: {shortenAddress(voter)}</Text>
                  <Text>Amount: {formatEther(amount)}</Text>
                  <Text>At Block: {snapshotBlock.toString()}</Text>
                </Flex>
              </DepositWrapper>
            ))
          ) : (
            <>No Deposit</>
          )}
        </BoxWrapper>
      }
      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose} title="Deposit">
          <Box>
            <FormLabel>Amount</FormLabel>
            <InputGroup className="m-1">
              <Input
                {...register("depositAmount", {
                  valueAsNumber: true,
                })}
                onChange={handleOnChange}
                placeholder="amount"
              />
              <InputRightAddon
                children={CHAIN_METADATA[network].nativeCurrency.symbol}
              />
            </InputGroup>
            <Tooltip isDisabled={isUserDeposited} aria-label="A tooltip">
              <Button
                colorScheme="blue"
                isDisabled={isUserDeposited}
                onClick={handleDeposit}
              >
                Deposit
              </Button>
            </Tooltip>
          </Box>
        </Modal>
      )}
    </>
  );
};

export default Deposits;
