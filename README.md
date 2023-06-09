# Soft Rug Pull Detection Agent

## Description

This agent emits alert for the soft-rug-pull bot that monitors transactions on the Ethereum network for suspicious activity related to token creators, liquidity pools, and token liquidity

## Supported Chains

- Ethereum
- Avalanche
- Binance Smart Chain
- Polygon
- Fantom
- Arbitrum
- Optimism


## Alerts

Describe each of the type of alerts fired by this agent

- Name: Soft Rug Pull
  - Fired when 90% of liquidity has been removed
  - Label field contains entityType, entity, label, and confidence for address and transaction
  - Metadata field contains alert_hash, bot_id, alert_id, contractAddress, token, deployer

- Name: Soft Rug Pull Detected
  - Fired when two or more soft rug pull is detected from the same token address
  - Label field contains entityType, entity, label, and confidence for address and transaction
  - Metadata field contains alert_hash, bot_id, alert_id, contractAddress, token, deployer

## Test Data

The agent behaviour can be verified with the following tokens:


TODO: Add more test data