import { ethers, waffle } from "hardhat";
import chai from "chai";

import KingOfEtherArtifact from "../artifacts/contracts/KingOfEther.sol/KingOfEther.json";
import { KingOfEther } from "../types/KingOfEther";
import { parseEther } from "ethers/lib/utils";
import { constants } from "ethers";

const { deployContract } = waffle;
const { expect } = chai;

describe("KingOfEther", async () => {
  let kingOfEther: KingOfEther;

  it("should initially set the deployer as the `richest`", async () => {
    const [owner] = await ethers.getSigners();
    kingOfEther = (await deployContract(
      owner,
      KingOfEtherArtifact
    )) as KingOfEther;

    const richest = await kingOfEther.richest();
    expect(richest).to.equal(owner.address);
  });

  it("should initially set 0 as `mostSent` if the initial balance is 0", async () => {
    const [owner] = await ethers.getSigners();
    kingOfEther = (await deployContract(
      owner,
      KingOfEtherArtifact
    )) as KingOfEther;

    const mostSent = await kingOfEther.mostSent();
    expect(mostSent).to.deep.equal(constants.Zero);
  });

  it("should initially set contract balance as `mostSent`", async () => {
    const [owner] = await ethers.getSigners();
    kingOfEther = (await deployContract(owner, KingOfEtherArtifact, undefined, {
      value: parseEther("1"),
    })) as KingOfEther;

    const mostSent = await kingOfEther.mostSent();
    const balance = await ethers.provider.getBalance(kingOfEther.address);
    expect(mostSent).to.deep.equal(balance);
  });

  it("should revert if a candidate sends less than `mostSent`", async () => {
    const [owner, candidate] = await ethers.getSigners();
    kingOfEther = (await deployContract(owner, KingOfEtherArtifact, undefined, {
      value: parseEther("1"),
    })) as KingOfEther;

    await expect(
      kingOfEther.connect(candidate).becomeRichest({
        value: parseEther("0.9"),
      })
    ).to.be.revertedWith("NotEnoughEther()");
  });
});
