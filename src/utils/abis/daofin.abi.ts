export const DaofinABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "masterNode_",
        type: "address",
      },
    ],
    name: "isXDCValidatorCandidate",
    outputs: [
      {
        internalType: "bool",
        name: "isValid",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "AddressIsZero",
    type: "error",
  },
  {
    inputs: [],
    name: "CannotCreateProposalWithinElectionPeriod",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "dao",
        type: "address",
      },
      {
        internalType: "address",
        name: "where",
        type: "address",
      },
      {
        internalType: "address",
        name: "who",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "permissionId",
        type: "bytes32",
      },
    ],
    name: "DaoUnauthorized",
    type: "error",
  },
  {
    inputs: [],
    name: "InValidAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "InValidAmount",
    type: "error",
  },
  {
    inputs: [],
    name: "InValidBlockNumber",
    type: "error",
  },
  {
    inputs: [],
    name: "InValidCommittee",
    type: "error",
  },
  {
    inputs: [],
    name: "InValidDate",
    type: "error",
  },
  {
    inputs: [],
    name: "InValidStatus",
    type: "error",
  },
  {
    inputs: [],
    name: "InValidTime",
    type: "error",
  },
  {
    inputs: [],
    name: "InValidVoter",
    type: "error",
  },
  {
    inputs: [],
    name: "IsNotCandidate",
    type: "error",
  },
  {
    inputs: [],
    name: "JudiciaryExist",
    type: "error",
  },
  {
    inputs: [],
    name: "JudiciaryNotExist",
    type: "error",
  },
  {
    inputs: [],
    name: "MustBeGreaterThanZero",
    type: "error",
  },
  {
    inputs: [],
    name: "NotReadyToExecute",
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
    inputs: [],
    name: "SameAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "UnexpectedFailure",
    type: "error",
  },
  {
    inputs: [],
    name: "VotedAlready",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "previousAdmin",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
    ],
    name: "AdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "beacon",
        type: "address",
      },
    ],
    name: "BeaconUpgraded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_depositer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "Deposited",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64",
        name: "_start",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "_end",
        type: "uint64",
      },
    ],
    name: "ElectionPeriodUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_newAmount",
        type: "uint256",
      },
    ],
    name: "HouseMinAmountUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_houseMember",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "_cooldown",
        type: "uint64",
      },
    ],
    name: "HouseResignRequested",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_houseMember",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "HouseResigned",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_member",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_action",
        type: "uint256",
      },
    ],
    name: "JudiciaryChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_masterNode",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_delegatee",
        type: "address",
      },
    ],
    name: "MasterNodeDelegateeUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_proposalId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_proposer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_cost",
        type: "uint256",
      },
    ],
    name: "ProposalCostsReceived",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_newValue",
        type: "uint256",
      },
    ],
    name: "ProposalCostsUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "proposalId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "startDate",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "endDate",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "metadata",
        type: "bytes",
      },
      {
        components: [
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
        ],
        indexed: false,
        internalType: "struct IDAO.Action[]",
        name: "actions",
        type: "tuple[]",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "allowFailureMap",
        type: "uint256",
      },
    ],
    name: "ProposalCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "proposalId",
        type: "uint256",
      },
    ],
    name: "ProposalExecuted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_proposalId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_proposalTypeId",
        type: "uint256",
      },
    ],
    name: "ProposalIdToProposalTypeIdAttached",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_proposalId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "_metadata",
        type: "bytes",
      },
    ],
    name: "ProposalMetadataUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_proposalType",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "name",
            type: "bytes32",
          },
          {
            internalType: "uint32",
            name: "supportThreshold",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "minParticipation",
            type: "uint32",
          },
        ],
        indexed: false,
        internalType: "struct BaseDaofinPlugin.CommitteeVotingSettings[]",
        name: "_settings",
        type: "tuple[]",
      },
    ],
    name: "ProposalTypeCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "Upgraded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_proposalId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_voter",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "_committee",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "enum BaseDaofinPlugin.VoteOption",
        name: "_voteOption",
        type: "uint8",
      },
    ],
    name: "VoteReceived",
    type: "event",
  },
  {
    inputs: [],
    name: "CREATE_PROPOSAL_TYPE_PERMISSION",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "EXECUTION_DELAY_BLOCK",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "JudiciaryCommittee",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MODIFY_PROPOSAL_TYPE_PERMISSION",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MasterNodeCommittee",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "PeoplesHouseCommittee",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "UPDATE_ELECTION_PERIOD_PERMISSION",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "UPDATE_JUDICIARY_MAPPING_PERMISSION",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "UPDATE_MIN_HOUSE_AMOUNT_PERMISSION",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "UPDATE_PROPOSAL_COSTS_PERMISSION",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "UPGRADE_PLUGIN_PERMISSION_ID",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "_committeesList",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "_judiciaryCommittee",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "_judiciaryCommitteeCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "_masterNodeDelegatee",
    outputs: [
      {
        internalType: "uint256",
        name: "lastModificationBlocknumber",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "numberOfJointMasterNodes",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "_proposals",
    outputs: [
      {
        internalType: "bool",
        name: "executed",
        type: "bool",
      },
      {
        internalType: "address",
        name: "proposer",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "proposalTypeId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "allowFailureMap",
        type: "uint256",
      },
      {
        internalType: "uint64",
        name: "startDate",
        type: "uint64",
      },
      {
        internalType: "uint64",
        name: "endDate",
        type: "uint64",
      },
      {
        internalType: "uint64",
        name: "snapshotBlock",
        type: "uint64",
      },
      {
        internalType: "bytes",
        name: "metadata",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "_voterToLockedAmounts",
    outputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "blockNumber",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isActive",
        type: "bool",
      },
      {
        internalType: "uint64",
        name: "startOfCooldownPeriod",
        type: "uint64",
      },
      {
        internalType: "uint64",
        name: "endOfCooldownPeriod",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_members",
        type: "address[]",
      },
    ],
    name: "addJudiciaryMembers",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_proposalId",
        type: "uint256",
      },
    ],
    name: "canExecute",
    outputs: [
      {
        internalType: "bool",
        name: "isValid",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_metadata",
        type: "bytes",
      },
      {
        components: [
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
        ],
        internalType: "struct IDAO.Action[]",
        name: "_actions",
        type: "tuple[]",
      },
      {
        internalType: "uint256",
        name: "_electionPeriodIndex",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_proposalType",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_allowFailureMap",
        type: "uint256",
      },
      {
        internalType: "enum BaseDaofinPlugin.VoteOption",
        name: "_voteOption",
        type: "uint8",
      },
    ],
    name: "createProposal",
    outputs: [
      {
        internalType: "uint256",
        name: "_proposalId",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "name",
            type: "bytes32",
          },
          {
            internalType: "uint32",
            name: "supportThreshold",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "minParticipation",
            type: "uint32",
          },
        ],
        internalType: "struct BaseDaofinPlugin.CommitteeVotingSettings[]",
        name: "_committeesVotingSettings",
        type: "tuple[]",
      },
    ],
    name: "createProposalType",
    outputs: [
      {
        internalType: "uint256",
        name: "proposalTypeId",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "dao",
    outputs: [
      {
        internalType: "contract IDAO",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_proposalId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_metadata",
        type: "bytes",
      },
    ],
    name: "editProposalMetadata",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_proposalId",
        type: "uint256",
      },
    ],
    name: "execute",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "executeResignHouse",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "voter_",
        type: "address",
      },
    ],
    name: "findCommitteeName",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getBlockSnapshot",
    outputs: [
      {
        internalType: "uint256",
        name: "snapshotBlock",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCommitteesList",
    outputs: [
      {
        internalType: "bytes32[]",
        name: "",
        type: "bytes32[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "proposalTypeId_",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "committee_",
        type: "bytes32",
      },
    ],
    name: "getCommitteesToVotingSettings",
    outputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "name",
            type: "bytes32",
          },
          {
            internalType: "uint32",
            name: "supportThreshold",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "minParticipation",
            type: "uint32",
          },
        ],
        internalType: "struct BaseDaofinPlugin.CommitteeVotingSettings",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getElectionPeriods",
    outputs: [
      {
        components: [
          {
            internalType: "uint64",
            name: "startDate",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "endDate",
            type: "uint64",
          },
        ],
        internalType: "struct BaseDaofinPlugin.ElectionPeriod[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getGlobalSettings",
    outputs: [
      {
        components: [
          {
            internalType: "contract IXDCValidator",
            name: "xdcValidator",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "houseMinAmount",
            type: "uint256",
          },
        ],
        internalType: "struct BaseDaofinPlugin.DaofinGlobalSettings",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_proposalId",
        type: "uint256",
      },
    ],
    name: "getProposal",
    outputs: [
      {
        internalType: "bool",
        name: "open",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "executed",
        type: "bool",
      },
      {
        internalType: "address",
        name: "proposer",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "proposalTypeId",
        type: "uint256",
      },
      {
        internalType: "uint64",
        name: "snapshotBlock",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "proposalId_",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "committee_",
        type: "bytes32",
      },
    ],
    name: "getProposalTallyDetails",
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
            name: "abstain",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "yes",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "no",
            type: "uint256",
          },
        ],
        internalType: "struct BaseDaofinPlugin.TallyDatails",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "proposalId_",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "voter_",
        type: "address",
      },
    ],
    name: "getProposalVoterToInfo",
    outputs: [
      {
        components: [
          {
            internalType: "bool",
            name: "voted",
            type: "bool",
          },
          {
            internalType: "enum BaseDaofinPlugin.VoteOption",
            name: "option",
            type: "uint8",
          },
        ],
        internalType: "struct BaseDaofinPlugin.VoteInfo",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalNumberOfJudiciary",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalNumberOfMN",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "committee_",
        type: "bytes32",
      },
    ],
    name: "getTotalNumberOfMembersByCommittee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getXDCTotalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "implementation",
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
    inputs: [
      {
        internalType: "contract IDAO",
        name: "_dao",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "allowedAmount_",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "xdcValidatorContract_",
        type: "address",
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "name",
            type: "bytes32",
          },
          {
            internalType: "uint32",
            name: "supportThreshold",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "minParticipation",
            type: "uint32",
          },
        ],
        internalType: "struct BaseDaofinPlugin.CommitteeVotingSettings[]",
        name: "grantSettings_",
        type: "tuple[]",
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "name",
            type: "bytes32",
          },
          {
            internalType: "uint32",
            name: "supportThreshold",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "minParticipation",
            type: "uint32",
          },
        ],
        internalType: "struct BaseDaofinPlugin.CommitteeVotingSettings[]",
        name: "generalSettings_",
        type: "tuple[]",
      },
      {
        internalType: "uint64[]",
        name: "electionPeriod_",
        type: "uint64[]",
      },
      {
        internalType: "address[]",
        name: "judiciaries_",
        type: "address[]",
      },
      {
        internalType: "uint256",
        name: "proposalCosts_",
        type: "uint256",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_member",
        type: "address",
      },
    ],
    name: "isJudiciaryMember",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "delegatee_",
        type: "address",
      },
    ],
    name: "isMasterNodeDelegatee",
    outputs: [
      {
        internalType: "bool",
        name: "isValid",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_proposalId",
        type: "uint256",
      },
    ],
    name: "isMinParticipationReached",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "voter_",
        type: "address",
      },
    ],
    name: "isPeopleHouse",
    outputs: [
      {
        internalType: "bool",
        name: "isValid",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_proposalId",
        type: "uint256",
      },
    ],
    name: "isThresholdReached",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_voter",
        type: "address",
      },
    ],
    name: "isValidVoter",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_voter",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_proposalId",
        type: "uint256",
      },
    ],
    name: "isVotedOnProposal",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "isWithinElectionPeriod",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "joinHouse",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_proposalTypeId",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "name",
            type: "bytes32",
          },
          {
            internalType: "uint32",
            name: "supportThreshold",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "minParticipation",
            type: "uint32",
          },
        ],
        internalType: "struct BaseDaofinPlugin.CommitteeVotingSettings[]",
        name: "_committeesVotingSettings",
        type: "tuple[]",
      },
    ],
    name: "modifyProposalType",
    outputs: [
      {
        internalType: "uint256",
        name: "proposalTypeId",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "pluginType",
    outputs: [
      {
        internalType: "enum IPlugin.PluginType",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "proposalCosts",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "proposalCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "proposalTypeCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "proxiableUUID",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_member",
        type: "address",
      },
    ],
    name: "removeJudiciaryMember",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "resignHouse",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_allowedAmount",
        type: "uint256",
      },
    ],
    name: "updateAllowedAmounts",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint64",
            name: "startDate",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "endDate",
            type: "uint64",
          },
        ],
        internalType: "struct BaseDaofinPlugin.ElectionPeriod[]",
        name: "_periods",
        type: "tuple[]",
      },
    ],
    name: "updateElectionPeriod",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "delegatee_",
        type: "address",
      },
    ],
    name: "updateOrJoinMasterNodeDelegatee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_newAmount",
        type: "uint256",
      },
    ],
    name: "updateProposalCosts",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
    ],
    name: "upgradeTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "upgradeToAndCall",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_proposalId",
        type: "uint256",
      },
      {
        internalType: "enum BaseDaofinPlugin.VoteOption",
        name: "_voteOption",
        type: "uint8",
      },
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];
