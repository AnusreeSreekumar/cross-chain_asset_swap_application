export const idlFactory = ({ IDL }) => {
  const TokenRate = IDL.Record({ 'usd' : IDL.Float64, 'token' : IDL.Text });
  const Token = IDL.Variant({
    'BTC' : IDL.Null,
    'ETH' : IDL.Null,
    'ICP' : IDL.Null,
  });
  const SwapRequest = IDL.Record({
    'status' : IDL.Text,
    'refund_address' : IDL.Text,
    'swap_id' : IDL.Text,
    'amount_sats' : IDL.Nat64,
    'target_token' : Token,
    'recipient_address' : IDL.Text,
    'source_token' : Token,
  });
  const UserProfile = IDL.Record({
    'member_since' : IDL.Text,
    'status' : IDL.Text,
    'balance' : IDL.Nat64,
    'wallet_address' : IDL.Text,
  });
  return IDL.Service({
    'all_token_rates' : IDL.Func([], [IDL.Vec(TokenRate)], ['query']),
    'claim_test_tokens' : IDL.Func([IDL.Text], [], []),
    'create_swap' : IDL.Func(
        [IDL.Text, IDL.Nat64, IDL.Text, Token, Token],
        [SwapRequest],
        [],
      ),
    'get_user_profile' : IDL.Func([IDL.Text], [UserProfile], ['query']),
    'get_user_swaps' : IDL.Func([IDL.Text], [IDL.Vec(SwapRequest)], ['query']),
    'swap_tokens' : IDL.Func(
        [Token, Token, IDL.Float64],
        [IDL.Float64],
        ['query'],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
