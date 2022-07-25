import { expect } from "chai";
import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { signTypedData_v4 } from "eth-sig-util";
import { formatEther } from "../utils/ether";
const msgJSON = require("./eip712-msg.json");

let MetaTransaction: ContractFactory;
let metaTransaction: Contract;

let owner: SignerWithAddress;
let addr1: SignerWithAddress;
let addr2: SignerWithAddress;
let addrs: SignerWithAddress[];

before(async () => {
  MetaTransaction = await ethers.getContractFactory("MetaTransaction");

  [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
});

beforeEach(async function () {
  metaTransaction = await MetaTransaction.deploy();

  

  await metaTransaction.transfer(addr1.address, 100);
  console.log(
    "addr1 balance: ",
    (await metaTransaction.balanceOf(addr1.address)).toNumber()
  );
  console.log("owner address: ", owner.address);
  console.log("addr1 address: ", addr1.address);
  console.log("addr2 address: ", addr2.address);
});

describe("MetaTransaction", () => {
  it("should transfer with meta-transactions", async () => {
    const addr1ETHBalanceBefore = await addr1.getBalance();
    const addr1PrivateKey =
      "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";

    msgJSON.domain.verifyingContract = metaTransaction.address;
    msgJSON.message.to = addr2.address;
    msgJSON.message.amount = 42;

    
    const privateKeyBuffer = ethers.utils.arrayify(addr1PrivateKey);
    
    const signature = signTypedData_v4(privateKeyBuffer, {
      data: msgJSON,
    });

    console.log("signature: ", signature);
    console.log();
    const r = "0x" + signature.substring(2).substring(0, 64);
    const s = "0x" + signature.substring(2).substring(64, 128);
    const v = "0x" + signature.substring(2).substring(128, 130);

    const signer = addr1.address;
    const transaction = {
      to: addr2.address,
      amount: 42,
      nonce: 0,
    };

    
    expect(
      await metaTransaction.isValidTransaction(signer, transaction, v, r, s)
    ).to.be.true;

    await metaTransaction.metaTransfer(signer, transaction, v, r, s);

    console.log(
      "owner token: ",
      (await metaTransaction.balanceOf(owner.address)).toNumber()
    );
    console.log(
      "addr1 token: ",
      (await metaTransaction.balanceOf(addr1.address)).toNumber()
    );
    console.log(
      "addr2 token: ",
      (await metaTransaction.balanceOf(addr2.address)).toNumber()
    );

    
    expect(await metaTransaction.balanceOf(addr1.address)).to.equal(58);
    expect(addr1ETHBalanceBefore).to.equal(await addr1.getBalance());
  });
});
