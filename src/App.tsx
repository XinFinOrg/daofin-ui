import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Web3Button, useWeb3Modal } from "@web3modal/react";
import { useAccount } from "wagmi";
import Header from "./components/Header";
import { useClient } from "./hooks/useClient";
import { useDaoQuery } from "./hooks/useDaoDetails";
import DaoHeader from "./components/DaoHeader";
import DaofinSettingsCard from "./components/DaofinSettingsCard";
import { styled } from "styled-components";
import CreateProposal from "./pages/CreateProposal";
import Tiptap from "./components/Tiptap";
import { Route, Routes } from "react-router";
import Dashboard from "./pages/Dashboard";
import ProposalsPage from "./pages/ProposalsPage";
import ProposalDetailsPage from "./pages/ProposalDetailsPage";
import JudiciaryPage from "./pages/JudiciaryPage";
import CommitteesPage from "./pages/CommitteesPage";
import PeoplesHousePage from "./pages/PeoplesHousePage";
import MasterNodeDelegatePage from "./pages/MasterNodeDelegatePage";

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
      <Routes>
        <Route path="/create" element={<CreateProposal />} />
      </Routes>
      <Routes>
        <Route path="/proposals">
          <Route path="/proposals" element={<ProposalsPage />} />
          <Route
            path="/proposals/:proposalId/details"
            element={<ProposalDetailsPage />}
          />
        </Route>

        <Route path="/committees">
          <Route path="/committees" element={<CommitteesPage />} />
          <Route path="/committees/judiciaries" element={<JudiciaryPage />} />
          <Route
            path="/committees/peoples-house"
            element={<PeoplesHousePage />}
          />
          <Route
            path="/committees/master-node-delegatee"
            element={<MasterNodeDelegatePage />}
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
