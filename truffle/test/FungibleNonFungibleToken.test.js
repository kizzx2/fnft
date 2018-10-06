const { assertThrowsAsync, balance} = require('./helpers');
const TestNonFungibleToken = artifacts.require("TestNft.sol");
const FungibleNonFungibleToken = artifacts.require("FungibleNonFungibleToken.sol");

contract('FungibleNonFungibleToken', async (accounts) => {
	let asset, fnft;
	let me = accounts[0];
	let alice = accounts[1];
	let bob = accounts[2];

	beforeEach(async () => {
		asset = await TestNonFungibleToken.new();
		assert.ok(asset);
		await asset.mint();
		assert.equal(me, await asset.ownerOf(0));
		fnft = await FungibleNonFungibleToken.new("Fnft", "FNFT", [me, alice, bob], [1000, 1000, 1000], asset.address, 0);
	});

	it("creates contract", async () => {
		assert.ok(fnft);
	});

	describe("1. construction of FNFT", async () => {

		it("eth is accepted", async () => {
			let wei = 1;
			await fnft.send(wei);
			assert.equal(wei, await balance(fnft.address));
		});

		it("FNFT cannot be transfered", async () => {
			await assertThrowsAsync(fnft.transfer(alice, 1));
		});

	});

	describe("2. eth is deposited", async () => {

		let wei = 1;

		beforeEach(async () => {
			await fnft.send(wei);
		});

		it("NFT can be transfered", async () => {
			await asset.approve(fnft.address, 0);
			await fnft.depositAsset();
			assert.equal(fnft.address, await asset.ownerOf(0));
		});
	});

	describe("3. NFT is tokenized", async () => {

		beforeEach(async () => {
			await fnft.send(1);
			await asset.approve(fnft.address, 0);
			await fnft.depositAsset();
		});

		it("FNFT can be transfered", async () => {
			await fnft.transfer(alice, 1);
		});
	});
});
