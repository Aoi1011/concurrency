import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletDialogProvider } from "@solana/wallet-adapter-material-ui";
// import {
//   LedgerWalletAdapter,
//   PhantomWalletAdapter,
//   SlopeWalletAdapter,
//   SolflareWalletAdapter,
//   SolletExtensionWalletAdapter,
//   SolletWalletAdapter,
//   TorusWalletAdapter, 
// } from "@solana/wallet-adapter-wallets";
import { getPhantomWallet } from "@solana/wallet-adapter-wallets";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { SnackbarProvider, useSnackbar } from "notistack";
import { createTheme, ThemeProvider } from "@material-ui/core";
import { blue, orange } from "@material-ui/core/colors";
import { useCallback, useEffect, useMemo, useState } from "react";
import { web3 } from "@project-serum/anchor";
import { clusterApiUrl, Keypair } from "@solana/web3.js";

import Main from "./components/Main";

// require("@solana/wallet-adapter-react-ui/styles.css");

// const localnet = "http://127.0.0.1:8899";
// const network = localnet;

const theme = createTheme({
  palette: {
    primary: {
      main: blue[300],
    },
    secondary: {
      main: orange[300],
    },
  },
  overrides: {
    MuiButtonBase: {
      root: {
        textTransform: undefined,
        padding: "12px 16px",
        fontWeight: 600,
      },
      // startIcon: {
      //   marginRight: 8,
      // },
      // endIcon: {
      //   marginLeft: 8,
      // },
      // label: {
      //   color: "white",
      // },
    },
    MuiLink: {
      root: {
        color: "initial",
      },
    },
  },
});

function AppWrappedWithProviders() {
  const { enqueueSnackbar } = useSnackbar();
  const [voteAccount, setVoteAccount] = useState<Keypair>();

  // const network = WalletAdapterNetwork.Devnet;
  const devnet = clusterApiUrl("devnet");
  const network = devnet;
  // const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  // const network = "http://127.0.0.1:8899";

  // const wallets = useMemo(
  //   () => [
  //     new PhantomWalletAdapter(),
  //     // new SlopeWalletAdapter(),
  //     // new SolflareWalletAdapter(),
  //     // new TorusWalletAdapter(),
  //     // new LedgerWalletAdapter(),
  //     // new SolletWalletAdapter({ network }),
  //     // new SolletExtensionWalletAdapter({ network }),
  //   ],
  //   [network]
  // );

  const wallets = [getPhantomWallet()];

  useEffect(() => {
    fetch("/voteAccount")
      .then((response) => response.json())
      .then((data) => {
        const accountArray: number[] = Object.values(
          data.voteAccount._keypair.secretKey
        );
        const secret = new Uint8Array(accountArray);
        const kp = web3.Keypair.fromSecretKey(secret);
        setVoteAccount(kp);
      })
      .catch((err) => {
        console.log(err);
        enqueueSnackbar("Could not fetch vote account", { variant: "error" });
      });
  }, [enqueueSnackbar]);

  const onWalletError = useCallback(
    (error) => {
      enqueueSnackbar(
        error.message ? `${error.name}: ${error.message}` : error.name,
        { variant: "error" }
      );
      console.error(error);
    },
    [enqueueSnackbar]
  );

  return (
    <ConnectionProvider endpoint={network}>
      <WalletProvider wallets={wallets} onError={onWalletError} autoConnect>
        <WalletModalProvider>
          <WalletMultiButton />
          <WalletDisconnectButton />
          <Main network={network} voteAccount={voteAccount!} />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

function App() {
  // const network = WalletAdapterNetwork.Devnet;
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <AppWrappedWithProviders />
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
