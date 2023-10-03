import React from "react";
import { useDaoQuery } from "../hooks/useDaoDetails";
import { formatDate, shortenAddress, toDisplayEns } from "../utils/networks";
import { useNetwork } from "../contexts/network";
import { useResolveDaoAvatar } from "../hooks/useResolveDaoAvatar";
import styled from "styled-components";

import useDaoGlobalSettings from "../hooks/useDaoGlobalSettings";
import { daoAddress, pluginAddress } from "../utils/constants";
import { formatEther, parseEther, parseUnits } from "@ethersproject/units";
import { Card, CardBody, CardFooter } from "@chakra-ui/card";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Heading, Spacer, Stack, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { Tag } from "@chakra-ui/tag";
import BoxWrapper from "./BoxWrapper";

const HeaderWrapper = styled(BoxWrapper).attrs({
  className: "w-100",
})``;

const DaoHeader = ({}) => {
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

  return (
    <>
      {isSuccess && !liveDaoLoading && liveDao && (
        <HeaderWrapper>
          <Card
            direction={{ base: "column", sm: "row" }}
            overflow="hidden"
            variant="outline"
            justifyContent={'center'}
          >
            <Stack justifyContent={'center'} alignItems={'center'}>
              <CardBody>
                <Heading size="md">Dao Name: {liveDao.metadata.name}</Heading>
                <Text>{liveAddressOrEns}</Text>
                <Text py="2">{liveDao.metadata.description}</Text>

                <Flex >
                  <Box className="mr-1">
                    <Tag>{new Date(liveDao.creationDate).toUTCString()}</Tag>
                  </Box>
                  <Spacer />
                  <Box className="mr-1">
                    <Tag>{liveDao?.plugins[0]?.id}</Tag>
                  </Box>
                  <Spacer />
                  <Box className="mr-1">
                    <Tag>{network}</Tag>
                  </Box>
                </Flex>
              </CardBody>
            </Stack>
          </Card>
        </HeaderWrapper>
      )}
    </>
  );
};

export default DaoHeader;
