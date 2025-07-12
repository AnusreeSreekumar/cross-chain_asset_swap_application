import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface SwapRequest {
  'status' : string,
  'refund_address' : string,
  'swap_id' : string,
  'amount_sats' : bigint,
  'target_token' : Token,
  'recipient_address' : string,
  'source_token' : Token,
}
export type Token = { 'BTC' : null } |
  { 'ETH' : null } |
  { 'ICP' : null };
export interface TokenRate { 'usd' : number, 'token' : string }
export interface UserProfile {
  'member_since' : string,
  'status' : string,
  'balance' : bigint,
  'wallet_address' : string,
}
export interface _SERVICE {
  'all_token_rates' : ActorMethod<[], Array<TokenRate>>,
  'claim_test_tokens' : ActorMethod<[string], undefined>,
  'create_swap' : ActorMethod<
    [string, bigint, string, Token, Token],
    SwapRequest
  >,
  'get_user_profile' : ActorMethod<[string], UserProfile>,
  'get_user_swaps' : ActorMethod<[string], Array<SwapRequest>>,
  'swap_tokens' : ActorMethod<[Token, Token, number], number>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
