//The below code uses testtokens and test accounts for Transfer Operations.
//Sender account is an actual Internet Identity/Plug Wallet account.

use ic_cdk_macros::*;
use candid::{CandidType, Principal};
use std::collections::HashMap;
use std::cell::RefCell;
use serde::{Deserialize, Serialize};
mod conversion;
use conversion::*;


type SwapId = String;

#[derive(Clone, CandidType, Serialize, Deserialize)]
pub struct SwapRequest {
    pub swap_id: SwapId,
    pub refund_address: String,
    pub amount_sats: u64,
    pub recipient_address: String, 
    pub source_token: Token,
    pub target_token: Token,
    pub status: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone)]
pub struct UserProfile {
    pub wallet_address: String, // changed from Principal
    pub member_since: String,
    pub balance: u64,
    pub status: String,
}


#[derive(CandidType, Serialize, Deserialize, Clone)]
struct TokenRate {
    token: String,
    usd: f64,
}

#[derive(Clone, Debug, PartialEq, Eq, candid::CandidType, serde::Serialize, serde::Deserialize)]
pub enum Token {
    BTC,
    ETH,
    ICP,
}

thread_local! {
    static SWAPS: RefCell<HashMap<SwapId, SwapRequest>> = RefCell::new(HashMap::new());
}

thread_local! {
    static USER_PROFILES: RefCell<HashMap<String, UserProfile>> = RefCell::new(HashMap::new());
}


#[init]
fn init() {
    ic_cdk::println!("Cross-chain swap application initialized.");
}

//To get the Profile details of logged in User
#[query]
fn get_user_profile(user_id: String) -> UserProfile {
    USER_PROFILES.with(|profiles| {
        profiles.borrow().get(&user_id).cloned().unwrap_or(UserProfile {
            wallet_address: user_id.clone(),
            member_since: "2024-06-01".to_string(),
            balance: 0,
            status: "Active".to_string(),
        })
    })
}

//To get test tokens for the logged in account:
#[update]
fn claim_test_tokens(user_id: String) {
    USER_PROFILES.with(|profiles| {
        let mut profiles = profiles.borrow_mut();

        profiles
            .entry(user_id.clone())
            .and_modify(|profile| {
                profile.balance += 1_000_000;
            })
            .or_insert(UserProfile {
                wallet_address: user_id.clone(),
                member_since: "2024-06-01".to_string(),
                balance: 1_000_000,
                status: "Active".to_string(),
            });
    });
}

#[update]
//function that takes the input data from UI and save a copy in th network
fn create_swap(
    refund_address: String,
    amount_sats: u64,
    recipient_address: String,
    source_token: Token,
    target_token: Token,
) -> SwapRequest {
    
    let swap_id = format!("SWAP-{}", ic_cdk::api::time());
    let caller_id = refund_address.clone();
    let current_balance = USER_PROFILES.with(|profiles| {
        profiles.borrow().get(&caller_id).map(|p| p.balance).unwrap_or(0)
    });

    if current_balance < amount_sats {
        ic_cdk::trap("Insufficient balance.");
    }

    let swap = SwapRequest {
        swap_id: swap_id.clone(),
        refund_address,
        amount_sats,
        recipient_address,
        source_token,
        target_token,
        status: "waiting_deposit".into(),
    };

    SWAPS.with(|s| s.borrow_mut().insert(swap_id.clone(), swap.clone()));
    process_swap(swap.clone());
    swap
}

//Completes processing of the incoming swap request
fn process_swap(mut swap: SwapRequest) -> f64 {
    let converted_amount = swap_tokens(
        swap.source_token.clone(),
        swap.target_token.clone(),
        swap.amount_sats as f64 / 100_000_000.0,
    );

    update_user_balance(swap.refund_address.clone(), -(swap.amount_sats as i64));
    swap.status = "Completed".to_string();

    SWAPS.with(|s| s.borrow_mut().insert(swap.swap_id.clone(), swap.clone()));

    converted_amount
}


//To update the account balance after transfer function is processed
fn update_user_balance(user_id: String, delta: i64) {
    USER_PROFILES.with(|profiles| {
        let mut map = profiles.borrow_mut();

        let profile = map.entry(user_id.clone()).or_insert(UserProfile {
            wallet_address: user_id.clone(),
            member_since: "2024-06-01".to_string(),
            balance: 0,
            status: "Active".to_string(),
        });

        if delta.is_positive() {
            profile.balance += delta as u64;
        } else {
            let subtract = delta.abs() as u64;
            profile.balance = profile.balance.saturating_sub(subtract);
        }
    });
}

//To recieve the conversion rates for BTC/ICP/Ether tokens
#[query]
fn swap_tokens(source_token: Token, target_token: Token, amount_sats: f64) -> f64 {
    match (source_token, target_token) {
        (Token::BTC, Token::ETH) => {
            let usd = btc_to_usd(amount_sats);
            usd_to_eth(usd)
        }
        (Token::ETH, Token::BTC) => {
            let usd = eth_to_usd(amount_sats);
            usd_to_btc(usd)
        }
        (Token::BTC, Token::ICP) => {
            let usd = btc_to_usd(amount_sats);
            usd_to_icp(usd)
        }
        (Token::ICP, Token::BTC) => {
            let usd = icp_to_usd(amount_sats);
            usd_to_btc(usd)
        }
        (Token::ETH, Token::ICP) => {
            let usd = eth_to_usd(amount_sats);
            usd_to_icp(usd)
        }
        (Token::ICP, Token::ETH) => {
            let usd = icp_to_usd(amount_sats);
            usd_to_eth(usd)
        }
        // Same token or unsupported direction
        _ => 0.0,
    }
}

//To get the USD equivalent rates for ICP/BTC/Ether tokens
#[query]
fn all_token_rates() -> Vec<TokenRate> {
    vec![
        TokenRate { token: "BTC".to_string(), usd: USD_PER_BTC_RATE },
        TokenRate { token: "ETH".to_string(), usd: USD_PER_ETH_RATE },
        TokenRate { token: "ICP".to_string(), usd: USD_PER_ICP_RATE },
    ]
}

//To track swaps created by each user (Principal)
#[query]
fn get_user_swaps(user_id: String) -> Vec<SwapRequest> {
    SWAPS.with(|swaps| {
        swaps
            .borrow()
            .values()
            .filter(|swap| swap.refund_address == user_id)
            .cloned()
            .collect()
    })
}
