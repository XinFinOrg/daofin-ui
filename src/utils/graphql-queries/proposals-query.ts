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
    proposalType {
      id
      txHash
      proposalTypeId
      settings {
        id
        supportThreshold
        minParticipation
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
      executionTxHash
      executionBlockNumber
      executionDate
      executedBy
      proposalType {
        id
        txHash
        proposalTypeId
        settings {
          id
          supportThreshold
          minParticipation
        }
      }
    }
  }
`;
export { allProposalsByPluginIdQuery, proposalByProposalIdQuery };
