// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                                                                           ║
 * ║    ██████╗ ██████╗ ██████╗     ████████╗ ██████╗ ██╗  ██╗███████╗███╗   ██║
 * ║   ██╔═══██╗██╔══██╗██╔══██╗    ╚══██╔══╝██╔═══██╗██║ ██╔╝██╔════╝████╗  ██║
 * ║   ██║   ██║██████╔╝██████╔╝       ██║   ██║   ██║█████╔╝ █████╗  ██╔██╗ ██║
 * ║   ██║   ██║██╔══██╗██╔══██╗       ██║   ██║   ██║██╔═██╗ ██╔══╝  ██║╚██╗██║
 * ║   ╚██████╔╝██║  ██║██████╔╝       ██║   ╚██████╔╝██║  ██╗███████╗██║ ╚████║
 * ║    ╚═════╝ ╚═╝  ╚═╝╚═════╝        ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝
 * ║                                                                           ║
 * ║   THE CURRENCY OF THE SIMULATION                                          ║
 * ║   Total Supply: 1,000,000,000 $0RB                                        ║
 * ║                                                                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */
contract ORBToken is ERC20, ERC20Burnable, ERC20Permit, Ownable {
    // Token distribution
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 * 10**18; // 1 billion

    // Distribution allocations
    uint256 public constant COMMUNITY_ALLOCATION = 400_000_000 * 10**18;  // 40%
    uint256 public constant TEAM_ALLOCATION = 150_000_000 * 10**18;       // 15%
    uint256 public constant TREASURY_ALLOCATION = 200_000_000 * 10**18;   // 20%
    uint256 public constant LIQUIDITY_ALLOCATION = 150_000_000 * 10**18;  // 15%
    uint256 public constant ECOSYSTEM_ALLOCATION = 100_000_000 * 10**18;  // 10%

    // Vesting
    mapping(address => uint256) public vestedAmount;
    mapping(address => uint256) public vestingStart;
    mapping(address => uint256) public vestingDuration;
    mapping(address => uint256) public claimed;

    // Staking tiers
    uint256 public constant OBSERVER_THRESHOLD = 1_000 * 10**18;
    uint256 public constant AWAKENED_THRESHOLD = 10_000 * 10**18;
    uint256 public constant ARCHITECT_THRESHOLD = 100_000 * 10**18;
    uint256 public constant ORACLE_THRESHOLD = 1_000_000 * 10**18;

    // Events
    event VestingCreated(address indexed beneficiary, uint256 amount, uint256 duration);
    event VestingClaimed(address indexed beneficiary, uint256 amount);

    constructor(
        address treasury,
        address teamWallet,
        address liquidityWallet
    ) ERC20("ORB Token", "0RB") ERC20Permit("ORB Token") Ownable(msg.sender) {
        // Mint allocations
        _mint(msg.sender, COMMUNITY_ALLOCATION);  // Community (immediate)
        _mint(treasury, TREASURY_ALLOCATION);      // Treasury
        _mint(liquidityWallet, LIQUIDITY_ALLOCATION); // Liquidity

        // Team tokens with vesting
        _mint(address(this), TEAM_ALLOCATION);
        _createVesting(teamWallet, TEAM_ALLOCATION, 365 days * 2); // 2 year vest

        // Ecosystem allocation
        _mint(address(this), ECOSYSTEM_ALLOCATION);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // VESTING
    // ═══════════════════════════════════════════════════════════════════════

    function _createVesting(address beneficiary, uint256 amount, uint256 duration) internal {
        vestedAmount[beneficiary] = amount;
        vestingStart[beneficiary] = block.timestamp;
        vestingDuration[beneficiary] = duration;

        emit VestingCreated(beneficiary, amount, duration);
    }

    function getVestedAmount(address beneficiary) public view returns (uint256) {
        if (vestingStart[beneficiary] == 0) return 0;

        uint256 elapsed = block.timestamp - vestingStart[beneficiary];
        if (elapsed >= vestingDuration[beneficiary]) {
            return vestedAmount[beneficiary];
        }

        return (vestedAmount[beneficiary] * elapsed) / vestingDuration[beneficiary];
    }

    function claimVested() external {
        uint256 vested = getVestedAmount(msg.sender);
        uint256 claimable = vested - claimed[msg.sender];
        require(claimable > 0, "Nothing to claim");

        claimed[msg.sender] = vested;
        _transfer(address(this), msg.sender, claimable);

        emit VestingClaimed(msg.sender, claimable);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // TIER SYSTEM
    // ═══════════════════════════════════════════════════════════════════════

    enum Tier { NONE, OBSERVER, AWAKENED, ARCHITECT, ORACLE }

    function getTier(address account) public view returns (Tier) {
        uint256 balance = balanceOf(account);

        if (balance >= ORACLE_THRESHOLD) return Tier.ORACLE;
        if (balance >= ARCHITECT_THRESHOLD) return Tier.ARCHITECT;
        if (balance >= AWAKENED_THRESHOLD) return Tier.AWAKENED;
        if (balance >= OBSERVER_THRESHOLD) return Tier.OBSERVER;

        return Tier.NONE;
    }

    function getTierName(address account) public view returns (string memory) {
        Tier tier = getTier(account);

        if (tier == Tier.ORACLE) return "Oracle";
        if (tier == Tier.ARCHITECT) return "Architect";
        if (tier == Tier.AWAKENED) return "Awakened";
        if (tier == Tier.OBSERVER) return "Observer";

        return "None";
    }

    // ═══════════════════════════════════════════════════════════════════════
    // ECOSYSTEM DISTRIBUTION
    // ═══════════════════════════════════════════════════════════════════════

    function distributeEcosystemTokens(
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external onlyOwner {
        require(recipients.length == amounts.length, "Length mismatch");

        uint256 total = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            total += amounts[i];
        }
        require(balanceOf(address(this)) >= total, "Insufficient ecosystem tokens");

        for (uint256 i = 0; i < recipients.length; i++) {
            _transfer(address(this), recipients[i], amounts[i]);
        }
    }
}
