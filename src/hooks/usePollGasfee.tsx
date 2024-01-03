import { constants } from "ethers";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useNetwork } from "../contexts/network";
import { fetchTokenPrice } from "../services/prices";
import { GasFeeEstimation } from "@aragon/sdk-client-common";

/**
 * This hook returns the gas estimation for a particular transaction and
 * the price of the native token in USD
 *
 * NOTE: Due to what is assumed to be temporary design changes, this hook
 * does not yet poll for the gas fees on interval
 *
 * @param estimationFunction function that estimates gas fee
 * @returns the average and maximum gas fee estimations, native token price
 * in USD, an error object if an error occurred while estimating,
 * and a function to stop the interval polling
 */
export const usePollGasFee = (
  estimationFunction: () => Promise<GasFeeEstimation | undefined>,
  shouldPoll = true,
  value = "0"
) => {
  const { network } = useNetwork();
  const [error, setError] = useState<Error | undefined>();
  const [maxFee, setMaxFee] = useState<BigInt | undefined>(BigInt(0));
  const [averageFee, setAverageFee] = useState<BigInt | undefined>(BigInt(0));
  const [tokenPrice, setTokenPrice] = useState<number>(0);

  const txFees = useMemo(() => {
    return maxFee && averageFee
      ? [
          { title: "Value (Ether)", tooltip: "", value },
          {
            title: "Estimated Gas fee (Gwei)",
            tooltip: "",
            value: averageFee.toString(),
          },
          { title: "Max Fee (Gwei)", tooltip: "", value: maxFee.toString() },
        ]
      : undefined;
  }, [averageFee, maxFee]);

  const txCosts = useMemo(() => {
    return averageFee && tokenPrice
      ? {
          tokenValue: averageFee.toString(),
          usdValue: tokenPrice.toString(),
        }
      : undefined;
  }, [tokenPrice, averageFee]);

  // estimate gas for DAO creation
  useEffect(() => {
    async function getFeesAndPrice() {
      try {
        const results = await Promise.all([
          estimationFunction(),
          fetchTokenPrice(constants.AddressZero, network),
        ]);

        setTokenPrice(results[1] || 0);
        setMaxFee(results[0]?.max);
        setAverageFee(results[0]?.average);
        setError(undefined);
      } catch (err) {
        setError(err as Error);
        setMaxFee(undefined);
        setAverageFee(undefined);
        console.log("Error fetching gas fees and price", err);
      }
    }

    if (shouldPoll) getFeesAndPrice();
  }, [estimationFunction, network, shouldPoll]);

  // stop polling in anticipation for polling at interval
  const stopPolling = useCallback(() => {
    setMaxFee(BigInt(0));
    setAverageFee(BigInt(0));
    setTokenPrice(0);
  }, []);
  return {
    error,
    tokenPrice,
    maxFee,
    averageFee,
    stopPolling,
    txCosts,
    txFees,
  };
};
