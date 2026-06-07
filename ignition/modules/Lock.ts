import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import ProxyModule from "./Proxy";

const lockModule = buildModule("lockModule", (m) => {
    const { proxy } = m.useModule(ProxyModule);
    const lock = m.contractAt("Lock", proxy);

    return { lock, proxy };
})


export default lockModule;