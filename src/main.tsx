import ReactDOM from "react-dom/client";
import "./index.css";
import "./utils/assets/inter-regular.ttf";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import WagmiProvider from "./providers/WagmiProvider";
import { WalletMenuProvider } from "./contexts/walletMenu";
import { UseClientProvider } from "./hooks/useClient";
import { ProvidersProvider } from "./hooks/providers";
import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";
import { ApolloProvider } from "@apollo/client";
import { apothemTestClient, client } from "./contexts/apolloClient";
import { ChakraProvider } from "@chakra-ui/react";
import { HashRouter as Router } from "react-router-dom";
import { AppGlobalConfigProvider } from "./contexts/AppGlobalConfig";
import { NetworkProvider } from "./contexts/network";
import { theme } from "./utils/theme";
import { GlobalStateProvider } from "./contexts/GlobalStateContext";
import { ModalProvider } from "./contexts/ModalContext";
import React from "react";

// import 'tailwindcss/tailwind.css';
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
// React-Query client
export const queryClient = new QueryClient();
root.render(
  <React.StrictMode>
    <Router>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <WagmiProvider>
            <AppGlobalConfigProvider>
              <NetworkProvider>
                <GlobalStateProvider>
                  <UseClientProvider>
                    <WalletMenuProvider>
                      <ProvidersProvider>
                        <ModalProvider>
                          <ApolloProvider
                            client={client["apothem"] || apothemTestClient} //TODO remove fallback when all clients are defined
                          >
                            <App />
                          </ApolloProvider>
                        </ModalProvider>
                      </ProvidersProvider>
                    </WalletMenuProvider>
                  </UseClientProvider>
                </GlobalStateProvider>
              </NetworkProvider>
            </AppGlobalConfigProvider>
          </WagmiProvider>
        </ChakraProvider>
      </QueryClientProvider>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
