use ic_cdk_macros::*;
// use ic_cdk::api::management_canister::bitcoin::{BitcoinNetwork, GetBalanceRequest};
// use ic_cdk::call;
// use candid::{Principal}
use candid::{CandidType};
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

thread_local! {
    static SWAPS: RefCell<HashMap<SwapId, SwapRequest>> = RefCell::new(HashMap::new());
}

#[derive(Clone, Debug, PartialEq, Eq, candid::CandidType, serde::Serialize, serde::Deserialize)]
pub enum Token {
    BTC,
    ETH,
    ICP,
}

#[init]
fn init() {
    ic_cdk::println!("Cross-chain swap backend initialized.");
}

#[update]
//function that takes the input data from UI and save a copy in th network

fn create_swap(refund_address: String, amount_sats: u64, recipient_address: String, source_token: Token, target_token: Token) -> SwapRequest {
    let swap_id = format!("SWAP-{}", ic_cdk::api::time());
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
    swap
}

#[update]
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

#[update]
fn process_swap(mut swap: SwapRequest) -> f64 {
    let result = swap_tokens(
        swap.source_token.clone(),
        swap.target_token.clone(),
        swap.amount_sats as f64 / 100_000_000.0,
    );
    swap.status = "Completed".to_string();
    result
}

#[query]
fn check_swap(swap_id: SwapId) -> Option<SwapRequest> {
    SWAPS.with(|s| s.borrow().get(&swap_id).cloned())
}

#[update]
fn simulate_deposit(swap_id: SwapId) -> String {
    SWAPS.with(|s| {
        let mut map = s.borrow_mut();
        if let Some(swap) = map.get_mut(&swap_id) {
            swap.status = "deposit_received".to_string();
            return format!("Deposit received for {}", swap.swap_id);
        }
        "Swap ID not found".into()
    })
}

// #[update]
// async fn get_btc_balance(address: String) -> Result<u64, String> {
//     let request = GetBalanceRequest {
//         address,
//         network: BitcoinNetwork::Testnet,
//         min_confirmations: None,
//     };

//     let (balance,): (u64,) = call(
//         bitcoin_canister_id,
//         "bitcoin_get_balance",
//         (request,),
//     )
//     .await
//     .map_err(|e| format!("Call failed: {:?}", e))?;

//     Ok(balance)
// }