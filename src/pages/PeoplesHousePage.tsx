import { Box } from "@chakra-ui/layout";
import React, { useEffect } from "react";
import PeoplesHouseDeposits from "../components/PeoplesHouseDeposits";
import { DepositSteps } from "@xinfin/osx-daofin-sdk-client";
import { formatEther, parseEther } from "@ethersproject/units";
import { CHAIN_METADATA, getPluginInstallationId } from "../utils/networks";
import usePeoplesHouseDeposits from "../hooks/useDeposits";
import { useDisclosure } from "@chakra-ui/hooks";
import useIsUserDeposited from "../hooks/useIsUserDeposited";
import { useNetwork } from "../contexts/network";
import { useClient } from "../hooks/useClient";
import { useWallet } from "../hooks/useWallet";
import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
import Modal from "../components/Modal";
import { FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightAddon } from "@chakra-ui/input";
import BoxWrapper from "../components/BoxWrapper";
import { Tooltip } from "@chakra-ui/tooltip";
import { Button } from "@chakra-ui/button";
import useDaoGlobalSettings from "../hooks/useDaoGlobalSettings";
import { Select } from "@chakra-ui/select";
import { option } from "yargs";
import { use } from "chai";
import WithConnectedWallet from "../components/WithConnectedWallet";
import useIsJudiciaryMember from "../hooks/useIsJudiciaryMember";

const PeoplesHousePage = () => {
  const { daoAddress, pluginAddress } = useAppGlobalConfig();

  const { address: voterAddress } = useWallet();

  const { daofinClient } = useClient();
  const { network } = useNetwork();
  const isUserDeposited = useIsUserDeposited(voterAddress ? voterAddress : "");
  const isJudiciaryMember = useIsJudiciaryMember(
    voterAddress ? voterAddress : ""
  );

  const showAddNewButton = isJudiciaryMember || isUserDeposited;
  
  
  const { isOpen, onClose, onOpen } = useDisclosure();

  // const { setValue, getValues, register, watch } = useForm({
  //   defaultValues: {
  //     depositAmount: "",
  //   },
  // });
  // const depositAmount = watch(["depositAmount"]);

  const { data: deposits } = usePeoplesHouseDeposits(
    getPluginInstallationId(daoAddress, pluginAddress)
  );
  const globalSettings = useDaoGlobalSettings();
  useEffect(() => {
    if (!globalSettings || !globalSettings.allowedAmounts) return;

    // setValue("depositAmount", globalSettings.allowedAmounts[0].toString());
  }, [globalSettings]);
  const handleDeposit = async () => {
    // const { depositAmount } = getValues();

    // const parsedAmount = depositAmount;
    // const depositIterator = daofinClient?.methods.deposit(parsedAmount);
    // if (!depositIterator) return;
    // try {
    //   for await (const step of depositIterator) {
    //     switch (step.key) {
    //       case DepositSteps.DEPOSITING:
    //         console.log(step.txHash);

    //         break;
    //       case DepositSteps.DONE: {
    //         console.log("DONE", step.key, step.key);
    //         onClose();
    //         break;
    //       }
    //     }
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
  };

  const handleOnChange = (e: any) => {
    const name = e.target.name;
    const value = e.target.value;
    // setValue(name, value);
  };
  return (
    <>
      <Box className="grid grid-cols-3">
        <Box className="col-start-2">
          <WithConnectedWallet>
            <Tooltip isDisabled={showAddNewButton} aria-label="A tooltip">
              <Button
                colorScheme="green"
                isDisabled={showAddNewButton}
                onClick={onOpen}
              >
                Add a new
              </Button>
            </Tooltip>
          </WithConnectedWallet>
          {deposits && <PeoplesHouseDeposits deposits={deposits} />}
        </Box>
      </Box>
      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose} title="Deposit">
          <Box>
            <FormLabel>Amount</FormLabel>
            <InputGroup className="m-1">
              <Select 
              // {...register("depositAmount", {})}
              >
                {globalSettings?.allowedAmounts.map((amount) => (
                  <option value={amount.toString()}>
                    {formatEther(amount.toString())}
                    {CHAIN_METADATA[network].nativeCurrency.symbol}
                  </option>
                ))}
              </Select>
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

export default PeoplesHousePage;
