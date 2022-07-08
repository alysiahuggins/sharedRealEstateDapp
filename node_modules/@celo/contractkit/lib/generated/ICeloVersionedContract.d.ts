/// <reference types="node" />
import { AbiItem, Callback, CeloTxObject, Contract, EventLog } from '@celo/connect';
import { EventEmitter } from 'events';
import Web3 from 'web3';
import { EventOptions } from './types';
export interface ICeloVersionedContract extends Contract {
    clone(): ICeloVersionedContract;
    methods: {
        getVersionNumber(): CeloTxObject<{
            0: string;
            1: string;
            2: string;
            3: string;
        }>;
    };
    events: {
        allEvents: (options?: EventOptions, cb?: Callback<EventLog>) => EventEmitter;
    };
}
export declare const ABI: AbiItem[];
export declare function newICeloVersionedContract(web3: Web3, address: string): ICeloVersionedContract;
