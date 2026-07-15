// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title ChronosToken
 * @author Chronos Team
 * @notice Campus utility token for the Chronos Autonomous Campus Asset & Resource Sharing Platform.
 * @dev ERC-20 token with role-based minting. Only accounts holding `MINTER_ROLE` may mint.
 *      Future modules (escrow, reputation, treasury) are intentionally out of scope here.
 */
contract ChronosToken is ERC20, AccessControl {
    /// @notice Role allowed to mint student allocations via `mintStudent`.
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /// @notice Fixed student mint amount: 100 CHRONOS (in whole tokens, before decimals).
    uint256 public constant STUDENT_MINT_AMOUNT = 100;

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
     * @notice Mints exactly 100 CHRONOS to a student wallet.
     * @dev Amount respects ERC-20 decimals (default 18): `100 * 10 ** decimals()`.
     * @param student Recipient address of the student allocation.
     */
    function mintStudent(address student) public onlyRole(MINTER_ROLE) {
        require(student != address(0), "ChronosToken: student is zero address");
        _mint(student, STUDENT_MINT_AMOUNT * 10 ** decimals());
    }
}
