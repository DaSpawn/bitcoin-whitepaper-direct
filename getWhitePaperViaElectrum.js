/*!
 * getWhitePaperViaElectrum.js
 *
 * bitcoin-whitepaper-direct
 * Copyright(c) 2015 Brian Taber
 * Bitcoin Cash: 1J8zzGFQoWY3ZaSs5his99G53Vc8Rkx1v8
 * MIT Licensed
 */
const fs = require('fs');
const util = require('util');
const parse = require('electrum-host-parse');
const ElectrumClient = require('electrum-client');
const bitcore = require("bitcore-lib");

const writeFile = util.promisify(fs.writeFile);

const whitePaperHash = '54e48e5f5c656b26c3bca14a8c95aa583d07ebe84dde3b7dd4a78f4e4186e713';

const peers = [
	"electroncash.bitcoinplug.com s t",
	"electrum-abc.criptolayer.net s50012",
	"electroncash.cascharia.com s50002",
	"bcc.arihanc.com t52001 s52002",
	"mash.1209k.com s t",
	"abc1.hsmiths.com t60001 s60002"
];

const getRandomPeer = () => parse.parsePeerString(peers[peers.length * Math.random() | 0]);

const main = async () => {
	var whitePaperTxn = "";

	const peer = getRandomPeer();
	console.log('begin connection: ' + peer.host);
	const ecl = new ElectrumClient(peer.ssl, peer.host, 'ssl');
	await ecl.connect();
	try{
		whitePaperTxn = await ecl.blockchainTransaction_get(whitePaperHash);
	}catch(e){
		console.log(e)
	}
	await ecl.close()

	var transaction = new bitcore.Transaction(whitePaperTxn).toObject()

	//console.log(util.inspect(transaction,{ showHidden: true, depth: 4 }));

	var pdf;

	console.log("Writing bitcoin.pdf...")
	var wstream = fs.createWriteStream('bitcoin.pdf');

	transaction.outputs.forEach(function(output,num){
		var len = output.script.length;
		if (num >= transaction.outputs.length-2) return;

		var tmp = "";
		var cur = 4;

		tmp += output.script.substr(cur,130);
		cur += 132
		tmp += output.script.substr(cur,130);
		cur += 132
		tmp += output.script.substr(cur,130);

		var out = Buffer.from(tmp, 'hex');
		if (num === 0){
			out = out.slice(8);
		}else if (num == transaction.outputs.length-3){
			out = out.slice(0,out.length-45);
		}
		wstream.write(out)
	});

	wstream.end();

	console.log("Done!")
}
main().catch(console.log)