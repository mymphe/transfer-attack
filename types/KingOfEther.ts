/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface KingOfEtherInterface extends utils.Interface {
  contractName: "KingOfEther";
  functions: {
    "becomeRichest()": FunctionFragment;
    "mostSent()": FunctionFragment;
    "richest()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "becomeRichest",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "mostSent", values?: undefined): string;
  encodeFunctionData(functionFragment: "richest", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "becomeRichest",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "mostSent", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "richest", data: BytesLike): Result;

  events: {};
}

export interface KingOfEther extends BaseContract {
  contractName: "KingOfEther";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: KingOfEtherInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    becomeRichest(
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    mostSent(overrides?: CallOverrides): Promise<[BigNumber]>;

    richest(overrides?: CallOverrides): Promise<[string]>;
  };

  becomeRichest(
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  mostSent(overrides?: CallOverrides): Promise<BigNumber>;

  richest(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    becomeRichest(overrides?: CallOverrides): Promise<void>;

    mostSent(overrides?: CallOverrides): Promise<BigNumber>;

    richest(overrides?: CallOverrides): Promise<string>;
  };

  filters: {};

  estimateGas: {
    becomeRichest(
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    mostSent(overrides?: CallOverrides): Promise<BigNumber>;

    richest(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    becomeRichest(
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    mostSent(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    richest(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
