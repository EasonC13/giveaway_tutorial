import "@/styles/globals.css";
import type { AppProps } from "next/app";
import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider,
} from "@mysten/dapp-kit";
import { getFullnodeUrl, type SuiClientOptions } from "@mysten/sui/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import { EnokiFlowProvider } from "@mysten/enoki/react";

const queryClient = new QueryClient();
const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl("testnet") },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <EnokiFlowProvider apiKey={process.env.NEXT_PUBLIC_ENOKI_API_KEY || ""}>
        <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
          <WalletProvider autoConnect>
            <Component {...pageProps} />
          </WalletProvider>
        </SuiClientProvider>
        <ToastContainer />
      </EnokiFlowProvider>
    </QueryClientProvider>
  );
}
