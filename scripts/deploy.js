const main=async()=>{
    const nftFactory=await hre.ethers.getContractFactory('MyEpicNFT'); // calling our contract by its name (*not file name, its the contract name) and compiling it and generate the necessary files we need to work with our contract under the artifacts directory.
    const nftContract=await nftFactory.deploy(); // deploying it

    // What's happening here is Hardhat will create a local Ethereum network for us, but just for this contract. 
    // Then, after the script completes it'll destroy that local network. So, every time you run the contract, it'll be a fresh blockchain. Whats the point? It's kinda like refreshing your local server every time so you always start from a clean slate which makes it easy to debug errors.

    // We'll wait until our contract is officially mined and deployed to our local blockchain!
    // That's right, hardhat actually creates fake "miners" on your machine to try its best to imitate the actual blockchain.
    await nftContract.deployed(); // waiting for it to get deployed
    console.log("contract deployed to: ", nftContract.address); // log the address of the contract

    // calling the smart contract fucntion
    let txn=await nftContract.makeEpicNFT();
    // wait for the txn to be mined
    await txn.wait();
    console.log("Minted NFT #1")

    // mint one more
    // txn=await nftContract.makeEpicNFT();
    // wait for the txn to be mined
    // await txn.wait();
    // console.log("Minted NFT #2")
};

const runMain=async()=>{
    try{
        await main();
        process.exit(0);
    }
    catch(error){
        console.log(error);
        process.exit(1);
    }
};

runMain();