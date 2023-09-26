import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Web3Button, useWeb3Modal } from "@web3modal/react";
import { useAccount } from "wagmi";
import Header from "./components/Header";
import { useClient } from "./hooks/useClient";
import { useDaoQuery } from "./hooks/useDaoDetails";
import DaoHeader from "./components/DaoHeader";

function App() {
  const { open, isOpen } = useWeb3Modal();
  const { status } = useAccount();
  const { daofinClient } = useClient();

  return (
    <div className="App">
      <Header />
      <DaoHeader />
      <header className="p-2"></header>
    </div>
  );
}

export default App;
