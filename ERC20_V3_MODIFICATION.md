# LockV3 ERC20 Upgrade

This project keeps the existing `Lock` and `LockV2` contracts unchanged and adds ERC20 token behavior in `LockV3` through the existing transparent proxy pattern.

## What Changed

### `contracts/LockV3.sol`

`LockV3` now inherits from OpenZeppelin's upgradeable ERC20 contract:

```solidity
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

contract LockV3 is Initializable, ERC20Upgradeable {
```

The original lock storage and behavior are preserved:

```solidity
uint public unlockTime;
address payable public owner;
withdraw()
changeOwner()
```

ERC20 setup is added with a V3-specific initializer:

```solidity
function initializeV3(
    string memory _name,
    string memory _symbol,
    uint256 _initialSupply
) public reinitializer(2) {
    __ERC20_init(_name, _symbol);
    _mint(owner, _initialSupply);
}
```

`reinitializer(2)` is required because the proxy was already initialized by `Lock.initialize(...)`. Calling another `initializer` would revert.

## Deploy Modules

### `ignition/modules/UpgradeV3.ts`

This module:

1. Reuses the existing proxy deployment module.
2. Deploys the new `LockV3` implementation.
3. Encodes the `initializeV3(...)` call.
4. Calls `ProxyAdmin.upgradeAndCall(...)` to upgrade the proxy and initialize ERC20 data in one step.

Default token values:

```text
name: Lock Token
symbol: LOCK
initialSupply: 1,000,000 * 10^18
```

### `ignition/modules/LockV3.ts`

This module returns a `LockV3` contract instance attached to the proxy address:

```ts
const lock = m.contractAt("LockV3", proxy);
```

That means interactions use the `LockV3` ABI, but the address remains the proxy address.

## Deployment Command

Run Hardhat node first:

```bash
npx hardhat node
```

Then deploy/upgrade V3 on localhost:

```bash
npx hardhat ignition deploy ./ignition/modules/LockV3.ts --network localhost
```

Or use the npm shortcut:

```bash
npm run deploy:lockv3 -- --network localhost
```

## Rabby Wallet

Add the proxy address in Rabby, not the implementation address.

Use the address printed for:

```text
lockV3Module#LockV3
```

Do not use:

```text
UpgradeV3Module#LockV3
```

The `UpgradeV3Module#LockV3` address is only the implementation contract. Wallets must interact with the proxy address because the proxy stores the token state.

## Tests

The test suite verifies that the proxy exposes ERC20 behavior after the V3 upgrade:

```bash
npm test
```

Checked behavior:

```text
name()
symbol()
decimals()
totalSupply()
balanceOf()
transfer()
```

