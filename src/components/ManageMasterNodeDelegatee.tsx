import React from "react";
import BoxWrapper from "./BoxWrapper";
import { Box, Flex, Heading, Text } from "@chakra-ui/layout";
import useFetchJudiciaries from "../hooks/useFetchJudiciaries";
import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
import { shortenAddress, shortenTxHash } from "../utils/networks";
import Modal from "./Modal/Modal";
import { useDisclosure } from "@chakra-ui/hooks";
import { FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup } from "@chakra-ui/input";
import { Tooltip } from "@chakra-ui/tooltip";
import { Button } from "@chakra-ui/button";
import { useClient } from "../hooks/useClient";
import {
  AddJudiciarySteps,
  UpdateOrJoinMasterNodeDelegateeSteps,
} from "@xinfin/osx-daofin-sdk-client";
import WithConnectedWallet from "./WithConnectedWallet";
import useIsJudiciaryMember from "../hooks/useIsJudiciaryMember";
import { useWallet } from "../hooks/useWallet";
import useIsXDCValidatorCandidate from "../hooks/useIsXDCValidatorCandidate";
import useFetchMasterNodeDelegatee from "../hooks/useFetchMasterNodeDelegatee";

const ManageMasterNodeDelegatee = () => {
  const { daoAddress, pluginAddress } = useAppGlobalConfig();
  const { data } = useFetchMasterNodeDelegatee(daoAddress, pluginAddress);
  const { onClose, isOpen, onOpen } = useDisclosure();
  const { address: connectedAddress } = useWallet();
  // const { setValue, getValues, register, watch } = useForm({
  //   defaultValues: {
  //     address: "",
  //   },
  // });
  // const address = watch("address");

  const { daofinClient } = useClient();
  const handleAddDelegatee = async () => {
    // const iterator =
    //   daofinClient?.methods.updateOrJoinMasterNodeDelegatee(address);

    // if (!iterator) return;
    // try {
    //   for await (const step of iterator) {
    //     switch (step.key) {
    //       case UpdateOrJoinMasterNodeDelegateeSteps.WAITING:
    //         console.log(step.txHash);
    //         break;
    //       case UpdateOrJoinMasterNodeDelegateeSteps.DONE: {
    //         console.log("DONE", step.key);
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
  const isMasterNode = useIsXDCValidatorCandidate(
    connectedAddress ? connectedAddress : ""
  );
  console.log({ isMasterNode });

  const showButton = isMasterNode;
  return (
    <>
      <BoxWrapper>
        <Heading size="md">Manage Master Node Delegatee</Heading>
        <WithConnectedWallet>
          <Box className="m-4 text-end">
            <Tooltip aria-label="A tooltip" isDisabled={showButton}>
              <Button
                colorScheme="green"
                onClick={onOpen}
                isDisabled={!showButton}
              >
                +
              </Button>
            </Tooltip>
          </Box>
        </WithConnectedWallet>
        <Flex className="w-full flex-col">
          {data?.length > 0 ? (
            data.map(
              ({
                action,
                creationDate,
                masterNode,
                id,
                member,
                snapshotBlock,
                txHash,
              }) => {
                return (
                  <BoxWrapper key={id}>
                    <Text>Master Node: {shortenAddress(masterNode)}</Text>
                    <Text>Delegatee: {shortenAddress(member)}</Text>
                    <Text>At TX: {shortenTxHash(txHash?.toString())}</Text>
                  </BoxWrapper>
                );
              }
            )
          ) : (
            <Text>No Item</Text>
          )}
        </Flex>
        {isOpen && (
          <Modal isOpen={isOpen} onClose={onClose} title="Add Delegatee">
            <Box>
              <FormLabel>Delegatee Address</FormLabel>
              <InputGroup className="m-1">
                <Input
                  // {...register("address", {
                  //   required: true,
                  // })}
                  onChange={handleOnChange}
                  placeholder="0x...."
                />
              </InputGroup>
              <Tooltip aria-label="A tooltip">
                <Button colorScheme="blue" onClick={handleAddDelegatee}>
                  Add
                </Button>
              </Tooltip>
            </Box>
          </Modal>
        )}
      </BoxWrapper>
    </>
  );
};

export default ManageMasterNodeDelegatee;
