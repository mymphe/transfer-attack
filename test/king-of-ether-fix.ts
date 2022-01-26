import chai from "chai";
import { constants } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { ethers, waffle } from "hardhat";
import KingOfEtherFixArtifact from "../artifacts/contracts/KingOfEtherFix.sol/KingOfEtherFix.json";
import { KingOfEtherFix } from "../types/KingOfEtherFix";

const { deployContract } = waffle;
const { expect } = chai;

describe("KingOfEtherFix", async () => {
  let kingOfEtherFix: KingOfEtherFix;

  it("should initially set the deployer as the `richest`", async () => {
    const [owner] = await ethers.getSigners();
    kingOfEtherFix = (await deployContract(
      owner,
      KingOfEtherFixArtifact
    )) as KingOfEtherFix;

    const richest = await kingOfEtherFix.richest();
    expect(richest).to.equal(owner.address);
  });

  it("should initially set 0 as `mostSent` if the initial balance is 0", async () => {
    const [owner] = await ethers.getSigners();
    kingOfEtherFix = (await deployContract(
      owner,
      KingOfEtherFixArtifact
    )) as KingOfEtherFix;

    const mostSent = await kingOfEtherFix.mostSent();
    expect(mostSent).to.deep.equal(constants.Zero);
  });

  it("should initially set contract balance as `mostSent`", async () => {
    const [owner] = await ethers.getSigners();
    kingOfEtherFix = (await deployContract(
      owner,
      KingOfEtherFixArtifact,
      undefined,
      {
        value: parseEther("1"),
      }
    )) as KingOfEtherFix;

    const mostSent = await kingOfEtherFix.mostSent();
    const balance = await ethers.provider.getBalance(kingOfEtherFix.address);
    expect(mostSent).to.deep.equal(balance);
  });

  it("should revert if the value sent less than `mostSent`", async () => {
    const [owner, candidate] = await ethers.getSigners();
    kingOfEtherFix = (await deployContract(
      owner,
      KingOfEtherFixArtifact,
      undefined,
      {
        value: parseEther("1"),
      }
    )) as KingOfEtherFix;

    await expect(
      kingOfEtherFix.connect(candidate).becomeRichest({
        value: parseEther("0.9"),
      })
    ).to.be.revertedWith("NotEnoughEther()");
  });

  it("should revert if the value sent equals `mostSent`", async () => {
    const [owner, candidate] = await ethers.getSigners();
    kingOfEtherFix = (await deployContract(
      owner,
      KingOfEtherFixArtifact,
      undefined,
      {
        value: parseEther("1"),
      }
    )) as KingOfEtherFix;

    await expect(
      kingOfEtherFix.connect(candidate).becomeRichest({
        value: parseEther("1"),
      })
    ).to.be.revertedWith("NotEnoughEther()");
  });

  it("should update the `richest` if the candidate sends more than `mostSent`", async () => {
    const [owner, candidate] = await ethers.getSigners();
    kingOfEtherFix = (await deployContract(
      owner,
      KingOfEtherFixArtifact,
      undefined,
      {
        value: parseEther("1"),
      }
    )) as KingOfEtherFix;

    await kingOfEtherFix.connect(candidate).becomeRichest({
      value: parseEther("1.1"),
    });

    const richest = await kingOfEtherFix.richest();

    expect(richest).to.equal(candidate.address);
  });

  it("should update the `mostSent` if the candidate sends more than `mostSent`", async () => {
    const [owner, candidate] = await ethers.getSigners();
    kingOfEtherFix = (await deployContract(
      owner,
      KingOfEtherFixArtifact,
      undefined,
      {
        value: parseEther("1"),
      }
    )) as KingOfEtherFix;

    await kingOfEtherFix.connect(candidate).becomeRichest({
      value: parseEther("1.1"),
    });

    const mostSent = await kingOfEtherFix.mostSent();

    expect(mostSent).to.deep.equal(parseEther("1.1"));
  });

  it("should pay out the previous `richest`", async () => {
    const [owner, candidate] = await ethers.getSigners();
    kingOfEtherFix = (await deployContract(
      owner,
      KingOfEtherFixArtifact
    )) as KingOfEtherFix;

    const ownerBalanceBefore = await owner.getBalance();

    await kingOfEtherFix.connect(candidate).becomeRichest({
      value: parseEther("1"),
    });

    const fallbackGasPrice = await ethers.provider.getGasPrice();
    const tx = await kingOfEtherFix.connect(owner).withdraw();
    const receipt = await tx.wait();
    const gasCost = receipt.gasUsed.mul(tx.gasPrice ?? fallbackGasPrice);

    const ownerBalanceAfter = await owner.getBalance();

    expect(ownerBalanceAfter).to.deep.equal(
      ownerBalanceBefore.add(parseEther("1").sub(gasCost))
    );
  });
});
