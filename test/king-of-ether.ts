import chai from "chai";
import { constants } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { ethers, waffle } from "hardhat";
import KingOfEtherArtifact from "../artifacts/contracts/KingOfEther.sol/KingOfEther.json";
import { KingOfEther } from "../types/KingOfEther";

const { deployContract } = waffle;
const { expect } = chai;

xdescribe("KingOfEther", async () => {
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

  it("should revert if the value sent less than `mostSent`", async () => {
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

  it("should revert if the value sent equals `mostSent`", async () => {
    const [owner, candidate] = await ethers.getSigners();
    kingOfEther = (await deployContract(owner, KingOfEtherArtifact, undefined, {
      value: parseEther("1"),
    })) as KingOfEther;

    await expect(
      kingOfEther.connect(candidate).becomeRichest({
        value: parseEther("1"),
      })
    ).to.be.revertedWith("NotEnoughEther()");
  });

  it("should update the `richest` if the candidate sends more than `mostSent`", async () => {
    const [owner, candidate] = await ethers.getSigners();
    kingOfEther = (await deployContract(owner, KingOfEtherArtifact, undefined, {
      value: parseEther("1"),
    })) as KingOfEther;

    await kingOfEther.connect(candidate).becomeRichest({
      value: parseEther("1.1"),
    });

    const richest = await kingOfEther.richest();

    expect(richest).to.equal(candidate.address);
  });

  it("should update the `mostSent` if the candidate sends more than `mostSent`", async () => {
    const [owner, candidate] = await ethers.getSigners();
    kingOfEther = (await deployContract(owner, KingOfEtherArtifact, undefined, {
      value: parseEther("1"),
    })) as KingOfEther;

    await kingOfEther.connect(candidate).becomeRichest({
      value: parseEther("1.1"),
    });

    const mostSent = await kingOfEther.mostSent();

    expect(mostSent).to.deep.equal(parseEther("1.1"));
  });

  it("should re-transfer the value to the previous `richest`", async () => {
    const [owner, candidate] = await ethers.getSigners();
    kingOfEther = (await deployContract(
      owner,
      KingOfEtherArtifact
    )) as KingOfEther;

    const ownerBalanceBefore = await owner.getBalance();

    await kingOfEther.connect(candidate).becomeRichest({
      value: parseEther("1"),
    });

    const ownerBalanceAfter = await owner.getBalance();

    expect(ownerBalanceAfter).to.deep.equal(
      ownerBalanceBefore.add(parseEther("1"))
    );
  });
});
