const hre = require("hardhat");

async function main() {
  
  const MetaTransaction = await hre.ethers.getContractFactory(
    "MetaTransaction"
  );

  console.log("Waiting for deploying...");

  const metaTransaction = await MetaTransaction.deploy();
  await metaTransaction.deployed();

  // owner transfiere 100 tokens a addr1 y addr2 respectivamente

  const addr1Address = "0x70997970c51812dc3a010c7d01b50e0d17dc79c8";
  const addr2Address = "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc";

  await metaTransaction.transfer(addr1Address, 100);
  await metaTransaction.transfer(addr2Address, 100);

  console.log("Contract address: ", metaTransaction.address);
}


main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
