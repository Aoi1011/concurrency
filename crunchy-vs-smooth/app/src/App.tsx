import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletDialogProvider } from "@solana/wallet-adapter-material-ui";
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { SnackbarProvider, useSnackbar } from "notistack";
import { createTheme, ThemeProvider } from "@material-ui/core";
import { blue, orange } from "@material-ui/core/colors";
import { useCallback, useEffect, useState } from "react";
import { web3 } from "@project-serum/anchor";
import { Keypair } from "@solana/web3.js";

import Main from "./components/Main";

const localnet = "http://127.0.0.1:8899";
const network = localnet;

const wallets = [
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
];

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
  });

  return (
    <WalletProvider wallets={wallets} onError={onWalletError} autoConnect>
      
    </WalletProvider>
  )
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
