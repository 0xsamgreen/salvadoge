// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract AIGeneratedNFT is ERC1155 {
    using Strings for uint256;

    address private _owner;
    address private _tmp;
    uint256 private _currentTokenId;
    uint256 private _royaltyFee; // In basis points, e.g. 1000 = 10% royalty fee

    mapping(uint256 => address) private _creators;
    mapping(uint256 => string) private _tokenURIs;

    event RoyaltyFeeUpdated(uint256 royaltyFee);

    constructor(string memory uri, uint256 royaltyFee) ERC1155(uri) {
        _owner = msg.sender;
        _currentTokenId = 0;
        _royaltyFee = royaltyFee;
    }

    modifier onlyOwner() {
        require(msg.sender == _owner, "AIGeneratedNFT: Only the contract owner can call this function.");
        _;
    }

    function mint(address to, string memory tokenURI) public onlyOwner returns (uint256) {
        uint256 newTokenId = _currentTokenId;
        _mint(to, newTokenId, 1, "");
        _creators[newTokenId] = msg.sender;
        _tokenURIs[newTokenId] = tokenURI;
        _currentTokenId += 1;

        return newTokenId;
    }

    function setRoyaltyFee(uint256 royaltyFee) public onlyOwner {
        _royaltyFee = royaltyFee;
        emit RoyaltyFeeUpdated(royaltyFee);
    }

    function royaltyInfo(uint256, uint256 value) public view returns (address receiver, uint256 royaltyAmount) {
        receiver = _owner;
        royaltyAmount = (value * _royaltyFee) / 10000; // Apply the royalty fee
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "AIGeneratedNFT: URI query for nonexistent token");
        return _tokenURIs[tokenId];
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return _creators[tokenId] != address(0);
    }
}
