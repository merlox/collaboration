pragma solidity ^0.6.0;

import 'openzeppelin-solidity/contracts/access/Ownable.sol';
import 'openzeppelin-solidity/contracts/presets/ERC20PresetMinterPauser.sol';

contract Collaboration is Ownable {
	address public private_token;
	
	event TokenMint(address indexed token, uint256 amount);

	/**
	 * @dev Deploys new Token contract with the Minter and the Pauser roles set to the Collaboration,
	 * mint tokens to the Collaboration and, finally, emits TokenMint event
	 * @param amount - number of tokens to mint
	 * @return true if the Tokens have been mint.
	*/
	function mintToken(uint256 amount) external returns (bool) {
        require(amount > 0, 'The amount must be larger than zero');
        // 1. deploy new custom ERC20PresetMinterPauser
        ERC20PresetMinterPauser token = new ERC20PresetMinterPauser('Token', 'ERC');
		token.grantRole(keccak256("MINTER_ROLE"), address(this));
        // 2. mint tokens
        token.mint(address(this), amount);
		private_token = address(token);
        // 3. emit the event
        emit TokenMint(address(token), amount);
		return true;
    }

	/**
	 * DelegateCalls the Token contract
	 * @param data Data to send as msg.data
	 * It should include the signature and the parameters of the function to be called, as described in
	 * https://solidity.readthedocs.io/en/v0.4.24/abi-spec.html#function-selector-and-argument-encoding.
	*/
	function callToken(bytes calldata data) payable external onlyOwner {
		// The delegatecall doesn't update the receiving contract's state so we use .call()
		// private_token.delegatecall(data);
		private_token.call(data);
    }
}