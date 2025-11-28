// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                                                                           ║
 * ║   ███╗   ███╗ █████╗ ██████╗ ██╗  ██╗███████╗████████╗                    ║
 * ║   ████╗ ████║██╔══██╗██╔══██╗██║ ██╔╝██╔════╝╚══██╔══╝                    ║
 * ║   ██╔████╔██║███████║██████╔╝█████╔╝ █████╗     ██║                       ║
 * ║   ██║╚██╔╝██║██╔══██║██╔══██╗██╔═██╗ ██╔══╝     ██║                       ║
 * ║   ██║ ╚═╝ ██║██║  ██║██║  ██║██║  ██╗███████╗   ██║                       ║
 * ║   ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝   ╚═╝                       ║
 * ║                                                                           ║
 * ║   TRADE & RENT AI AGENTS                                                  ║
 * ║   Buy. Sell. Rent. Earn.                                                  ║
 * ║                                                                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */
contract AgentMarketplace is ReentrancyGuard, Ownable {

    IERC20 public orbToken;
    IERC721 public agentNFT;

    // Platform fee (basis points, 100 = 1%)
    uint256 public platformFee = 250; // 2.5%
    uint256 constant BASIS_POINTS = 10000;

    // Listing structure
    struct Listing {
        address seller;
        uint256 tokenId;
        uint256 price;
        bool isActive;
        uint256 createdAt;
    }

    // Rental structure
    struct Rental {
        address owner;
        address renter;
        uint256 tokenId;
        uint256 dailyRate;
        uint256 startTime;
        uint256 endTime;
        uint256 deposit;
        bool isActive;
    }

    // Auction structure
    struct Auction {
        address seller;
        uint256 tokenId;
        uint256 startPrice;
        uint256 currentBid;
        address highestBidder;
        uint256 endTime;
        bool isActive;
    }

    // Storage
    mapping(uint256 => Listing) public listings;
    mapping(uint256 => Rental) public rentals;
    mapping(uint256 => Auction) public auctions;

    uint256[] public activeListingIds;
    uint256[] public activeRentalIds;
    uint256[] public activeAuctionIds;

    // Events
    event Listed(uint256 indexed tokenId, address indexed seller, uint256 price);
    event Unlisted(uint256 indexed tokenId);
    event Sold(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price);

    event RentalCreated(uint256 indexed tokenId, address indexed owner, uint256 dailyRate);
    event RentalStarted(uint256 indexed tokenId, address indexed renter, uint256 endTime);
    event RentalEnded(uint256 indexed tokenId);

    event AuctionCreated(uint256 indexed tokenId, uint256 startPrice, uint256 endTime);
    event BidPlaced(uint256 indexed tokenId, address indexed bidder, uint256 amount);
    event AuctionEnded(uint256 indexed tokenId, address indexed winner, uint256 amount);

    constructor(address _orbToken, address _agentNFT) Ownable(msg.sender) {
        orbToken = IERC20(_orbToken);
        agentNFT = IERC721(_agentNFT);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // LISTINGS (Buy/Sell)
    // ═══════════════════════════════════════════════════════════════════════

    function listAgent(uint256 tokenId, uint256 price) external nonReentrant {
        require(agentNFT.ownerOf(tokenId) == msg.sender, "Not owner");
        require(price > 0, "Invalid price");
        require(!listings[tokenId].isActive, "Already listed");

        agentNFT.transferFrom(msg.sender, address(this), tokenId);

        listings[tokenId] = Listing({
            seller: msg.sender,
            tokenId: tokenId,
            price: price,
            isActive: true,
            createdAt: block.timestamp
        });

        activeListingIds.push(tokenId);

        emit Listed(tokenId, msg.sender, price);
    }

    function unlistAgent(uint256 tokenId) external nonReentrant {
        Listing storage listing = listings[tokenId];
        require(listing.isActive, "Not listed");
        require(listing.seller == msg.sender, "Not seller");

        listing.isActive = false;
        agentNFT.transferFrom(address(this), msg.sender, tokenId);

        emit Unlisted(tokenId);
    }

    function buyAgent(uint256 tokenId) external nonReentrant {
        Listing storage listing = listings[tokenId];
        require(listing.isActive, "Not listed");

        uint256 price = listing.price;
        address seller = listing.seller;

        // Calculate fees
        uint256 fee = (price * platformFee) / BASIS_POINTS;
        uint256 sellerAmount = price - fee;

        // Transfer tokens
        require(orbToken.transferFrom(msg.sender, seller, sellerAmount), "Payment failed");
        require(orbToken.transferFrom(msg.sender, address(this), fee), "Fee payment failed");

        // Transfer NFT
        listing.isActive = false;
        agentNFT.transferFrom(address(this), msg.sender, tokenId);

        emit Sold(tokenId, seller, msg.sender, price);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // RENTALS
    // ═══════════════════════════════════════════════════════════════════════

    function listForRent(uint256 tokenId, uint256 dailyRate) external nonReentrant {
        require(agentNFT.ownerOf(tokenId) == msg.sender, "Not owner");
        require(dailyRate > 0, "Invalid rate");
        require(!rentals[tokenId].isActive, "Already listed");

        agentNFT.transferFrom(msg.sender, address(this), tokenId);

        rentals[tokenId] = Rental({
            owner: msg.sender,
            renter: address(0),
            tokenId: tokenId,
            dailyRate: dailyRate,
            startTime: 0,
            endTime: 0,
            deposit: 0,
            isActive: true
        });

        activeRentalIds.push(tokenId);

        emit RentalCreated(tokenId, msg.sender, dailyRate);
    }

    function rentAgent(uint256 tokenId, uint256 days_) external nonReentrant {
        Rental storage rental = rentals[tokenId];
        require(rental.isActive, "Not available");
        require(rental.renter == address(0), "Already rented");
        require(days_ > 0 && days_ <= 30, "Invalid duration");

        uint256 totalCost = rental.dailyRate * days_;
        uint256 deposit = totalCost / 2; // 50% deposit

        // Transfer payment + deposit
        require(orbToken.transferFrom(msg.sender, rental.owner, totalCost), "Payment failed");
        require(orbToken.transferFrom(msg.sender, address(this), deposit), "Deposit failed");

        rental.renter = msg.sender;
        rental.startTime = block.timestamp;
        rental.endTime = block.timestamp + (days_ * 1 days);
        rental.deposit = deposit;

        emit RentalStarted(tokenId, msg.sender, rental.endTime);
    }

    function endRental(uint256 tokenId) external nonReentrant {
        Rental storage rental = rentals[tokenId];
        require(rental.isActive, "Not active");
        require(
            rental.renter == msg.sender ||
            rental.owner == msg.sender ||
            block.timestamp > rental.endTime,
            "Cannot end rental"
        );

        // Return deposit to renter
        if (rental.deposit > 0) {
            orbToken.transfer(rental.renter, rental.deposit);
        }

        rental.renter = address(0);
        rental.startTime = 0;
        rental.endTime = 0;
        rental.deposit = 0;

        emit RentalEnded(tokenId);
    }

    function withdrawFromRental(uint256 tokenId) external nonReentrant {
        Rental storage rental = rentals[tokenId];
        require(rental.owner == msg.sender, "Not owner");
        require(rental.renter == address(0), "Currently rented");

        rental.isActive = false;
        agentNFT.transferFrom(address(this), msg.sender, tokenId);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // AUCTIONS
    // ═══════════════════════════════════════════════════════════════════════

    function createAuction(uint256 tokenId, uint256 startPrice, uint256 duration) external nonReentrant {
        require(agentNFT.ownerOf(tokenId) == msg.sender, "Not owner");
        require(duration >= 1 hours && duration <= 7 days, "Invalid duration");

        agentNFT.transferFrom(msg.sender, address(this), tokenId);

        auctions[tokenId] = Auction({
            seller: msg.sender,
            tokenId: tokenId,
            startPrice: startPrice,
            currentBid: 0,
            highestBidder: address(0),
            endTime: block.timestamp + duration,
            isActive: true
        });

        activeAuctionIds.push(tokenId);

        emit AuctionCreated(tokenId, startPrice, block.timestamp + duration);
    }

    function placeBid(uint256 tokenId, uint256 amount) external nonReentrant {
        Auction storage auction = auctions[tokenId];
        require(auction.isActive, "Auction not active");
        require(block.timestamp < auction.endTime, "Auction ended");
        require(
            amount >= auction.startPrice &&
            amount > auction.currentBid,
            "Bid too low"
        );

        // Return previous bid
        if (auction.highestBidder != address(0)) {
            orbToken.transfer(auction.highestBidder, auction.currentBid);
        }

        // Accept new bid
        require(orbToken.transferFrom(msg.sender, address(this), amount), "Bid payment failed");

        auction.currentBid = amount;
        auction.highestBidder = msg.sender;

        emit BidPlaced(tokenId, msg.sender, amount);
    }

    function endAuction(uint256 tokenId) external nonReentrant {
        Auction storage auction = auctions[tokenId];
        require(auction.isActive, "Auction not active");
        require(block.timestamp >= auction.endTime, "Auction still active");

        auction.isActive = false;

        if (auction.highestBidder != address(0)) {
            // Calculate fees
            uint256 fee = (auction.currentBid * platformFee) / BASIS_POINTS;
            uint256 sellerAmount = auction.currentBid - fee;

            // Transfer payment to seller
            orbToken.transfer(auction.seller, sellerAmount);

            // Transfer NFT to winner
            agentNFT.transferFrom(address(this), auction.highestBidder, tokenId);

            emit AuctionEnded(tokenId, auction.highestBidder, auction.currentBid);
        } else {
            // No bids, return NFT to seller
            agentNFT.transferFrom(address(this), auction.seller, tokenId);

            emit AuctionEnded(tokenId, address(0), 0);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // VIEW FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════

    function getActiveListings() external view returns (uint256[] memory) {
        return activeListingIds;
    }

    function getActiveRentals() external view returns (uint256[] memory) {
        return activeRentalIds;
    }

    function getActiveAuctions() external view returns (uint256[] memory) {
        return activeAuctionIds;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // ADMIN
    // ═══════════════════════════════════════════════════════════════════════

    function setPlatformFee(uint256 _fee) external onlyOwner {
        require(_fee <= 1000, "Fee too high"); // Max 10%
        platformFee = _fee;
    }

    function withdrawFees() external onlyOwner {
        uint256 balance = orbToken.balanceOf(address(this));
        orbToken.transfer(owner(), balance);
    }
}
