import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import ProxyModule from "./Proxy";

const upgradeModule = buildModule("UpgradeModule", (m) => {
    const proxyAdminOwner = m.getAccount(0);
    const { proxy, proxyAdmin } = m.useModule(ProxyModule);

    const LockV2 = m.contract("LockV2");

    m.call(proxyAdmin, "upgradeAndCall", [proxy, LockV2, "0x"], { from: proxyAdminOwner });

    return { proxyAdmin, proxy };
})


export default upgradeModule;