import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import ProxyModule from "./Proxy";

const lockModule = buildModule("lockModule", (m) => {
    const { lockProxy, proxy } = m.useModule(ProxyModule);

    return { lock: lockProxy, proxy };
})


export default lockModule;
