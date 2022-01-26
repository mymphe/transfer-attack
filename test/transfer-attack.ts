import chai from "chai";
import { constants } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { ethers, waffle } from "hardhat";
import KingOfEtherArtifact from "../artifacts/contracts/KingOfEther.sol/KingOfEther.json";
import TransferAttackArtifact from "../artifacts/contracts/TransferAttack.sol/TransferAttack.json";
import { KingOfEther } from "../types/KingOfEther";
import { TransferAttack } from "../types/TransferAttack";

const { deployContract } = waffle;
const { expect } = chai;

describe("TransferAttack", async () => {
  let kingOfEther: KingOfEther;
  let transferAttack: TransferAttack;

  beforeEach(async () => {
    const [signer] = await ethers.getSigners();
    kingOfEther = (await deployContract(
      signer,
      KingOfEtherArtifact,
      undefined,
      {
        value: parseEther("1"),
      }
    )) as KingOfEther;

    transferAttack = (await deployContract(signer, TransferAttackArtifact, [
      kingOfEther.address,
    ])) as TransferAttack;
  });

  it("should set `kingOfEther` the address of KingOfEther contract", async () => {
    const kingOfEtherAddress = await transferAttack.kingOfEther();

    expect(kingOfEtherAddress).to.equal(kingOfEther.address);
  });

  it("should be able to become `richest` in `KingOfEther`", async () => {
    const mostSent = await kingOfEther.mostSent();
    const sendValue = mostSent.add(constants.One);

    await transferAttack.attack({
      value: sendValue,
    });

    const richest = await kingOfEther.richest();
    expect(richest).to.equal(transferAttack.address);
  });

  it("should render `KingOfEther` unplayable", async () => {
    const mostSent = await kingOfEther.mostSent();
    const sendValue = mostSent.add(constants.One);

    await transferAttack.attack({
      value: sendValue,
    });

    const [, anotherPlayer] = await ethers.getSigners();
    await expect(
      kingOfEther.connect(anotherPlayer).becomeRichest({
        value: sendValue.add(constants.One),
      })
    ).to.be.revertedWith(
      "there's no receive function, fallback function is not payable and was called with value 1000000000000000002"
    );
  });
});
