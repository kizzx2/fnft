const { assertThrowsAsync, balance} = require('./helpers');
const FakeKitty = artifacts.require("FakeKitty.sol");
const FungibleNonFungibleToken = artifacts.require("FungibleNonFungibleToken.sol");

contract('FungibleNonFungibleToken', async (accounts) => {
	let asset, fnft;
	let me = accounts[0];
	let alice = accounts[1];
	let bob = accounts[2];
	let kittyId = 18;

	beforeEach(async () => {
		asset = await FakeKitty.new();
		assert.ok(asset);
		await asset.mint(kittyId);
		assert.equal(me, await asset.ownerOf(kittyId));
		fnft = await FungibleNonFungibleToken.new(
				"Fnft", "FNFT",
				[me, alice, bob],
				[1000, 1000, 1000],
				asset.address, kittyId
		);
	});

	it("creates contract", async () => {
		assert.ok(fnft);
	});

	describe("1. construction of FNFT", async () => {

		it("share exist", async () => {
			assert.equal(1000, await fnft.balanceOf(me));
			assert.equal(1000, await fnft.balanceOf(alice));
			assert.equal(1000, await fnft.balanceOf(bob));
		});

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
			await asset.approve(fnft.address, kittyId);
			await fnft.depositAsset();
			assert.equal(fnft.address, await asset.ownerOf(kittyId));
		});

		it("cannot approve to sale", async () => {
			await assertThrowsAsync(fnft.approveSale());
		});
	});

	describe("3. NFT is tokenized", async () => {

		beforeEach(async () => {
			await fnft.send(1);
			await asset.approve(fnft.address, kittyId);
			await fnft.depositAsset();
		});

		it("all ETH is tranfered from the contract", async () => {
			assert.equal(0, await balance(fnft.address));
		});

		it("FNFT can be transfered", async () => {
			await fnft.transfer(alice, 1);
			assert.equal(1001, await fnft.balanceOf(alice));
		});

		it("can approve to sale", async () => {
			await fnft.approveSale();
			assert.equal(1000, await fnft.supplyApproved());
			assert.equal(false, await fnft.isSaleApproved());
		});

		it("cannot deposit ETH", async () => {
			await assertThrowsAsync(fnft.send(1000));
		});
	});

	describe("3. NFT is sold away", async () => {

		beforeEach(async () => {
			await fnft.send(1);
			await asset.approve(fnft.address, kittyId);
			await fnft.depositAsset();
			await fnft.approveSale();
			await fnft.approveSale({from: alice});
			await fnft.send(30000); // TODO: replace with 0x
		});

		it("token is sold", async () => {
			assert.ok(await fnft.sold());
			assert.equal(30000, await balance(fnft.address));
		});

		it("FNFT cannot be transfered", async () => {
			await assertThrowsAsync(fnft.transfer(alice, 1));
		});

		it("calculates share in eth correctly", async () => {
			let share = await fnft.shareInEth();
			assert.equal(10000, share);
		});

		it("eth can be withdrawn", async () => {
			await fnft.withdraw();
			assert.equal(20000, await balance(fnft.address));
		});
	});
});
