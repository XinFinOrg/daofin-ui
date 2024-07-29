
import BoxWrapper from "./BoxWrapper";
import { Box, Flex, Heading, Text } from "@chakra-ui/layout";
import useFetchJudiciaries from "../hooks/useFetchJudiciaries";
import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
import { shortenAddress } from "../utils/networks";
import Modal from "./Modal/Modal";
import { useDisclosure } from "@chakra-ui/hooks";
import { FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup } from "@chakra-ui/input";
import { Tooltip } from "@chakra-ui/tooltip";
import { Button } from "@chakra-ui/button";
import { useClient } from "../hooks/useClient";
import { AddJudiciarySteps } from "@xinfin/osx-daofin-sdk-client";
import WithConnectedWallet from "./WithConnectedWallet";
import useIsJudiciaryMember from "../hooks/useIsJudiciaryMember";
import { useWallet } from "../hooks/useWallet";

const ManageJudiciary = () => {
  const { daoAddress, pluginAddress } = useAppGlobalConfig();
  const { data } = useFetchJudiciaries(daoAddress, pluginAddress);
  const { onClose, isOpen, onOpen } = useDisclosure();
  const { address: connectedAddress } = useWallet();
  // const { setValue, getValues, register, watch } = useForm({
  //   defaultValues: {
  //     address: "",
  //   },
  // });
  // const address = watch("address");

  const { daofinClient } = useClient();
  const handleAddJudiciary = async () => {
    // const iterator = daofinClient?.methods.addjudiciary(address);

    // if (!iterator) return;
    // try {
    //   for await (const step of iterator) {
    //     switch (step.key) {
    //       case AddJudiciarySteps.ADDING:
    //         console.log(step.txHash);
    //         break;
    //       case AddJudiciarySteps.DONE: {
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
  const isJudiciary = useIsJudiciaryMember(
    connectedAddress ? connectedAddress : ""
  );
  return (
    <>
      <BoxWrapper>
        <Heading size="md">Manage Judiciaries</Heading>
        <WithConnectedWallet>
          <Box className="m-4 text-end">
            <Tooltip aria-label="A tooltip" isDisabled={isJudiciary}>
              <Button
                colorScheme="green"
                onClick={onOpen}
                isDisabled={!isJudiciary}
              >
                +
              </Button>
            </Tooltip>
          </Box>
        </WithConnectedWallet>
        <Flex className="w-full flex-col">
          {data?.length > 0 &&
            data.map(
              ({ action, creationDate, id, member, snapshotBlock, txHash }) => {
                return (
                  <BoxWrapper key={id}>
                    <Text>Member: {shortenAddress(member)}</Text>
                    <Text color={'gray'}>
                      {`@ ${snapshotBlock.toString()}`}
                    </Text>
                  </BoxWrapper>
                );
              }
            )}
        </Flex>
        {isOpen && (
          <Modal isOpen={isOpen} onClose={onClose} title="Add Judiciary">
            <Box>
              <FormLabel>Address</FormLabel>
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
                <Button colorScheme="blue" onClick={handleAddJudiciary}>
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

export default ManageJudiciary;
