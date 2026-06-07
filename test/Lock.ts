import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import lockModule from "../ignition/modules/Lock";
import lockV2Module from "../ignition/modules/LockV2";
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

  })

});
