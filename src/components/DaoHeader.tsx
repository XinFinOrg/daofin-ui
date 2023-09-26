import React from "react";
import { CardWallet, HeaderDao } from "@aragon/ods";
import { useDaoQuery } from "../hooks/useDaoDetails";
import { formatDate, shortenAddress, toDisplayEns } from "../utils/networks";
import { useNetwork } from "../contexts/network";
import { useResolveDaoAvatar } from "../hooks/useResolveDaoAvatar";
import styled from "styled-components";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import useDaoGlobalSettings from "../hooks/useDaoGlobalSettings";
import { daoAddress, pluginAddress } from "../utils/constants";
import { formatEther, parseEther, parseUnits } from "@ethersproject/units";

const HeaderWrapper = styled.div.attrs({
  className:
    " justify-center	w-screen -mx-2 tablet:col-span-full tablet:w-full tablet:mx-0 desktop:col-start-2 desktop:col-span-10 tablet:mt-3",
})``;

const DaoHeader = ({}) => {
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

  const globalSettings = useDaoGlobalSettings(daoAddress);

  return (
    <>
      <HeaderWrapper>
        {isSuccess && !liveDaoLoading && liveDao && (
          <Card className="mt-6 w-96">
            <CardBody>
              <Typography variant="h5" color="blue-gray" className="mb-2">
                Dao Name: {liveDao.metadata.name}
              </Typography>
              <Typography>{liveAddressOrEns}</Typography>

              {globalSettings && (
                <div>
                  <Typography>
                    Allowed Amounts:
                    {globalSettings.allowedAmounts
                      .map((amount) => formatEther(amount.toString()))
                      .join(" XDC, ")}
                  </Typography>
                  <Typography>
                    Master Node Numbers:{" "}
                    {globalSettings.totalNumberOfMasterNodes.toString()}
                  </Typography>
                  <Typography>
                    {shortenAddress(globalSettings.xdcValidator.toString())}
                  </Typography>
                </div>
              )}
            </CardBody>
            <CardFooter className="pt-0">
              <Typography>
                <Button className="mr-1 mt-1">
                  {formatDate(
                    liveDao.creationDate.getTime() / 1000,
                    "MMMM yyyy"
                  ).toString()}
                </Button>
                <Button className="mr-1 mt-1">{liveDao?.plugins[0]?.id}</Button>
                <Button className="mr-1 mt-1">{network}</Button>
              </Typography>
            </CardFooter>
          </Card>
        )}
      </HeaderWrapper>
    </>
  );
};

export default DaoHeader;
