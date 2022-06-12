import "./styles/App.css"
import twitterLogo from './assets/twitter-logo.svg'
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
// import abi file
import myEpicNft from './utils/MakeEpicNFT.json';

// Constants
const TWITTER_HANDLE = 'dakshp07';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = ' https://testnets.opensea.io/collection/dakshnft-ihvavhwn3h';
const OpenSeaLogo='https://storage.googleapis.com/opensea-static/Logomark/Logomark-Blue.svg';
const CONTRACT_ADDRESS="0x1574a1f0747b11B0E38BadA85e49aA0688fFba7b"; // contract address on testnet

const App=()=>{
    // state variables to store user wallet address
    const [currentAdd, setCurrAdd] = useState("");

    // state variables for current supply
    const [currentSupply, setCurrentSupply] = useState("");

    // state variables for total supply
    const [totalSupply, setTotalSupply] = useState(0); // intialize them as 0

    // state variable for correct chain ID
    const [chainIdOk, setChainIdOk] = useState(false); // seting them as false intially

    // checking if chain ID is correct or not ie its Rinkeby or not and displaying a toast if its wrong
    const checkIfChainIsCorrect = async () => {
        try {
          const { ethereum } = window
          const chainId = await ethereum.request({ method: 'eth_chainId' })
          const rinkebyChainId = '0x4'
          if (chainId !== rinkebyChainId) {
            setChainIdOk(false)
            alert(`Hey there! You are on wrong chain. Kindly switch to Rinkeby Test Network!`);
          } else {
            setChainIdOk(true)
          }
        } catch (error) {
          console.log(new Error(error))
        }
      }

    // check if we have the wallet or not
    const checkIfWalletConnected=async()=>{
        const {ethereum} = window;
        if(!ethereum)
        {
            console.log("make sure you have metamask!");
        }
        else
        {
            console.log("we have ethereum object", ethereum);
        }
        // check if we're authorized to access the user's wallet
        const acc=await ethereum.request({method: "eth_accounts"});

        // if we have multiple accounts then we grab the first one
        if(acc.length!==0)
        {
            const accs=acc[0];
            console.log("found authorized account: ", accs);
            setCurrAdd(accs);

            // Setup listener! This is for the case where a user comes to our site
            // and connected their wallet for the first time.
            setUpEventListener();

            // calling the chain correct here
            checkIfChainIsCorrect();
        }
        else
        {
            console.log("No authorized account found");
        }
    }

    // connect wallet method
    const connectWallet=async()=>{
        try{
            const {ethereum}=window;
            if(!ethereum)
            {
                alert("Get MetaMask!");
                return;
            }
            // method to access the account
            const acc=await ethereum.request({method: "eth_requestAccounts"});

            // now we gonna print the address
            console.log("Connected", acc[0]);

            setCurrAdd(acc[0]); // in case we have many accounts, we grab the first one

            // Setup listener! This is for the case where a user comes to our site
            // and connected their wallet for the first time.
            setUpEventListener();

            // calling the chain correct here
            checkIfChainIsCorrect();
        
        }
        catch(error){
            console.log(error);
        }
    }

    // Setup our listener
    const setUpEventListener=async()=>{
        try{
            const{ethereum}=window;
            if(ethereum)
            {
                const provider=new ethers.providers.Web3Provider(ethereum); // provider to talk to nodes provided by metamask
                const signer=provider.getSigner(); // here we sign the message or transaction or whatever
                // Just know that this line is what actually creates the connection to our contract. 
                // It needs: the contract's address, something called an abi file, and a signer. 
                // These are the three things we always need to communicate with contracts on the blockchain.
                const connectedContract=new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

                // THIS IS THE MAGIC SAUCE.
                // This will essentially "capture" our event when our contract throws it.
                // If you're familiar with webhooks, it's very similar to that!
                // we write our event name from contract to here
                connectedContract.on("NewEpicNFTMinted", (from, tokenId)=>{
                    console.log(from, tokenId.toNumber());
                    getCurrentTotalEpicNFTs(); // calling it here
                    alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
                });
                console.log("Setup event listener!")
            }
            else 
            {
                console.log("Ethereum object doesn't exist!");
            }
        }
        catch(error){
            console.log(error);
        }
    }

    // method to call our getCurrentTotalNFTs() from contract
    const getCurrentTotalEpicNFTs=async()=>{
        try {
            const { ethereum } = window
            if (ethereum) 
            {
              const provider = new ethers.providers.Web3Provider(ethereum)
              const signer = provider.getSigner()
              const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer)
              const total = await connectedContract.getCurrentTotalNFTs() // call the fucntion from contract
              setCurrentSupply(total.toNumber()) // set the value
            } 
            else 
            {
              console.log("Ethereum object doesn't exist!")
            }
        }
        catch(error){
            console.log(error)
        }
    }

    // method to call our getTotalNFTs() from contract
    const getTotalEpicNFTs=async()=>{
        try {
            const { ethereum } = window
            if (ethereum) 
            {
              const provider = new ethers.providers.Web3Provider(ethereum)
              const signer = provider.getSigner()
              const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer)
              const total = await connectedContract.getTotalNFTs() // call the fucntion from contract
              setTotalSupply(total.toNumber()) // set the value
            } 
            else 
            {
              console.log("Ethereum object doesn't exist!")
            }
        }
        catch(error){
            console.log(error)
        }
    }

    // lets write method to mint
    const askContractToMint=async()=>{
        try{
            const{ethereum}=window;
            if(ethereum)
            {
                const provider=new ethers.providers.Web3Provider(ethereum); // provider to talk to nodes provided by metamask
                const signer=provider.getSigner(); // here we sign the message or transaction or whatever
                // Just know that this line is what actually creates the connection to our contract. 
                // It needs: the contract's address, something called an abi file, and a signer. 
                // These are the three things we always need to communicate with contracts on the blockchain.
                const connectedContract=new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer); 
                console.log("pop wallet to pay gas..");
                let nftTxn=await connectedContract.makeEpicNFT(); // calling our makeEpicNFT() from contract

                console.log("mining...")
                await nftTxn.wait();

                console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
            }
            else
            {
                console.log("Ethereum object doesn't exist!");
            }
        }
        catch(error)
        {
            console.log(error);
        }
    }

    // render the button
    // onClick should make our connectWallet trigger
    const renderNotConnectedContainer=()=>(
        <button className="cta-button connect-wallet-button" onClick={connectWallet}>
            Connect to Wallet
        </button>
    );

    // this runs the function when page loads
    useEffect(()=>{
        checkIfWalletConnected();
        getCurrentTotalEpicNFTs();
        getTotalEpicNFTs();
    },[])

    return(
        <div className="App">
            <div className="container">
                <header className="header-top">
                    <h3>Mint MyNFT</h3>
                    {currentAdd===""?(<button className="cta-button header-button">Wallet Address</button>):(<button onClick={null} className="cta-button header-button">{currentAdd}</button>)}
                </header>
                <div className="header-container">
                    <p className="header gradient-text">
                        My NFT Collection
                    </p>
                    <p className="sub-text">
                        Each unique. Each beautiful. Discover your NFT today.
                    </p>
                    <p className="mint-text">
                        {currentSupply} of {totalSupply} is minted.
                    </p>
                    {/* Add render method here, if we dont have any curracc then we need to render connect wallet ie renderNotConnectedContainer but if we curracc then we need to display mintnft and clickong on it will call askContractToMint to mint, disabling the button if the network is wrong*/}
                    {currentAdd===""?(renderNotConnectedContainer()):(<button onClick={askContractToMint} className="cta-button connect-wallet-button" disabled={!chainIdOk}>Mint NFT</button>)}
                    <a href={`https://testnets.opensea.io/${currentAdd.toString()}?tab=collected`} target="_blank"><button className="cta-button connect-wallet-button-collected" disabled={!chainIdOk}>View Your Owned/Collected NFTs</button></a>
                </div>
                <div className="footer-container">
                    <img alt="Twitter Logo" src={twitterLogo} className="twitter-logo"/>
                    <a className="footer-text" href={TWITTER_LINK} target="_blank" rel="noreferrer">{`built by @${TWITTER_HANDLE}`}</a><br></br>
                    <img alt="OpenSea Logo" src={OpenSeaLogo} className="open-logo"/>
                    <a className="footer-text-down" href={OPENSEA_LINK} target="_blank" rel="noreferrer">{`View collection on OpenSea`}</a>
                </div>
            </div>
        </div>
    );
};

export default App;