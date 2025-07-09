export const idlFactory = ({ IDL }) => {
  const TokenRate = IDL.Record({ 'usd' : IDL.Float64, 'token' : IDL.Text });
  const SwapId = IDL.Text;
  const token = IDL.Variant({
    'BTC' : IDL.Null,
    'ETH' : IDL.Null,
    'ICP' : IDL.Null,
  });
  const SwapRequest = IDL.Record({
    'status' : IDL.Text,
    'refund_address' : IDL.Text,
    'swap_id' : SwapId,
    'amount_sats' : IDL.Nat64,
    'target_token' : token,
    'recipient_address' : IDL.Text,
    'source_token' : token,
  });
  const UserProfile = IDL.Record({
    'member_since' : IDL.Text,
    'status' : IDL.Text,
    'balance' : IDL.Nat64,
    'wallet_address' : IDL.Principal,
  });
  return IDL.Service({
    'all_token_rates' : IDL.Func([], [IDL.Vec(TokenRate)], ['query']),
    'check_swap' : IDL.Func([SwapId], [IDL.Opt(SwapRequest)], ['query']),
    'create_swap' : IDL.Func(
        [IDL.Text, IDL.Nat64, IDL.Text, token, token],
        [SwapRequest],
        [],
      ),
    'get_user_profile' : IDL.Func([IDL.Principal], [UserProfile], ['query']),
    'process_swap' : IDL.Func([SwapRequest], [IDL.Float64], []),
    'swap_tokens' : IDL.Func(
        [token, token, IDL.Float64],
        [IDL.Float64],
        ['query'],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
