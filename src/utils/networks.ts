import {
  SupportedNetwork as SdkSupportedNetworks,
  Context as SdkContext,
} from "@xinfin/osx-client-common";
import {
  format,
  formatDistance,
  formatDistanceToNow,
  formatRelative,
  Locale,
} from "date-fns";
import { bytesToHex, resolveIpfsCid } from "@aragon/sdk-common";
import { DaofinDetails, VoteOption } from "@xinfin/osx-daofin-sdk-client";
import { Client, VoteValues } from "@xinfin/osx-sdk-client";
import { isAddress } from "@ethersproject/address";
import { ethers } from "ethers";
import { defaultAbiCoder } from "@ethersproject/abi";
import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
export const SUPPORTED_CHAIN_ID = [
  1, 5, 137, 80001, 42161, 421613, 50, 51,
] as const;
export type SupportedChainID = (typeof SUPPORTED_CHAIN_ID)[number];
const SUPPORTED_NETWORKS = ["apothem", "xdc"] as const;

export function isSupportedChainId(
  chainId: number
): chainId is SupportedChainID {
  return SUPPORTED_CHAIN_ID.some((id) => id === chainId);
}
export type availableNetworks = "apothem" | "xdc";

export type SupportedNetworks =
  | (typeof SUPPORTED_NETWORKS)[number]
  | "unsupported";

export function isSupportedNetwork(
  network: string
): network is SupportedNetworks {
  return SUPPORTED_NETWORKS.some((n) => n === network);
}

export function toSupportedNetwork(network: string): SupportedNetworks {
  return SUPPORTED_NETWORKS.some((n) => n === network)
    ? (network as SupportedNetworks)
    : "unsupported";
}

export type NetworkDomain = "L1 Blockchain" | "L2 Blockchain";

/* CHAIN DATA =============================================================== */

export type NativeTokenData = {
  name: string;
  symbol: string;
  decimals: number;
};

export type ChainData = {
  id: SupportedChainID;
  name: string;
  domain: NetworkDomain;
  testnet: boolean;
  explorer: string;
  logo: string;
  rpc: string[];
  nativeCurrency: NativeTokenData;
  etherscanApi: string;
  etherscanApiKey?: string;
  covalentApi?: string;
  alchemyApi: string;
  supportsEns: boolean;
  ipfs?: string;
  daofinSubgraph: string;
  osxSubgraph: string;
};

export type ChainList = Record<SupportedNetworks, ChainData>;
export const CHAIN_METADATA: ChainList = {
  apothem: {
    id: 51,
    name: "Apothem",
    domain: "L1 Blockchain",
    logo: "https://icons.llamao.fi/icons/chains/rsz_xdc.jpg",
    explorer: "https://apothem.xdcscan.io",
    testnet: true,
    rpc: [`https://erpc.apothem.network/`, `https://apothem.xdcrpc.com/`],
    nativeCurrency: {
      name: "TXDC",
      symbol: "TXDC",
      decimals: 18,
    },
    alchemyApi: "",
    etherscanApi: "https://apothem.xdcscan.io/api",
    etherscanApiKey: "",
    supportsEns: true,
    ipfs: import.meta.env.VITE_IPFS_API_URL,
    daofinSubgraph: import.meta.env.VITE_APOTHEM_DAOFIN_SUB_GRAPH_URL || "",
    osxSubgraph: import.meta.env.VITE_APOTHEM_OSX_SUB_GRAPH_URL || "",
  },
  xdc: {
    id: 50,
    name: "XDC",
    domain: "L1 Blockchain",
    logo: "https://icons.llamao.fi/icons/chains/rsz_xdc.jpg",
    explorer: "https://apothem.xdcscan.io",
    testnet: false,
    rpc: [`https://xdc.xdcrpc.com/      `, `wss://ews.xdc.network/`],
    nativeCurrency: {
      name: "XDC",
      symbol: "XDC",
      decimals: 18,
    },
    alchemyApi: "",
    etherscanApi: "https://xdc.xdcscan.io/api",
    etherscanApiKey: "",
    supportsEns: false,
    ipfs: import.meta.env.VITE_IPFS_API_URL,
    daofinSubgraph: import.meta.env.VITE_XDC_DAOFIN_SUB_GRAPH_URL || "",
    osxSubgraph: import.meta.env.VITE_XDC_OSX_SUB_GRAPH_URL || "",
  },
  unsupported: {
    id: 1,
    name: "Unsupported",
    domain: "L1 Blockchain",
    logo: "",
    explorer: "",
    testnet: false,
    rpc: [],
    nativeCurrency: {
      name: "",
      symbol: "",
      decimals: 18,
    },
    etherscanApi: "",
    alchemyApi: "",
    supportsEns: false,
    ipfs: "",
    daofinSubgraph: "",
    osxSubgraph: "",
  },
};

export const chainExplorerAddressLink = (
  network: SupportedNetworks,
  address: string
) => {
  return `${CHAIN_METADATA[network].explorer}address/${address}`;
};

/**
 * Maps SDK network name to app network context network name
 * @param sdkNetwork supported network returned by the SDK
 * @returns translated equivalent app supported network
 */
export const translateToAppNetwork = (
  sdkNetwork: SdkContext["network"]
): SupportedNetworks => {
  switch (sdkNetwork.name) {
    case "apothem":
      return "apothem";
    case "xdc":
      return "xdc";
  }
  return "unsupported";
};

/**
 * Maps app network context name to SDK network name
 * @param appNetwork supported network returned by the network context
 * @returns translated equivalent SDK supported network
 */
export function translateToNetworkishName(
  appNetwork: SupportedNetworks
): SdkSupportedNetworks | "unsupported" {
  if (typeof appNetwork !== "string") {
    return "unsupported";
  }
  switch (appNetwork) {
    case "apothem":
      return SdkSupportedNetworks.APOTHEM;
    case "xdc":
      return SdkSupportedNetworks.XDC;
  }

  return "unsupported";
}

/**
 * Get the network name with given chain id
 * @param chainId Chain id
 * @returns the name of the supported network or undefined if network is unsupported
 */
export function getSupportedNetworkByChainId(
  chainId: number
): SupportedNetworks | undefined {
  if (isSupportedChainId(chainId)) {
    return Object.entries(CHAIN_METADATA).find(
      (entry) => entry[1].id === chainId
    )?.[0] as SupportedNetworks;
  }
}
/**
 * display ens names properly
 * @param ensName ens name
 * @returns ens name or empty string if ens name is null.dao.eth
 */
export function toDisplayEns(ensName?: string) {
  if (!ensName || ensName === "null.dao.eth") return "";

  if (!ensName.includes(".dao.eth")) return `${ensName}.dao.eth`;
  return ensName;
}
type SubgraphNetworkUrl = Record<SupportedNetworks, string | undefined>;

// export const SUBGRAPH_API_URL: SubgraphNetworkUrl = {
//   xdc: undefined,
//   apothem: "http://localhost:8000/subgraphs/name/xinfin-osx-apothem",
//   unsupported: undefined,
// };
// export const SUBGRAPH_PLUGIN_API_URL: SubgraphNetworkUrl = {
//   xdc: undefined,
//   apothem: "http://localhost:8000/subgraphs/name/daofin-apothem",
//   unsupported: undefined,
// };
/**
 * Custom function to deserialize values, including Date and BigInt types
 * @param _ key: unused
 * @param value value to deserialize
 * @returns deserialized value
 */
// disabling so forced assertion is not necessary in try catch
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FLAG_TYPED_ARRAY = "FLAG_TYPED_ARRAY";

export const ISO_DATE_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;

export const BIGINT_PATTERN = /^\d+n$/;

export const customJSONReviver = (_: string, value: any) => {
  // deserialize uint8array
  if (value.flag === FLAG_TYPED_ARRAY) {
    return new Uint8Array(value.data);
  }

  if (typeof value === "string") {
    // BigInt
    if (BIGINT_PATTERN.test(value)) return BigInt(value.slice(0, -1));

    // Date
    if (ISO_DATE_PATTERN.test(value)) return new Date(value);
  }

  return value;
};

export type DetailedProposal = {};

export const KNOWN_FORMATS = {
  standard: "MMM dd yyyy HH:mm", // This is our standard used for showing dates.
  proposals: "yyyy/MM/dd hh:mm a",
};

/**
 * @param date number or string in seconds (not milliseconds)
 * @param formatType KNOWN_FORMATS
 */
export function formatDate(date: number | string, formatType?: string) {
  try {
    if (typeof date === "string") {
      date = parseInt(date, 10);
    }
    date = date * 1000;
    if (formatType === "relative") {
      return formatRelative(date, new Date()); // Relative Format for Human Readable Date format
    } else {
      formatType = formatType || KNOWN_FORMATS.standard;
      return format(date, formatType, {});
    }
  } catch (e) {
    return date;
  }
}
/**
 * Get DAO resolved IPFS CID URL for the DAO avatar
 * @param avatar - avatar to be resolved. If it's an IPFS CID,
 * the function will return a fully resolved URL.
 * @returns the url to the DAO avatar
 */
export async function resolveDaoAvatarIpfsCid(
  client: Client | undefined,
  avatar?: string | Blob
): Promise<string | undefined> {
  if (avatar) {
    if (typeof avatar !== "string") {
      return URL.createObjectURL(avatar);
    } else if (/^ipfs/.test(avatar) && client) {
      try {
        const cid = resolveIpfsCid(avatar);
        const ipfsClient = client.ipfs.getClient();
        const imageBytes = await ipfsClient.cat(cid); // Uint8Array
        const imageBlob = new Blob([imageBytes] as unknown as BlobPart[]);

        return URL.createObjectURL(imageBlob);
      } catch (err) {
        console.warn("Error resolving DAO avatar IPFS Cid", err);
      }
    } else {
      return avatar;
    }
  }
}
export function shortenAddress(address: string | null) {
  if (address === null) return "";
  if (isAddress(address))
    return (
      address.substring(0, 5) +
      "…" +
      address.substring(address.length - 4, address.length)
    );
  else return address;
}
export function shortenTxHash(address: string | null) {
  if (address === null) return "";

  return (
    address.substring(0, 5) +
    "…" +
    address.substring(address.length - 4, address.length)
  );
}

export type ProposalResource = {
  name: string;
  url: string;
};

export function getPluginInstallationId(
  daoAddress: string,
  pluginAddress: string
): string {
  return ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ["address", "address"],
      [daoAddress, pluginAddress]
    )
  );
}
export function getPluginProposalId(
  pluginAddress: string,
  proposalId: number
): string {
  return pluginAddress
    .toLocaleLowerCase()
    .concat("_")
    .concat(defaultAbiCoder.encode(["uint256"], [proposalId]));
}

export function getFormattedUtcOffset(): string {
  const currDate = new Date();
  let decimalOffset = currDate.getTimezoneOffset() / 60;
  const isNegative = decimalOffset < 0;
  decimalOffset = Math.abs(decimalOffset);
  const hourOffset = Math.floor(decimalOffset);
  const minuteOffset = Math.round((decimalOffset - hourOffset) * 60);
  let formattedOffset = "UTC" + (isNegative ? "+" : "-") + hourOffset;
  formattedOffset += minuteOffset > 0 ? ":" + minuteOffset : "";
  return formattedOffset;
}

export function convertVoteOptionToText(option: VoteOption) {
  switch (option) {
    case 1:
      return "ABSTAIN";
    case 2:
      return "YES";
    case 3:
      return "NO";
    default:
      return "NONE";
  }
}
export function convertVoteOptionToItsColor(option: VoteOption) {
  switch (option) {
    case 1:
      return "gray";
    case 2:
      return "green";
    case 3:
      return "red";
    default:
      return "yellow";
  }
}
export const MasterNodeCommittee = ethers.utils.id("MASTER_NODE_COMMITTEE");
export const PeoplesHouseCommittee = ethers.utils.id("PEOPLES_HOUSE_COMMITTEE");
export const JudiciaryCommittee = ethers.utils.id("JUDICIARY_COMMITTEE");

export function convertCommitteeToPlainText(bytesName: string) {
  switch (bytesName) {
    case MasterNodeCommittee:
      return "Master Node Senate";
    case PeoplesHouseCommittee:
      return "People's House";
    case JudiciaryCommittee:
      return "Judiciary";
    default:
      return "Invalid actor";
  }
}

// The base value to encode real-valued ratios on the interval [0, 1] as integers on the interval 0 to 10^6.
const RATIO_BASE: BigNumberish = BigNumber.from(10).pow(6);

// Thrown if a ratio value exceeds the maximal value of 10^6.
class RatioOutOfBounds extends Error {
  constructor(limit: BigNumberish, actual: BigNumberish) {
    super(
      `Ratio out of bounds. Limit: ${limit.toString()}, Actual: ${actual.toString()}`
    );
  }
}

// Applies a ratio to a value and ceils the remainder.
export function applyRatioCeiled(
  _value: BigNumber,
  _ratio: BigNumber
): BigNumber {
  if (_ratio.gt(RATIO_BASE)) {
    throw new RatioOutOfBounds(RATIO_BASE, _ratio);
  }

  _value = _value.mul(_ratio);
  const remainder: BigNumber = _value.mod(RATIO_BASE);
  let result: BigNumber = _value.div(RATIO_BASE);

  // Check if ceiling is needed
  if (!remainder.isZero()) {
    result = result.add(BigNumber.from(1));
  }

  return result;
}
export const BASE_URL = "https://api.coingecko.com/api/v3";
export const DEFAULT_CURRENCY = "usd";

// Coingecko Api specific asset platform keys
export const ASSET_PLATFORMS: Record<SupportedNetworks, string | null> = {
  xdc: null,
  apothem: null,
  unsupported: null,
};

export const NATIVE_TOKEN_ID = {
  default: "xdce-crowd-sale",
};

export function makeBlockScannerHashUrl(
  network: SupportedNetworks,
  hash: string
) {
  return `${CHAIN_METADATA[network].explorer}/txs/${hash}`;
}
export function makeBlockScannerAddressUrl(
  network: SupportedNetworks,
  address: string
) {
  return `${CHAIN_METADATA[network].explorer}/address/${address}`;
}
