import Layout from '../components/layout';
import Link from 'next/link';
import Bluebird from 'bluebird';
import { getWeb3 } from '../components/web3-utils';

export default class extends React.Component {
  async componentDidMount() {
    // const walletAddresses = JSON.parse(window.localStorage.getItem('walletAddresses') || '[]');

    // const web3 = await getWeb3();
    // const myWallets = [];
    // for (const w of walletAddresses) {
    //   const walletContract = await FungibleNonFungibleToken.at(w);
    //   const percentage = await walletContract.balanceOf.call(web3.eth.addresses[0]) /
    //     await walletContract.totalSupply.call();

    //   myWallets.push([
    //     (myStakes / allStakes * 100) + '%',
    //     w,
    //     await walletContract.asset.address.call(),
    //     await walletContract.assetId.call()
    //   ]);
    // }

    this.setState({
      myWallets: [
        ['34%', '0x12345', '0x5d00d312e171be5342067c09bae883f9bcb2003b', '39856'],
        ['31%', '0x12345', '0x06012c8cf97bead5deae237070f9587f8e7a266d', '585392'],
      ]
    });
  }

  state = { myWallets: [] };

  render() {
    return (
      <Layout>
        <div className="row" style={{ textAlign: 'center' }}>
          <br />

          <div className="col s6">
            <a href="/new">
              <button className="btn" style={{ backgroundColor: '#ff5722' }}>Deploy new wallet</button>
            </a>
          </div>

          <div className="col s6">
            <a href="/import">
              <button className="btn" style={{ backgroundColor: '#ff5722' }}>Import existing wallet</button>
            </a>
          </div>
        </div>

        <div className="row" style={{ textAlign: 'center' }}>
          <br />
          <div className="col s6">
            <a href="/create-erc20-sets">
              <button className="btn" style={{ backgroundColor: '#ff5722' }}>Bundle My FNFTs!</button>
            </a>
          </div>
        </div>

        <br />
        <br />

        <table>
          <thead>
            <tr>
              <th>Wallet</th>
              <th>NFT</th>
              <th>Highest Bid</th>
            </tr>
          </thead>

          <tbody>
            { this.state.myWallets.map((wallet, i) =>
              <tr key={`wallet-${i}`}>
                <td style={{ width: 1, paddingRight: 32 }}>{wallet[0]} of {wallet[1]}</td>
                <td style={{ width: 1, paddingRight: 32 }}>
                  <Link href={`/wallet?wallet=${wallet[1]}&contract=${wallet[2]}&id=${wallet[3]}`}>
                    <img src={`https://storage.googleapis.com/opensea-prod.appspot.com/${wallet[2]}/${wallet[3]}.png`} style={{ maxHeight: 240, cursor: 'pointer' }} onError={(e) => e.target.src.endsWith('.png') ? e.target.src = e.target.src.replace('.png', '.svg') : null} />
                  </Link>
                </td>
                <td>ETH 1234</td>
              </tr>
            ) }
          </tbody>
        </table>
      </Layout>
    );
  }
}
