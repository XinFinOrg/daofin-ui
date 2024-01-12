import { useEffect, useMemo, useState } from "react";
import { useClient } from "./useClient";
import { useNetwork } from "../contexts/network";
import { BigNumberish } from "ethers";
import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
import { TokenType } from "@xinfin/osx-client-common";
import { BigNumber } from "ethers";
function useFetchDaoBalance() {
  const [amount, setAmount] = useState<BigNumberish>();
  const { daofinClient, client } = useClient();
  const [error, setError] = useState<Error>();
  const [isLoading, setIsLoading] = useState(false);
  const { daoAddress } = useAppGlobalConfig();

  useEffect(() => {
    if (!client) return;
    setIsLoading(true);

    client.web3
      .getProvider()
      .getBalance(daoAddress)

      .then((data) => {
        setIsLoading(false);
        if (!data) return;

        setAmount(data);
      })
      .catch((e) => {
        setIsLoading(false);
        console.log("error", e);
      });
  }, [daofinClient]);

  return { data: amount, isLoading };
}
export default useFetchDaoBalance;
