/// <reference types="node" />
import { BigNumber } from 'bignumber.js';
import * as t from 'io-ts';
export interface EIP712Parameter {
    name: string;
    type: string;
}
export interface EIP712Types {
    [key: string]: EIP712Parameter[];
}
export interface EIP712TypesWithPrimary {
    types: EIP712Types;
    primaryType: string;
}
export declare type EIP712ObjectValue = string | number | BigNumber | boolean | Buffer | EIP712Object | EIP712ObjectValue[];
export interface EIP712Object {
    [key: string]: EIP712ObjectValue;
}
export interface EIP712TypedData {
    types: EIP712Types & {
        EIP712Domain: EIP712Parameter[];
    };
    domain: EIP712Object;
    message: EIP712Object;
    primaryType: string;
}
/** Array of all EIP-712 atomic type names. */
export declare const EIP712_ATOMIC_TYPES: string[];
export declare const EIP712_DYNAMIC_TYPES: string[];
export declare const EIP712_BUILTIN_TYPES: string[];
/**
 * Utility type representing an optional value in a EIP-712 compatible manner, as long as the
 * concrete type T is a subtype of EIP712ObjectValue.
 *
 * @remarks EIP712Optonal is not part of the EIP712 standard, but is fully compatible with it.
 */
export declare type EIP712Optional<T extends EIP712ObjectValue> = {
    defined: boolean;
    value: T;
};
/**
 * Utility to build EIP712Optional<T> types to insert in EIP-712 type arrays.
 * @param typeName EIP-712 string type name. Should be builtin or defined in the EIP712Types
 * structure into which this type will be merged.
 */
export declare const eip712OptionalType: (typeName: string) => EIP712Types;
/**
 * Utility to build EIP712Optional<T> schemas for encoding and decoding with io-ts.
 * @param schema io-ts type (a.k.a. schema or codec) describing the inner type.
 */
export declare const eip712OptionalSchema: <S extends t.Mixed>(schema: S) => t.TypeC<{
    defined: t.BooleanC;
    value: S;
}>;
/** Utility to construct an defined EIP712Optional value with inferred type. */
export declare const defined: <T extends EIP712ObjectValue>(value: T) => EIP712Optional<T>;
/** Undefined EIP712Optional type with value type boolean. */
export declare const noBool: EIP712Optional<boolean>;
/** Undefined EIP712Optional type with value type number. */
export declare const noNumber: EIP712Optional<number>;
/** Undefined EIP712Optional type with value type string. */
export declare const noString: EIP712Optional<string>;
/**
 * Generates the EIP712 Typed Data hash for signing
 * @param   typedData An object that conforms to the EIP712TypedData interface
 * @return  A Buffer containing the hash of the typed data.
 */
export declare function generateTypedDataHash(typedData: EIP712TypedData): Buffer;
/**
 * Creates a string encoding of the primary type, including all dependencies.
 * E.g. "Transaction(Person from,Person to,Asset tx)Asset(address token,uint256 amount)Person(address wallet,string name)"
 */
export declare function encodeType(primaryType: string, types: EIP712Types): string;
export declare function typeHash(primaryType: string, types: EIP712Types): Buffer;
/**
 * Constructs the struct encoding of the data as the primary type.
 */
export declare function encodeData(primaryType: string, data: EIP712Object, types: EIP712Types): Buffer;
export declare function structHash(primaryType: string, data: EIP712Object, types: EIP712Types): Buffer;
/**
 * Produce the zero value for a given type.
 *
 * @remarks
 * All atomic types will encode as the 32-byte zero value. Dynamic types as an empty hash.
 * Dynamic arrays will return an empty array. Fixed length arrays will have members set to zero.
 * Structs will have the values of all fields set to zero recursively.
 *
 * Note that EIP-712 does not specify zero values, and so this is non-standard.
 */
export declare function zeroValue(primaryType: string, types?: EIP712Types): EIP712ObjectValue;
