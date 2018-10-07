const loadWeb3 = () => {
  let { web3 } = window;
  const alreadyInjected = typeof web3 !== `undefined`; // i.e. Mist/Metamask

  if (alreadyInjected) {
    web3 = new Web3(web3.currentProvider);
    window.web3Loaded = true;
    console.log(`Injected web3 detected.`);
  } else {
    // Fallback to localhost if no web3 injection.
    const provider = new Web3.providers.HttpProvider(`http://localhost:9545`);
    web3 = new Web3(provider);
    console.log(`No web3 instance injected, using Local web3.`);
  }
};

export async function getWeb3() {
  if (!window.web3Loaded)
    loadWeb3();

  while (!window.web3Loaded) {
    await new Promise((r) => setTimeout(r, 1000));
  }
  return window.web3;
}

export function web3Promisify(f) {
  return (...args) => new Promise((rs, rj) =>
    f(...args, (err, res) => err ? rj(err) : rs(res)));
}
