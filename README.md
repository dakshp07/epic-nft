# Make EpicNFT
In our last [branch](https://github.com/dakshp07/epic-nft/tree/master) we learnt how to mint an NFT, and we also deployed our contract to mint NFT on Rinkeby testnet and successfully minted two nft which are now available on open sea for testnets.

**BUT!**

We have a big problem right now with our NFTs.

What happens if imgur goes down? Well — then our `image` link is absolutely useless and our NFT is lost and our image is lost! Even worse, what happens if that website that hosts the JSON file goes down? Well — then our NFT is completely broken because the metadata wouldn't be accesible.

One way to fix this problem is to store all our NFT data "on-chain" meaning the data lives on the contract itself vs in the hands of a third-party. This means our NFT will truly be permanent :). In this case, the only situation where we lose our NFT data is if the blockchain itself goes down. And if that happens — well then we have bigger problems!

But, assuming the blockchain stays up forever — our NFT will be up forever! This is very appealing because it also means if you sell an NFT, the buyer can be confident the NFT won't break. Many popular projects use on-chain data, [Loot](https://techcrunch.com/2021/09/03/loot-games-the-crypto-world/?utm_source=buildspace.so&utm_medium=buildspace_project) is one very popular example!

# What the heck are SVGs?
A common way to store NFT data for images is using a SVG. A SVG is an image, but the image itself is built with code.

For example, here's a really simple SVG that renders a black box with some white text in the middle.

```html
<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">
    <style>.base { fill: white; font-family: serif; font-size: 14px; }</style>
    <rect width="100%" height="100%" fill="black" />
    <text x="50%" y="50%" class="base" dominant-baseline="middle" text-anchor="middle">EpicLordHamburger</text>
</svg>
```

Head to [this](https://www.svgviewer.dev/?utm_source=buildspace.so&utm_medium=buildspace_project) website and paste in the code above to see it. Feel free to mess around with it.

This is really cool because it lets us create images with code.

SVGs can be customized a lot. 

# What are we exactly going to do now?
First, we're going to learn how to get all our NFT data on-chain. Our NFT is simply going to be a box with a funny three-word combo at the center. Just like the SVG above. We're going to hardcode the SVG above in our contract that says "EpicLordHamburger".

After that, we're going to learn how to dynamically generate these NFTs on our contract. So, every time someone mints an NFT they'll get a different, hilarious three-word combo. For example:

- EpicLordHamburger
- NinjaSandwichBoomerang
- SasukeInterstellarSwift

It's going to be epic :). Let's do this!

# Mint NFTs with static SVGs
Next, we want a way to somehow get this data in our NFT without hosting it somewhere like imgur (which can go down or die at any moment!). Head to [this](https://www.utilities-online.info/base64?utm_source=buildspace.so&utm_medium=buildspace_project) website. Paste in your full SVG code above and then click "encode" to get your base64 encoded SVG. Now, ready for some magic? Open a new tab. And in the URL bar paste this:

```
data:image/svg+xml;base64,INSERT_YOUR_BASE64_ENCODED_SVG_HERE
```
So for example, mine looks like this:
```
data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaW5ZTWluIG1lZXQiIHZpZXdCb3g9IjAgMCAzNTAgMzUwIj4NCiAgICA8c3R5bGU+LmJhc2UgeyBmaWxsOiB3aGl0ZTsgZm9udC1mYW1pbHk6IHNlcmlmOyBmb250LXNpemU6IDE0cHg7IH08L3N0eWxlPg0KICAgIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9ImJsYWNrIiAvPg0KICAgIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBjbGFzcz0iYmFzZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RXBpY0xvcmRIYW1idXJnZXI8L3RleHQ+DQo8L3N2Zz4=
```

We turned our SVG code into a nice string :). base64 is basically an accepted standard for encoding data into a string. So when we say data:image/svg+xml;base64 it's basically saying, "Hey, I'm about to give you base64 encoded data please process it as a SVG, thank you!".

Take that whole string data:image/svg+xml;base64,INSERT_YOUR_BASE64_ENCODED_SVG_HERE and paste it in your browser's address bar and boom you'll see the SVG! Note: if you get an error, double-check you followed all the steps properly. It's easy to mess up :).

Okay, epic. This is a way to keep our NFTs image data permanent and available forever. All the data centers in the world can burn down but since we have this base64 encoded string, we would always see the SVG as long as we have a computer and a browser.

<img src="https://i.imgur.com/f9mXVSb.png">

# Let's get rid of our JSON Data
Remember our JSON metadata?

Well, I changed it just a little bit for our three-word NFTs :). Same thing! A name, description, and image. But now instead of pointing to an imgur link, we point to our base64 encoded string.
```json
{
    "name": "EpicLordHamburger",
    "description": "An NFT from the highly acclaimed square collection",
    "image": "data:image/svg+xml;base64,INSERT_YOUR_BASE64_ENCODED_SVG_HERE"
}
```
Note: don't forget the quotation marks around the `data:image/svg+xml;base64,INSERT_YOUR_BASE64_ENCODED_SVG_HERE`.

For example, mine looks like this:
```json
{
    "name": "EpicLordHamburger",
    "description": "An NFT from the highly acclaimed square collection",
    "image": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaW5ZTWluIG1lZXQiIHZpZXdCb3g9IjAgMCAzNTAgMzUwIj4NCiAgICA8c3R5bGU+LmJhc2UgeyBmaWxsOiB3aGl0ZTsgZm9udC1mYW1pbHk6IHNlcmlmOyBmb250LXNpemU6IDE0cHg7IH08L3N0eWxlPg0KICAgIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9ImJsYWNrIiAvPg0KICAgIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBjbGFzcz0iYmFzZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RXBpY0xvcmRIYW1idXJnZXI8L3RleHQ+DQo8L3N2Zz4="
}
```
**But wait — where will our fancy new JSON file go? We are not yet done, we were dependent on json keeper for our json data but lets change that too. How?**

Right now, we host it on [this](https://jsonkeeper.com/?utm_source=buildspace.so&utm_medium=buildspace_project) random website. If that website goes down, our beautiful NFT is gone forever! Here's what we're going to do. **We're going to base64 encode our entire JSON file. Just like we encoded our SVG.**

Head to [this](https://www.utilities-online.info/base64?utm_source=buildspace.so&utm_medium=buildspace_project) website again. Paste in your full JSON metadata with the base64 encoded SVG (should look sorta like what I have above) and then click "encode" to get you encoded JSON.

Open a new tab. And in the URL bar paste this:
```
data:application/json;base64,INSERT_YOUR_BASE64_ENCODED_JSON_HERE
```
For example, mine looks like this:
```
data:application/json;base64,ewogICAgIm5hbWUiOiAiRXBpY0xvcmRIYW1idXJnZXIiLAogICAgImRlc2NyaXB0aW9uIjogIkFuIE5GVCBmcm9tIHRoZSBoaWdobHkgYWNjbGFpbWVkIHNxdWFyZSBjb2xsZWN0aW9uIiwKICAgICJpbWFnZSI6ICJkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUI0Yld4dWN6MGlhSFIwY0RvdkwzZDNkeTUzTXk1dmNtY3ZNakF3TUM5emRtY2lJSEJ5WlhObGNuWmxRWE53WldOMFVtRjBhVzg5SW5oTmFXNVpUV2x1SUcxbFpYUWlJSFpwWlhkQ2IzZzlJakFnTUNBek5UQWdNelV3SWo0TkNpQWdJQ0E4YzNSNWJHVStMbUpoYzJVZ2V5Qm1hV3hzT2lCM2FHbDBaVHNnWm05dWRDMW1ZVzFwYkhrNklITmxjbWxtT3lCbWIyNTBMWE5wZW1VNklERTBjSGc3SUgwOEwzTjBlV3hsUGcwS0lDQWdJRHh5WldOMElIZHBaSFJvUFNJeE1EQWxJaUJvWldsbmFIUTlJakV3TUNVaUlHWnBiR3c5SW1Kc1lXTnJJaUF2UGcwS0lDQWdJRHgwWlhoMElIZzlJalV3SlNJZ2VUMGlOVEFsSWlCamJHRnpjejBpWW1GelpTSWdaRzl0YVc1aGJuUXRZbUZ6Wld4cGJtVTlJbTFwWkdSc1pTSWdkR1Y0ZEMxaGJtTm9iM0k5SW0xcFpHUnNaU0krUlhCcFkweHZjbVJJWVcxaWRYSm5aWEk4TDNSbGVIUStEUW84TDNOMlp6ND0iCn0=
```
When you paste that full URI into your browsers address bar, you'll see the full JSON in all it's glory. **BOOOOOM!** Now we have a way to keep our JSON metadata permanent and available forever.

Here's a screenshot of mine:

<img src="https://i.imgur.com/y1ZaYGf.png">

# Change our contract, deploy
Okay awesome, we've got this fancy base64 encoded JSON file. How do we get it on our contract? Simple head to `MyEpicNFT.sol` and — we just copy-paste the whole big string into our contract.

We just need to change one line.
```
_setTokenURI(newItemId, "data:application/json;base64,INSERT_BASE_64_ENCODED_JSON_HERE")
```

Finally, let's deploy our updated contract, mint the NFT, and make sure it works properly on OpenSea! Deploy using the same command. I changed my deploy script a little to only mint one NFT instead of two, feel free to do the same!
```
npx hardhat run scripts/deploy.js --network rinkeby
```
Everything worked fine, we removed centralization and made our stuff remain on-chain.
**BUT BUT**
NFTs are Non Fungible Token which means all the tokens have unique attribute and are completely different but here we are deploying only one NFT, so why would a user mint them if everyone has the same NFT??

# Dynamically generating SVG NFTs on-chain
## Randomly generate words on an image
Cool — we created a contract that's now minting NFTs all on-chain. But, it's still always the same NFT argh!!! Let's make it dynamic.
**I wrote out all the code with comments in the solidity contract file which will generate an SVG with a combination of three random words.**

**All the comments in the solidity code explains everything!!**

# Deploy to Rinkeby
The coolest part is we can just re-deploy without changing our script using:
```
npx hardhat run scripts/deploy.js --network rinkeby
```
Once we redeploy, you'll be able to see your NFTs on https://testnets.opensea.io/ once you search the newly deployed contract address. 

My contract on Rinkeby: https://rinkeby.etherscan.io/address/0xAbA4d9454D47c76506202F389248Cb8a2710062F

Minted NFTs on OpenSea Testnet: https://testnets.opensea.io/collection/dakshnft-v3

# Output:
<img src="https://i.imgur.com/AFMS8E4.png">


<img src="https://i.imgur.com/NXc5G6K.png">