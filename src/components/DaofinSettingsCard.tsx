import React, { useEffect } from "react";
import { useDaoQuery } from "../hooks/useDaoDetails";
import {
  CHAIN_METADATA,
  JudiciaryCommittee,
  MasterNodeCommittee,
  PeoplesHouseCommittee,
  formatDate,
  shortenAddress,
  toDisplayEns,
} from "../utils/networks";
import { useNetwork } from "../contexts/network";
import { useResolveDaoAvatar } from "../hooks/useResolveDaoAvatar";
import styled from "styled-components";

import useDaoGlobalSettings from "../hooks/useDaoGlobalSettings";
import { daoAddress, pluginAddress } from "../utils/constants";
import { formatEther, parseEther, parseUnits } from "@ethersproject/units";
import { Box, Flex, Heading, Spacer, Stack, Text } from "@chakra-ui/layout";
import { Card, CardBody } from "@chakra-ui/card";
import useDaoElectionPeriods from "../hooks/useDaoElectionPeriods";

import BoxWrapper from "./BoxWrapper";
import { v4 as uuid } from "uuid";
import useFetchTotalNumbersByCommittee from "../hooks/useFetchTotalNumbersByCommittee";
import useFetchGlobalCommitteeToVotingSettings from "../hooks/useFetchGlobalCommitteeToVotingSettings";
import { utils, BigNumberish, BigNumber } from "ethers";

const HeaderWrapper = styled(BoxWrapper).attrs({
  className: "w-100",
})``;

const DaofinSettingsCard = ({}) => {
  const {
    data: liveDao,
    isLoading: liveDaoLoading,
    isSuccess,
  } = useDaoQuery(daoAddress, 5000);
  const { avatar: liveDaoAvatar } = useResolveDaoAvatar(
    liveDao?.metadata?.avatar
  );
  const { network } = useNetwork();
  const liveAddressOrEns = toDisplayEns(liveDao?.ensDomain) || liveDao?.address;

  const globalSettings = useDaoGlobalSettings();
  const electionPeriods = useDaoElectionPeriods();
  const totalNumberOfMns = useFetchTotalNumbersByCommittee(MasterNodeCommittee);
  // Formula: Reaching at Min Participations: Min Participations >= All Total Member

  const totalNumberOfPeoplesHouse = useFetchTotalNumbersByCommittee(
    PeoplesHouseCommittee
  );
  const totalNumberOfJudiciary =
    useFetchTotalNumbersByCommittee(JudiciaryCommittee);

  const globalMasterNodeCommitteeToVotingSettings =
    useFetchGlobalCommitteeToVotingSettings(MasterNodeCommittee);

  const globalJudiciaryCommitteeToVotingSettings =
    useFetchGlobalCommitteeToVotingSettings(JudiciaryCommittee);

  const globalPeoplesHouseCommitteeToVotingSettings =
    useFetchGlobalCommitteeToVotingSettings(PeoplesHouseCommittee);

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
                          {
                            <BoxWrapper key={uuid()} className="m-3">
                              {`${formatEther(
                                globalSettings.houseMinAmount.toString()
                              )} XDC`}
                            </BoxWrapper>
                          }
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
                      {totalNumberOfMns?.toString() && (
                        <BoxWrapper className="m-4">
                          <Text>
                            Master Node Numbers: {totalNumberOfMns.toString()}
                          </Text>
                        </BoxWrapper>
                      )}
                      {totalNumberOfJudiciary?.toString() && (
                        <BoxWrapper className="m-4">
                          <Text>
                            Total Number of Judiciaries:{" "}
                            {totalNumberOfJudiciary.toString()}
                          </Text>
                        </BoxWrapper>
                      )}
                      {totalNumberOfPeoplesHouse?.toString() && (
                        <BoxWrapper className="m-4">
                          <Text>
                            {CHAIN_METADATA[network].nativeCurrency.symbol}{" "}
                            Total Supply:{" "}
                            {formatEther(totalNumberOfPeoplesHouse.toString())}{" "}
                            {CHAIN_METADATA[network].nativeCurrency.symbol}
                          </Text>
                        </BoxWrapper>
                      )}
                      {globalSettings && (
                        <BoxWrapper className="m-4">
                          <Text>
                            XDC Validator Contract @{" "}
                            {shortenAddress(
                              globalSettings.xdcValidator.toString()
                            )}
                          </Text>
                        </BoxWrapper>
                      )}
                    </Flex>
                  </Box>

                  <Box className="mb-4">
                    <Heading className="text-start" size="md" mb={"1"}>
                      Rules:
                    </Heading>
                    <Flex className="flex-row justify-start">
                      {globalMasterNodeCommitteeToVotingSettings &&
                        totalNumberOfMns?.toString() && (
                          <BoxWrapper className="m-4">
                            <Text>
                              <strong>Master Node Delegatee Senate</strong>
                            </Text>
                            <Text>
                              Quorum:{" "}
                              {convertUint32ToPercentage(
                                globalMasterNodeCommitteeToVotingSettings.minParticipation.toString()
                              )}
                              % of {totalNumberOfMns.toString()}
                            </Text>
                            <Text>
                              Pass Rate:{" "}
                              {convertUint32ToPercentage(
                                globalMasterNodeCommitteeToVotingSettings.supportThreshold.toString()
                              )}
                              % of {totalNumberOfMns.toString()}
                            </Text>
                          </BoxWrapper>
                        )}
                      {globalJudiciaryCommitteeToVotingSettings &&
                        totalNumberOfJudiciary?.toString() && (
                          <BoxWrapper className="m-4">
                            <Text>
                              <strong>Judiciary Senate</strong>
                            </Text>
                            <Text>
                              Quorum:{" "}
                              {convertUint32ToPercentage(
                                globalJudiciaryCommitteeToVotingSettings.minParticipation.toString()
                              )}
                              % of {totalNumberOfJudiciary.toString()}
                            </Text>
                            <Text>
                              Pass Rate:{" "}
                              {convertUint32ToPercentage(
                                globalJudiciaryCommitteeToVotingSettings.supportThreshold.toString()
                              )}
                              % of {totalNumberOfJudiciary.toString()}
                            </Text>
                          </BoxWrapper>
                        )}
                      {globalPeoplesHouseCommitteeToVotingSettings &&
                        totalNumberOfPeoplesHouse?.toString() && (
                          <BoxWrapper className="m-4">
                            <Text>
                              <strong>People's House</strong>
                            </Text>
                            <Text>
                              Quorum:{" "}
                              {convertUint32ToPercentage(
                                globalPeoplesHouseCommitteeToVotingSettings.minParticipation.toString()
                              )}
                              % of{" "}
                              {formatEther(
                                totalNumberOfPeoplesHouse.toString()
                              )}{" "}
                              {CHAIN_METADATA[network].nativeCurrency.symbol}
                            </Text>
                            <Text>
                              Pass Rate:{" "}
                              {convertUint32ToPercentage(
                                globalPeoplesHouseCommitteeToVotingSettings.supportThreshold.toString()
                              )}
                              % of{" "}
                              {formatEther(
                                totalNumberOfPeoplesHouse.toString()
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
function convertUint32ToPercentage(value: BigNumberish) {
  return utils.formatUnits(BigNumber.from(value).mul(BigNumber.from(100)), 6);
}
export default DaofinSettingsCard;
