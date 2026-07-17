// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title ChronosToken
 * @author Chronos Team
 * @notice Campus utility token for the Chronos Autonomous Campus Asset & Resource Sharing Platform.
 * @dev ERC-20 token with role-based minting. Only accounts holding `MINTER_ROLE` may mint.
 *      Each student address may receive the initial allocation at most once.
 *      Future modules (escrow, reputation, treasury) are intentionally out of scope here.
 */
contract ChronosToken is ERC20, AccessControl {
    /// @notice Role allowed to mint student allocations via `mintStudent`.
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /// @notice Fixed student mint amount: 100 CHRONOS (in whole tokens, before decimals).
    uint256 public constant STUDENT_MINT_AMOUNT = 100;

    /**
     * @notice Tracks whether an address has already received its one-time student allocation.
     * @dev Prevents repeated `mintStudent` calls for the same wallet, which would inflate
     *      supply and unfairly double-allocate campus tokens. Public so the backend / UI
     *      can check eligibility without a custom getter.
     */
    mapping(address => bool) public hasReceivedInitialTokens;

    /**
     * @notice Emitted when a student receives the one-time initial allocation.
     * @param student Address receiving the allocation.
     * @param amount Amount minted in the token's smallest unit.
     */
    event StudentInitialTokensMinted(address indexed student, uint256 amount);

    /**
     * @notice Deploys Chronos Token and grants admin + minter roles to `admin`.
     * @param admin Address that receives `DEFAULT_ADMIN_ROLE` and `MINTER_ROLE`.
     */
    constructor(address admin) ERC20("Chronos Token", "CHRONOS") {
        require(admin != address(0), "ChronosToken: admin is zero address");

        // DEFAULT_ADMIN_ROLE can grant/revoke roles (including MINTER_ROLE).
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        // Initial minter so the platform can allocate student tokens after deploy.
        _grantRole(MINTER_ROLE, admin);
    }

    /**
     * @notice Mints exactly 100 CHRONOS to a student wallet (one-time only).
     * @dev Amount respects ERC-20 decimals (default 18): `100 * 10 ** decimals()`.
     *      Reverts if `student` is zero or has already received the initial allocation.
     * @param student Recipient address of the student allocation.
     */
    function mintStudent(address student) public onlyRole(MINTER_ROLE) {
        require(student != address(0), "ChronosToken: student is zero address");
        require(
            !hasReceivedInitialTokens[student],
            "ChronosToken: student already received initial tokens"
        );

        uint256 amount = STUDENT_MINT_AMOUNT * 10 ** decimals();

        // Record eligibility consumption before minting (checks-effects pattern).
        hasReceivedInitialTokens[student] = true;
        _mint(student, amount);

        emit StudentInitialTokensMinted(student, amount);
    }

    /**
     * @notice Returns whether `account` is authorized to mint student allocations.
     * @param account Address to check.
     * @return True when the account holds `MINTER_ROLE`.
     */
    function hasMinterRole(address account) public view returns (bool) {
        return hasRole(MINTER_ROLE, account);
    }
}
