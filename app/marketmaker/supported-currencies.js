'use strict';

const coinlist = require('coinlist');
const _ = require('lodash');

/*
Info:
We use the `name` property only when the currency is not on `coinmarketcap.com`.
*/

const supportedCurrencies = [
	{
		coin: 'ARG',
		rpcport: 13581,
		pubtype: 23,
		p2shtype: 5,
		wiftype: 151,
		txfee: 50000,
		electrumServers: [
			{
				host: 'electrum1.cipig.net',
				port: 10068,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10068,
			},
		],
	},
	{
		coin: 'BCBC',
		name: 'Bitcoin@CBC',
		rpcport: 8340,
		pubtype: 0,
		p2shtype: 5,
		wiftype: 128,
		txfee: 10000,
		electrumServers: [
			{
				host: 'bsmn0.cleanblockchain.io',
				port: 50001,
			},
			{
				host: 'bsmn1.cleanblockchain.org',
				port: 50001,
			},
		],
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
				host: 'electrum1.cipig.net',
				port: 10051,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10051,
			},
		],
	},
	{
		coin: 'BEER',
		name: 'Beer',
		asset: 'BEER',
		rpcport: 8923,
		electrumServers: [
			{
				host: 'electrum1.cipig.net',
				port: 10022,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10022,
			},
		],
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
		],
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
		],
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
		],
	},
	{
		coin: 'BTCP',
		rpcport: 7932,
		taddr: 19,
		pubtype: 37,
		p2shtype: 175,
		wiftype: 128,
		txfee: 10000,
		electrumServers: [
			{
				host: 'electrum.btcprivate.org',
				port: 5222,
			},
			{
				host: 'electrum2.btcprivate.org',
				port: 5222,
			},
		],
	},
	{
		coin: 'BTCZ',
		rpcport: 1979,
		taddr: 28,
		pubtype: 184,
		p2shtype: 189,
		wiftype: 128,
		txfee: 10000,
		electrumServers: [
			{
				host: 'electrum1.cipig.net',
				port: 10056,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10056,
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
				host: '173.212.225.176',
				port: 10052,
			},
			{
				host: '94.130.224.11',
				port: 10052,
			},
		],
	},
	{
		coin: 'BTX',
		rpcport: 8556,
		pubtype: 0,
		p2shtype: 5,
		wiftype: 128,
		txfee: 50000,
		electrumServers: [
			{
				host: 'electrum1.cipig.net',
				port: 10057,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10057,
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
		],
	},
	{
		coin: 'CRW',
		rpcport: 9341,
		pubtype: 0,
		p2shtype: 28,
		wiftype: 128,
		txfee: 10000,
		electrumServers: [
			{
				host: 'electrum1.cipig.net',
				port: 10069,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10069,
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
		],
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
		],
	},
	{
		coin: 'DNR',
		isPoS: 1,
		rpcport: 32339,
		pubtype: 30,
		p2shtype: 90,
		wiftype: 158,
		txfee: 10000,
		electrumServers: [
			{
				host: '144.202.95.223',
				port: 50001,
			},
			{
				host: '45.77.137.111',
				port: 50001,
			},
		],
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
		],
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
		],
	},
	{
		coin: 'FAIR',
		rpcport: 40405,
		pubtype: 95,
		p2shtype: 36,
		wiftype: 223,
		txfee: 1000000,
		electrumServers: [
			{
				host: 'electrum1.cipig.net',
				port: 10063,
			},
			{
				host: 'electrum2.cipig.net',
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
		],
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
		],
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
		],
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
		],
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
		],
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
				host: 'electrum1.cipig.net',
				port: 10065,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10065,
			},
		],
	},
	{
		coin: 'MNZ',
		name: 'Monaize',
		asset: 'MNZ',
		rpcport: 14337,
		electrumServers: [
			{
				host: 'electrum1.cipig.net',
				port: 10002,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10002,
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
				host: 'electrum1.cipig.net',
				port: 10070,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10070,
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
		],
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
				host: 'electrum1.cipig.net',
				port: 10066,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10066,
			},
		],
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
		],
	},
	{
		coin: 'PIZZA',
		name: 'Pizza',
		asset: 'PIZZA',
		rpcport: 11116,
		electrumServers: [
			{
				host: 'electrum1.cipig.net',
				port: 10024,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10024,
			},
		],
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
		],
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
		],
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
		],
	},
	{
		coin: 'XSG',
		name: 'SnowGem',
		rpcport: 16112,
		taddr: 28,
		pubtype: 40,
		p2shtype: 45,
		wiftype: 128,
		txfee: 10000,
		electrumServers: [
			{
				host: '45.77.254.232',
				port: 10001,
			},
			{
				host: '128.199.233.38',
				port: 10001,
			},
		],
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
		],
	},
	{
		coin: 'VIA',
		rpcport: 5222,
		pubtype: 71,
		p2shtype: 33,
		wiftype: 199,
		txfee: 100000,
		electrumServers: [
			{
				host: 'electrum1.cipig.net',
				port: 10067,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10067,
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
				host: 'electrum1.cipig.net',
				port: 10071,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10071,
			},
		],
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
		],
	},
	{
		coin: 'ZCL',
		rpcport: 8023,
		taddr: 28,
		pubtype: 184,
		p2shtype: 189,
		wiftype: 128,
		txfee: 1000,
		electrumServers: [
			{
				host: 'electrum1.cipig.net',
				port: 10055,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10055,
			},
		],
	},
	{
		coin: 'ZEC',
		active: 0,
		rpcport: 8232,
		taddr: 28,
		pubtype: 184,
		p2shtype: 189,
		wiftype: 128,
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
		],
	},
];

const getCurrencySymbols = () => _.orderBy(supportedCurrencies.map(currency => currency.coin));

const getCurrencyName = symbol => {
	const coinParams = supportedCurrencies.find(currency => currency.coin === symbol);

	return coinParams.name || coinlist.get(symbol, 'name') || symbol;
};

const getCurrency = symbol => supportedCurrencies.find(currency => currency.coin === symbol);

module.exports = {
	supportedCurrencies,
	getCurrencySymbols,
	getCurrencyName,
	getCurrency,
};
