import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import lockModule from "../ignition/modules/Lock";
import lockV2Module from "../ignition/modules/LockV2";
import lockV3Module from "../ignition/modules/LockV3";
import hre, { ignition, ethers } from "hardhat";

describe("Lock", function () {

  describe("Proxy interaction", function () {

    it("Should be interactable via proxy", async function () {
      const { lock } = await ignition.deploy(lockModule);
      expect(await lock.unlockTime()).to.equal(1893456000);
    })

    it("Should already be initialized", async function () {
      const { lock } = await ignition.deploy(lockModule);
      expect(lock.initialize(0)).to.be.reverted;
    })

    it("Should upgrade", async function () {
      const [currentOwner, otherAccount] = await ethers.getSigners();
      const { lock } = await ignition.deploy(lockV2Module);
      expect(await lock.owner()).to.equal(currentOwner.address);

      await lock.changeOwner(otherAccount.address);
      expect(await lock.owner()).to.equal(otherAccount.address);

    })

    it("Should upgrade to V3 ERC20 token via proxy", async function () {
      const [currentOwner, otherAccount] = await ethers.getSigners();
      const { lock, proxy } = await ignition.deploy(lockV3Module);
      const initialSupply = 1_000_000n * 10n ** 18n;

      expect(await lock.getAddress()).to.equal(await proxy.getAddress());
      expect(await lock.name()).to.equal("Lock Token");
      expect(await lock.symbol()).to.equal("LOCK");
      expect(await lock.decimals()).to.equal(18);
      expect(await lock.totalSupply()).to.equal(initialSupply);
      expect(await lock.balanceOf(currentOwner.address)).to.equal(initialSupply);

      await lock.transfer(otherAccount.address, 100n);
      expect(await lock.balanceOf(otherAccount.address)).to.equal(100n);
    })

  })

});
