/// <reference types="node" />
import { Bip39, MnemonicLanguages, MnemonicStrength } from '@celo/base/lib/account';
export { Bip39, CELO_DERIVATION_PATH_BASE, MnemonicLanguages, MnemonicStrength, RandomNumberGenerator, } from '@celo/base/lib/account';
export declare function generateMnemonic(strength?: MnemonicStrength, language?: MnemonicLanguages, bip39ToUse?: Bip39): Promise<string>;
export declare function validateMnemonic(mnemonic: string, bip39ToUse?: Bip39, language?: MnemonicLanguages): boolean;
/**
 * Return a list of the words in the mnemonic that are not in the list of valid BIP-39 words for the
 * specified or detected language.
 *
 * @remarks Will return undefined if the language cannot be detected (e.g.  all the words are
 * invalid, or half of the valid words are from one language and the other half from another.)
 */
export declare function invalidMnemonicWords(mnemonic: string, language?: MnemonicLanguages): string[] | undefined;
/**
 * Normalize the mnemonic phrase to eliminate a number of inconsistencies with standard BIP-39
 * phrases that are likely to arise when a user manually enters a phrase.
 *
 * @remarks Note that this does not guarantee that the output is a valid mnemonic phrase, or even
 * that all the words in the phrase are contained in a valid wordlist.
 */
export declare function normalizeMnemonic(mnemonic: string, language?: MnemonicLanguages): string;
/**
 * @deprecated now an alias for normalizeMnemonic.
 */
export declare function formatNonAccentedCharacters(mnemonic: string): string;
export declare function getAllLanguages(): MnemonicLanguages[];
export declare function mnemonicLengthFromStrength(strength: MnemonicStrength): number;
/**
 * Detects the language of tokenized mnemonic phrase by applying a heuristic.
 *
 * @remarks Uses a heuristic of returning the language with the most matching words. In practice, we
 * expect all words to come from a single language, also some may be misspelled or otherwise
 * malformed. It may occasionally occur that a typo results in word from another language (e.g. bag
 * -> bagr) but this should occur at most once or twice per phrase.
 */
export declare function detectMnemonicLanguage(words: string[], candidates?: MnemonicLanguages[]): MnemonicLanguages | undefined;
/**
 * Generates a list of suggested corrections to the mnemonic phrase based on a set of heuristics.
 *
 * @remarks
 * Each yielded suggestion represents an attempt to correct the seed phrase by replacing any invalid
 * words with the most likely valid words. Returned suggestions phrases are ordered by probability
 * based on a noisy channel model, described in detail in CIP-39.
 *
 * The generated list of suggestions is exponential in size, and effectively infinite. One should
 * not attempt to generate the entire list.
 *
 * All yielded suggestions will have a valid checksum, but are not guaranteed to correspond to any
 * given wallet. If the phrase is being used to recover a wallet with non-zero balance, it is
 * suggested that the caller check the balance of the derived wallet address. If the balance is
 * non-zero, they can be sure that the phrase is correct. If it is zero, then they should continue
 * and try the next suggestion.
 *
 * It is recommended to normalize the mnemonic phrase before inputting to this function.
 *
 * @privateRemarks
 * TODO(victor): Include a heuristic rule for phrase-level corrections, such as word ordering swaps.
 */
export declare function suggestMnemonicCorrections(mnemonic: string, language?: MnemonicLanguages, strength?: MnemonicStrength): Generator<string>;
export declare function generateKeys(mnemonic: string, password?: string, changeIndex?: number, addressIndex?: number, bip39ToUse?: Bip39, derivationPath?: string): Promise<{
    privateKey: string;
    publicKey: string;
    address: string;
}>;
export declare function generateDeterministicInviteCode(recipientPhoneHash: string, recipientPepper: string, addressIndex?: number, changeIndex?: number, derivationPath?: string): {
    privateKey: string;
    publicKey: string;
};
export declare function generateSeed(mnemonic: string, password?: string, bip39ToUse?: Bip39, keyByteLength?: number): Promise<Buffer>;
export declare function generateKeysFromSeed(seed: Buffer, changeIndex?: number, addressIndex?: number, derivationPath?: string): {
    privateKey: string;
    publicKey: string;
    address: string;
};
export declare const AccountUtils: {
    detectMnemonicLanguage: typeof detectMnemonicLanguage;
    generateMnemonic: typeof generateMnemonic;
    normalizeMnemonic: typeof normalizeMnemonic;
    validateMnemonic: typeof validateMnemonic;
    invalidMnemonicWords: typeof invalidMnemonicWords;
    suggestMnemonicCorrections: typeof suggestMnemonicCorrections;
    generateKeys: typeof generateKeys;
    generateSeed: typeof generateSeed;
    generateKeysFromSeed: typeof generateKeysFromSeed;
};
