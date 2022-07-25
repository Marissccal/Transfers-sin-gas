import { expect } from "chai";
import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

let SignatureValidator: ContractFactory;
let signatureValidator: Contract;

let owner: SignerWithAddress;
let addr1: SignerWithAddress;
let addr2: SignerWithAddress;
let addrs: SignerWithAddress[];

before(async () => {
  SignatureValidator = await ethers.getContractFactory("SignatureValidator");
  [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
});

beforeEach(async function () {
  signatureValidator = await SignatureValidator.deploy();
});

describe("SignatureValidator", () => {
  it("should be verified", async () => {
    const signer = "0x2f852c93D92d5818909EaFD2c427Bb6DBE6D0E1a";

    const transaction = {
      to: "0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520",
      amount: 1000000,
      nonce: 0,
    };

    const r =
      "0x146d784f1b2983b942cfbba948de2d9d0e6eed3865c200c94dd696c82a7371fc";
    const s =
      "0x6899ed1c8793848dd27715e0b55c65e8e6f1539eaf2667392788447537fdd413";
    const v = "0x1b";

    expect(
      await signatureValidator.isValidTransaction(signer, transaction, v, r, s)
    ).to.be.true;
  });
});
