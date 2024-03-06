import {
  ASSET_PLATFORMS,
  BASE_URL,
  NATIVE_TOKEN_ID,
  SupportedNetworks,
} from "../utils/networks";
import { isNativeToken } from "../utils/tokens";

export async function fetchTokenPrice(
  address: string,
  network: SupportedNetworks,
  _?: string
): Promise<number | undefined> {
  // check if token address is address zero, ie, native token of platform
  const nativeToken = isNativeToken(address);
  let fetchAddress = address;
  let fetchNetwork = network;

  // network unsupported, or testnet
  const platformId = ASSET_PLATFORMS[fetchNetwork];
  if (!platformId && !nativeToken) return;

  // build url based on whether token is ethereum
  const endPoint = `/simple/token_price/${platformId}?vs_currencies=usd&contract_addresses=`;
  const url = nativeToken
    ? `${BASE_URL}/simple/price?ids=${getNativeTokenId(
        fetchNetwork
      )}&vs_currencies=usd`
    : `${BASE_URL}${endPoint}${fetchAddress}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    return Object.values(data as object)[0]?.usd as number;
  } catch (error) {
    console.error("Error fetching token price", error);
  }
}
function getNativeTokenId(_: SupportedNetworks): string {
  return NATIVE_TOKEN_ID.default;
}
