// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract AIGeneratedNFT is ERC1155 {
    using Strings for uint256;
    using SignatureChecker for address;

    address private _owner;
    uint256 private _currentTokenId;
    uint256 private _royaltyFee; // In basis points, e.g. 1000 = 10% royalty fee

    mapping(uint256 => address) private _creators;
    mapping(uint256 => string) private _tokenURIs;
    mapping(address => uint256) public nonces;

    event RoyaltyFeeUpdated(uint256 royaltyFee);
    event TokenMinted(uint256 tokenId);

    constructor(string memory uri, uint256 royaltyFee) ERC1155(uri) {
        _owner = msg.sender;
        _currentTokenId = 0;
        _royaltyFee = royaltyFee;
    }

    modifier onlyOwner() {
        require(msg.sender == _owner, "AIGeneratedNFT: Only the contract owner can call this function.");
        _;
    }

    function getNonce(address user) public view returns (uint256) {
        return nonces[user];
    }
    
    function mint(address to, string memory tokenURI) public onlyOwner returns (uint256) {
        uint256 newTokenId = _currentTokenId;
        bytes memory data = ""; // Pass an empty bytes array as data
        _mint(to, newTokenId, 1, data);
        _creators[newTokenId] = msg.sender;
        _tokenURIs[newTokenId] = tokenURI;
        _currentTokenId += 1;

        emit TokenMinted(newTokenId); // Emit the custom event

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

    function mintWithSignature(address to, string memory tokenURI, bytes memory signature, uint256 nonce) public {
        bytes32 messageHash = keccak256(abi.encodePacked(to, tokenURI, nonce, address(this)));
        bytes32 ethSignedMessageHash = ECDSA.toEthSignedMessageHash(messageHash);
        address signer = ECDSA.recover(ethSignedMessageHash, signature);

        require(signer == _owner, "AIGeneratedNFT: Invalid signature");
        require(nonces[to] == nonce, "AIGeneratedNFT: Invalid nonce");

        mint(to, tokenURI);

        // Increase the nonce for the user after successful minting
        nonces[to]++;
    }
}
