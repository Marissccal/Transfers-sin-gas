
const hre = require("hardhat");

async function main() {
  
  const Token = await hre.ethers.getContractFactory("Token");

  console.log("Waiting for deploying...");

  const token = await Token.deploy(3000, 0);
  await token.deployed();

  console.log("Token deployed to:", token.address);
}


main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
