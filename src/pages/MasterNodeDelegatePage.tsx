import { FC } from "react";
import { Box, HStack, VStack } from "@chakra-ui/layout";
import { Text } from "@chakra-ui/react";
import { Page } from "../components";
import { MasterNodeSenateCard } from "../components/WalletAddressCard";
import MasterNodeDelegateeSenateIcon from "../utils/assets/icons/MasterNodeDelegateeSenateIcon";
import {
  MasterNodeDelegateeSentateProvider,
  useMasterNodeDelegateeSentateContext,
} from "../contexts/MasterNodeDelegateeSentateContext";
import { Formik } from "formik";
import useFetchMasterNodeDelegatee from "../hooks/useFetchMasterNodeDelegatee";
import { toNormalDate } from "../utils/date";
import useFetchTotalNumbersByCommittee from "../hooks/useFetchTotalNumbersByCommittee";
import { MasterNodeCommittee } from "../utils/networks";
import { EmptyBoxIcon } from "../utils/assets/icons/EmptyBoxIcon";
import { MasterNodeAuthorizedButton } from "../components/Button/AuthorizedButton";
import { DefaultBox } from "../components/Box";
import { DefaultAlert } from "../components/Alerts";
import RulesOfDecisions from "../components/RulesOfDecisions";
import useFetchPluginProposalTypeDetails from "../hooks/useFetchPluginProposalTypeDetails";
import { MasterNodeDelegationSchema } from "../schemas/delegateMasterNodeSchema";
import { Address, useContractRead, useContractReads } from "wagmi";
import { DaofinABI } from "../utils/abis/daofin.abi";
import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
import { useTranslation } from "react-i18next";

export type UpdateOrJoinMasterNodeDelegateeType = {
  delegateeAddress: string;
};
const MasterNodeDelegatePage = () => {
  const { data: delegatees } = useFetchMasterNodeDelegatee();
  const communityName = MasterNodeCommittee;
  const totalMasterNodes = useFetchTotalNumbersByCommittee(communityName);
  const { pluginAddress } = useAppGlobalConfig();
  // useContractReads({
  //   contracts: [
  //     {
  //       abi: DaofinABI,
  //       address: pluginAddress as Address,
  //       functionName:"",
  //       ge
  //     },
  //   ],
  // });
  // const bgColor = useColorModeValue("gray.50", "gray.900");

  const { data: proposalTypes } = useFetchPluginProposalTypeDetails();

  return (
    <Page title="Senate">
      <Formik
        initialValues={{
          delegateeAddress: "",
        }}
        validationSchema={MasterNodeDelegationSchema}
        onSubmit={() => {}}
      >
        <MasterNodeDelegateeSentateProvider>
          <>
            <DefaultBox mb={4}>
              <VStack>
                {totalMasterNodes != undefined && (
                  <MasterNodeDelegateeHeader
                    totalMasterNodes={parseInt(totalMasterNodes?.toString())}
                    totalJoined={delegatees.length}
                  />
                )}
              </VStack>
            </DefaultBox>
            <HStack flexDirection={["column", "column", "column", "row"]}>
              <Box
                w={["full", "full", "full", "60%"]}
                alignSelf={"flex-start"}
                mr={2}
              >
                <DefaultBox>
                  <VStack>
                    {delegatees.length > 0 ? (
                      delegatees.map(
                        ({
                          member,
                          masterNode,
                          snapshotBlock,
                          txHash,
                          id,
                          creationDate,
                        }) => (
                          <MasterNodeSenateCard
                            txHash={txHash}
                            key={id}
                            address={member}
                            joinedDate={toNormalDate(creationDate.toString())}
                            blockNumber={parseInt(snapshotBlock.toString())}
                            masterNodeAddress={masterNode}
                          />
                        )
                      )
                    ) : (
                      <VStack
                        w={"full"}
                        alignItems="center"
                        alignSelf={"center"}
                      >
                        <EmptyBoxIcon />
                        <Text
                          fontSize={"xs"}
                          fontWeight={"500"}
                          opacity={"0.5"}
                        >
                          {"There is no member yet."}
                        </Text>
                      </VStack>
                    )}
                  </VStack>
                </DefaultBox>
              </Box>
              {proposalTypes && proposalTypes?.length > 0 && (
                <DefaultBox
                  w={["full", "full", "full", "40%"]}
                  alignSelf={"flex-start"}
                >
                  <RulesOfDecisions
                    communityName={communityName}
                    summary={"All below info demostrate how voting rules work."}
                    proposalTypes={proposalTypes}
                  />
                </DefaultBox>
              )}
            </HStack>
          </>
        </MasterNodeDelegateeSentateProvider>
      </Formik>
    </Page>
  );
};
interface MasterNodeDelegateeHeaderProps {
  totalJoined: number;
  totalMasterNodes: number;
}
const MasterNodeDelegateeHeader: FC<MasterNodeDelegateeHeaderProps> = ({
  totalJoined,
  totalMasterNodes,
}) => {
  const { handleToggleFormModal } = useMasterNodeDelegateeSentateContext();
  const { t } = useTranslation();
  return (
    <>
      <HStack
        justifyContent={"space-between"}
        w={"full"}
        mb={4}
        flexDirection={["column", "column", "column", "row"]}
      >
        <Box>
          <HStack>
            <Box w={["60px", "50px"]} flexShrink={1}>
              <MasterNodeDelegateeSenateIcon />
            </Box>
            <Box>
              <Text fontSize={["lg", "xl"]} fontWeight={"bold"}>
                {" "}
                {t("community.masternodeDelegateeSenate")}
              </Text>
              <Text fontSize={"xs"}>
                {t("community.masternodeDelegateeSenateDesc")}
              </Text>
            </Box>
          </HStack>
        </Box>
        <Box w={["full", "fit-content"]}>
          <MasterNodeAuthorizedButton
            w={["full", "inherit"]}
            colorScheme="blue"
            onClick={handleToggleFormModal}
          >
            {t("community.delegateMember")}
          </MasterNodeAuthorizedButton>
        </Box>
      </HStack>
      <HStack flexDirection={["column", "column", "column", "row"]} w={"full"}>
        <DefaultBox w={["full", "full", "full", "25%"]}>
          <VStack
            fontSize={"sm"}
            alignSelf={"normal"}
            alignItems={"flex-start"}
            justifyContent={"center"}
          >
            <Text>{t("community.totalMn")}</Text>
            <Text fontSize={"lg"} fontWeight={"bold"}>
              {totalMasterNodes}
            </Text>
          </VStack>
        </DefaultBox>{" "}
        <DefaultBox w={["full", "full", "full", "25%"]}>
          <VStack
            fontSize={"sm"}
            alignSelf={"normal"}
            alignItems={"flex-start"}
            justifyContent={"center"}
          >
            <Text>{t("community.joinedMn")}</Text>
            <Text fontSize={"lg"} fontWeight={"bold"}>
              {totalJoined}
            </Text>
          </VStack>
        </DefaultBox>
        <DefaultAlert w={["full", "full", "full", "50%"]} p={4}>
          <Box fontSize={"sm"}>
            <Text fontWeight={"semibold"}>{t("community.whyDelegation")}</Text>
            <Text>{t("community.whyDelegationDesc")}</Text>
          </Box>
        </DefaultAlert>
      </HStack>
    </>
  );
};
export default MasterNodeDelegatePage;
