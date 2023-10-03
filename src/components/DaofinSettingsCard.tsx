import React, { useEffect } from "react";
import { useDaoQuery } from "../hooks/useDaoDetails";
import { formatDate, shortenAddress, toDisplayEns } from "../utils/networks";
import { useNetwork } from "../contexts/network";
import { useResolveDaoAvatar } from "../hooks/useResolveDaoAvatar";
import styled from "styled-components";

import useDaoGlobalSettings from "../hooks/useDaoGlobalSettings";
import { daoAddress, pluginAddress } from "../utils/constants";
import { formatEther, parseEther, parseUnits } from "@ethersproject/units";
import { Box, Flex, Heading, Spacer, Stack, Text } from "@chakra-ui/layout";
import { Card, CardBody } from "@chakra-ui/card";
import useDaoElectionPeriods from "../hooks/useDaoElectionPeriods";
import { BigNumber } from "ethers";
import BoxWrapper from "./BoxWrapper";
import { v4 as uuid } from "uuid";
const HeaderWrapper = styled(BoxWrapper).attrs({
  className: "w-100",
})``;

const DaofinSettingsCard = ({}) => {
  const {
    data: liveDao,
    isLoading: liveDaoLoading,
    isSuccess,
  } = useDaoQuery(daoAddress, 5000);
  console.log({ liveDao });
  const { avatar: liveDaoAvatar } = useResolveDaoAvatar(
    liveDao?.metadata?.avatar
  );
  const { network } = useNetwork();
  const liveAddressOrEns = toDisplayEns(liveDao?.ensDomain) || liveDao?.address;

  const globalSettings = useDaoGlobalSettings();
  const electionPeriods = useDaoElectionPeriods();
  console.log({ electionPeriods });

  return (
    <>
      <HeaderWrapper>
        {isSuccess && !liveDaoLoading && liveDao && (
          <Card
            direction={{ base: "column" }}
            overflow="hidden"
            variant="outline"
            justifyContent={"start"}
          >
            <Stack direction={"column"} justifyContent={"space-around"}>
              <CardBody>
                <Flex className="flex-col items-start">
                  <Box className="mb-4">
                    <Heading className="text-start" size="md" mb={"1"}>
                      Allowed Amounts:
                    </Heading>
                    <Flex className="flex-row justify-start">
                      {globalSettings && (
                        <>
                          {globalSettings.allowedAmounts.map((amount) => (
                            <BoxWrapper key={uuid()} className="m-3">
                              {`${formatEther(amount.toString())} XDC`}
                            </BoxWrapper>
                          ))}
                        </>
                      )}
                    </Flex>
                  </Box>
                  <Box className="mb-4">
                    <Heading className="text-start" size="md" mb={"1"}>
                      Election Periods:
                    </Heading>
                    <Flex className="flex-row justify-start">
                      {electionPeriods &&
                        electionPeriods?.length > 0 &&
                        electionPeriods.map((period) => (
                          <BoxWrapper className="m-4">
                            <Text>
                              <strong>Start Date:</strong>
                              {new Date(period.startDate).toUTCString()}
                            </Text>
                            <Text>
                              <strong>End Date:</strong>
                              {new Date(period.endDate).toUTCString()}
                            </Text>
                            <br />
                          </BoxWrapper>
                        ))}
                    </Flex>
                  </Box>
                  <Box className="mb-4">
                    <Heading className="text-start" size="md" mb={"1"}>
                      Global Settings:
                    </Heading>
                    <Flex className="flex-row justify-start">
                      {globalSettings && (
                        <BoxWrapper className="m-4">
                          <Text>
                            Master Node Numbers:{" "}
                            {globalSettings.totalNumberOfMasterNodes.toString()}
                          </Text>
                          <Text>
                            {shortenAddress(
                              globalSettings.xdcValidator.toString()
                            )}
                          </Text>
                        </BoxWrapper>
                      )}
                    </Flex>
                  </Box>
                </Flex>
              </CardBody>
            </Stack>
          </Card>
        )}
      </HeaderWrapper>
    </>
  );
};

export default DaofinSettingsCard;
