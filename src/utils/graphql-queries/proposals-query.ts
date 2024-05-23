const allProposalsByPluginIdQuery = `
query ProposalsQuery($pluginId: ID!) {
  pluginProposals(where: { plugin: $pluginId }, orderBy: createdAt, orderDirection: desc) {
    id
    pluginProposalId
    failureMap
    creator
    metadata
    startDate
    endDate
    creationBlockNumber
    snapshotBlock
    executed
    createdAt
    executionTxHash
    executionBlockNumber
    executionDate
    executedBy
    creationTxHash
    actions {
      id
      to
      value
      data
    }
    dao{
      id
    }
    tallyDetails {
      committee
      id
      totalVotes
      yesVotes
      noVotes
      abstainVotes
      quorumRequiredVote
      passrateRequiredVote
      quorumActiveVote
      passrateActiveVote
      totalMembers
      pluginProposalId
      proposalType {
        id
        settings {
          name
          supportThreshold
          minParticipation
          minVotingPower
        }
      }
    }
  }
}
`;

const proposalByProposalIdQuery = `
query ProposalQuery($id: ID!) {
    pluginProposal(id: $id) {
      id
      actions {
        id
        to
        data
        value
      }
      allowFailureMap
      creator
      createdAt
      metadata
      startDate
      endDate
      snapshotBlock
      executed
      creationBlockNumber
      failureMap 
      pluginProposalId
      creationTxHash
      proposalType {
        id
        txHash
        settings {
          id
          supportThreshold
          minParticipation
          minVotingPower
        }
      }
      tallyDetails {
        committee
        id
        totalVotes
        yesVotes
        noVotes
        abstainVotes
        quorumRequiredVote
        passrateRequiredVote
        quorumActiveVote
        passrateActiveVote
        totalMembers
        pluginProposalId
        proposalType {
          id
          settings {
            name
            supportThreshold
            minParticipation
            minVotingPower
          }
        }
      }
    }
  }
`;
export { allProposalsByPluginIdQuery, proposalByProposalIdQuery };
