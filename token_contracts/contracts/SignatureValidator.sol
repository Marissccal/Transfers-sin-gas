// SPDX-License-Identifier: MIT
pragma solidity 0.7.0;
pragma experimental ABIEncoderV2;

contract SignatureValidator {
    uint256 constant chainId = 4;

    struct Transaction {
        address payable to;
        uint256 amount;
        uint256 nonce;
    }

    bytes32 private constant EIP712_DOMAIN_TYPEHASH =
        keccak256(
            "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract,bytes32 salt)"
        );
    bytes32 private constant TRANSACTION_TYPEHASH =
        keccak256("Transaction(address to,uint256 amount,uint256 nonce)");

    bytes32 private DOMAIN_SEPARATOR =
        keccak256(
            abi.encode(
                EIP712_DOMAIN_TYPEHASH,
                keccak256("Mariscal"), // string name
                keccak256("1.0.0"), // string version
                chainId, // uint256 chainId
                address(this), // address verifyingContract
                0x76e22a8ee58573472b9d7b73c41ee29160bc2759195434c1bc1201ae4769afd7 // salt
            )
        );

    function hashTransaction(Transaction calldata transaction)
        private
        view
        returns (bytes32)
    {
        return
            keccak256(
                abi.encodePacked(
                    bytes1(0x19),
                    bytes1(0x01),
                    DOMAIN_SEPARATOR,
                    keccak256(
                        abi.encode(
                            TRANSACTION_TYPEHASH,
                            transaction.to,
                            transaction.amount,
                            transaction.nonce
                        )
                    )
                )
            );
    }

    
    function isValidTransaction(
        address signer,
        Transaction calldata transaction,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public view returns (bool) {
        return ecrecover(hashTransaction(transaction), v, r, s) == signer;
    }
}
