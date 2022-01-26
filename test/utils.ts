import { BigNumber, constants, Signer } from "ethers";
import { ethers } from "hardhat";

export const burnEtherBalance = async (signer: Signer) => {
  const gasLimit = BigNumber.from(21000);
  const gasPrice = await ethers.provider.getGasPrice();
  const gasCost = gasLimit.mul(gasPrice);
  const currentBalance = await signer.getBalance();
  const sendAmount = currentBalance.sub(gasCost);

  return signer.sendTransaction({
    to: constants.AddressZero,
    value: sendAmount,
    gasLimit,
    gasPrice,
  });
};
