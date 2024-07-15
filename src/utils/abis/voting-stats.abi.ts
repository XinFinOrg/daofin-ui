export const VotingStatsABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "daofin_",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "limit",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "actual",
        type: "uint256",
      },
    ],
    name: "RatioOutOfBounds",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "daofin_",
        type: "address",
      },
    ],
    name: "changeDAO",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "daofin",
    outputs: [
      {
        internalType: "contract IDAOFIN",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "proposalId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "proposalTypeId",
        type: "uint256",
      },
    ],
    name: "stats",
    outputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "name",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "yesVotes",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "noVotes",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "abstainVotes",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalVotes",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "currentQuorumNumber",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "currentPassrateNumber",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "requiredQuruomNumber",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "requiredPassrateNumber",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalNumberOfVoters",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "currentQuroumNumberRatio",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "currentPassrateRatio",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "requiredQuroumNumberRatio",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "currentPassrateNumberRatio",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "requiredPassrateNumberRatio",
            type: "uint256",
          },
        ],
        internalType: "struct VotingStats.CommunityReturnType[]",
        name: "communities",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
