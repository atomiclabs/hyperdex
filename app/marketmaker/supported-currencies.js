'use strict';

const coinlist = require('coinlist');
const _ = require('lodash');
const {hiddenCurrencies} = require('../constants');

/*
Info:
We use the `name` property only when the currency is not on `coinmarketcap.com`.
*/

const supportedCurrencies = [
	{
		coin: '$PAC',
		rpcport: 7111,
		pubtype: 55,
		p2shtype: 10,
		wiftype: 204,
		txfee: 10000,
		electrumServers: [
			{
				host: 'electrum.paccoin.io',
				port: 50001,
			},
			{
				host: 'electro-pac.paccoin.io',
				port: 50001,
			},
		],
	},
	{
		coin: '1ST',
		name: 'FirstBlood',
		contractAddress: '0xAf30D2a7E90d7DC361c8C4585e9BB7D2F6f15bc7',
		rpcport: 80,
	},
	{
		coin: 'ADT',
		name: 'adToken',
		contractAddress: '0xD0D6D6C5Fe4a677D343cC433536BB717bAe167dD',
		rpcport: 80,
	},
	{
		coin: 'AE',
		name: 'Aeternity',
		contractAddress: '0x5ca9a71b1d01849c0a95490cc00559717fcf0d1d',
		rpcport: 80,
	},
	{
		coin: 'AMB',
		name: 'Ambrosus',
		contractAddress: '0x4DC3643DbC642b72C158E7F3d2ff232df61cb6CE',
		rpcport: 80,
	},
	{
		coin: 'ANN',
		name: 'Agent Not Needed',
		contractAddress: '0xe0e73E8fc3a0fA161695be1D75E1Bc3E558957c4',
		rpcport: 80,
	},
	{
		coin: 'ANT',
		name: 'Aragon',
		contractAddress: '0x960b236A07cf122663c4303350609A66A7B288C0',
		rpcport: 80,
	},
	{
		coin: 'AST',
		name: 'AirSwap',
		contractAddress: '0x27054b13b1B798B345b591a4d22e6562d47eA75a',
		rpcport: 80,
	},
	{
		coin: 'BAT',
		name: 'Basic Attention Token',
		contractAddress: '0x0D8775F648430679A709E98d2b0Cb6250d2887EF',
		rpcport: 80,
	},
	{
		coin: 'BBT',
		name: 'Bitboost',
		contractAddress: '0x1500205f50bf3fd976466d0662905c9ff254fc9c',
		rpcport: 80,
	},
	{
		coin: 'BCAP',
		name: 'Bcap',
		contractAddress: '0xFf3519eeeEA3e76F1F699CCcE5E23ee0bdDa41aC',
		rpcport: 80,
	},
	{
		coin: 'BCH',
		rpcport: 33333,
		pubtype: 0,
		p2shtype: 5,
		wiftype: 128,
		txfee: 1000,
		electrumServers: [
			{
				host: 'bch.imaginary.cash',
				port: 50001,
			},
			{
				host: 'bch.loping.net',
				port: 50001,
			},
			{
				host: 'electron.coinucopia.io',
				port: 50001,
			},
			{
				host: 'electrumx-bch.cryptonermal.net',
				port: 50001,
			},
			{
				host: 'wallet.satoshiscoffeehouse.com',
				port: 50001,
			},
		],
	},
	{
		coin: 'BITSOKO',
		name: 'Bitsoko',
		contractAddress: '0xb72627650f1149ea5e54834b2f468e5d430e67bf',
		rpcport: 80,
	},
	{
		coin: 'BLK',
		isPoS: 1,
		rpcport: 15715,
		pubtype: 25,
		p2shtype: 85,
		wiftype: 153,
		txfee: 100000,
		electrumServers: [
			{
				host: 'electrum1.cipig.net',
				port: 10054,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10054,
			},
			{
				host: 'electrum3.cipig.net',
				port: 10054,
			},
		],
	},
	{
		coin: 'BNB',
		name: 'Binance Coin',
		contractAddress: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
		rpcport: 80,
	},
	{
		coin: 'BNT',
		name: 'Bancor',
		contractAddress: '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C',
		rpcport: 80,
	},
	{
		coin: 'BOTS',
		name: 'Bots',
		asset: 'BOTS',
		rpcport: 11964,
		electrumServers: [
			{
				host: 'electrum1.cipig.net',
				port: 10007,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10007,
			},
			{
				host: 'electrum3.cipig.net',
				port: 10007,
			},
		],
	},
	{
		coin: 'BOX',
		name: 'Beonbox',
		contractAddress: '0x01e579be97433f861340268521a7a2ab9829082c',
		rpcport: 80,
	},
	{
		coin: 'BTC',
		electrumServers: [
			{
				host: 'electrum1.cipig.net',
				port: 10000,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10000,
			},
			{
				host: 'electrum3.cipig.net',
				port: 10000,
			},
		],
	},
	{
		coin: 'BTCH',
		name: 'Bitcoin Hush',
		asset: 'BTCH',
		rpcport: 8800,
		electrumServers: [
			{
				host: 'electrum1.cipig.net',
				port: 10020,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10020,
			},
			{
				host: 'electrum3.cipig.net',
				port: 10020,
			},
		],
	},
	{
		coin: 'BTCL',
		name: 'BTC Lite',
		contractAddress: '0x5acd19b9c91e596b1f062f18e3d02da7ed8d1e50',
		rpcport: 80,
	},
	{
		coin: 'BTG',
		rpcport: 12332,
		pubtype: 38,
		p2shtype: 23,
		wiftype: 128,
		txfee: 10000,
		electrumServers: [
			{
				host: 'electrumx-eu.bitcoingold.org',
				port: 50001,
			},
			{
				host: 'electrumx-us.bitcoingold.org',
				port: 50001,
			},
		],
	},
	{
		coin: 'BTK',
		name: 'BitcoinToken',
		contractAddress: '0xdb8646F5b487B5Dd979FAC618350e85018F557d4',
		rpcport: 80,
	},
	{
		coin: 'BTM',
		name: 'Bytom',
		contractAddress: '0xcB97e65F07DA24D46BcDD078EBebd7C6E6E3d750',
		rpcport: 80,
	},
	{
		coin: 'CDT',
		name: 'Blox',
		contractAddress: '0x177d39AC676ED1C67A2b268AD7F1E58826E5B0af',
		rpcport: 80,
	},
	{
		coin: 'CENNZ',
		name: 'Centrality',
		contractAddress: '0x1122b6a0e00dce0563082b6e2953f3a943855c1f',
		rpcport: 80,
	},
	{
		coin: 'CFI',
		name: 'Cofound.it',
		contractAddress: '0x12FEF5e57bF45873Cd9B62E9DBd7BFb99e32D73e',
		rpcport: 80,
	},
	{
		coin: 'CHAIN',
		name: 'Chainmakers',
		asset: 'CHAIN',
		rpcport: 15587,
		electrumServers: [
			{
				host: 'electrum1.cipig.net',
				port: 10032,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10032,
			},
			{
				host: 'electrum3.cipig.net',
				port: 10032,
			},
		],
	},
	{
		coin: 'CHIPS',
		name: 'Chips',
		rpcport: 57776,
		pubtype: 60,
		p2shtype: 85,
		wiftype: 188,
		txfee: 10000,
		electrumServers: [
			{
				host: 'electrum1.cipig.net',
				port: 10053,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10053,
			},
			{
				host: 'electrum3.cipig.net',
				port: 10053,
			},
		],
	},
	{
		coin: 'CIX',
		name: 'Cryptonetix',
		contractAddress: '0x1175a66a5c3343Bbf06AA818BB482DdEc30858E0',
		rpcport: 80,
	},
	{
		coin: 'CCL',
		name: 'CoinCollect',
		asset: 'CCL',
		rpcport: 20849,
		txversion: 4,
		electrumServers: [
			{
				host: 'electrum1.cipig.net',
				port: 10029,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10029,
			},
			{
				host: 'electrum3.cipig.net',
				port: 10029,
			},
		],
	},
	{
		coin: 'COQUI',
		name: 'Coqui Cash',
		asset: 'COQUI',
		rpcport: 14276,
		electrumServers: [
			{
				host: 'electrum1.cipig.net',
				port: 10011,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10011,
			},
			{
				host: 'electrum3.cipig.net',
				port: 10011,
			},
		],
	},
	{
		coin: 'CRYPTO',
		name: 'Crypto777',
		asset: 'CRYPTO',
		rpcport: 8516,
		electrumServers: [
			{
				host: 'electrum1.cipig.net',
				port: 10008,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10008,
			},
			{
				host: 'electrum3.cipig.net',
				port: 10008,
			},
		],
	},
	{
		coin: 'CS',
		name: 'Credits',
		contractAddress: '0x46b9ad944d1059450da1163511069c718f699d31',
		rpcport: 80,
	},
	{
		coin: 'CVC',
		name: 'Civic',
		contractAddress: '0x41e5560054824eA6B0732E656E3Ad64E20e94E45',
		rpcport: 80,
	},
	{
		coin: 'DAI',
		name: 'Dai',
		contractAddress: '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359',
		rpcport: 80,
	},
	{
		coin: 'D',
		name: 'Denarius',
		rpcport: 32369,
		pubtype: 30,
		p2shtype: 90,
		wiftype: 158,
		txfee: 10000,
		electrumServers: [
			{
				host: 'electrumx1.denarius.pro',
				port: 50001,
			},
			{
				host: 'electrumx2.denarius.pro',
				port: 50001,
			},
			{
				host: 'electrum.denariuspool.info',
				port: 50001,
			},
			{
				host: 'electrum.denarius.vip',
				port: 50001,
			},
		],
	},
	{
		coin: 'DASH',
		rpcport: 9998,
		pubtype: 76,
		p2shtype: 16,
		wiftype: 204,
		txfee: 10000,
		electrumServers: [
			{
				host: 'electrum1.cipig.net',
				port: 10061,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10061,
			},
			{
				host: 'electrum3.cipig.net',
				port: 10061,
			},
		],
	},
	{
		coin: 'DATA',
		name: 'Streamr DATAcoin',
		contractAddress: '0x0cf0ee63788a0849fe5297f3407f701e122cc023',
		rpcport: 80,
	},
	{
		coin: 'DCN',
		name: 'Dentacoin',
		contractAddress: '0x08d32b0da63e2C3bcF8019c9c5d849d7a9d791e6',
		rpcport: 80,
	},
	{
		coin: 'DEC8',
		name: 'DEC8 (TESTCOIN)',
		contractAddress: '0x3ab100442484dc2414aa75b2952a0a6f03f8abfd',
		rpcport: 80,
	},
	{
		coin: 'DEX',
		name: 'InstantDEX',
		asset: 'DEX',
		rpcport: 11890,
		electrumServers: [
			{
				host: 'electrum1.cipig.net',
				port: 10006,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10006,
			},
			{
				host: 'electrum3.cipig.net',
				port: 10006,
			},
		],
	},
	{
		coin: 'DGB',
		rpcport: 14022,
		pubtype: 30,
		p2shtype: 5,
		wiftype: 128,
		txfee: 100000,
		electrumServers: [
			{
				host: 'electrum1.cipig.net',
				port: 10059,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10059,
			},
			{
				host: 'electrum3.cipig.net',
				port: 10059,
			},
		],
	},
	{
		coin: 'DGD',
		name: 'DigixDAO',
		contractAddress: '0xE0B7927c4aF23765Cb51314A0E0521A9645F0E2A',
		decimals: 9,
		rpcport: 80,
	},
	{
		coin: 'DGPT',
		name: 'DigiPulse',
		contractAddress: '0xf6cFe53d6FEbaEEA051f400ff5fc14F0cBBDacA1',
		rpcport: 80,
	},
	{
		coin: 'DICE',
		name: 'Etheroll',
		contractAddress: '0x2e071D2966Aa7D8dECB1005885bA1977D6038A65',
		rpcport: 80,
	},
	{
		coin: 'DNT',
		name: 'District0x',
		contractAddress: '0x0AbdAce70D3790235af448C88547603b945604ea',
		rpcport: 80,
	},
	{
		coin: 'DOGE',
		rpcport: 22555,
		pubtype: 30,
		p2shtype: 22,
		wiftype: 158,
		txfee: 100000000,
		electrumServers: [
			{
				host: 'electrum1.cipig.net',
				port: 10060,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10060,
			},
			{
				host: 'electrum3.cipig.net',
				port: 10060,
			},
		],
	},
	{
		coin: 'DRGN',
		name: 'Dragonchain',
		contractAddress: '0x419c4db4b9e25d6db2ad9691ccb832c8d9fda05e',
		rpcport: 80,
	},
	{
		coin: 'DROP',
		name: 'Dropil',
		contractAddress: '0x4672bad527107471cb5067a887f4656d585a8a31',
		rpcport: 80,
	},
	{
		coin: 'DRT',
		name: 'DomRaider',
		contractAddress: '0x9af4f26941677c706cfecf6d3379ff01bb85d5ab',
		rpcport: 80,
	},
	{
		coin: 'EDG',
		name: 'Edgeless',
		contractAddress: '0x08711D3B02C8758F2FB3ab4e80228418a7F8e39c',
		rpcport: 80,
	},
	{
		coin: 'ELD',
		name: 'Electrum Dark',
		contractAddress: '0xaaf7d4cd097317d68174215395eb02c2cca81e31',
		rpcport: 80,
	},
	{
		coin: 'ELF',
		name: 'aelf',
		contractAddress: '0xbf2179859fc6D5BEE9Bf9158632Dc51678a4100e',
		rpcport: 80,
	},
	{
		coin: 'EMC2',
		rpcport: 41879,
		pubtype: 33,
		p2shtype: 5,
		wiftype: 176,
		txfee: 100000,
		electrumServers: [
			{
				host: 'electrum1.cipig.net',
				port: 10062,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10062,
			},
			{
				host: 'electrum3.cipig.net',
				port: 10062,
			},
		],
	},
	{
		coin: 'ENG',
		name: 'Enigma',
		contractAddress: '0xf0ee6b27b759c9893ce4f094b49ad28fd15a23e4',
		rpcport: 80,
	},
	{
		coin: 'ENJ',
		name: 'Enjin Coin',
		contractAddress: '0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c',
		rpcport: 80,
	},
	{
		coin: 'ETH',
		contractAddress: '0x0000000000000000000000000000000000000000',
		rpcport: 80,
	},
	{
		coin: 'ETA',
		name: 'Etheera',
		contractAddress: '0x9195e00402abe385f2d00a32af40b271f2e87925',
		rpcport: 80,
	},
	{
		coin: 'ETHOS',
		name: 'Ethos',
		contractAddress: '0x5Af2Be193a6ABCa9c8817001F45744777Db30756',
		rpcport: 80,
	},
	{
		coin: 'FAIR',
		rpcport: 40405,
		pubtype: 95,
		p2shtype: 36,
		wiftype: 223,
		txfee: 2000000,
		electrumServers: [
			{
				host: 'electrum1.cipig.net',
				port: 10063,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10063,
			},
			{
				host: 'electrum3.cipig.net',
				port: 10063,
			},
		],
	},
	{
		coin: 'FJC',
		rpcport: 3776,
		pubtype: 36,
		p2shtype: 16,
		wiftype: 164,
		txfee: 100000,
		electrumServers: [
			{
				host: 'electrumx1.fujicoin.org',
				port: 50001,
			},
			{
				host: 'electrumx2.fujicoin.org',
				port: 50001,
			},
			{
				host: 'electrumx3.fujicoin.org',
				port: 50001,
			},
		],
	},
	{
		coin: 'FLLW',
		name: 'FollowCoin',
		contractAddress: '0x0200412995f1bafef0d3f97c4e28ac2515ec1ece',
		rpcport: 80,
	},
	{
		coin: 'FSN',
		name: 'Fusion',
		contractAddress: '0xd0352a019e9ab9d757776f532377aaebd36fd541',
		rpcport: 80,
	},
	{
		coin: 'FTC',
		rpcport: 9337,
		pubtype: 14,
		p2shtype: 5,
		wiftype: 142,
		txfee: 1000000,
		electrumServers: [
			{
				host: 'electrumx-gb-1.feathercoin.network',
				port: 50001,
			},
			{
				host: 'electrumx-gb-2.feathercoin.network',
				port: 50001,
			},
			{
				host: 'electrumx-ch-1.feathercoin.ch',
				port: 50001,
			},
			{
				host: 'electrumx-de-2.feathercoin.ch',
				port: 50001,
			},
		],
	},
	{
		coin: 'FUN',
		name: 'FunFair',
		contractAddress: '0x419D0d8BdD9aF5e606Ae2232ed285Aff190E711b',
		rpcport: 80,
	},
	{
		coin: 'FYN',
		name: 'FundYourselfNow',
		contractAddress: '0x88FCFBc22C6d3dBaa25aF478C578978339BDe77a',
		rpcport: 80,
	},
	{
		coin: 'GAME',
		rpcport: 40001,
		pubtype: 38,
		p2shtype: 5,
		wiftype: 166,
		txfee: 1000000,
		electrumServers: [
			{
				host: 'electrum1.cipig.net',
				port: 10072,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10072,
			},
			{
				host: 'electrum3.cipig.net',
				port: 10072,
			},
		],
	},
	{
		coin: 'GNO',
		name: 'Gnosis',
		contractAddress: '0x6810e776880C02933D47DB1b9fc05908e5386b96',
		rpcport: 80,
	},
	{
		coin: 'GPN',
		name: 'GPN Coin',
		contractAddress: '0xE2b407160AAd5540eAc0e80338b9a5085C60F25B',
		rpcport: 80,
	},
	{
		coin: 'GRS',
		rpcport: 1441,
		pubtype: 36,
		p2shtype: 5,
		wiftype: 128,
		txfee: 10000,
		electrumServers: [
			{
				host: 'electrum10.groestlcoin.org',
				port: 50001,
			},
			{
				host: 'electrum11.groestlcoin.org',
				port: 50001,
			},
			{
				host: 'electrum13.groestlcoin.org',
				port: 50001,
			},
			{
				host: 'electrum14.groestlcoin.org',
				port: 50001,
			},
		],
	},
	{
		coin: 'GTO',
		name: 'Gifto',
		contractAddress: '0xc5bbae50781be1669306b9e001eff57a2957b09d',
		rpcport: 80,
	},
	{
		coin: 'GUP',
		name: 'Matchpool',
		contractAddress: '0xf7B098298f7C69Fc14610bf71d5e02c60792894C',
		rpcport: 80,
	},
	{
		coin: 'GUSD',
		name: 'Gemini dollar',
		decimals: 2,
		contractAddress: '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd',
		rpcport: 80,
	},
	{
		coin: 'HGT',
		name: 'HelloGold',
		contractAddress: '0xba2184520A1cC49a6159c57e61E1844E085615B6',
		rpcport: 80,
	},
	{
		coin: 'HMQ',
		name: 'Humaniq',
		contractAddress: '0xcbCC0F036ED4788F63FC0fEE32873d6A7487b908',
		rpcport: 80,
	},
	/* Disabled because of #289
	{
		coin: 'HODL',
		asset: 'HODL',
		rpcport: 14431,
		electrumServers: [
			{
				host: 'electrum1.cipig.net',
				port: 10009,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10009,
			},
			{
				host: 'electrum3.cipig.net',
				port: 10009,
			},
		],
	},
	{
		coin: 'HODLC',
		name: 'Hodlcoin',
		rpcport: 11989,
		pubtype: 40,
		p2shtype: 5,
		wiftype: 168,
		txfee: 5000,
		electrumServers: [
			{
				host: 'hodl.amit.systems',
				port: 17989,
			},
			{
				host: 'hodl2.amit.systems',
				port: 17989,
			},
		],
	},
	*/
	{
		coin: 'HUSH',
		rpcport: 8822,
		taddr: 28,
		pubtype: 184,
		p2shtype: 189,
		wiftype: 128,
		txfee: 1000,
		electrumServers: [
			{
				host: 'electrum1.cipig.net',
				port: 10064,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10064,
			},
			{
				host: 'electrum3.cipig.net',
				port: 10064,
			},
		],
	},
	{
		coin: 'HYD',
		name: 'Hydra',
		contractAddress: '0xD233495C48EB0143661fFC8458EAfc21b633f97f',
		rpcport: 80,
	},
	{
		coin: 'ICN',
		name: 'Iconomi',
		contractAddress: '0x888666CA69E0f178DED6D75b5726Cee99A87D698',
		rpcport: 80,
	},
	{
		coin: 'IND',
		name: 'Indorse Token',
		contractAddress: '0xf8e386EDa857484f5a12e4B5DAa9984E06E73705',
		rpcport: 80,
	},
	{
		coin: 'IOST',
		name: 'IOST',
		contractAddress: '0xfa1a856cfa3409cfa145fa4e20eb270df3eb21ab',
		rpcport: 80,
	},
	{
		coin: 'JOI',
		name: 'JointEDU',
		contractAddress: '0x58ded6994124b4fff298f1416aca3fc9cdba37b2',
		rpcport: 80,
	},
	{
		coin: 'JST',
		name: 'JST (TESTCOIN)',
		contractAddress: '0x996a8ae0304680f6a69b8a9d7c6e37d65ab5ab56',
		rpcport: 80,
	},
	{
		coin: 'JUMBLR',
		name: 'Jumblr',
		asset: 'JUMBLR',
		active: 0,
		rpcport: 15106,
		electrumServers: [
			{
				host: 'electrum1.cipig.net',
				port: 10004,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10004,
			},
			{
				host: 'electrum3.cipig.net',
				port: 10004,
			},
		],
	},
	{
		coin: 'KIN',
		name: 'Kin',
		contractAddress: '0x818fc6c2ec5986bc6e2cbf00939d90556ab12ce5',
		rpcport: 80,
	},
	{
		coin: 'KMD',
		electrumServers: [
			{
				host: 'electrum1.cipig.net',
				port: 10001,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10001,
			},
			{
				host: 'electrum3.cipig.net',
				port: 10001,
			},
		],
	},
	{
		coin: 'KNC',
		name: 'Kyber Network',
		contractAddress: '0xdd974D5C2e2928deA5F71b9825b8b646686BD200',
		rpcport: 80,
	},
	{
		coin: 'KV',
		name: 'KeyValue',
		asset: 'KV',
		rpcport: 8299,
		electrumServers: [
			{
				host: 'electrum1.cipig.net',
				port: 10016,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10016,
			},
			{
				host: 'electrum3.cipig.net',
				port: 10016,
			},
		],
	},
	{
		coin: 'LALA',
		name: 'LALA World',
		contractAddress: '0xfd107b473ab90e8fbd89872144a3dc92c40fa8c9',
		rpcport: 80,
	},
	{
		coin: 'LIKE',
		name: 'LikeCoin',
		contractAddress: '0x02f61fd266da6e8b102d4121f5ce7b992640cf98',
		rpcport: 80,
	},
	{
		coin: 'LINK',
		name: 'ChainLink',
		contractAddress: '0x514910771af9ca656af840dff83e8264ecf986ca',
		rpcport: 80,
	},
	{
		coin: 'LOOM',
		name: 'Loom Network',
		contractAddress: '0xa4e8c3ec456107ea67d3075bf9e3df3a75823db0',
		rpcport: 80,
	},
	{
		coin: 'LRC',
		name: 'Loopring',
		contractAddress: '0xEF68e7C694F40c8202821eDF525dE3782458639f',
		decimals: 18,
		rpcport: 80,
	},
	{
		coin: 'LTC',
		rpcport: 9332,
		pubtype: 48,
		p2shtype: 5,
		wiftype: 176,
		txfee: 100000,
		electrumServers: [
			{
				host: 'electrum-ltc.bysh.me',
				port: 50001,
			},
			{
				host: 'electrum.ltc.xurious.com',
				port: 50001,
			},
			{
				host: 'ltc.rentonisk.com',
				port: 50001,
			},
			{
				host: 'backup.electrum-ltc.org',
				port: 50001,
			},
		],
	},
	{
		coin: 'LUN',
		name: 'Lunyr',
		contractAddress: '0xfa05A73FfE78ef8f1a739473e462c54bae6567D9',
		rpcport: 80,
	},
	{
		coin: 'LYS',
		name: 'Lightyears',
		contractAddress: '0xdd41fbd1ae95c5d9b198174a28e04be6b3d1aa27',
		rpcport: 80,
	},
	{
		coin: 'MANA',
		name: 'Decentraland',
		contractAddress: '0x0F5D2fB29fb7d3CFeE444a200298f468908cC942',
		rpcport: 80,
	},
	{
		coin: 'MCO',
		name: 'Monaco',
		contractAddress: '0xB63B606Ac810a52cCa15e44bB630fd42D8d1d83d',
		rpcport: 80,
	},
	{
		coin: 'MGO',
		name: 'MobileGo',
		contractAddress: '0x40395044Ac3c0C57051906dA938B54BD6557F212',
		rpcport: 80,
	},
	{
		coin: 'MKR',
		name: 'Maker',
		contractAddress: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
		rpcport: 80,
	},
	{
		coin: 'MLN',
		name: 'Melon',
		contractAddress: '0xBEB9eF514a379B997e0798FDcC901Ee474B6D9A1',
		rpcport: 80,
	},
	{
		coin: 'MMX',
		name: 'Mechanix Token',
		contractAddress: '0xe7c33a0e04f2316bb321c4ad2976873d09538b56',
		rpcport: 80,
	},
	{
		coin: 'MNX',
		rpcport: 17786,
		pubtype: 75,
		p2shtype: 5,
		wiftype: 128,
		txfee: 10000,
		electrumServers: [
			{
				host: 'elex01-ams.turinex.eu',
				port: 50001,
			},
			{
				host: '95.85.35.152',
				port: 50001,
			},
		],
	},
	{
		coin: 'MONA',
		rpcport: 9402,
		pubtype: 50,
		p2shtype: 5,
		wiftype: 176,
		txfee: 100000,
		electrumServers: [
			{
				host: 'electrumx1.monacoin.nl',
				port: 50001,
			},
			{
				host: 'electrumx2.monacoin.nl',
				port: 50001,
			},
			{
				host: 'electrumx1.monacoin.ninja',
				port: 50001,
			},
			{
				host: 'electrumx2.monacoin.ninja',
				port: 50001,
			},
		],
	},
	{
		coin: 'MORTY',
		name: 'Morty [Test]',
		asset: 'MORTY',
		rpcport: 63812,
		mm2: 1,
		electrumServers: [
			{
				host: 'electrum1.cipig.net',
				port: 10018,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10018,
			},
			{
				host: 'electrum3.cipig.net',
				port: 10018,
			},
		],
	},
	{
		coin: 'MSHARK',
		name: 'MiliShark',
		asset: 'MSHARK',
		rpcport: 8846,
		electrumServers: [
			{
				host: 'electrum1.cipig.net',
				port: 10013,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10013,
			},
			{
				host: 'electrum3.cipig.net',
				port: 10013,
			},
		],
	},
	{
		coin: 'MTL',
		name: 'Metal',
		contractAddress: '0xF433089366899D83a9f26A773D59ec7eCF30355e',
		rpcport: 80,
	},
	{
		coin: 'MYB',
		name: 'MyBit Token',
		contractAddress: '0x5d60d8d7ef6d37e16ebabc324de3be57f135e0bc',
		rpcport: 80,
	},
	{
		coin: 'MYTH',
		name: 'Unicoin',
		decimals: 18,
		contractAddress: '0x277ab4b9dde09a8e710fd755deeb9d0d9532d047',
		rpcport: 80,
	},
	{
		coin: 'NAS',
		name: 'Nebulas',
		contractAddress: '0x5d65d971895edc438f465c17db6992698a52318d',
		rpcport: 80,
	},
	{
		coin: 'NET',
		name: 'Nimiq',
		contractAddress: '0xcfb98637bcae43C13323EAa1731cED2B716962fD',
		rpcport: 80,
	},
	{
		coin: 'NMC',
		rpcport: 8336,
		pubtype: 52,
		p2shtype: 13,
		wiftype: 180,
		txfee: 100000,
		electrumServers: [
			{
				host: 'nmc.bitcoins.sk',
				port: 50002,
			},
			{
				host: 'electrum-nmc.le-space.de',
				port: 50002,
			},
			{
				host: 'ulrichard.ch',
				port: 50006,
			},
		],
	},
	{
		coin: 'NMR',
		name: 'Numeraire',
		contractAddress: '0x1776e1F26f98b1A5dF9cD347953a26dd3Cb46671',
		rpcport: 80,
	},
	{
		coin: 'NOAH',
		name: 'Noah Coin',
		contractAddress: '0x58a4884182d9e835597f405e5f258290e46ae7c2',
		rpcport: 80,
	},
	{
		coin: 'OCC',
		name: 'Original Crypto Coin',
		contractAddress: '0x0235fe624e044a05eed7a43e16e3083bc8a4287a',
		rpcport: 80,
	},
	{
		coin: 'OCT',
		name: 'Octus',
		contractAddress: '0x7e9d365C0C97Fe5FcAdcc1B513Af974b768C5867',
		rpcport: 80,
	},
	{
		coin: 'OMG',
		name: 'OmiseGo',
		contractAddress: '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07',
		rpcport: 80,
	},
	{
		coin: 'ONNI',
		name: 'Misericordae',
		contractAddress: '0xbd9c6028e1132a6b52f1ca15c0933a2fd342e21f',
		rpcport: 80,
	},
	{
		coin: 'OOT',
		name: 'Utrum',
		asset: 'OOT',
		rpcport: 12467,
		electrumServers: [
			{
				host: 'electrum1.utrum.io',
				port: 10088,
			},
			{
				host: 'electrum2.utrum.io',
				port: 10088,
			},
		],
	},
	{
		coin: 'PANGEA',
		name: 'Pangea Poker',
		asset: 'PANGEA',
		rpcport: 14068,
		electrumServers: [
			{
				host: 'electrum1.cipig.net',
				port: 10010,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10010,
			},
			{
				host: 'electrum3.cipig.net',
				port: 10010,
			},
		],
	},
	{
		coin: 'PAT',
		name: 'Pangea Arbitration Token',
		contractAddress: '0xBB1fA4FdEB3459733bF67EbC6f893003fA976a82',
		rpcport: 80,
	},
	{
		coin: 'PAY',
		name: 'TenX',
		contractAddress: '0xB97048628DB6B661D4C2aA833e95Dbe1A905B280',
		rpcport: 80,
	},
	{
		coin: 'PCL',
		name: 'Peculium',
		contractAddress: '0x3618516f45cd3c913f81f9987af41077932bc40d',
		rpcport: 80,
	},
	{
		coin: 'PUNGO',
		name: 'Pungo Token',
		asset: 'PGT',
		rpcport: 46705,
		electrumServers: [
			{
				host: 'electrum1.pungo.cloud',
				port: 10002,
			},
			{
				host: 'electrum2.pungo.cloud',
				port: 10002,
			},
		],
	},
	{
		coin: 'PLU',
		name: 'Pluton',
		contractAddress: '0xD8912C10681D8B21Fd3742244f44658dBA12264E',
		rpcport: 80,
	},
	{
		coin: 'POLY',
		name: 'Polymath',
		contractAddress: '0x9992ec3cf6a55b00978cddf2b27bc6882d88d1ec',
		rpcport: 80,
	},
	{
		coin: 'POWR',
		name: 'Power Ledger',
		contractAddress: '0x595832f8fc6bf59c85c527fec3740a1b7a361269',
		rpcport: 80,
	},
	{
		coin: 'PPT',
		name: 'Populous',
		contractAddress: '0xd4fa1460F537bb9085d22C7bcCB5DD450Ef28e3a',
		rpcport: 80,
	},
	{
		coin: 'PRL',
		name: 'Oyster',
		contractAddress: '0x1844b21593262668b7248d0f57a220caaba46ab9',
		rpcport: 80,
	},
	{
		coin: 'PURC',
		name: 'Peurcoin',
		contractAddress: '0x7148b80b38278853ca8263cfc0b57d4478ae6a6e',
		rpcport: 80,
	},
	{
		coin: 'PXT',
		name: 'Populous XBRL Token',
		contractAddress: '0xc14830e53aa344e8c14603a91229a0b925b0b262',
		rpcport: 80,
	},
	{
		coin: 'RICK',
		name: 'Rick [Test]',
		asset: 'RICK',
		rpcport: 28223,
		mm2: 1,
		electrumServers: [
			{
				host: 'electrum1.cipig.net',
				port: 10017,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10017,
			},
			{
				host: 'electrum3.cipig.net',
				port: 10017,
			},
		],
	},
	{
		coin: 'QASH',
		name: 'Qash',
		contractAddress: '0x618E75Ac90b12c6049Ba3b27f5d5F8651b0037F6',
		rpcport: 80,
	},
	{
		coin: 'QBIT',
		name: 'Qubitica',
		contractAddress: '0x1602af2C782cC03F9241992E243290Fccf73Bb13',
		rpcport: 80,
	},
	{
		coin: 'QSP',
		name: 'Quantstamp',
		contractAddress: '0x99ea4dB9EE77ACD40B119BD1dC4E33e1C070b80d',
		rpcport: 80,
	},
	{
		coin: 'QTUM',
		rpcport: 3889,
		pubtype: 58,
		p2shtype: 50,
		wiftype: 128,
		txfee: 400000,
		electrumServers: [
			{
				host: 's1.qtum.info',
				port: 50001,
			},
			{
				host: 's2.qtum.info',
				port: 50001,
			},
			{
				host: 's3.qtum.info',
				port: 50001,
			},
			{
				host: 's4.qtum.info',
				port: 50001,
			},
			{
				host: 's5.qtum.info',
				port: 50001,
			},
			{
				host: 's6.qtum.info',
				port: 50001,
			},
			{
				host: 's7.qtum.info',
				port: 50001,
			},
			{
				host: 's8.qtum.info',
				port: 50001,
			},
			{
				host: 's9.qtum.info',
				port: 50001,
			},
		],
	},
	{
		coin: 'R',
		name: 'Revain',
		contractAddress: '0x48f775efbe4f5ece6e0df2f7b5932df56823b990',
		rpcport: 80,
	},
	{
		coin: 'RCN',
		name: 'Ripio Credit Network',
		contractAddress: '0xF970b8E36e23F7fC3FD752EeA86f8Be8D83375A6',
		rpcport: 80,
	},
	{
		coin: 'RDN',
		name: 'Raiden Network Token',
		contractAddress: '0x255Aa6DF07540Cb5d3d297f0D0D4D84cb52bc8e6',
		rpcport: 80,
	},
	{
		coin: 'REP',
		name: 'Augur',
		contractAddress: '0xE94327D07Fc17907b4DB788E5aDf2ed424adDff6',
		rpcport: 80,
	},
	{
		coin: 'REQ',
		name: 'Request Network',
		contractAddress: '0x8f8221aFbB33998d8584A2B05749bA73c37a938a',
		rpcport: 80,
	},
	{
		coin: 'REVS',
		name: 'Revs',
		asset: 'REVS',
		rpcport: 10196,
		electrumServers: [
			{
				host: 'electrum1.cipig.net',
				port: 10003,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10003,
			},
			{
				host: 'electrum3.cipig.net',
				port: 10003,
			},
		],
	},
	{
		coin: 'RHOC',
		name: 'RChain',
		contractAddress: '0x168296bb09e24a88805cb9c33356536b980d3fc5',
		rpcport: 80,
	},
	{
		coin: 'RLC',
		name: 'iExec RLC',
		contractAddress: '0x607F4C5BB672230e8672085532f7e901544a7375',
		rpcport: 80,
	},
	{
		coin: 'RLTY',
		name: 'SMARTRealty',
		contractAddress: '0xbe99b09709fc753b09bcf557a992f6605d5997b0',
		rpcport: 80,
	},
	{
		coin: 'RVT',
		name: 'Rivetz',
		contractAddress: '0x3d1ba9be9f66b8ee101911bc36d3fb562eac2244',
		rpcport: 80,
	},
	{
		coin: 'SALT',
		name: 'Salt',
		contractAddress: '0x4156D3342D5c385a87D264F90653733592000581',
		rpcport: 80,
	},
	{
		coin: 'SAN',
		name: 'Santiment',
		contractAddress: '0x7C5A0CE9267ED19B22F8cae653F198e3E8daf098',
		rpcport: 80,
	},
	{
		coin: 'SANC',
		name: 'Sancoj',
		contractAddress: '0x03ec7bb59be036870ef696a2abf124f496d6735a',
		rpcport: 80,
	},
	{
		coin: 'SIB',
		rpcport: 1944,
		pubtype: 63,
		p2shtype: 40,
		wiftype: 128,
		txfee: 10000,
		electrumServers: [
			{
				host: 'electrum1.cipig.net',
				port: 10050,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10050,
			},
			{
				host: 'electrum3.cipig.net',
				port: 10050,
			},
		],
	},
	{
		coin: 'SMART',
		rpcport: 9679,
		pubtype: 63,
		p2shtype: 18,
		wiftype: 191,
		txfee: 200000,
		electrumServers: [
			{
				host: 'electrum1.smartcash.cc',
				port: 50001,
			},
			{
				host: 'electrum2.smartcash.cc',
				port: 50001,
			},
			{
				host: 'electrum3.smartcash.cc',
				port: 50001,
			},
			{
				host: 'electrum4.smartcash.cc',
				port: 50001,
			},
			{
				host: 'electrum5.smartcash.cc',
				port: 50001,
			},
			{
				host: 'electrum6.smartcash.cc',
				port: 50001,
			},
		],
	},
	{
		coin: 'SNGLS',
		name: 'SingularDTV',
		contractAddress: '0xaeC2E87E0A235266D9C5ADc9DEb4b2E29b54D009',
		rpcport: 80,
	},
	{
		coin: 'SNT',
		name: 'Status',
		contractAddress: '0x744d70FDBE2Ba4CF95131626614a1763DF805B9E',
		rpcport: 80,
	},
	{
		coin: 'SPANK',
		name: 'SpankChain',
		contractAddress: '0x42d6622dece394b54999fbd73d108123806f6a18',
		rpcport: 80,
	},
	{
		coin: 'SRN',
		name: 'SIRIN LABS Token',
		contractAddress: '0x68d57c9a1c35f63e2c83ee8e49a64e9d70528d25',
		rpcport: 80,
	},
	{
		coin: 'STORJ',
		name: 'Storj',
		contractAddress: '0xB64ef51C888972c908CFacf59B47C1AfBC0Ab8aC',
		rpcport: 80,
	},
	{
		coin: 'STORM',
		name: 'Storm',
		contractAddress: '0xd0a4b8946cb52f0661273bfbc6fd0e0c75fc6433',
		rpcport: 80,
	},
	{
		coin: 'STRM41',
		name: 'Stream41',
		contractAddress: '0xbad7a7f7ba71ce3659fe6dcad34af86b9de2a4b2',
		rpcport: 80,
	},
	{
		coin: 'STWY',
		name: 'StorweeyToken',
		contractAddress: '0x8a8c71f032362fca2994f75d854f911ec381ac5a',
		rpcport: 80,
	},
	{
		coin: 'SUB',
		name: 'Substratum',
		contractAddress: '0x8D75959f1E61EC2571aa72798237101F084DE63a',
		rpcport: 80,
	},
	{
		coin: 'SUPERNET',
		name: 'Supernet',
		asset: 'SUPERNET',
		rpcport: 11341,
		electrumServers: [
			{
				host: 'electrum1.cipig.net',
				port: 10005,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10005,
			},
			{
				host: 'electrum3.cipig.net',
				port: 10005,
			},
		],
	},
	{
		coin: 'SWT',
		name: 'Swarm City',
		contractAddress: '0xB9e7F8568e08d5659f5D29C4997173d84CdF2607',
		rpcport: 80,
	},
	{
		coin: 'TAAS',
		name: 'TaaS',
		contractAddress: '0xE7775A6e9Bcf904eb39DA2b68c5efb4F9360e08C',
		rpcport: 80,
	},
	{
		coin: 'TIME',
		name: 'Chronobank',
		contractAddress: '0x6531f133e6DeeBe7F2dcE5A0441aA7ef330B4e53',
		rpcport: 80,
	},
	{
		coin: 'TKN',
		name: 'TokenCard',
		contractAddress: '0xaAAf91D9b90dF800Df4F55c205fd6989c977E73a',
		rpcport: 80,
	},
	{
		coin: 'TRST',
		name: 'Trust',
		contractAddress: '0xCb94be6f13A1182E4A4B6140cb7bf2025d28e41B',
		rpcport: 80,
	},
	{
		coin: 'TUSD',
		name: 'TrueUSD',
		contractAddress: '0x0000000000085d4780B73119b644AE5ecd22b376',
		rpcport: 80,
	},
	{
		coin: 'UCASH',
		name: 'U.CASH',
		contractAddress: '0x92e52a1a235d9a103d970901066ce910aacefd37',
		rpcport: 80,
	},
	{
		coin: 'USDT',
		name: 'Tether',
		contractAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
		rpcport: 80,
	},
	{
		coin: 'VRSC',
		name: 'VerusCoin',
		asset: 'VRSC',
		rpcport: 27486,
		txversion: 4,
		electrumServers: [
			{
				host: 'el0.vrsc.0x03.services',
				port: 10000,
			},
			{
				host: 'el1.vrsc.0x03.services',
				port: 10000,
			},
			{
				host: 'el2.vrsc.0x03.services',
				port: 10000,
			},
		],
	},
	{
		coin: 'VSL',
		name: 'vSlice',
		contractAddress: '0x5c543e7AE0A1104f78406C340E9C64FD9fCE5170',
		decimals: 18,
		rpcport: 80,
	},
	{
		coin: 'VTC',
		rpcport: 5888,
		pubtype: 71,
		p2shtype: 5,
		wiftype: 128,
		txfee: 100000,
		electrumServers: [
			{
				host: 'fr1.vtconline.org',
				port: 55001,
			},
			{
				host: 'uk1.vtconline.org',
				port: 55001,
			},
			{
				host: 'vtc-cce-1.coinomi.net',
				port: 5028,
			},
			{
				host: 'vtc-cce-2.coinomi.net',
				port: 5028,
			},
		],
	},
	{
		coin: 'WAX',
		name: 'WAX',
		contractAddress: '0x39Bb259F66E1C59d5ABEF88375979b4D20D98022',
		rpcport: 80,
	},
	{
		coin: 'WINGS',
		name: 'Wings',
		contractAddress: '0x667088b212ce3d06a1b553a7221E1fD19000d9aF',
		rpcport: 80,
	},
	{
		coin: 'WLC',
		name: 'Wireless Coin',
		asset: 'WLC',
		rpcport: 12167,
		electrumServers: [
			{
				host: 'electrum1.cipig.net',
				port: 10014,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10014,
			},
			{
				host: 'electrum3.cipig.net',
				port: 10014,
			},
		],
	},
	{
		coin: 'WTC',
		name: 'Waltonchain',
		contractAddress: '0xb7cb1c96db6b22b0d3d9536e0108d062bd488f74',
		rpcport: 80,
	},
	{
		coin: 'XAUR',
		name: 'Xarum',
		contractAddress: '0x4DF812F6064def1e5e029f1ca858777CC98D2D81',
		rpcport: 80,
	},
	{
		coin: 'XOV',
		name: 'XOVBank',
		contractAddress: '0x153eD9CC1b792979d2Bde0BBF45CC2A7e436a5F9',
		rpcport: 80,
	},
	{
		coin: 'XZC',
		rpcport: 8888,
		pubtype: 82,
		p2shtype: 7,
		wiftype: 210,
		txfee: 10000,
		electrumServers: [
			{
				host: 'electrumx.zcoin.io',
				port: 50001,
			},
			{
				host: 'electrumx02.zcoin.io',
				port: 50001,
			},
			{
				host: 'electrumx03.zcoin.io',
				port: 50001,
			},
		],
	},
	{
		coin: 'ZEC',
		rpcport: 8232,
		taddr: 28,
		pubtype: 184,
		p2shtype: 189,
		wiftype: 128,
		txversion: 4,
		txfee: 10000,
		electrumServers: [
			{
				host: 'electrum1.cipig.net',
				port: 10058,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10058,
			},
			{
				host: 'electrum3.cipig.net',
				port: 10058,
			},
		],
	},
	{
		coin: 'ZIL',
		name: 'Zilliqa',
		contractAddress: '0x05f4a42e251f2d52b8ed15e9fedaacfcef1fad27',
		rpcport: 80,
	},
	{
		coin: 'ZILLA',
		name: 'ChainZilla',
		asset: 'ZILLA',
		rpcport: 10041,
		electrumServers: [
			{
				host: 'electrum1.cipig.net',
				port: 10028,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10028,
			},
			{
				host: 'electrum3.cipig.net',
				port: 10028,
			},
		],
	},
	{
		coin: 'ZRX',
		name: '0x',
		contractAddress: '0xE41d2489571d322189246DaFA5ebDe1F4699F498',
		rpcport: 80,
	},
];

// TODO: Update the `mm2` compatibility info for individual currencies
for (const currency of supportedCurrencies) {
	currency.mm2 = 1;
}

const getCurrencySymbols = () => (
	_(supportedCurrencies)
		.chain()
		.map('coin')
		.without(...hiddenCurrencies)
		.orderBy()
		.value()
);

const getCurrencyName = symbol => {
	const coinParams = supportedCurrencies.find(currency => currency.coin === symbol);

	return coinParams.name || coinlist.get(symbol, 'name') || symbol;
};

const getCurrency = symbol => supportedCurrencies.find(currency => currency.coin === symbol);

const isEthBased = symbol => {
	const currency = getCurrency(symbol);

	if (!currency) {
		throw new Error(`Unsupported currency: ${symbol}`);
	}

	return currency.contractAddress;
};

module.exports = {
	supportedCurrencies,
	getCurrencySymbols,
	getCurrencyName,
	getCurrency,
	isEthBased,
};
