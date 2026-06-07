import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import UpgradeModule from "./Upgrade";

const lockV2Module = buildModule("lockModule", (m) => {
    const { proxy } = m.useModule(UpgradeModule);
    const lock = m.contractAt("LockV2", proxy);

    return { lock };
})


export default lockV2Module;