import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type SwapId = string;
export interface SwapRequest {
  'status' : string,
  'refund_address' : string,
  'swap_id' : SwapId,
  'amount_sats' : bigint,
  'target_token' : token,
  'recipient_address' : string,
  'source_token' : token,
}
export interface UserProfile {
  'member_since' : string,
  'status' : string,
  'balance' : bigint,
  'wallet_address' : Principal,
}
export type token = { 'BTC' : null } |
  { 'ETH' : null } |
  { 'ICP' : null };
export interface _SERVICE {
  'check_swap' : ActorMethod<[SwapId], [] | [SwapRequest]>,
  'create_swap' : ActorMethod<
    [string, bigint, string, token, token],
    SwapRequest
  >,
  'get_user_profile' : ActorMethod<[Principal], UserProfile>,
  'process_swap' : ActorMethod<[SwapRequest], number>,
  'swap_tokens' : ActorMethod<[token, token, number], number>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
