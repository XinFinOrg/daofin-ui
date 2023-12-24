
import Header from "./components/Header";
import CreateProposal from "./pages/CreateProposal";
import { Route, Routes } from "react-router";
import Dashboard from "./pages/Dashboard";
import ProposalsPage from "./pages/ProposalsPage";
import ProposalDetailsPage from "./pages/ProposalDetailsPage";
import JudiciaryPage from "./pages/JudiciaryPage";
import CommitteesPage from "./pages/CommitteesPage";
import PeoplesHousePage from "./pages/PeoplesHousePage";
import MasterNodeDelegatePage from "./pages/MasterNodeDelegatePage";
import { Box } from "@chakra-ui/react";

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
          <Route path="/community" element={<CommitteesPage />} />
          <Route path="/community/judiciaries" element={<JudiciaryPage />} />
          <Route
            path="/community/peoples-house"
            element={<PeoplesHousePage />}
          />
          <Route
            path="/community/master-node-delegatee"
            element={<MasterNodeDelegatePage />}
          />
        </Route>
      </Routes>
    </Box>
  );
}

export default App;
