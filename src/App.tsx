import Header from "./components/Header";
import CreateProposal from "./pages/CreateProposal";
import { Route, Routes } from "react-router";
import Dashboard from "./pages/Dashboard";
import ProposalsPage from "./pages/ProposalsPage";
import ProposalDetailsPage from "./pages/ProposalDetailsPage";
import JudiciaryPage from "./pages/JudiciaryPage";
import PeoplesHousePage from "./pages/PeoplesHousePage";
import MasterNodeDelegatePage from "./pages/MasterNodeDelegatePage";
import { Box, useColorModeValue } from "@chakra-ui/react";
import CommunityPage from "./pages/CommunityPage";
import TreasuryPage from "./pages/TreasuryPage";
import Footer from "./components/Footer";
import NotFoundPage from "./pages/NotFoundPage";
import useSlowScroll from "./hooks/useSlowScroll";

function App() {
  useSlowScroll();
  // #141c29
  return (
    // <Box bgColor={useColorModeValue("#FFF", "#1c2531")} minH={"100vh"}>
    <Box bgColor={useColorModeValue("#FFF", "#141c29")} minH={"100vh"}>
      <Header />
      {/* <RouterProvider router={router} /> */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
      {/* <Routes>
        <Route path="/create/:type" element={<CreateProposal />} />
      </Routes> */}
      <Routes>
        <Route path="/proposals">
          <Route path="/proposals" element={<ProposalsPage />} />
          <Route
            path="/proposals/:proposalId/details"
            element={<ProposalDetailsPage />}
          />
          <Route path="/proposals/create/:type" element={<CreateProposal />} />
        </Route>

        <Route path="/community">
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/community/judiciary" element={<JudiciaryPage />} />
          <Route path="/community/house" element={<PeoplesHousePage />} />
          <Route
            path="/community/senate"
            element={<MasterNodeDelegatePage />}
          />
        </Route>
        <Route path="/treasury">
          <Route path="/treasury" element={<TreasuryPage />} />
        </Route>
      </Routes>
      <Routes>
        <Route path="/not-found">
          <Route path="/not-found" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <Box p={5}>
        <Footer />
      </Box>
    </Box>
  );
}

export default App;
