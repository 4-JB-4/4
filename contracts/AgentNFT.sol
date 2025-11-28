// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                                                                           ║
 * ║    █████╗  ██████╗ ███████╗███╗   ██╗████████╗    ███╗   ██╗███████╗████████╗
 * ║   ██╔══██╗██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝    ████╗  ██║██╔════╝╚══██╔══╝
 * ║   ███████║██║  ███╗█████╗  ██╔██╗ ██║   ██║       ██╔██╗ ██║█████╗     ██║
 * ║   ██╔══██║██║   ██║██╔══╝  ██║╚██╗██║   ██║       ██║╚██╗██║██╔══╝     ██║
 * ║   ██║  ██║╚██████╔╝███████╗██║ ╚████║   ██║       ██║ ╚████║██║        ██║
 * ║   ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝       ╚═╝  ╚═══╝╚═╝        ╚═╝
 * ║                                                                           ║
 * ║   OWN YOUR AI AGENTS - THE PANTHEON AWAITS                                ║
 * ║                                                                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */
contract AgentNFT is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {

    // Agent archetypes
    enum Archetype { APOLLO, ATHENA, HERMES, ARES, HEPHAESTUS, ARTEMIS, MERCURY }

    // Agent rarity
    enum Rarity { COMMON, UNCOMMON, RARE, EPIC, LEGENDARY, MYTHIC }

    // Agent structure
    struct Agent {
        Archetype archetype;
        Rarity rarity;
        uint256 level;
        uint256 experience;
        uint256 tasksCompleted;
        uint256 reputation;
        uint256 createdAt;
        bool isActive;
        string customName;
    }

    // Token ID counter
    uint256 private _nextTokenId;

    // Agent data
    mapping(uint256 => Agent) public agents;

    // Rarity probabilities (out of 10000)
    uint256 constant COMMON_PROB = 5000;      // 50%
    uint256 constant UNCOMMON_PROB = 3000;    // 30%
    uint256 constant RARE_PROB = 1500;        // 15%
    uint256 constant EPIC_PROB = 400;         // 4%
    uint256 constant LEGENDARY_PROB = 90;     // 0.9%
    uint256 constant MYTHIC_PROB = 10;        // 0.1%

    // Mint prices (in wei)
    mapping(Archetype => uint256) public mintPrices;

    // Events
    event AgentMinted(uint256 indexed tokenId, address indexed owner, Archetype archetype, Rarity rarity);
    event AgentLevelUp(uint256 indexed tokenId, uint256 newLevel);
    event AgentExperienceGained(uint256 indexed tokenId, uint256 amount);
    event AgentTaskCompleted(uint256 indexed tokenId, uint256 totalTasks);

    constructor() ERC721("0RB Agent", "0RBAGENT") Ownable(msg.sender) {
        // Set default mint prices
        mintPrices[Archetype.APOLLO] = 0.05 ether;
        mintPrices[Archetype.ATHENA] = 0.05 ether;
        mintPrices[Archetype.HERMES] = 0.05 ether;
        mintPrices[Archetype.ARES] = 0.05 ether;
        mintPrices[Archetype.HEPHAESTUS] = 0.05 ether;
        mintPrices[Archetype.ARTEMIS] = 0.05 ether;
        mintPrices[Archetype.MERCURY] = 0.05 ether;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // MINTING
    // ═══════════════════════════════════════════════════════════════════════

    function mintAgent(Archetype archetype) external payable returns (uint256) {
        require(msg.value >= mintPrices[archetype], "Insufficient payment");

        uint256 tokenId = _nextTokenId++;
        Rarity rarity = _determineRarity(tokenId);

        agents[tokenId] = Agent({
            archetype: archetype,
            rarity: rarity,
            level: 1,
            experience: 0,
            tasksCompleted: 0,
            reputation: 100,
            createdAt: block.timestamp,
            isActive: true,
            customName: ""
        });

        _safeMint(msg.sender, tokenId);

        emit AgentMinted(tokenId, msg.sender, archetype, rarity);

        return tokenId;
    }

    function _determineRarity(uint256 tokenId) internal view returns (Rarity) {
        uint256 random = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            msg.sender,
            tokenId
        ))) % 10000;

        if (random < MYTHIC_PROB) return Rarity.MYTHIC;
        if (random < MYTHIC_PROB + LEGENDARY_PROB) return Rarity.LEGENDARY;
        if (random < MYTHIC_PROB + LEGENDARY_PROB + EPIC_PROB) return Rarity.EPIC;
        if (random < MYTHIC_PROB + LEGENDARY_PROB + EPIC_PROB + RARE_PROB) return Rarity.RARE;
        if (random < MYTHIC_PROB + LEGENDARY_PROB + EPIC_PROB + RARE_PROB + UNCOMMON_PROB) return Rarity.UNCOMMON;

        return Rarity.COMMON;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // AGENT PROGRESSION
    // ═══════════════════════════════════════════════════════════════════════

    function addExperience(uint256 tokenId, uint256 amount) external onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Agent does not exist");

        Agent storage agent = agents[tokenId];
        agent.experience += amount;

        emit AgentExperienceGained(tokenId, amount);

        // Check for level up
        uint256 requiredXP = _getRequiredXP(agent.level);
        while (agent.experience >= requiredXP) {
            agent.experience -= requiredXP;
            agent.level++;
            requiredXP = _getRequiredXP(agent.level);

            emit AgentLevelUp(tokenId, agent.level);
        }
    }

    function _getRequiredXP(uint256 level) internal pure returns (uint256) {
        return level * 100 * level; // Quadratic scaling
    }

    function recordTaskCompletion(uint256 tokenId) external onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Agent does not exist");

        Agent storage agent = agents[tokenId];
        agent.tasksCompleted++;

        emit AgentTaskCompleted(tokenId, agent.tasksCompleted);
    }

    function updateReputation(uint256 tokenId, int256 change) external onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Agent does not exist");

        Agent storage agent = agents[tokenId];

        if (change > 0) {
            agent.reputation += uint256(change);
            if (agent.reputation > 1000) agent.reputation = 1000;
        } else {
            uint256 decrease = uint256(-change);
            if (decrease >= agent.reputation) {
                agent.reputation = 0;
            } else {
                agent.reputation -= decrease;
            }
        }
    }

    function setCustomName(uint256 tokenId, string calldata name) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        require(bytes(name).length <= 32, "Name too long");

        agents[tokenId].customName = name;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // VIEW FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════

    function getAgent(uint256 tokenId) external view returns (Agent memory) {
        require(_ownerOf(tokenId) != address(0), "Agent does not exist");
        return agents[tokenId];
    }

    function getAgentsByOwner(address owner) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](balance);

        for (uint256 i = 0; i < balance; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(owner, i);
        }

        return tokenIds;
    }

    function getArchetypeName(Archetype archetype) public pure returns (string memory) {
        if (archetype == Archetype.APOLLO) return "Apollo";
        if (archetype == Archetype.ATHENA) return "Athena";
        if (archetype == Archetype.HERMES) return "Hermes";
        if (archetype == Archetype.ARES) return "Ares";
        if (archetype == Archetype.HEPHAESTUS) return "Hephaestus";
        if (archetype == Archetype.ARTEMIS) return "Artemis";
        if (archetype == Archetype.MERCURY) return "Mercury";
        return "Unknown";
    }

    function getRarityName(Rarity rarity) public pure returns (string memory) {
        if (rarity == Rarity.COMMON) return "Common";
        if (rarity == Rarity.UNCOMMON) return "Uncommon";
        if (rarity == Rarity.RARE) return "Rare";
        if (rarity == Rarity.EPIC) return "Epic";
        if (rarity == Rarity.LEGENDARY) return "Legendary";
        if (rarity == Rarity.MYTHIC) return "Mythic";
        return "Unknown";
    }

    // ═══════════════════════════════════════════════════════════════════════
    // ADMIN
    // ═══════════════════════════════════════════════════════════════════════

    function setMintPrice(Archetype archetype, uint256 price) external onlyOwner {
        mintPrices[archetype] = price;
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // OVERRIDES
    // ═══════════════════════════════════════════════════════════════════════

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
