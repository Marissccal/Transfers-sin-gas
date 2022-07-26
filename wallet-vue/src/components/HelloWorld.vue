<template>
  <div class="hello">
    <p>addr1 address: 0x70997970c51812dc3a010c7d01b50e0d17dc79c8</p>
    <p>addr2 address: 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc</p>

    <vue-metamask userMessage="msg" @onComplete="onComplete"></vue-metamask>
    <div>
      <label for=""> to<input type="text" v-model="to" /></label>
    </div>
    <div>
      <label for=""> amount<input type="number" v-model="amount" /></label>
    </div>

    <button @click="sign">sign</button>
    <button @click="recover">recover</button>

    <div>
      <p v-if="signature">signature: {{ signature }}</p>
    </div>

    <div>
      <button @click="transfer">transfer</button>
    </div>
  </div>
</template>

<script>
import VueMetamask from "vue-metamask";
import { recoverTypedSignature_v4 } from "eth-sig-util";
import axios from "axios";
// import ethUtil from "ethereumjs-util";
// import Web3 from "web3";

export default {
  name: "HelloWorld",
  components: {
    VueMetamask,
  },
  data() {
    return {
      msg: "This is demo net work",
      to: "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc",
      amount: "",
      msgParams: {
        types: {
          EIP712Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "chainId", type: "uint256" },
            { name: "verifyingContract", type: "address" },
            { name: "salt", type: "bytes32" },
          ],
          Transaction: [
            { name: "to", type: "address" },
            { name: "amount", type: "uint256" },
            { name: "nonce", type: "uint256" },
          ],
        },
        domain: {
          name: "MyCrypto",
          version: "1.0.0",
          chainId: 4,
          verifyingContract: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
          salt:
            "0x76e22a8ee58573472b9d7b73c41ee29160bc2759195434c1bc1201ae4769afd7",
        },
        primaryType: "Transaction",
        message: {
          to: "",
          amount: 0,
          nonce: 0,
        },
      },
      web3: null,
      metaMaskAddress: "",
      signature: "",
    };
  },
  computed: {
    msgParamsJSON() {
      return JSON.stringify(this.msgParams);
    },
  },
  methods: {
    onComplete(data) {
      console.log("data:", data);
      this.metaMaskAddress = data.metaMaskAddress;
      this.web3 = data.web3;
      // web3.setProvider(
      //   "https://rinkeby.infura.io/v3/ff6a249a74e048f1b413cba715f98d07"
      // );
      // const web3 = new Web3(
      //   "https://rinkeby.infura.io/v3/ff6a249a74e048f1b413cba715f98d07"
      // );
    },
    recover() {
      if (!this.signature) return console.error("ERROR: signature not found");
      const recovered = recoverTypedSignature_v4({
        data: this.msgParams,
        sig: this.signature,
      });
      console.log("recovered address: ", recovered);
      console.log("isValid: ", this.metaMaskAddress == recovered);
    },
    sign() {
      if (!this.web3) return console.error("ERROR: web3 not found");
      if (!this.metaMaskAddress)
        return console.error("ERROR: metaMaskAddress not found");

      if (!this.to || !this.amount) {
        return console.error("ERROR: no address and amount");
      }

      this.msgParams.message.to = this.to;
      this.msgParams.message.amount = this.amount;

      var from = this.metaMaskAddress;
      var params = [from, this.msgParamsJSON];
      var method = "eth_signTypedData_v4";
      console.log("send data: ", params, method);

      const me = this;

      this.web3.currentProvider.sendAsync(
        {
          method,
          params,
          from,
        },
        function (err, result) {
          if (err) return console.dir(err);
          if (result.error) {
            alert(result.error.message);
          }
          if (result.error) return console.error("ERROR", result);
          const signature = result.result;
          console.log("signature: " + signature);
          me.signature = signature;

          const r = "0x" + signature.substring(2).substring(0, 64);
          const s = "0x" + signature.substring(2).substring(64, 128);
          const v = "0x" + signature.substring(2).substring(128, 130);
          console.log("r: ", r);
          console.log("s: ", s);
          console.log("v: ", v);

          // const recovered = sigUtil.recoverTypedSignature_v4({
          //   data: JSON.parse(this.msgParamsJSON),
          //   sig: result.result,
          // });

          // if (
          //   ethUtil.toChecksumAddress(recovered) ===
          //   ethUtil.toChecksumAddress(from)
          // ) {
          //   alert("Successfully recovered signer as " + from);
          // } else {
          //   alert(
          //     "Failed to verify signer when comparing " + result + " to " + from
          //   );
          // }
        }
      );
    },
    async transfer() {
      try {
        await axios.post("http://localhost:3000/transfer", {
          signer: this.metaMaskAddress,
          to: this.to,
          amount: this.amount,
          signature: this.signature,
        });
      } catch (e) {
        throw new Error(e);
      }
      console.log("signature sent");
    },
  },
};
</script>

<style scoped lang="scss">
</style>
