# Transfer Vulnerability Demo

This is a demonstration of an Ethereum vulnerability. A smart contract should avoid using `address.transfer` pattern because the `address` could be a malicious smart contract with a fallback function that reverts or runs out gas. This attack renders the former unable to process any calls.

See [Solidity docs](https://docs.soliditylang.org/en/latest/common-patterns.html#withdrawal-from-contracts) for more information
