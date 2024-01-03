import Header from "./components/Header";
import CreateProposal from "./pages/CreateProposal";
import { Route, Routes } from "react-router";
import Dashboard from "./pages/Dashboard";
import ProposalsPage from "./pages/ProposalsPage";
import ProposalDetailsPage from "./pages/ProposalDetailsPage";
import JudiciaryPage from "./pages/JudiciaryPage";
import CommitteesPage from "./pages/CommunityPage";
import PeoplesHousePage from "./pages/PeoplesHousePage";
import MasterNodeDelegatePage from "./pages/MasterNodeDelegatePage";
import { Box } from "@chakra-ui/react";
import CommunityPage from "./pages/CommunityPage";
import TreasuryPage from "./pages/TreasuryPage";

function App() {
  return (
    <Box className="App">
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
      <Routes>
        <Route path="/create/:type" element={<CreateProposal />} />
      </Routes>
      <Routes>
        <Route path="/proposals">
          <Route path="/proposals" element={<ProposalsPage />} />
          <Route
            path="/proposals/:proposalId/details"
            element={<ProposalDetailsPage />}
          />
        </Route>

        <Route path="/community">
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/community/judiciary" element={<JudiciaryPage />} />
          <Route
            path="/community/peoples-house"
            element={<PeoplesHousePage />}
          />
          <Route
            path="/community/masternode-delegatee-senate"
            element={<MasterNodeDelegatePage />}
          />
        </Route>
        <Route path="/treasury">
          <Route path="/treasury" element={<TreasuryPage />} />
        </Route>
      </Routes>
    </Box>
  );
}

export default App;
