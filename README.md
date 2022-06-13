# Make EpicNFT
In our last [branch](https://github.com/dakshp07/epic-nft/tree/onchain-random) we learnt how to mint an random NFT that too on chain and not depending on things like imgur, json keeper and shit. Now we move ahead and use react to deploy it on the frontend for the users to mint the NFTs and give some extra features.

# Connect wallet to web app
## Using window.ethereum()

So, in order for our website to talk to the blockchain, we need to somehow connect our wallet to it. Once we connect our wallet to our website, our website will have permission to call smart contracts on our behalf. **Remember, it's just like authenticating into a website.**

Head over Replit and go to `App.js` under `src`, this is where we'll be doing all our work.

If we're logged in to Metamask, it will automatically inject a special object named `ethereum` into our window that has some magical methods. Let's check if we have that first.

**Check all the comments in the code to understand the changes**

## See if we can access the user's account
So when you run this, you should see that line "We have the Ethereum object" printed in the console of the website when you go to inspect it. If you are using Replit, make sure you're looking at the console of your project website, not the Replit workspace! You can access the console of your website by opening it in its own window/tab and launching the developer tools.

Next, we need to actually check if we're authorized to actually access the user's wallet. Once we have access to this, we can call our smart contract!

Basically, Metamask doesn't just give our wallet credentials to every website we go to. It only gives it to websites we authorize. Again, it's just like logging in! But, what we're doing here is checking if we're "logged in".

**Check all the comments in the code to understand the changes**

## Build a connect wallet button
When you run the above code, the console.log that prints should be `No authorized account found`. Why? Well because we never explicitly told Metamask, "hey Metamask, please give this website access to my wallet".

We need to create a `connectWallet` button. In the world of Web3, connecting your wallet is literally a "Login" button for your user.

Ready for the easiest "login" experience for your life :)?

**Check all the comments in the code to understand the changes**

# Create a button to call contract and mint NFT
## Mint NFT through our website

Awesome. We made it. We've deployed our website. We've deployed our contract. We've connected our wallet. **Now we need to actually call our contract from our web app** using the credentials we have access to now from Metamask!

So, remember, our contract has the function `makeAnEpicNFT` which will actually mint the NFT. We'll need to now call this function from our web app. Go ahead and add the following function under the `connectWallet` function.

**Check all the comments in the code to understand the changes**

# A note on contract redeploys!!
Let's say you want to change your contract. You'd need to do 3 things:

- We need to deploy it again.

- We need to update the contract address on our frontend.

- We need to update the abi file on our frontend.

- People constantly forget to do these 3 steps when they change their contract. Don't forget lol.

Why do we need to do all this? Well, it's because smart contracts are immutable. They can't change. They're permanent. That means changing a contract requires a full redeploy. This will also reset all the variables since it'd be treated as a brand new contract. That means we'd lose all our NFT data if we wanted to update the contract's code.

Contract on Etherscan: https://rinkeby.etherscan.io/address/0x1574a1f0747b11B0E38BadA85e49aA0688fFba7b
NFTs Contract on OpenSea: https://testnets.opensea.io/collection/dakshnft-ihvavhwn3h 

# Finishing touches to web app
## Give user their OpenSea link
One thing that’d be awesome is after the NFT is minted we actually give a link to their NFT on OpenSea that they’d be able to share on Twitter or with their friends!!

The link for an NFT on OpenSea looks like this:
```
https://testnets.opensea.io/assets/0x88a3a1dd73f982e32764eadbf182c3126e69a5cb/9
```

Basically, these are the variables.
```
https://testnets.opensea.io/assets/INSERT_CONTRACT_ADDRESS_HERE/INSERT_TOKEN_ID_HERE
```

We’re going to be using something called `Events` in Solidity. These are sorta like webhooks. Lets write out some of the code and get it working first!

Add this line under the line where you create your three arrays with your random words!
```
event NewEpicNFTMinted(address sender, uint256 tokenId);
```

Then, add this line at very bottom of the `makeAnEpicNFT` function, so, this is the last line in the function:
```
emit NewEpicNFTMinted(msg.sender, newItemId);
```

At a basic level, events are messages our smart contracts throw out that we can capture on our client in real-time. In the case of our NFT, just because our transaction is mined **does not mean the transaction resulted in the NFT being minted**. It could have just error’d out!! Even if it error’d out, it would have still been mined in the process.

Thats why I use events here. I’m able to `emit` an event on the contract and then capture that event on the frontend. Notice in my `event` I send the `newItemId` which we need on the frontend, right :)?

Again, it’s sorta like a web hook. Except this is going to be the easiest webhook ever to setup lol.

**AGAIN RE-DEPLOY CONTRACT!!!**
As always when we change our contract.

- Redeploy.
- Update contract address in `App.js`.
- Update ABI file on the web app.
- If you mess any of this up, you will get errors :).

# Colorful backgrounds!
Just for fun, I changed the contract to randomly pick a colorful background. I'm not going to go over the code here because it was just for fun but feel free to see the comments [here](https://gist.github.com/farzaa/b3b8ec8aded7e5876b8a1ab786347cc9?utm_source=buildspace.so&utm_medium=buildspace_project). Remember if you change the contract you'll need to re-deploy, update the abi, and update the contract address. 

**NOT DONE BY ME IN THIS CONTRACT!**

# Set a limit on the # of minted NFTs
So, I challenge you to change your contract to only allow a set # of NFTs to be minted (for example, maybe you want only 50 NFTs to be minted max!!). It'd be even more epic if on your website it said something like `4/50 NFTs minted so far` or something like that to make your user feel super special when they get an NFT!!!

Hint, you'll need something in solidity called `require`. And, you'll like also need to create a function like `getTotalNFTsMintedSoFar` for your web app to call.

**Check all the comments in the code to understand the changes**

# Alert user when they’re on the wrong network
Your website is only going to work on Rinkeby (since that's where your contract lives).

We're going to to add a nice message telling users about this!

For that, we make a RPC request to the blockchain to see the ID of the chain our wallet connects to. (Why a chain and not a network? [Good question](https://ethereum.stackexchange.com/a/37571t)!)

We have already addressed requests to the blockchain. We used `ethereum.request` with the methods `eth_accounts` and `eth_requestAccounts`. Now we use `eth_chainId` to get the ID.

There, now the user will know if they are on the wrong network! The request conforms to [EIP-695](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-695.md?utm_source=buildspace.so&utm_medium=buildspace_project) so it returns the hex value of the network as a string. You can find the IDs of other networks [here](https://docs.metamask.io/guide/ethereum-provider.html#chain-ids?utm_source=buildspace.so&utm_medium=buildspace_project).

# Add a button to let people see the collection!
Perhaps the most important part!

Usually, when people want to see an NFT collection, they look at it on OpenSea!! It's a super-easy way for people to get a feel for your collection. So if you link your friend your site, they'll know it's legit!!

Add a little button that says "🌊 View Collection on OpenSea" and then when your users clicks it, it links to your collection! Remember, your collections link changes every time you change the contract. So be sure to link your latest and final collection. For example, this is my collection.

Note: This link you'll need to hardcode. I left a variable at the top for you to fill in. It can't be dynamically generated unless you use the OpenSea API (which is overkill for now lol).

# Output:
Contract Deployed
<img src="https://i.imgur.com/ii5U87P.png">

OpenSea Page
<img src="https://i.imgur.com/IQpLM2n.png">

Frontend
<img src="https://i.imgur.com/Ln9DQFg.png">

Contract on Etherscan: https://rinkeby.etherscan.io/address/0x1574a1f0747b11B0E38BadA85e49aA0688fFba7b
NFTs Contract on OpenSea: https://testnets.opensea.io/collection/dakshnft-ihvavhwn3h 

# Video Output
<img src="assets/output.gif">

# What's next?
- Learn about IPFS
- Verify Contract on Etherscan
- The NFTs still have some backgroun colors (ie black) lets make that random too, now we gonna get completely unique NFTs :)
and More
Check [here](https://buildspace.so/p/mint-nft-collection/lessons/LE8ed42760-6bec-415a-b2bc-4987858c99ad)