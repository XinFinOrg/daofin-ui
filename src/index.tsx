import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import WagmiProvider from "./providers/WagmiProvider";
import { WalletMenuProvider } from "./contexts/walletMenu";
import { UseClientProvider } from "./hooks/useClient";
import { ProvidersProvider } from "./hooks/providers";
import { HashRouter } from "react-router-dom";
import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";
import { ApolloProvider } from "@apollo/client";
import { apothemTestClient, client } from "./contexts/apolloClient";

// import 'tailwindcss/tailwind.css';
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
// React-Query client
export const queryClient = new QueryClient();
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <WagmiProvider>
          <UseClientProvider>
            <WalletMenuProvider>
              <ProvidersProvider>
                <ApolloProvider
                  client={client["apothem"] || apothemTestClient} //TODO remove fallback when all clients are defined
                >
                  <App />
                </ApolloProvider>
              </ProvidersProvider>
            </WalletMenuProvider>
          </UseClientProvider>
        </WagmiProvider>
      </HashRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
