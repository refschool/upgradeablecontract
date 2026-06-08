import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import ProxyModule from "./Proxy";

const INITIAL_SUPPLY: bigint = 1_000_000n * 10n ** 18n;

const upgradeV3Module = buildModule("UpgradeV3Module", (m) => {
    const proxyAdminOwner = m.getAccount(0);
    const { proxy, proxyAdmin } = m.useModule(ProxyModule);

    const tokenName = m.getParameter("tokenName", "Lock Token");
    const tokenSymbol = m.getParameter("tokenSymbol", "LOCK");
    const initialSupply = m.getParameter("initialSupply", INITIAL_SUPPLY);

    const LockV3 = m.contract("LockV3");
    const initData = m.encodeFunctionCall(LockV3, "initializeV3", [
        tokenName,
        tokenSymbol,
        initialSupply,
    ]);

    m.call(proxyAdmin, "upgradeAndCall", [proxy, LockV3, initData], {
        from: proxyAdminOwner,
    });

    return { proxyAdmin, proxy };
});

export default upgradeV3Module;
