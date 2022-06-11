// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.4;
// We first import some OpenZeppelin Contracts.
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract MyEpicNFT is ERC721URIStorage{
    // in the next line we use the stuff given to us by OpenZeppelin to help us keep a track of tokenIDs
    using Counters for Counters.Counter;
    Counters.Counter private tokenid;
    // here we declare the name of our NFT token and its symbol
    constructor() ERC721("DakshNFT", "DAKSH"){
        console.log("This is my NFT Contract!");
    }

    // we create a function which when hit by the users will help them get their NFT
    function makeEpicNFT() public {
        // get the current tokenID, it starts at 0
        uint256 newId=tokenid.current();
        // mint the NFT to the user sending the request by using msg.sender
        _safeMint(msg.sender, newId);
        // set the NFT data which looks like the example below, a json metadata (refer opensea requirements)
        // {
        //     "name": "Spongebob Cowboy Pants",
        //     "description": "A silent hero. A watchful protector.",
        //     "image": "https://i.imgur.com/v7U019j.png"
        // }
        _setTokenURI(newId, "https://jsonkeeper.com/b/P1YD");
        // log the NFT details
        console.log("a NFT with ID %s has been minted to %s", newId, msg.sender);
        // increment the tokenID for which the next NFT will be minted
        tokenid.increment();
    }
}