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
import { Box, useColorModeValue } from "@chakra-ui/react";
import CommunityPage from "./pages/CommunityPage";
import TreasuryPage from "./pages/TreasuryPage";
import Footer from "./components/Footer";
import { ScrollRestoration, createBrowserRouter } from "react-router-dom";
import { useEffect } from "react";
import NotFoundPage from "./pages/NotFoundPage";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/create/:type",
    element: <CreateProposal />,
  },
  {
    path: "/proposals",
    children: [
      {
        path: "/proposals",
        element: <ProposalsPage />,
      },
      {
        path: "/proposals/:proposalId/details",
        element: <ProposalDetailsPage />,
      },
    ],
  },
  {
    path: "/community",
    children: [
      {
        path: "/community",
        element: <CommunityPage />,
      },
      {
        path: "/community/judiciary",
        element: <JudiciaryPage />,
      },
      {
        path: "/community/peoples-house",
        element: <PeoplesHousePage />,
      },
      {
        path: "/community/masternode-delegatee-senate",
        element: <MasterNodeDelegatePage />,
      },
    ],
  },
]);
function App() {
  return (
    <Box bgColor={useColorModeValue("#FFF", "#19262e")}>
      <Header />
      {/* <RouterProvider router={router} /> */}
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
