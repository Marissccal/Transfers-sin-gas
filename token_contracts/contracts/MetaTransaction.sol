// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "./SignatureValidator.sol";
import "./Token.sol";
import "hardhat/console.sol";

contract MetaTransaction is SignatureValidator, Token(3000, 0) {
    function metaTransfer(
        address signer,
        Transaction calldata transaction,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public payable {
        require(
            isValidTransaction(signer, transaction, v, r, s) == true,
            "ERROR: Invalid transaction"
        );

        _setCurrentContextAddressIfRequired(signer, signer);
        // A's storage is set, B is not modified.
        (bool success, bytes memory data) =
            address(this).delegatecall(
                abi.encodeWithSignature(
                    "transfer(address,uint256)",
                    transaction.to,
                    transaction.amount
                )
            );
        console.log("Is delegatecall success? ", success);
        _setCurrentContextAddressIfRequired(signer, address(0));

        // transfer(transaction.to, transaction.amount);
    }
}
