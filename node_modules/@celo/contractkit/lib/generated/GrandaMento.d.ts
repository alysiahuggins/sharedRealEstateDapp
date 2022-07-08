/// <reference types="node" />
import { AbiItem, Callback, CeloTxObject, Contract, EventLog } from '@celo/connect';
import { EventEmitter } from 'events';
import Web3 from 'web3';
import { ContractEvent, EventOptions } from './types';
export interface GrandaMento extends Contract {
    clone(): GrandaMento;
    methods: {
        activeProposalIdsSuperset(arg0: number | string): CeloTxObject<string>;
        approver(): CeloTxObject<string>;
        exchangeProposalCount(): CeloTxObject<string>;
        exchangeProposals(arg0: number | string): CeloTxObject<{
            exchanger: string;
            stableToken: string;
            state: string;
            sellCelo: boolean;
            sellAmount: string;
            buyAmount: string;
            celoStableTokenExchangeRate: string;
            vetoPeriodSeconds: string;
            approvalTimestamp: string;
            0: string;
            1: string;
            2: string;
            3: boolean;
            4: string;
            5: string;
            6: string;
            7: string;
            8: string;
        }>;
        initialized(): CeloTxObject<boolean>;
        isOwner(): CeloTxObject<boolean>;
        maxApprovalExchangeRateChange(): CeloTxObject<string>;
        owner(): CeloTxObject<string>;
        registry(): CeloTxObject<string>;
        renounceOwnership(): CeloTxObject<void>;
        setRegistry(registryAddress: string): CeloTxObject<void>;
        spread(): CeloTxObject<string>;
        stableTokenExchangeLimits(arg0: string): CeloTxObject<{
            minExchangeAmount: string;
            maxExchangeAmount: string;
            0: string;
            1: string;
        }>;
        transferOwnership(newOwner: string): CeloTxObject<void>;
        vetoPeriodSeconds(): CeloTxObject<string>;
        getVersionNumber(): CeloTxObject<{
            0: string;
            1: string;
            2: string;
            3: string;
        }>;
        initialize(_registry: string, _approver: string, _maxApprovalExchangeRateChange: number | string, _spread: number | string, _vetoPeriodSeconds: number | string): CeloTxObject<void>;
        createExchangeProposal(stableTokenRegistryId: string, sellAmount: number | string, sellCelo: boolean): CeloTxObject<string>;
        approveExchangeProposal(proposalId: number | string): CeloTxObject<void>;
        cancelExchangeProposal(proposalId: number | string): CeloTxObject<void>;
        executeExchangeProposal(proposalId: number | string): CeloTxObject<void>;
        getBuyAmount(celoStableTokenExchangeRate: number | string, sellAmount: number | string, sellCelo: boolean): CeloTxObject<string>;
        removeFromActiveProposalIdsSuperset(index: number | string): CeloTxObject<void>;
        getActiveProposalIds(): CeloTxObject<string[]>;
        getStableTokenExchangeLimits(stableTokenRegistryId: string): CeloTxObject<{
            0: string;
            1: string;
        }>;
        setApprover(newApprover: string): CeloTxObject<void>;
        setMaxApprovalExchangeRateChange(newMaxApprovalExchangeRateChange: number | string): CeloTxObject<void>;
        setSpread(newSpread: number | string): CeloTxObject<void>;
        setStableTokenExchangeLimits(stableTokenRegistryId: string, minExchangeAmount: number | string, maxExchangeAmount: number | string): CeloTxObject<void>;
        setVetoPeriodSeconds(newVetoPeriodSeconds: number | string): CeloTxObject<void>;
    };
    events: {
        ApproverSet: ContractEvent<string>;
        ExchangeProposalApproved: ContractEvent<string>;
        ExchangeProposalCancelled: ContractEvent<string>;
        ExchangeProposalCreated: ContractEvent<{
            proposalId: string;
            exchanger: string;
            stableTokenRegistryId: string;
            sellAmount: string;
            buyAmount: string;
            sellCelo: boolean;
            0: string;
            1: string;
            2: string;
            3: string;
            4: string;
            5: boolean;
        }>;
        ExchangeProposalExecuted: ContractEvent<string>;
        MaxApprovalExchangeRateChangeSet: ContractEvent<string>;
        OwnershipTransferred: ContractEvent<{
            previousOwner: string;
            newOwner: string;
            0: string;
            1: string;
        }>;
        RegistrySet: ContractEvent<string>;
        SpreadSet: ContractEvent<string>;
        StableTokenExchangeLimitsSet: ContractEvent<{
            stableTokenRegistryId: string;
            minExchangeAmount: string;
            maxExchangeAmount: string;
            0: string;
            1: string;
            2: string;
        }>;
        VetoPeriodSecondsSet: ContractEvent<string>;
        allEvents: (options?: EventOptions, cb?: Callback<EventLog>) => EventEmitter;
    };
}
export declare const ABI: AbiItem[];
export declare function newGrandaMento(web3: Web3, address: string): GrandaMento;
