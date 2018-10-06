var exports = module.exports = {};

exports.assertThrowsAsync = async (promise) => {
	try {
		await promise;
	} catch (error) {
		const revert = error.message.search('revert') >= 1;
		const invalidOpcode = error.message.search('invalid opcode') >= 0;
		const outOfGas = error.message.search('out of gas') >= 0;
		assert(
				invalidOpcode || outOfGas || revert,
				'Expected throw, got \'' + error + '\' instead',
		);
		return;
	}
	assert.fail('Expected throw not received');
};

exports.ether =  function ether(n) {
	return new web3.BigNumber(web3.toWei(n, 'ether'));
};

exports.latestTime = function latestTime() {
	return web3.eth.getBlock('latest').timestamp;
};

exports.balance = async function getBalance(address) {
	return await web3.eth.getBalance(address);
};

const jsonrpc = '2.0';
const id = 0;
const send = (method, params = []) =>	web3.currentProvider.send({ id, jsonrpc, method, params });

exports.timeTravel = async function(seconds) {
	await send('evm_increaseTime', [seconds]);
	await send('evm_mine');
};
