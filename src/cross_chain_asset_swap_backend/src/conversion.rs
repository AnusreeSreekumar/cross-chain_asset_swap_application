pub const BTC_PER_USD_RATE: f64 = 0.0000092;      // 1 USD = 0.0000092 BTC
pub const ETH_PER_USD_RATE: f64 = 0.00038750;     // 1 USD = 0.00038750 ETH
pub const ICP_PER_USD_RATE: f64 = 0.125;         // 1 USD = 0.125 ICP

pub const  USD_PER_BTC_RATE: f64 = 109427.70;
pub const  USD_PER_ETH_RATE: f64 = 2597.74;
pub const  USD_PER_ICP_RATE: f64 = 5.06;


pub fn btc_to_usd(btc: f64) -> f64 {
    btc * USD_PER_BTC_RATE as f64
}

pub fn eth_to_usd(eth: f64) -> f64 {
    eth * USD_PER_ETH_RATE as f64
}

pub fn icp_to_usd(icp: f64) -> f64 {
    icp * USD_PER_ICP_RATE as f64
}

pub fn usd_to_btc(usd: f64) -> f64 {
    let btc = usd * BTC_PER_USD_RATE;
    (btc * 100_000_000.0).round() as f64
}

pub fn usd_to_eth(usd: f64) -> f64 {
    let eth = usd * ETH_PER_USD_RATE;
    (eth * 1_000_000_000_000_000_000.0).round() as f64
}

pub fn usd_to_icp(usd: f64) -> f64 {
    let icp = usd * ICP_PER_USD_RATE;
    (icp * 100_000_000.0).round() as f64
}