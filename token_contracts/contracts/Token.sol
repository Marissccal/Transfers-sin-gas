// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

// AccessControl docs: https://docs.openzeppelin.com/contracts/4.x/access-control

contract Token is ERC20("MariscalToken", "MARISCAL"), AccessControl {
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");
    address public issuer;

    address public currentContextAddress;

    constructor(uint256 _supply, uint8 _decimals) {
        issuer = msg.sender;
        _setupDecimals(_decimals);
        _setupRole(ISSUER_ROLE, issuer);
        _mint(issuer, _supply * 10**uint256(_decimals));
    }

    function mint(address account, uint256 amount) public {
        require(hasRole(ISSUER_ROLE, msg.sender), "Caller is not a minter");
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) public {
        require(hasRole(ISSUER_ROLE, msg.sender), "Caller is not a minter");
        _burn(account, amount);
    }

    function transfer(address recipient, uint256 amount)
        public
        virtual
        override
        returns (bool)
    {
        _transfer(_getCurrentContextAddress(), recipient, amount);
        return true;
    }

    function _setCurrentContextAddressIfRequired(
        address signerAddress,
        address contextAddress
    ) internal {
        if (signerAddress != msg.sender) {
            currentContextAddress = contextAddress;
        }
    }

    function _getCurrentContextAddress() internal view returns (address) {
        address currentContextAddress_ = currentContextAddress;
        address contextAddress =
            currentContextAddress_ == address(0)
                ? msg.sender
                : currentContextAddress_;
        return contextAddress;
    }
}
