'use strict';

const coinlist = require('coinlist');
const _ = require('lodash');

/*
Info:
We use the `name` property only when the currency is not on `coinmarketcap.com`.
*/

const supportedCurrencies = [
	{
		coin: '1ST',
		etomic: '0xAf30D2a7E90d7DC361c8C4585e9BB7D2F6f15bc7',
		rpcport: 80,
	},
	{
		coin: 'ADT',
		etomic: '0xD0D6D6C5Fe4a677D343cC433536BB717bAe167dD',
		rpcport: 80,
	},
	{
		coin: 'AE',
		etomic: '0x5ca9a71b1d01849c0a95490cc00559717fcf0d1d',
		rpcport: 80,
	},
	{
		coin: 'AION',
		etomic: '0x4CEdA7906a5Ed2179785Cd3A40A69ee8bc99C466',
		rpcport: 80,
	},
	{
		coin: 'AMB',
		etomic: '0x4DC3643DbC642b72C158E7F3d2ff232df61cb6CE',
		rpcport: 80,
	},
	{
		coin: 'ANN',
		etomic: '0xe0e73E8fc3a0fA161695be1D75E1Bc3E558957c4',
		rpcport: 80,
	},
	{
		coin: 'ANT',
		etomic: '0x960b236A07cf122663c4303350609A66A7B288C0',
		rpcport: 80,
	},
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
		coin: 'AST',
		etomic: '0x27054b13b1B798B345b591a4d22e6562d47eA75a',
		rpcport: 80,
	},
	{
		coin: 'BAT',
		etomic: '0x0D8775F648430679A709E98d2b0Cb6250d2887EF',
		rpcport: 80,
	},
	{
		coin: 'BBT',
		etomic: '0x1500205f50bf3fd976466d0662905c9ff254fc9c',
		rpcport: 80,
	},
	{
		coin: 'BCAP',
		etomic: '0xFf3519eeeEA3e76F1F699CCcE5E23ee0bdDa41aC',
		rpcport: 80,
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
		coin: 'BITSOKO',
		etomic: '0xb72627650f1149ea5e54834b2f468e5d430e67bf',
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
		],
	},
	{
		coin: 'BNB',
		etomic: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
		rpcport: 80,
	},
	{
		coin: 'BNT',
		etomic: '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C',
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
		],
	},
	{
		coin: 'BOX',
		etomic: '0x01e579be97433f861340268521a7a2ab9829082c',
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
		coin: 'BTCL',
		etomic: '0x5acd19b9c91e596b1f062f18e3d02da7ed8d1e50',
		rpcport: 80,
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
		coin: 'BTK',
		etomic: '0xdb8646F5b487B5Dd979FAC618350e85018F557d4',
		rpcport: 80,
	},
	{
		coin: 'BTM',
		etomic: '0xcB97e65F07DA24D46BcDD078EBebd7C6E6E3d750',
		rpcport: 80,
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
		coin: 'CDT',
		etomic: '0x177d39AC676ED1C67A2b268AD7F1E58826E5B0af',
		rpcport: 80,
	},
	{
		coin: 'CENNZ',
		etomic: '0x1122b6a0e00dce0563082b6e2953f3a943855c1f',
		rpcport: 80,
	},
	{
		coin: 'CFI',
		etomic: '0x12FEF5e57bF45873Cd9B62E9DBd7BFb99e32D73e',
		rpcport: 80,
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
		coin: 'CIX',
		etomic: '0x1175a66a5c3343Bbf06AA818BB482DdEc30858E0',
		rpcport: 80,
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
		coin: 'CVC',
		etomic: '0x41e5560054824eA6B0732E656E3Ad64E20e94E45',
		rpcport: 80,
	},
	{
		coin: 'DAI',
		etomic: '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359',
		rpcport: 80,
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
		coin: 'DATA',
		etomic: '0x0cf0ee63788a0849fe5297f3407f701e122cc023',
		rpcport: 80,
	},
	{
		coin: 'DCN',
		etomic: '0x08d32b0da63e2C3bcF8019c9c5d849d7a9d791e6',
		rpcport: 80,
	},
	{
		coin: 'DEC8',
		etomic: '0x3ab100442484dc2414aa75b2952a0a6f03f8abfd',
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
		coin: 'DGD',
		etomic: '0xE0B7927c4aF23765Cb51314A0E0521A9645F0E2A',
		decimals: 9,
		rpcport: 80,
	},
	{
		coin: 'DGPT',
		etomic: '0xf6cFe53d6FEbaEEA051f400ff5fc14F0cBBDacA1',
		rpcport: 80,
	},
	{
		coin: 'DICE',
		etomic: '0x2e071D2966Aa7D8dECB1005885bA1977D6038A65',
		rpcport: 80,
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
		coin: 'DNT',
		etomic: '0x0AbdAce70D3790235af448C88547603b945604ea',
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
		],
	},
	{
		coin: 'DRGN',
		etomic: '0x419c4db4b9e25d6db2ad9691ccb832c8d9fda05e',
		rpcport: 80,
	},
	{
		coin: 'DROP',
		etomic: '0x4672bad527107471cb5067a887f4656d585a8a31',
		rpcport: 80,
	},
	{
		coin: 'DRT',
		etomic: '0x9af4f26941677c706cfecf6d3379ff01bb85d5ab',
		rpcport: 80,
	},
	{
		coin: 'EDG',
		etomic: '0x08711D3B02C8758F2FB3ab4e80228418a7F8e39c',
		rpcport: 80,
	},
	{
		coin: 'ELD',
		etomic: '0xaaf7d4cd097317d68174215395eb02c2cca81e31',
		rpcport: 80,
	},
	{
		coin: 'ELF',
		etomic: '0xbf2179859fc6D5BEE9Bf9158632Dc51678a4100e',
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
		],
	},
	{
		coin: 'ENJ',
		etomic: '0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c',
		rpcport: 80,
	},
	{
		coin: 'EOS',
		etomic: '0x86fa049857e0209aa7d9e616f7eb3b3b78ecfdb0',
		rpcport: 80,
	},
	{
		coin: 'EQL',
		name: 'Equaliser',
		asset: 'EQL',
		rpcport: 10306,
		electrumServers: [
			{
				host: '159.65.91.235',
				port: 10801,
			},
			{
				host: '167.99.204.42',
				port: 10801,
			},
		],
	},
	{
		coin: 'ETH',
		etomic: '0x0000000000000000000000000000000000000000',
		rpcport: 80,
	},
	{
		coin: 'ETHOS',
		etomic: '0x5Af2Be193a6ABCa9c8817001F45744777Db30756',
		rpcport: 80,
	},
	{
		coin: 'ETOMIC',
		name: 'Etomic',
		asset: 'ETOMIC',
		rpcport: 10271,
		electrumServers: [
			{
				host: 'electrum1.cipig.net',
				port: 10025,
			},
			{
				host: 'electrum2.cipig.net',
				port: 10025,
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
		coin: 'FLLW',
		etomic: '0x0200412995f1bafef0d3f97c4e28ac2515ec1ece',
		rpcport: 80,
	},
	{
		coin: 'FSN',
		etomic: '0xd0352a019e9ab9d757776f532377aaebd36fd541',
		rpcport: 80,
	},
	{
		coin: 'FUN',
		etomic: '0x419D0d8BdD9aF5e606Ae2232ed285Aff190E711b',
		rpcport: 80,
	},
	{
		coin: 'FYN',
		etomic: '0x88FCFBc22C6d3dBaa25aF478C578978339BDe77a',
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
		],
	},
	{
		coin: 'GNO',
		etomic: '0x6810e776880C02933D47DB1b9fc05908e5386b96',
		rpcport: 80,
	},
	{
		coin: 'GPN',
		etomic: '0xE2b407160AAd5540eAc0e80338b9a5085C60F25B',
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
		coin: 'GUP',
		etomic: '0xf7B098298f7C69Fc14610bf71d5e02c60792894C',
		rpcport: 80,
	},
	{
		coin: 'HGT',
		etomic: '0xba2184520A1cC49a6159c57e61E1844E085615B6',
		rpcport: 80,
	},
	{
		coin: 'HMQ',
		etomic: '0xcbCC0F036ED4788F63FC0fEE32873d6A7487b908',
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
		],
	},
	{
		coin: 'HYD',
		etomic: '0xD233495C48EB0143661fFC8458EAfc21b633f97f',
		rpcport: 80,
	},
	{
		coin: 'ICN',
		etomic: '0x888666CA69E0f178DED6D75b5726Cee99A87D698',
		rpcport: 80,
	},
	{
		coin: 'ICX',
		etomic: '0xb5a5f22694352c15b00323844ad545abb2b11028',
		decimals: 18,
		rpcport: 80,
	},
	{
		coin: 'IND',
		etomic: '0xf8e386EDa857484f5a12e4B5DAa9984E06E73705',
		rpcport: 80,
	},
	{
		coin: 'IOST',
		etomic: '0xfa1a856cfa3409cfa145fa4e20eb270df3eb21ab',
		rpcport: 80,
	},
	{
		coin: 'JOI',
		etomic: '0x58ded6994124b4fff298f1416aca3fc9cdba37b2',
		rpcport: 80,
	},
	{
		coin: 'JST',
		etomic: '0x996a8ae0304680f6a69b8a9d7c6e37d65ab5ab56',
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
		],
	},
	{
		coin: 'KIN',
		etomic: '0x818fc6c2ec5986bc6e2cbf00939d90556ab12ce5',
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
		],
	},
	{
		coin: 'KNC',
		etomic: '0xdd974D5C2e2928deA5F71b9825b8b646686BD200',
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
		],
	},
	{
		coin: 'LALA',
		etomic: '0xfd107b473ab90e8fbd89872144a3dc92c40fa8c9',
		rpcport: 80,
	},
	{
		coin: 'LIKE',
		etomic: '0x02f61fd266da6e8b102d4121f5ce7b992640cf98',
		rpcport: 80,
	},
	{
		coin: 'LOOM',
		etomic: '0xa4e8c3ec456107ea67d3075bf9e3df3a75823db0',
		rpcport: 80,
	},
	{
		coin: 'LRC',
		etomic: '0xEF68e7C694F40c8202821eDF525dE3782458639f',
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
		coin: 'LUN',
		etomic: '0xfa05A73FfE78ef8f1a739473e462c54bae6567D9',
		rpcport: 80,
	},
	{
		coin: 'LYS',
		etomic: '0xdd41fbd1ae95c5d9b198174a28e04be6b3d1aa27',
		rpcport: 80,
	},
	{
		coin: 'MANA',
		etomic: '0x0F5D2fB29fb7d3CFeE444a200298f468908cC942',
		rpcport: 80,
	},
	{
		coin: 'MCO',
		etomic: '0xB63B606Ac810a52cCa15e44bB630fd42D8d1d83d',
		rpcport: 80,
	},
	{
		coin: 'MGO',
		etomic: '0x40395044Ac3c0C57051906dA938B54BD6557F212',
		rpcport: 80,
	},
	{
		coin: 'MKR',
		etomic: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
		rpcport: 80,
	},
	{
		coin: 'MLN',
		etomic: '0xBEB9eF514a379B997e0798FDcC901Ee474B6D9A1',
		rpcport: 80,
	},
	{
		coin: 'MMX',
		etomic: '0xe7c33a0e04f2316bb321c4ad2976873d09538b56',
		rpcport: 80,
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
		coin: 'MTL',
		etomic: '0xF433089366899D83a9f26A773D59ec7eCF30355e',
		rpcport: 80,
	},
	{
		coin: 'MYB',
		etomic: '0x5d60d8d7ef6d37e16ebabc324de3be57f135e0bc',
		rpcport: 80,
	},
	{
		coin: 'NAS',
		etomic: '0x5d65d971895edc438f465c17db6992698a52318d',
		rpcport: 80,
	},
	{
		coin: 'NET',
		etomic: '0xcfb98637bcae43C13323EAa1731cED2B716962fD',
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
		coin: 'NMR',
		etomic: '0x1776e1F26f98b1A5dF9cD347953a26dd3Cb46671',
		rpcport: 80,
	},
	{
		coin: 'OCC',
		etomic: '0x0235fe624e044a05eed7a43e16e3083bc8a4287a',
		rpcport: 80,
	},
	{
		coin: 'OCT',
		etomic: '0x7e9d365C0C97Fe5FcAdcc1B513Af974b768C5867',
		rpcport: 80,
	},
	{
		coin: 'OMG',
		etomic: '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07',
		rpcport: 80,
	},
	{
		coin: 'ONNI',
		etomic: '0xbd9c6028e1132a6b52f1ca15c0933a2fd342e21f',
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
		],
	},
	{
		coin: 'PAT',
		etomic: '0xBB1fA4FdEB3459733bF67EbC6f893003fA976a82',
		rpcport: 80,
	},
	{
		coin: 'PAY',
		etomic: '0xB97048628DB6B661D4C2aA833e95Dbe1A905B280',
		rpcport: 80,
	},
	{
		coin: 'PCL',
		etomic: '0x3618516f45cd3c913f81f9987af41077932bc40d',
		rpcport: 80,
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
		coin: 'PLU',
		etomic: '0xD8912C10681D8B21Fd3742244f44658dBA12264E',
		rpcport: 80,
	},
	{
		coin: 'POWR',
		etomic: '0x595832f8fc6bf59c85c527fec3740a1b7a361269',
		rpcport: 80,
	},
	{
		coin: 'PPT',
		etomic: '0xd4fa1460F537bb9085d22C7bcCB5DD450Ef28e3a',
		rpcport: 80,
	},
	{
		coin: 'PRL',
		etomic: '0x1844b21593262668b7248d0f57a220caaba46ab9',
		rpcport: 80,
	},
	{
		coin: 'PURC',
		etomic: '0x7148b80b38278853ca8263cfc0b57d4478ae6a6e',
		rpcport: 80,
	},
	{
		coin: 'PXT',
		etomic: '0xc14830e53aa344e8c14603a91229a0b925b0b262',
		rpcport: 80,
	},
	{
		coin: 'QASH',
		etomic: '0x618E75Ac90b12c6049Ba3b27f5d5F8651b0037F6',
		rpcport: 80,
	},
	{
		coin: 'QBIT',
		etomic: '0xcb5ea3c190d8f82deadf7ce5af855ddbf33e3962',
		rpcport: 80,
	},
	{
		coin: 'QSP',
		etomic: '0x99ea4dB9EE77ACD40B119BD1dC4E33e1C070b80d',
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
		],
	},
	{
		coin: 'R',
		etomic: '0x48f775efbe4f5ece6e0df2f7b5932df56823b990',
		rpcport: 80,
	},
	{
		coin: 'RCN',
		etomic: '0xF970b8E36e23F7fC3FD752EeA86f8Be8D83375A6',
		rpcport: 80,
	},
	{
		coin: 'RDN',
		etomic: '0x255Aa6DF07540Cb5d3d297f0D0D4D84cb52bc8e6',
		rpcport: 80,
	},
	{
		coin: 'REP',
		etomic: '0xE94327D07Fc17907b4DB788E5aDf2ed424adDff6',
		rpcport: 80,
	},
	{
		coin: 'REQ',
		etomic: '0x8f8221aFbB33998d8584A2B05749bA73c37a938a',
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
		],
	},
	{
		coin: 'RHOC',
		etomic: '0x168296bb09e24a88805cb9c33356536b980d3fc5',
		rpcport: 80,
	},
	{
		coin: 'RLC',
		etomic: '0x607F4C5BB672230e8672085532f7e901544a7375',
		rpcport: 80,
	},
	{
		coin: 'RLTY',
		etomic: '0xbe99b09709fc753b09bcf557a992f6605d5997b0',
		rpcport: 80,
	},
	{
		coin: 'RVT',
		etomic: '0x3d1ba9be9f66b8ee101911bc36d3fb562eac2244',
		rpcport: 80,
	},
	{
		coin: 'SALT',
		etomic: '0x4156D3342D5c385a87D264F90653733592000581',
		rpcport: 80,
	},
	{
		coin: 'SAN',
		etomic: '0x7C5A0CE9267ED19B22F8cae653F198e3E8daf098',
		rpcport: 80,
	},
	{
		coin: 'SANC',
		etomic: '0x03ec7bb59be036870ef696a2abf124f496d6735a',
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
		],
	},
	{
		coin: 'SNGLS',
		etomic: '0xaeC2E87E0A235266D9C5ADc9DEb4b2E29b54D009',
		rpcport: 80,
	},
	{
		coin: 'SNT',
		etomic: '0x744d70FDBE2Ba4CF95131626614a1763DF805B9E',
		rpcport: 80,
	},
	{
		coin: 'SPANK',
		etomic: '0x42d6622dece394b54999fbd73d108123806f6a18',
		rpcport: 80,
	},
	{
		coin: 'SRN',
		etomic: '0x68d57c9a1c35f63e2c83ee8e49a64e9d70528d25',
		rpcport: 80,
	},
	{
		coin: 'STORJ',
		etomic: '0xB64ef51C888972c908CFacf59B47C1AfBC0Ab8aC',
		rpcport: 80,
	},
	{
		coin: 'STORM',
		etomic: '0xd0a4b8946cb52f0661273bfbc6fd0e0c75fc6433',
		rpcport: 80,
	},
	{
		coin: 'STRM41',
		etomic: '0xbad7a7f7ba71ce3659fe6dcad34af86b9de2a4b2',
		rpcport: 80,
	},
	{
		coin: 'STWY',
		etomic: '0x8a8c71f032362fca2994f75d854f911ec381ac5a',
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
		],
	},
	{
		coin: 'SWT',
		etomic: '0xB9e7F8568e08d5659f5D29C4997173d84CdF2607',
		rpcport: 80,
	},
	{
		coin: 'TAAS',
		etomic: '0xE7775A6e9Bcf904eb39DA2b68c5efb4F9360e08C',
		rpcport: 80,
	},
	{
		coin: 'TIME',
		etomic: '0x6531f133e6DeeBe7F2dcE5A0441aA7ef330B4e53',
		rpcport: 80,
	},
	{
		coin: 'TKN',
		etomic: '0xaAAf91D9b90dF800Df4F55c205fd6989c977E73a',
		rpcport: 80,
	},
	{
		coin: 'TRST',
		etomic: '0xCb94be6f13A1182E4A4B6140cb7bf2025d28e41B',
		rpcport: 80,
	},
	{
		coin: 'TUSD',
		etomic: '0x8dd5fbce2f6a956c3022ba3663759011dd51e73e',
		rpcport: 80,
	},
	{
		coin: 'UCASH',
		etomic: '0x92e52a1a235d9a103d970901066ce910aacefd37',
		rpcport: 80,
	},
	{
		coin: 'USDT',
		etomic: '0xdac17f958d2ee523a2206206994597c13d831ec7',
		rpcport: 80,
	},
	{
		coin: 'VEN',
		etomic: '0xd850942ef8811f2a866692a623011bde52a462c1',
		rpcport: 80,
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
		coin: 'VSL',
		etomic: '0x5c543e7AE0A1104f78406C340E9C64FD9fCE5170',
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
		coin: 'WINGS',
		etomic: '0x667088b212ce3d06a1b553a7221E1fD19000d9aF',
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
		],
	},
	{
		coin: 'WTC',
		etomic: '0xb7cb1c96db6b22b0d3d9536e0108d062bd488f74',
		rpcport: 80,
	},
	{
		coin: 'XAUR',
		etomic: '0x4DF812F6064def1e5e029f1ca858777CC98D2D81',
		rpcport: 80,
	},
	{
		coin: 'XOV',
		etomic: '0x153eD9CC1b792979d2Bde0BBF45CC2A7e436a5F9',
		rpcport: 80,
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
	{
		coin: 'ZIL',
		etomic: '0x05f4a42e251f2d52b8ed15e9fedaacfcef1fad27',
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
		],
	},
	{
		coin: 'ZRX',
		etomic: '0xE41d2489571d322189246DaFA5ebDe1F4699F498',
		rpcport: 80,
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
