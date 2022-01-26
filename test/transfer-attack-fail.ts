import chai from "chai";
import { constants } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { ethers, waffle } from "hardhat";
import KingOfEtherFixArtifact from "../artifacts/contracts/KingOfEtherFix.sol/KingOfEtherFix.json";
import TransferAttackArtifact from "../artifacts/contracts/TransferAttack.sol/TransferAttack.json";
import { KingOfEtherFix } from "../types/KingOfEtherFix";
import { TransferAttack } from "../types/TransferAttack";

const { deployContract } = waffle;
const { expect } = chai;

describe("TransferAttack", async () => {
  let kingOfEtherFix: KingOfEtherFix;
  let transferAttack: TransferAttack;

  beforeEach(async () => {
    const [signer] = await ethers.getSigners();
    kingOfEtherFix = (await deployContract(
      signer,
      KingOfEtherFixArtifact,
      undefined,
      {
        value: parseEther("1"),
      }
    )) as KingOfEtherFix;

    transferAttack = (await deployContract(signer, TransferAttackArtifact, [
      kingOfEtherFix.address,
    ])) as TransferAttack;
  });

  it("should set `kingOfEther` the address of KingOfEtherFix contract", async () => {
    const kingOfEtherAddress = await transferAttack.kingOfEther();

    expect(kingOfEtherAddress).to.equal(kingOfEtherFix.address);
  });

  it("should be able to become `richest` in `KingOfEther`", async () => {
    const mostSent = await kingOfEtherFix.mostSent();
    const sendValue = mostSent.add(constants.One);

    await transferAttack.attack({
      value: sendValue,
    });

    const richest = await kingOfEtherFix.richest();
    expect(richest).to.equal(transferAttack.address);
  });

  it("should not be able to render `KingOfEtherFix` unplayable", async () => {
    const mostSent = await kingOfEtherFix.mostSent();
    const sendValue = mostSent.add(constants.One);

    await transferAttack.attack({
      value: sendValue,
    });

    const [, anotherPlayer] = await ethers.getSigners();
    await expect(
      kingOfEtherFix.connect(anotherPlayer).becomeRichest({
        value: sendValue.add(constants.One),
      })
    ).to.not.be.reverted;

    const newRichest = await kingOfEtherFix.richest();
    expect(newRichest).to.equal(anotherPlayer.address);
  });
});
