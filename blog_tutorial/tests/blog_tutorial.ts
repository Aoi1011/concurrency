import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { BlogTutorial } from '../target/types/blog_tutorial';

describe('blog_tutorial', () => {

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.BlogTutorial as Program<BlogTutorial>;

  it('Is initialized!', async () => {
    // Add your test here.
    const tx = await program.rpc.initialize({});
    console.log("Your transaction signature", tx);
  });
});
