// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Afblock Escrow Smart Contract
 * @dev Secure escrow contract for peer-to-peer crypto/fiat trading via Mobile Money
 * Developed for Afblock (Africa Blockchain SA)
 *
 * Features:
 * - Escrow-based order handling
 * - Commission deduction with dynamic rate based on seller volume
 * - Dispute resolution with admin intervention
 * - Auto-cancellation of expired unpaid orders
 * - Protection against reentrancy and underflow/overflow
 * - Only seller can cancel if order not accepted
 * - Only buyer or seller can open a dispute
 * - Only admin can resolve a dispute and withdraw commissions
 */

contract AfblockEscrow {
    struct Order {
        address seller;
        uint256 amount;
        uint256 createdAt;
        address buyer;
        bool completed;
        bool disputed;
    }

    address public admin;
    uint256 public BASE_COMMISSION = 100; // 1% in basis points (100 = 1%)
    uint256 public COMMISSION_DIVISOR = 10000; // For precision
    uint256 public DISCOUNT_COMMISSION = 75; // 0.75% for high-volume sellers
    uint256 public nextOrderId;

    mapping(uint256 => Order) public orders;
    mapping(address => uint256) public sellerVolume;

    constructor() {
        admin = msg.sender;
    }

    modifier validOrder(uint256 orderId) {
        require(orderId < nextOrderId, "Invalid orderId");
        _;
    }

    /**
     * @dev Seller creates an escrow order by sending ETH
     */
    function createOrder() external payable {
        require(msg.value > 0, "Amount must be > 0");

        orders[nextOrderId] = Order({
            seller: msg.sender,
            amount: msg.value,
            createdAt: 0,
            buyer: address(0),
            completed: false,
            disputed: false
        });

        nextOrderId++;
    }

    /**
     * @dev Buyer accepts an available order
     */
    function acceptOrder(uint256 orderId) external validOrder(orderId) {
        Order storage order = orders[orderId];
        require(order.buyer == address(0), "Already accepted");
        require(!order.completed, "Already completed");

        order.buyer = msg.sender;
        order.createdAt = block.timestamp;
    }

    /**
     * @dev Seller confirms payment received off-chain (Mobile Money)
     */
    function confirmPaymentReceived(uint256 orderId) external validOrder(orderId) {
        Order storage order = orders[orderId];
        require(msg.sender == order.seller, "Only seller");
        require(order.buyer != address(0), "No buyer");
        require(!order.completed, "Already completed");
        require(!order.disputed, "Dispute active");

        uint256 commissionRate = sellerVolume[order.seller] >= 10000 ether
            ? DISCOUNT_COMMISSION
            : BASE_COMMISSION;

        uint256 commission = (order.amount * commissionRate) / COMMISSION_DIVISOR;
        uint256 payout = order.amount - commission;

        order.completed = true;
        sellerVolume[order.seller] += order.amount;

        payable(admin).transfer(commission);
        payable(order.buyer).transfer(payout);
    }

    /**
     * @dev Seller can cancel if no buyer yet
     */
    function cancelOrder(uint256 orderId) external validOrder(orderId) {
        Order storage order = orders[orderId];
        require(msg.sender == order.seller, "Only seller");
        require(order.buyer == address(0), "Already accepted");
        require(!order.completed, "Already completed");

        order.completed = true;
        payable(order.seller).transfer(order.amount);
        orders[orderId] = Order(address(0), 0, 0, address(0), false, false);
    }

    /**
     * @dev Auto-cancel if 30 min expired and no payment
     */
    function autoCancelExpired(uint256 orderId) external validOrder(orderId) {
        Order storage order = orders[orderId];
        require(order.buyer != address(0), "No buyer");
        require(!order.completed, "Already completed");
        require(!order.disputed, "Dispute active – admin only");
        require(block.timestamp > order.createdAt + 30 minutes, "Not yet expired");

        order.completed = true;
        payable(order.seller).transfer(order.amount);
        orders[orderId] = Order(address(0), 0, 0, address(0), false, false);
    }

    /**
     * @dev Buyer or seller opens a dispute
     */
    function openDispute(uint256 orderId) external validOrder(orderId) {
        Order storage order = orders[orderId];
        require(msg.sender == order.buyer || msg.sender == order.seller, "Not allowed");
        require(!order.completed, "Already completed");

        order.disputed = true;
    }

    /**
     * @dev Admin resolves a dispute and decides where funds go
     */
    function resolveDispute(uint256 orderId, bool releaseToBuyer) external validOrder(orderId) {
        require(msg.sender == admin, "Only admin");

        Order storage order = orders[orderId];
        require(!order.completed, "Already completed");

        order.completed = true;
        order.disputed = false;

        if (releaseToBuyer) {
            payable(order.buyer).transfer(order.amount);
        } else {
            payable(order.seller).transfer(order.amount);
        }

        orders[orderId] = Order(address(0), 0, 0, address(0), false, false);
    }

    /**
     * @dev Admin can withdraw any unclaimed balance (commissions)
     */
    function withdrawCommission() external {
        require(msg.sender == admin, "Only admin");
        payable(admin).transfer(address(this).balance);
    }
}

