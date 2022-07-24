import { expect } from "chai";
import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

let Token: ContractFactory;
let token: Contract;

let owner: SignerWithAddress;
let addr1: SignerWithAddress;
let addr2: SignerWithAddress;
let addrs: SignerWithAddress[];

before(async () => {
  Token = await ethers.getContractFactory("Token");
  [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
});

beforeEach(async function () {
  token = await Token.deploy(3000, 0);
});

describe("Token basic", () => {
  it("should have issuer who is the owner", async () => {
    expect(await token.issuer()).to.equal(owner.address);
  });

  it("should have name MyAwesomeToken", async () => {
    expect(await token.name()).to.equal("MyAwesomeToken");
  });

  it("should have 3000 total supply", async () => {
    expect(await token.totalSupply()).to.equal(3000);
  });

  it("should have 3000 tokens in owner's address", async () => {
    expect(await token.balanceOf(owner.address)).to.equal(3000);
  });
});

describe("Issuer's power", () => {
  it("should not mint new token by addr1", async () => {
    const tokenByAddr1 = token.connect(addr1);
    await expect(tokenByAddr1.mint(addr1.address, 1000)).to.be.revertedWith(
      "Caller is not a minter"
    );
    expect(await token.totalSupply()).to.equal(3000);
  });
});

describe("Transfer", () => {
  it("should not transfer with decimal", async () => {
    await expect(token.transfer(addr1.address, 100.3)).to.be.reverted;
    await token.transfer(addr1.address, 100);
    expect(await token.balanceOf(addr1.address)).to.equal(100);
  });
});
