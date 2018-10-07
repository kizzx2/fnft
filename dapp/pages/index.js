import Layout from '../components/layout';
import Link from 'next/link';
import _ from 'lodash';
import Bluebird from 'bluebird';
import { getWeb3, web3Promisify } from '../components/web3-utils';
import FungibleNonFungibleToken from '../../truffle/build/contracts/FungibleNonFungibleToken.json';
import ERC721 from '../../truffle/build/contracts/ERC721.json';

export default class extends React.Component {
  async componentDidMount() {
    const walletAddresses = JSON.parse(window.localStorage.getItem('walletAddresses') || '[]');

    const web3 = await getWeb3();

    const myWallets = [];
    const highestBids = {};
    const images = {};
    const balances = {};

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

      const assetId = await (web3Promisify(walletContract.assetId)());
      const erc721Contract = web3.eth.contract(ERC721.abi).at(assetAddress);
      if (parseInt(assetAddress) > 0)
        images[w] = await (web3Promisify(erc721Contract.tokenURI)(assetId));

      balances[w] = web3.fromWei(await (web3Promisify(web3.eth.getBalance)(w))).toFixed();

      myWallets.push([
        percentage.times(100).toFixed() + '%',
        w, assetAddress, assetId
      ]);
    }

    this.setState({ myWallets, highestBids, images, balances });
  }

  state = {
    myWallets: [],
    highestBids: {}
  };

  async deposit(addr) {
    const web3 = await getWeb3();
    await (web3Promisify(web3.eth.sendTransaction)({ to: addr, value: web3.toWei('0.01')}));
  }

  render() {
    return (
      <Layout>
        <div className="row" style={{ textAlign: 'center' }}>
          <br />

          <div className="col s4">
            <a href="/new">
              <i className="large material-icons" style={{ color: '#ff5722' }}>control_point</i><br />
              <button className="btn" style={{ backgroundColor: '#ff5722' }}>Deploy new wallet</button>
            </a>
          </div>

          <div className="col s4">
            <a href="/import">
              <i className="large material-icons" style={{ color: '#ff5722' }}>call_merge</i><br />
              <button className="btn" style={{ backgroundColor: '#ff5722' }}>Import existing wallet</button>
            </a>
          </div>

          <div className="col s4">
            <a href="/create-erc20-sets">
              <i className="large material-icons" style={{ color: '#ff5722' }}>attach_money</i><br />
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
              <th>ETH Balance</th>
              <th>Highest Bid</th>
            </tr>
          </thead>

          <tbody>
            { this.state.myWallets.map((wallet, i) =>
              <tr key={`wallet-${i}`}>
                <td style={{ width: 1, paddingRight: 32 }}>{wallet[0]} of {wallet[1]}</td>
                <td style={{ width: 1, paddingRight: 32 }}>
                  {this.state.images[wallet[1]] &&
                    <Link href={`/wallet?wallet=${wallet[1]}&contract=${wallet[2]}&id=${wallet[3]}`}>
                      <img src={this.state.images[wallet[1]]} style={{ maxHeight: 240, cursor: 'pointer' }} /></Link> || <span>(Empty)</span>
                  }
                </td>

                <td>
                  {this.state.balances[wallet[1]]} ETH<br />
                  <a className="btn-flat" style={{ color: '#ff5722' }} onClick={() => this.deposit(wallet[1])}>Deposit</a>
                </td>

                <td>
                  {this.state.highestBids[wallet[1]] &&
                  <div>
                    highestBid[wallet[1]] ETH
                  </div> || <div>--</div>
                  }
                </td>
              </tr>
            ) }
          </tbody>
        </table>
      </Layout>
    );
  }
}
