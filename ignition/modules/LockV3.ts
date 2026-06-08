import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import UpgradeV3Module from "./UpgradeV3";

const lockV3Module = buildModule("lockV3Module", (m) => {
    const { proxy } = m.useModule(UpgradeV3Module);
    const lock = m.contractAt("LockV3", proxy);

    return { lock, proxy };
});

export default lockV3Module;
