/* eslint-disable camelcase */
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
		contractAddress: '0x5CA9a71B1d01849C0a95490Cc00559717fCF0D1d',
		rpcport: 80,
	},
	{
		coin: 'AMB',
		name: 'Ambrosus',
		contractAddress: '0x4DC3643DbC642b72C158E7F3d2ff232df61cb6CE',
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
		coin: 'BET',
		asset: 'BET',
		fname: 'BET',
		name: "BET",
		rpcport: 14250,
		txversion: 4,
		overwintered: 1,
		required_confirmations: 2,
		electrumServers: [
			{
				host: 'electrum1.cipig.net',
				port: 10012,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10012,
			},
			{
				host: 'electrum3.cipig.net',
				port: 10012,
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
		txversion: 4,
		overwintered: 1,
		required_confirmations: 2,
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
		coin: 'BTC',
		rpcport: 8332,
		pubtype: 0,
		p2shtype: 5,
		wiftype: 128,
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
		txversion: 4,
		overwintered: 1,
		required_confirmations: 2,
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
		coin: 'BTM',
		name: 'Bytom',
		contractAddress: '0xcB97e65F07DA24D46BcDD078EBebd7C6E6E3d750',
		rpcport: 80,
	},
	{
		coin: 'BUSD',
		name: 'Binance USD',
		contractAddress: '0x4Fabb145d64652a948d72533023f6E7A623C7C53',
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
		contractAddress: '0x1122B6a0E00DCe0563082b6e2953f3A943855c1F',
		rpcport: 80,
	},
	{
		coin: 'CHAIN',
		name: 'Chainmakers',
		asset: 'CHAIN',
		rpcport: 15587,
		txversion: 4,
		overwintered: 1,
		required_confirmations: 2,
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
		coin: 'CCL',
		name: 'CoinCollect',
		asset: 'CCL',
		rpcport: 20849,
		txversion: 4,
		overwintered: 1,
		required_confirmations: 2,
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
		coin: 'COMMOD',
		name: 'COMMOD',
		asset: 'COMMOD',
		rpcport: 27048,
		txversion: 4,
		overwintered: 1,
		required_confirmations: 2,
		electrumServers: [
			{
				host: 'electrum1.cipig.net',
				port: 10022,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10022,
			},
			{
				host: 'electrum3.cipig.net',
				port: 10022,
			},
		]
	},
	{
		coin: 'COQUI',
		name: 'Coqui Cash',
		asset: 'COQUICASH',
		rpcport: 19712,
		txversion: 4,
		overwintered: 1,
		required_confirmations: 2,
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
		txversion: 4,
		overwintered: 1,
		required_confirmations: 2,
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
		contractAddress: '0x46b9Ad944d1059450Da1163511069C718F699D31',
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
		contractAddress: '0x0Cf0Ee63788A0849fE5297F3407f701E122cC023',
		rpcport: 80,
	},
	{
		coin: 'DCN',
		name: 'Dentacoin',
		contractAddress: '0x08d32b0da63e2C3bcF8019c9c5d849d7a9d791e6',
		rpcport: 80,
	},
	{
		coin: 'DEX',
		name: 'DEX',
		asset: 'DEX',
		rpcport: 11890,
		txversion: 4,
		overwintered: 1,
		required_confirmations: 2,
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
		p2shtype: 63,
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
		txfee: 500000000,
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
		contractAddress: '0xf0Ee6b27b759C9893Ce4f094b49ad28fd15A23e4',
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
		coin: 'FSN',
		name: 'Fusion',
		contractAddress: '0xD0352a019e9AB9d757776F532377aAEbd36Fd541',
		rpcport: 80,
	},
	{
		coin: 'FUN',
		name: 'FunFair',
		contractAddress: '0x419D0d8BdD9aF5e606Ae2232ed285Aff190E711b',
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
		coin: 'GIN',
		name: 'Gincoin',
		fname: 'GINcoin',
		rpcport: 10211,
		pubtype: 38,
		p2shtype: 10,
		wiftype: 198,
		txfee: 10000,
		electrumServers: [
			{
				host: 'electrum2.gincoin.io',
				port: 6001,
			},
		]
	},
	{
		coin: 'GNO',
		name: 'Gnosis',
		contractAddress: '0x6810e776880C02933D47DB1b9fc05908e5386b96',
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
		contractAddress: '0xC5bBaE50781Be1669306b9e001EFF57a2957b09d',
		rpcport: 80,
	},
	{
		coin: 'GUSD',
		name: 'Gemini dollar',
		decimals: 2,
		contractAddress: '0x056Fd409E1d7A124BD7017459dFEa2F387b6d5Cd',
		rpcport: 80,
	},
	{
		coin: 'HODL',
		asset: 'HODL',
		name: 'HODL',
		rpcport: 14431,
		txversion: 4,
		overwintered: 1,
		required_confirmations: 2,
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
		coin: 'HUSH',
		asset: 'HUSH3',
		fname: 'Hush',
		rpcport: 18031,
		txversion: 4,
		overwintered: 1,
		mm2: 1,
		required_confirmations: 2,
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
		coin: 'IOST',
		name: 'IOST',
		contractAddress: '0xFA1a856Cfa3409CFa145Fa4e20Eb270dF3EB21ab',
		rpcport: 80,
	},
	{
		coin: 'JUMBLR',
		name: 'Jumblr',
		asset: 'JUMBLR',
		active: 0,
		rpcport: 15106,
		txversion: 4,
		overwintered: 1,
		required_confirmations: 2,
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
		contractAddress: '0x818Fc6C2Ec5986bc6E2CBf00939d90556aB12ce5',
		rpcport: 80,
	},
	{
		coin: 'KMD',
		rpcport: 7771,
		pubtype: 60,
		p2shtype: 85,
		wiftype: 188,
		txversion: 4,
		overwintered: 1,
		txfee: 1000,
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
		coin: 'LABS',
		name: 'LABS',
		fname: 'Komodo LABS',
		rpcport: 40265,
		txversion: 4,
		overwintered: 1,
		required_confirmations: 2,
		electrumServers: [
			{
				host: 'electrum1.cipig.net',
				port: 10019,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10019,
			},
			{
				host: 'electrum3.cipig.net',
				port: 10019,
			},
		]
	},
	{
		coin: 'LINK',
		name: 'ChainLink',
		contractAddress: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
		rpcport: 80,
	},
	{
		coin: 'LOOM',
		name: 'Loom Network',
		contractAddress: '0xA4e8C3Ec456107eA67d3075bF9e3DF3A75823DB0',
		rpcport: 80,
	},
	{
		coin: 'LRC',
		name: 'Loopring',
		contractAddress: '0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD',
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
		coin: 'MGW',
		name: 'MGW',
		fname: 'MultiGateway',
		rpcport: 12386,
		txversion: 4,
		overwintered: 1,
		required_confirmations: 2,
		electrumServers: [
			{
				host: 'electrum1.cipig.net',
				port: 10015,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10015,
			},
			{
				host: 'electrum3.cipig.net',
				port: 10015,
			},
		],
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
		contractAddress: '0xe7C33a0E04F2316Bb321C4AD2976873d09538B56',
		rpcport: 80,
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
		rpcport: 16348,
		txversion: 4,
		overwintered: 1,
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
		txversion: 4,
		overwintered: 1,
		required_confirmations: 2,
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
		coin: 'NAS',
		name: 'Nebulas',
		contractAddress: '0x5d65D971895Edc438f465c17DB6992698a52318D',
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
		contractAddress: '0x58a4884182d9E835597f405e5F258290E46ae7C2',
		rpcport: 80,
	},
	{
		coin: 'OMG',
		name: 'OmiseGo',
		contractAddress: '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07',
		rpcport: 80,
	},
	{
		coin: 'OOT',
		name: 'Utrum',
		asset: 'OOT',
		rpcport: 12467,
		required_confirmations: 2,
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
		txversion: 4,
		overwintered: 1,
		required_confirmations: 2,
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
		coin: 'PAY',
		name: 'TenX',
		contractAddress: '0xB97048628DB6B661D4C2aA833e95Dbe1A905B280',
		rpcport: 80,
	},
	{
		coin: 'PUNGO',
		name: 'Pungo Token',
		asset: 'PGT',
		rpcport: 46705,
		txversion: 4,
		overwintered: 1,
		required_confirmations: 2,
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
		coin: 'POLY',
		name: 'Polymath',
		contractAddress: '0x9992eC3cF6A55b00978cdDF2b27BC6882d88D1eC',
		rpcport: 80,
	},
	{
		coin: 'POWR',
		name: 'Power Ledger',
		contractAddress: '0x595832F8FC6BF59c85C527fEC3740A1b7a361269',
		rpcport: 80,
	},
	{
		coin: 'PPT',
		name: 'Populous',
		contractAddress: '0xd4fa1460F537bb9085d22C7bcCB5DD450Ef28e3a',
		rpcport: 80,
	},
	{
		coin: 'RICK',
		name: 'Rick [Test]',
		asset: 'RICK',
		rpcport: 25435,
		txversion: 4,
		overwintered: 1,
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
		contractAddress: '0x48f775EFBE4F5EcE6e0DF2f7b5932dF56823B990',
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
		txversion: 4,
		overwintered: 1,
		required_confirmations: 2,
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
		contractAddress: '0x168296bb09e24A88805CB9c33356536B980D3fC5',
		rpcport: 80,
	},
	{
		coin: 'RLC',
		name: 'iExec RLC',
		contractAddress: '0x607F4C5BB672230e8672085532f7e901544a7375',
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
		coin: 'STORJ',
		name: 'Storj',
		contractAddress: '0xB64ef51C888972c908CFacf59B47C1AfBC0Ab8aC',
		rpcport: 80,
	},
	{
		coin: 'STORM',
		name: 'Storm',
		contractAddress: '0xD0a4b8946Cb52f0661273bfbC6fD0E0C75Fc6433',
		rpcport: 80,
	},
	{
		coin: 'SUPERNET',
		name: 'Supernet',
		asset: 'SUPERNET',
		rpcport: 11341,
		txversion: 4,
		overwintered: 1,
		required_confirmations: 2,
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
		coin: 'TUSD',
		name: 'TrueUSD',
		contractAddress: '0x0000000000085d4780B73119b644AE5ecd22b376',
		rpcport: 80,
	},
	{
		coin: 'USDC',
		fname: 'USD Coin',
		contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
		rpcport: 80,
	},
	// Temporarily disabled as it's not working with mm2
	// {
	// 	coin: 'USDT',
	// 	name: 'Tether',
	// 	contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
	// 	rpcport: 80,
	// },
	{
		coin: 'VRSC',
		name: 'VerusCoin',
		asset: 'VRSC',
		rpcport: 27486,
		txversion: 4,
		overwintered: 1,
		required_confirmations: 2,
		electrumServers: [
			// TODO: check in with 0x03 on VRSC discord to replace, use cipi in meantime
			// {
			// 	host: 'el0.vrsc.0x03.services',
			// 	port: 10000,
			// },
			// {
			// 	host: 'el1.vrsc.0x03.services',
			// 	port: 10000,
			// },
			// {
			// 	host: 'el2.vrsc.0x03.services',
			// 	port: 10000,
			// },
			{
				host: 'electrum1.cipig.net',
				port: 10021
			},
			{
				host: 'electrum2.cipig.net',
				port: 10021
			},
			{
				host: 'electrum3.cipig.net',
				port: 10021
			},
		],
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
		coin: 'WLC',
		name: 'Wireless Coin',
		asset: 'WLC',
		rpcport: 12167,
		txversion: 4,
		overwintered: 1,
		required_confirmations: 2,
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
		contractAddress: '0xb7cB1C96dB6B22b0D3d9536E0108d062BD488F74',
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
		overwintered: 1,
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
		contractAddress: '0x05f4a42e251f2d52b8ed15E9FEdAacFcEF1FAD27',
		rpcport: 80,
	},
	{
		coin: 'ZILLA',
		name: 'ChainZilla',
		asset: 'ZILLA',
		rpcport: 10041,
		required_confirmations: 2,
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
