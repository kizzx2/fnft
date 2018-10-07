import Layout from '../components/layout';
import Link from 'next/link';
import _ from 'lodash';
import Bluebird from 'bluebird';
import { getWeb3, web3Promisify } from '../components/web3-utils';
import FungibleNonFungibleToken from '../../truffle/build/contracts/FungibleNonFungibleToken.json';

const PICS = [
  ['0x5d00d312e171be5342067c09bae883f9bcb2003b', '39856'],
  ['0x06012c8cf97bead5deae237070f9587f8e7a266d', '585392'],
];

export default class extends React.Component {
  async componentDidMount() {
    const walletAddresses = JSON.parse(window.localStorage.getItem('walletAddresses') || '[]');

    const web3 = await getWeb3();

    const myWallets = [];
    const highestBids = {};

    const db = firebase.firestore();

    for (const w of walletAddresses) {
      const walletContract = await web3.eth.contract(FungibleNonFungibleToken.abi).at(w);

      const myBalance = await (web3Promisify(walletContract.balanceOf)(web3.eth.accounts[0]));
      const totalSupply = await (web3Promisify(walletContract.totalSupply)());
      const percentage = myBalance.div(totalSupply);
      const assetAddress = await (web3Promisify(walletContract.asset)());

      const orders = await db.collection(`orders-${w}`).get();

      const buyOrders = [];

      if (orders) {
        orders.forEach((o) => {
          const dat = o.data();
          buyOrders.push([dat.makerAddress, dat.makerAssetAmount])
        });
      }

      highestBids[w] = (_.maxBy('buyOrders', 'makerAssetAmount') || {makerAssetAmount: null}).makerAssetAmount;

      myWallets.push([
        percentage.times(100).toFixed() + '%',
        w, assetAddress, await (web3Promisify(walletContract.assetId)())
      ]);
    }

    this.setState({
      myWallets,
      highestBids,
    });
  }

  state = {
    myWallets: [],
    highestBids: {}
  };

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
                    <img src={`https://storage.googleapis.com/opensea-prod.appspot.com/${PICS[i][0]}/${PICS[i][1]}.png`} style={{ maxHeight: 240, cursor: 'pointer' }} onError={(e) => e.target.src.endsWith('.png') ? e.target.src = e.target.src.replace('.png', '.svg') : null} />
                  </Link>
                </td>
                <td>
                  <div>
                    1234 ETH
                  </div>
                </td>
              </tr>
            ) }
          </tbody>
        </table>
      </Layout>
    );
  }
}
