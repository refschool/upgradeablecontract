// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const JAN_1ST_2030 = 1893456000;
const ONE_GWEI: bigint = 1_000_000_000n;

const LockModule = buildModule("LockModule", (m) => {
  const unlockTime = m.getParameter("unlockTime", JAN_1ST_2030);
  const lockedAmount = m.getParameter("lockedAmount", ONE_GWEI);
  const proxyAdminOwner = m.getAccount(0);

  const lock = m.contract("Lock");

  // Encode initialize(uint256) call as proxy constructor _data
  const initData = m.encodeFunctionCall(lock, "initialize", [unlockTime]);
  const proxy = m.contract("TransparentUpgradeableProxy", [
    lock,
    proxyAdminOwner,
    initData
  ], {
    value: lockedAmount
  });

  // on load  le contrat Lock à l'adresse du proxy
  const lockProxy = m.contractAt("Lock", proxy, { id: "LockProxyInstance" });

  // get address of proxyAdmin (deployed by TransparentUpgradeableProxy)
  const proxyAdminAddress = m.readEventArgument(
    proxy,
    "AdminChanged",
    "newAdmin");

  // on get l'adresse de proxyAdmin
  const proxyAdmin = m.contractAt("ProxyAdmin", proxyAdminAddress);

  return { proxy, proxyAdmin };
});

export default LockModule;
