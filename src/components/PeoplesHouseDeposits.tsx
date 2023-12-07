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
import { useDisclosure } from "@chakra-ui/hooks";
import { useClient } from "../hooks/useClient";
import { DepositSteps } from "@xinfin/osx-daofin-sdk-client";
import usePeoplesHouseDeposits from "../hooks/useDeposits";
import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
import { FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightAddon } from "@chakra-ui/input";
import { useNetwork } from "../contexts/network";
import Modal from "./Modal";

const DepositWrapper = styled(BoxWrapper).attrs({
  className: "m-4 w-100",
})``;
type DepositsProps = {
  deposits: Deposit[];
};
const PeoplesHouseDeposits: FC<DepositsProps> = () => {
  const { daoAddress, pluginAddress } = useAppGlobalConfig();

  const { address: voterAddress } = useWallet();

  const isUserDeposited = useIsUserDeposited(voterAddress ? voterAddress : "");

  const { data: deposits } = usePeoplesHouseDeposits(
    getPluginInstallationId(daoAddress, pluginAddress)
  );

  return (
    <>
      {
        <BoxWrapper>
          <Heading size="md">People's House Members</Heading>
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
            <>No Item</>
          )}
        </BoxWrapper>
      }
    </>
  );
};

export default PeoplesHouseDeposits;
