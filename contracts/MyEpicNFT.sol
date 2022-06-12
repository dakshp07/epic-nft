// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.4;
// We first import some OpenZeppelin Contracts.
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";
// here we will use OpenZeppelin Contracts to make our json metadata (containing svg) into base64
import "@openzeppelin/contracts/utils/Base64.sol";

contract MyEpicNFT is ERC721URIStorage{
    // max supply will be 10
    uint256 maxSupply=10;

    // This is our SVG code. All we need to change is the word that's displayed. Everything else stays the same.
    // So, we make a baseSvg variable here that all our NFTs can use.
    string baseSvg="<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

    // I create three arrays, each with their own theme of random words.
    // Pick some random funny words, names of anime characters, foods you like, whatever! 
    string[] firstWords = ["Pizza", "Burger", "Rolls", "Drinks", "Nachos", "Bread"];
    string[] secondWords = ["Portugal", "Italy", "Germany", "Argentina", "Wales", "Brazil"];
    string[] thirdWords = ["Ronaldo", "Bonucci", "Muller", "Messi", "Bale", "Neymar"];

    // let's make some events so that we can give user the opensea link on frontend
    // format of one nft link: https://testnets.opensea.io/assets/INSERT_CONTRACT_ADDRESS_HERE/INSERT_TOKEN_ID_HERE
    event NewEpicNFTMinted(address sender, uint256 tokenID);

    // event for total no of minted nfts
    event getTotalNFTsMintedSoFar(uint256 maxSupply, uint256 currentSupply);

    // in the next line we use the stuff given to us by OpenZeppelin to help us keep a track of tokenIDs
    using Counters for Counters.Counter;
    Counters.Counter private tokenid;
    // here we declare the name of our NFT token and its symbol
    constructor() ERC721("DakshNFT", "DAKSH"){
        console.log("This is my NFT Contract!");
    }

    // now i will write a function to pick firstword from each array
    function pickRandomFirstWord(uint256 _tokenid) public view returns(string memory)
    {
        // use a seed to pick random number
        // What this is doing is it's taking two things: 
        // The actual string FIRST_WORD and a stringified version of the tokenId. 
        // I combine these two strings using abi.encodePacked and then that combined string is what I use as the source of randomness.
        uint256 rand=random(string(abi.encodePacked("FIRST_WORD", Strings.toString(_tokenid))));
        // place the range of # between 0 and the length of array
        rand=rand%firstWords.length;
        return firstWords[rand];
    }

    // now we will do similarly for second, third words respectively
    function pickRandomSecondWord(uint256 tokenId) public view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("SECOND_WORD", Strings.toString(tokenId))));
        rand = rand % secondWords.length;
        return secondWords[rand];
    }

    function pickRandomThirdWord(uint256 tokenId) public view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("THIRD_WORD", Strings.toString(tokenId))));
        rand = rand % thirdWords.length;
        return thirdWords[rand];
    }

    function random(string memory input) internal pure returns(uint256){
        return uint256(keccak256(abi.encodePacked(input)));
    }

    // we create a function which when hit by the users will help them get their NFT
    function makeEpicNFT() public {
        // get the current tokenID, it starts at 0
        uint256 newId=tokenid.current();

        // set max limit to reach
        require(newId<maxSupply, "Max Limit Reached");

        // We go and randomly grab one word from each of the three arrays.
        string memory first = pickRandomFirstWord(newId);
        string memory second = pickRandomSecondWord(newId);
        string memory third = pickRandomThirdWord(newId);

        // combining all the threewords
        string memory combinedWord = string(abi.encodePacked(first, second, third));

        // I concatenate it all together, and then close the <text> and <svg> tags.
        string memory finalSvg = string(abi.encodePacked(baseSvg, first, second, third, "</text></svg>"));

        // Get all the JSON metadata in place and base64 encode it.
        string memory json=Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        // We set the title of our NFT as the generated word.
                        combinedWord,
                        '", "description": "A highly acclaimed collection of NFTs.", "image": "data:image/svg+xml;base64,',
                        // We add data:image/svg+xml;base64 and then append our base64 encode our svg.
                        Base64.encode(bytes(finalSvg)),
                        '"}'
                    )
                )
            )
        );
        
        // Just like before, we prepend data:application/json;base64, to our data.
        string memory finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        // Now that you have your tokenURI setup, how do we know if it's actually correct? 
        // After all, this holds all our data for our NFT! You can use a cool tool like - NFT Preview: https://nftpreview.0xdev.codes/ to see a quick preview of the image and the contents of the json without deploying it again and again on the opensea testnet.

        console.log("\n--------------------");
        console.log(finalTokenUri);
        console.log("--------------------\n");

        // mint the NFT to the user sending the request by using msg.sender
        _safeMint(msg.sender, newId);
        // Check Readme to know what we change here and how it got change
        _setTokenURI(newId, finalTokenUri);
        // log the NFT details
        console.log("a NFT with ID %s has been minted to %s", newId, msg.sender);
        // emit the event
        emit NewEpicNFTMinted(msg.sender, newId);
        // emit the current supply event
        emit getTotalNFTsMintedSoFar(maxSupply, newId);
        // increment the tokenID for which the next NFT will be minted
        tokenid.increment();
    }

    // function to get the current no of NFTs
    function getCurrentTotalNFTs() public view returns (uint256) {
        return tokenid.current();
    }

    // function to get the total no of NFTs
    function getTotalNFTs() public view returns (uint256) {
        return maxSupply;
    }
}