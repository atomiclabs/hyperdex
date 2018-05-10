'use strict';

const supportedCurrencies = [
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
		coin: 'BTC',
		electrumServers: [
			{
				host: 'electrum.hsmiths.com',
				port: 50001,
			},
			{
				host: 'helicarrier.bauerj.eu',
				port: 50001,
			},
		],
	},
	{
		coin: 'REVS',
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
		coin: 'SUPERNET',
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
		coin: 'CHIPS',
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
		coin: 'VTC',
		rpcport: 5888,
		pubtype: 71,
		p2shtype: 5,
		wiftype: 128,
		txfee: 100000,
		electrumServers: [
			{
				host: '173.212.225.176',
				port: 50088,
			},
			{
				host: '136.243.45.140',
				port: 50088,
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
				host: '173.212.225.176',
				port: 50012,
			},
			{
				host: '136.243.45.140',
				port: 50012,
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
				host: '173.212.225.176',
				port: 10060,
			},
			{
				host: '136.243.45.140',
				port: 10060,
			},
		],
	},
];

module.exports = supportedCurrencies;
