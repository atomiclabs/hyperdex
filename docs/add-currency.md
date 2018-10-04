# Add a Currency

Instructions for getting a new cryptocurrency added to HyperDEX.

## Requirements

- The currency must be [Bitcoin-compatible](https://docs.komodoplatform.com/barterDEX/get-listed-barterDEX.html) or ERC20-based.
- If the currency is not ERC20-based, there must be at least 2 trusted Electrum servers for the currency. The servers should available on domains/subdomains, not IP addresses. Preferably subdomains on the official domain. Say the domain is `currency.com`, the Electrum servers should be at `electrum1.currency.com` and `electrum2.currency.com`.

## Proof

You must prove to us that the currency information is correct and that the Electrum servers are officially approved.

Examples:

- [Verify the domain listed on the GitHub organization](https://help.github.com/articles/verifying-your-organization-s-domain/).
- [Signed PGP message](https://keybase.io/hyperdex) from the currency team approving the change.
- Tweet/DM from official account approving the change.

## Steps

- Add the currency to https://github.com/jl777/coins. *(We use this repo as the source of truth)*
- Open an issue on https://github.com/atomiclabs/cryptocurrency-icons if the currency's icon is not already there. We will make an icon for the currency.
- When your pull request to `jl777/coins` has been merged, you can open a pull request on https://github.com/atomiclabs/hyperdex.
	- Add the currency info [here](https://github.com/atomiclabs/hyperdex/blob/master/app/marketmaker/supported-currencies.js). *Note that the list is ordered alphabetically.*
	- Add the block explorer [here](https://github.com/atomiclabs/hyperdex/blob/master/app/renderer/block-explorer.js). *Note that the list is ordered alphabetically.*
	- In the pull request description, include information about the currency, like official website, CoinMarketCap page, Twitter, etc. Also include a link to your `jl777/coins` pull request.
