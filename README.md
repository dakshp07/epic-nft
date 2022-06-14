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

Contract on Etherscan: https://rinkeby.etherscan.io/address/0x448dc59FeeC045D40239cA3378b4EB55BdedB16B
NFTs Contract on OpenSea: https://testnets.opensea.io/collection/dakshnft-vidmpxbpjt 

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

**Check all the comments in the code to understand the changes**

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
## Upgrade your immortal NFTs with IPFS
Think about where your NFT assets are actually stored right now. They're on the Ethereum blockchain! This is awesome for lots of reasons, but it has a few issues. Mainly, it's very expensive because of how much storage costs on Ethereum. Contracts also have a length limit, so if you make a really fancy animated SVG that's very long, it won't fit in a contract.

Luckily we have something called [IPFS](https://en.wikipedia.org/wiki/InterPlanetary_File_System?utm_source=buildspace.so&utm_medium=buildspace_project), which is essentially a distributed file system. Today — you might use something like S3 or GCP Storage. But, in this case we can simply trust IPFS which is run by strangers who are using the network. Give [this](https://decrypt.co/resources/how-to-use-ipfs-the-backbone-of-web3?utm_source=buildspace.so&utm_medium=buildspace_project) a quick read when you can! Covers a lot of good base knowledge :). Really, all you need to know is that IPFS is the industry standard for storing NFT assets. It's immutable, permanent, and decentralized.

Using it is pretty simple. All you need to do is upload your NFTs to IPFS and then use the unique content ID hash it gives you back in your contract instead of the Imgur URL or SVG data.

First, you'll need to upload your images to a service that specializes in "[pinning](https://docs.ipfs.io/how-to/pin-files/?utm_source=buildspace.so&utm_medium=buildspace_project)" — which means your file will essentially be cached so its easily retrievable. I like using **[Pinata](https://www.pinata.cloud/?utm_source=buildspace?utm_source=buildspace.so&utm_medium=buildspace_project)** as my pinning service — they give you 1 GB of storage for free, which is enough for 1000s of assets. Just make an account, upload your character's image files through their UI, and that's it!

Go ahead and copy the files "CID". This is the files content address on IPFS! What's cool now is we can create this link:
```
https://cloudflare-ipfs.com/ipfs/INSERT_YOUR_CID_HERE
```

If you are using **Brave Browser** (which has IPFS built in) you can just type this paste into the URL:
```
ipfs://INSERT_YOUR_CID_HERE
```
And that'll actually start an IPFS node on your local machine and retrieve the file! If you try to do it on something like Chrome it just does a Google search lol. Instead you'll have to use the `cloudflare-ipfs` link.

From here, we just need to update our `tokenURI` function to prepend `ipfs://`. Basically, OpenSea likes when our image URI is structured like this: `ipfs://INSERT_YOUR_CID_HERE`.

Here's what your `_setTokenURI` function should look like:
```
_setTokenURI(newItemId, "ipfs://INSERT_YOUR_CID_HERE")
```
And now you know how to use IPFS! 

**BUT BUT!!!!**

There's a catch in our scenario though - we're dynamically generating the SVG code on-chain. You can't upload assets to IPFS from inside contracts, so you'll have to generate the SVGs in your browser or a dedicated server, upload them to IPFS, and pass the CIDs into your mint function as a string.

I'm just going to leave this for you to explore, but, sometimes you won't want to store your NFTs on-chain. Perhaps you want to have a video as an NFT. Doing it on-chain would be wildly expensive due to gas fees.

Remember, an NFT is just a JSON file at the end of the day that links to some metadata. You can put this JSON file up on IPFS. You can also put the NFT data itself (ex an image, video, etc) up on IPFS. Don't overcomplicate it :).

**A large percentage of NFTs use IPFS. It's the most popular way to store NFT data today.**

I'll leave it to you to explore!! ;)

# Verify contract on Etherscan 
Do you know that you are able to show your smart contract source code to the world? Doing so will enable your logic to be really transparent. True to the spirit of a public blockchain. Everyone who wishes to interact with your smart contract on the blockchain is able to peer into the contract logic first! For that, Etherscan has the **Verify Contract** function. [Here](https://rinkeby.etherscan.io/address/0x902ebbecafc54f7a8013a9d7954e7355309b50e6#code?utm_source=buildspace.so&utm_medium=buildspace_project) is an example of how a verified contract will look like. Feel free to examine the smart contract yourself.

If you select the **Contract** tab in Etherscan, you will notice a long list of text characters that starts from `0x608060405234801...` Hmm.. what could that be 🤔 ?
<img src="https://user-images.githubusercontent.com/60590919/139609052-f4bba83c-f224-44b1-be74-de8eaf31b403.png">

It turns out that this long, gibberish looking group of characters is actually the bytecodes of the contract which you have deployed! Bytecodes represent a series of opcodes in the EVM that will perform instructions for us onchain.

This is a lot of new information to understand, so don't worry if it doesn't make much sense right now. Take a moment to look up what bytecodes and EVM mean! Use Google :). [This is also a cool article](https://ethervm.io/?utm_source=buildspace.so&utm_medium=buildspace_project) about EVM opcodes by the way 🤘.

So, we know that bytecodes aren't readable to us. We want to be able to see the code we wrote right in Etherscan. Luckily, Etherscan has the magic to help us do that!

Notice that there is a prompt that requests us to **Verify and Publish** our contract source code. If we follow the link, we are required to manually select our contract settings and paste our code to publish our source code.

Luckily for us hardhat offers a smarter way of doing this.

Head back to your hardhat project and install `@nomiclabs/hardhat-etherscan` by running the command:
```
npm i -D @nomiclabs/hardhat-etherscan
```

Then in your `hardhat.config.js` add the following
```js
require("@nomiclabs/hardhat-etherscan");

// Rest of code
...

module.exports = {
  solidity: "0.8.1",

  // Rest of the config
  ...,
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: "",
  }
};
```
We are almost there! You may have noticed that the `etherscan` object in our config requires an `apiKey`! This means you will need an account with Etherscan to get this key.

If you don't have an account already, head to https://etherscan.io/register to create a free user account. After which head to your profile settings and under `API-KEYs` create a new apikey

Sweet you got your API key. Time to head back to your `hardhat.config.js` file and change the `apiKey` property to be your newly generated key.

**Note: Do not share your Etherscan api key with others**

We are down to our last step I promise. All that remains now is to run the command
```
npx hardhat verify YOUR_CONTRACT_ADDRESS --network rinkeby
```
If everything runs smoothly, you should see some outputs in the terminal. Mine looks like this:
<img src="https://i.imgur.com/76xQTIc.png">

# You've done it
Super exciting that you made it to the end. Pretty big deal!

Before you head out, be sure to add a few of those little final touches from the previous lesson if you feel like it. Those really make the difference.

Thank you for contributing to the future of web3 by learning this stuff. The fact that you know how this works and how to code it up is a superpower. Use your power wisely ;).
