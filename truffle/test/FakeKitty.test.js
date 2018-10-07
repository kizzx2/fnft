const FakeKitty = artifacts.require("FakeKitty.sol");

contract('FakeKitty', async (accounts) => {

	let fakeKitty;

	beforeEach(async () => {
		fakeKitty = await FakeKitty.new();
	});

	it("creates fake uri", async () => {
		await fakeKitty.mint(18);
		assert.equal("https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/18.svg", await fakeKitty.tokenURI(18));
	});

});
