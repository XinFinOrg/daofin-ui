const allCommunityMembers = `
query AllCommunityMembers($pluginId: ID) {
    pluginJudiciaries(where: {plugin: $pluginId}) {
      id
    }
    pluginMasterNodeDelegatees(where: {plugin: $pluginId}) {
      id
    }
    pluginDeposits(where: {plugin: $pluginId}) {
      id
    }
}
`;
export { allCommunityMembers };
