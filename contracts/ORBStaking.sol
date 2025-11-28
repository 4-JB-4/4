// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                                                                           ║
 * ║   ███████╗████████╗ █████╗ ██╗  ██╗██╗███╗   ██╗ ██████╗                  ║
 * ║   ██╔════╝╚══██╔══╝██╔══██╗██║ ██╔╝██║████╗  ██║██╔════╝                  ║
 * ║   ███████╗   ██║   ███████║█████╔╝ ██║██╔██╗ ██║██║  ███╗                 ║
 * ║   ╚════██║   ██║   ██╔══██║██╔═██╗ ██║██║╚██╗██║██║   ██║                 ║
 * ║   ███████║   ██║   ██║  ██║██║  ██╗██║██║ ╚████║╚██████╔╝                 ║
 * ║   ╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝ ╚═════╝                  ║
 * ║                                                                           ║
 * ║   STAKE $0RB - UNLOCK THE SIMULATION                                      ║
 * ║   Higher stakes = Greater power                                           ║
 * ║                                                                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */
contract ORBStaking is ReentrancyGuard, Ownable {

    IERC20 public orbToken;

    // Staking tiers with APY (basis points)
    struct Tier {
        string name;
        uint256 minStake;
        uint256 apy;      // APY in basis points (1000 = 10%)
        uint256 lockDays;
        uint256 boost;    // Agent capability boost percentage
    }

    Tier[] public tiers;

    // User stake info
    struct Stake {
        uint256 amount;
        uint256 tierIndex;
        uint256 startTime;
        uint256 lastClaimTime;
        bool locked;
    }

    mapping(address => Stake) public stakes;

    // Total staked
    uint256 public totalStaked;

    // Rewards pool
    uint256 public rewardsPool;

    // Events
    event Staked(address indexed user, uint256 amount, uint256 tierIndex);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);
    event TierUpgraded(address indexed user, uint256 newTierIndex);

    constructor(address _orbToken) Ownable(msg.sender) {
        orbToken = IERC20(_orbToken);

        // Initialize tiers
        tiers.push(Tier("Observer", 1_000 * 10**18, 500, 0, 10));        // 5% APY, no lock, 10% boost
        tiers.push(Tier("Awakened", 10_000 * 10**18, 1000, 30, 25));     // 10% APY, 30 day lock, 25% boost
        tiers.push(Tier("Architect", 100_000 * 10**18, 1500, 90, 50));   // 15% APY, 90 day lock, 50% boost
        tiers.push(Tier("Oracle", 1_000_000 * 10**18, 2500, 180, 100));  // 25% APY, 180 day lock, 100% boost
    }

    // ═══════════════════════════════════════════════════════════════════════
    // STAKING
    // ═══════════════════════════════════════════════════════════════════════

    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Cannot stake 0");
        require(stakes[msg.sender].amount == 0, "Already staking");

        // Determine tier
        uint256 tierIndex = _getTierForAmount(amount);
        require(tierIndex < tiers.length, "Amount too low for any tier");

        require(orbToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        stakes[msg.sender] = Stake({
            amount: amount,
            tierIndex: tierIndex,
            startTime: block.timestamp,
            lastClaimTime: block.timestamp,
            locked: tiers[tierIndex].lockDays > 0
        });

        totalStaked += amount;

        emit Staked(msg.sender, amount, tierIndex);
    }

    function increaseStake(uint256 amount) external nonReentrant {
        require(amount > 0, "Cannot add 0");
        Stake storage userStake = stakes[msg.sender];
        require(userStake.amount > 0, "No existing stake");

        // Claim pending rewards first
        _claimRewards(msg.sender);

        require(orbToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        userStake.amount += amount;
        totalStaked += amount;

        // Check for tier upgrade
        uint256 newTierIndex = _getTierForAmount(userStake.amount);
        if (newTierIndex > userStake.tierIndex) {
            userStake.tierIndex = newTierIndex;
            userStake.startTime = block.timestamp; // Reset lock period
            userStake.locked = tiers[newTierIndex].lockDays > 0;

            emit TierUpgraded(msg.sender, newTierIndex);
        }

        emit Staked(msg.sender, amount, userStake.tierIndex);
    }

    function unstake() external nonReentrant {
        Stake storage userStake = stakes[msg.sender];
        require(userStake.amount > 0, "No stake");

        // Check lock period
        if (userStake.locked) {
            uint256 lockEnd = userStake.startTime + (tiers[userStake.tierIndex].lockDays * 1 days);
            require(block.timestamp >= lockEnd, "Stake is locked");
        }

        // Claim remaining rewards
        _claimRewards(msg.sender);

        uint256 amount = userStake.amount;
        totalStaked -= amount;

        delete stakes[msg.sender];

        require(orbToken.transfer(msg.sender, amount), "Transfer failed");

        emit Unstaked(msg.sender, amount);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // REWARDS
    // ═══════════════════════════════════════════════════════════════════════

    function claimRewards() external nonReentrant {
        _claimRewards(msg.sender);
    }

    function _claimRewards(address user) internal {
        Stake storage userStake = stakes[user];
        if (userStake.amount == 0) return;

        uint256 rewards = _calculateRewards(user);
        if (rewards == 0) return;

        require(rewardsPool >= rewards, "Insufficient rewards pool");

        userStake.lastClaimTime = block.timestamp;
        rewardsPool -= rewards;

        require(orbToken.transfer(user, rewards), "Reward transfer failed");

        emit RewardsClaimed(user, rewards);
    }

    function _calculateRewards(address user) internal view returns (uint256) {
        Stake storage userStake = stakes[user];
        if (userStake.amount == 0) return 0;

        Tier storage tier = tiers[userStake.tierIndex];

        uint256 timeElapsed = block.timestamp - userStake.lastClaimTime;
        uint256 annualReward = (userStake.amount * tier.apy) / 10000;
        uint256 reward = (annualReward * timeElapsed) / 365 days;

        return reward;
    }

    function getPendingRewards(address user) external view returns (uint256) {
        return _calculateRewards(user);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // TIER FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════

    function _getTierForAmount(uint256 amount) internal view returns (uint256) {
        for (uint256 i = tiers.length; i > 0; i--) {
            if (amount >= tiers[i - 1].minStake) {
                return i - 1;
            }
        }
        return type(uint256).max; // Invalid tier
    }

    function getUserTier(address user) external view returns (string memory) {
        Stake storage userStake = stakes[user];
        if (userStake.amount == 0) return "None";
        return tiers[userStake.tierIndex].name;
    }

    function getUserBoost(address user) external view returns (uint256) {
        Stake storage userStake = stakes[user];
        if (userStake.amount == 0) return 0;
        return tiers[userStake.tierIndex].boost;
    }

    function getUnlockTime(address user) external view returns (uint256) {
        Stake storage userStake = stakes[user];
        if (userStake.amount == 0 || !userStake.locked) return 0;
        return userStake.startTime + (tiers[userStake.tierIndex].lockDays * 1 days);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // VIEW FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════

    function getStake(address user) external view returns (
        uint256 amount,
        string memory tierName,
        uint256 apy,
        uint256 pendingRewards,
        uint256 unlockTime,
        uint256 boost
    ) {
        Stake storage userStake = stakes[user];
        if (userStake.amount == 0) {
            return (0, "None", 0, 0, 0, 0);
        }

        Tier storage tier = tiers[userStake.tierIndex];
        uint256 unlock = userStake.locked
            ? userStake.startTime + (tier.lockDays * 1 days)
            : 0;

        return (
            userStake.amount,
            tier.name,
            tier.apy,
            _calculateRewards(user),
            unlock,
            tier.boost
        );
    }

    function getTierInfo(uint256 tierIndex) external view returns (Tier memory) {
        require(tierIndex < tiers.length, "Invalid tier");
        return tiers[tierIndex];
    }

    function getAllTiers() external view returns (Tier[] memory) {
        return tiers;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // ADMIN
    // ═══════════════════════════════════════════════════════════════════════

    function addRewardsToPool(uint256 amount) external onlyOwner {
        require(orbToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        rewardsPool += amount;
    }

    function updateTier(
        uint256 tierIndex,
        string memory name,
        uint256 minStake,
        uint256 apy,
        uint256 lockDays,
        uint256 boost
    ) external onlyOwner {
        require(tierIndex < tiers.length, "Invalid tier");
        tiers[tierIndex] = Tier(name, minStake, apy, lockDays, boost);
    }

    function emergencyWithdraw() external onlyOwner {
        uint256 balance = orbToken.balanceOf(address(this)) - totalStaked;
        orbToken.transfer(owner(), balance);
    }
}
