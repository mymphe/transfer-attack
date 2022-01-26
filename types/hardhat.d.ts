/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomiclabs/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "KingOfEther",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.KingOfEther__factory>;
    getContractFactory(
      name: "KingOfEtherFix",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.KingOfEtherFix__factory>;
    getContractFactory(
      name: "TransferAttack",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TransferAttack__factory>;

    getContractAt(
      name: "KingOfEther",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.KingOfEther>;
    getContractAt(
      name: "KingOfEtherFix",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.KingOfEtherFix>;
    getContractAt(
      name: "TransferAttack",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.TransferAttack>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
  }
}
