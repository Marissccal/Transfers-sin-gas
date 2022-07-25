const express = require("express");
const cors = require("cors");
const ethers = require("ethers");
const { utils } = ethers;
const { formatEther } = utils;

const app = express();

const port = 3000;

app.use(cors());
app.use(express.json());

// ethereum
const contractABI = require("./MetaTransaction.json").abi;
const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
const owner = new ethers.Wallet(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
  provider
);

const addr1 = new ethers.Wallet(
  "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
  provider
);

const addr2 = new ethers.Wallet(
  "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
  provider
);

// const addr1Address = "0x70997970c51812dc3a010c7d01b50e0d17dc79c8";
// const addr2Address = "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc";

const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
const contract = new ethers.Contract(contractAddress, contractABI, owner);

app.get("/", async (req, res) => {
  const balance = formatEther(await owner.getBalance());
  const tokenBalance = (await contract.balanceOf(owner.address)).toNumber();

  res.send(
    `
    Owner ETH balance: ${balance} </br> 
    Owner Token balance: ${tokenBalance} </br>
    addr1 ETH balance: ${formatEther(await addr1.getBalance())} </br>
    addr1 Token balance: ${(
      await contract.balanceOf(addr1.address)
    ).toNumber()} </br>
    addr2 ETH balance: ${formatEther(await addr2.getBalance())} </br>
    addr2 Token balance: ${(
      await contract.balanceOf(addr2.address)
    ).toNumber()} </br>
   
    `
  );
});

app.post("/transfer", async (req, res) => {
  const data = req.body;
  const signature = data.signature;

  const r = "0x" + signature.substring(2).substring(0, 64);
  const s = "0x" + signature.substring(2).substring(64, 128);
  const v = "0x" + signature.substring(2).substring(128, 130);

  const transaction = {
    to: data.to,
    amount: data.amount,
    nonce: 0,
  };

  console.log(data);

  contract.metaTransfer(data.signer, transaction, v, r, s);
  res.end();
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
