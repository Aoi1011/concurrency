import {
  AppBar,
  Box,
  Container,
  Link,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import React from "react";
import TwitterIcon from "@material-ui/icons/Twitter";
import GitHubIcon from "@material-ui/icons/GitHub";
import { PublicKey, Keypair } from "@solana/web3.js";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "transparent",
    boxShadow: "none",
    borderTop: "1px solid @e6e6e5",
    flexShrink: 0,
    marginTop: theme.spacing(2),
  },
  toolbar: {
    justifyContent: "space-between",
  },
  twitter: {
    marginRight: theme.spacing(1),
  },
}));

interface FooterProps {
  programID: PublicKey;
  voteAccount: Keypair;
}

function Footer({ programID, voteAccount }: FooterProps) {
  const classes = useStyles();
  return (
    <AppBar position="static" className={classes.root}>
      <Container maxWidth="xl">
        <Toolbar className="toolbar">
          <Typography variant="caption">
            Made by{" "}
            <Link underline="always" href="https://github.com/Aoi1011">
              Aoi
            </Link>
            {" | "}
            <Link underline="always" href="https://solana.com/">
              Solana
            </Link>
            {" | "}
            <Link
              underline="always"
              //   href={`https://explorer.solana.com/address/${voteAccount?.publicKey.toString()}`}
            >
              Vote Account
            </Link>
            {" | "}
            <Link underline="always" href="https://www.freepik.com/">
              Icon Credits
            </Link>
          </Typography>
          <Box>
            <Link className={classes.twitter} href="https://twitter.com">
              <TwitterIcon />
            </Link>
            <Link href="https://github.com">
              <GitHubIcon />
            </Link>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Footer;
