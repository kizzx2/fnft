import Layout from '../components/layout';
import { getWeb3, web3Promisify } from '../components/web3-utils';
import Link from 'next/link';
import FungibleNonFungibleToken from '../../truffle/build/contracts/FungibleNonFungibleToken.json';
import ERC721 from '../../truffle/build/contracts/ERC721.json';
import _ from 'lodash';

import {
    assetDataUtils,
    BigNumber,
    ContractWrappers,
    generatePseudoRandomSalt,
    Order,
    orderHashUtils,
    signatureUtils,
    SignerType,
} from '0x.js';
import { Web3Wrapper } from '@0xproject/web3-wrapper';

export default class extends React.Component {
  static async getInitialProps({ query }) {
    return {
      walletAddress: query.wallet,
      tokenContract: query.contract,
      tokenId: query.id
    };
  }

  state = {
    currentSellOrderProposer: '',
    currentSellOrderPrice: '',
    capTable: [],
    buyOrders: [],
    tokenName: '',
    tokenId: '',
    highestBid: '',
    web3: {},
    contractWrappers: {},
    web3Wrapper: {}
  };

  async componentDidMount() {
    const db = firebase.firestore();
    const orders = await db.collection(`orders-${this.props.walletAddress}`).get();

    const buyOrders = [];

    if (orders) {
      orders.forEach((o) => {
        const dat = o.data();
        buyOrders.push([dat.makerAddress, dat.makerAssetAmount])
      });
    }

    const web3 = await getWeb3()
    const contractWrappers = new ContractWrappers(web3.currentProvider, { networkId: 3 });
    const web3Wrapper = new Web3Wrapper(web3.currentProvider);


    const fnftContract = web3.eth.contract(FungibleNonFungibleToken.abi).at(
      this.props.walletAddress);

    const assetId = (await (web3Promisify(fnftContract.assetId)())).toNumber();

    const assetAddress = await (web3Promisify(fnftContract.asset)());
    let image = null;

    if (parseInt(assetAddress) > 0) {
      const erc721Contract = web3.eth.contract(ERC721.abi).at(assetAddress);
      image = await (web3Promisify(erc721Contract.tokenURI)(assetId));
    }

    const highestBid = (_.maxBy('buyOrders', 'makerAssetAmount') || {makerAssetAmount: ''}).makerAssetAmount;
    const supplyApproved = (await (web3Promisify(fnftContract.supplyApproved)())).toNumber();

    this.setState({
      currentSellOrderProposer: highestBid.makerAddress, // HACK just assume it's the highest bid for now
      currentSellOrderPrice: highestBid.makerAssetAmount, // HACK just assume it's the highest bid for now
      capTable: [
        ['0x12345', '45%', 'Approved'],
        ['0x22345', '30%', 'Rejected'],
        ['0x32345', '25%', ''],
      ],
      buyOrders,
      tokenName: await (web3Promisify(fnftContract.name)()),
      tokenId: assetId,
      image,
      highestBid,
      supplyApproved,
    });

    console.log(contractWrappers,web3Wrapper)

    this.setState({
      web3,
      contractWrappers,
      web3Wrapper
    })
  }


  handleFillOrderErc721 = async (address,tokenId) => {
    const {web3Wrapper, contractWrappers} = this.state
    const JSONSignedOrder = window.localStorage.getItem("signedOrder")
    const [taker] = await web3Wrapper.getAvailableAddressesAsync();
    const parsed = JSON.parse(JSONSignedOrder)
    const signedOrder = {
      exchangeAddress: parsed.exchangeAddress,
      expirationTimeSeconds: new BigNumber(parsed.expirationTimeSeconds),
      feeRecipientAddress: parsed.feeRecipientAddress,
      makerAddress: parsed.makerAddress,
      makerAssetAmount: new BigNumber(parsed.makerAssetAmount),
      makerAssetData: parsed.makerAssetData,
      makerFee: new BigNumber(parsed.makerFee),
      salt: new BigNumber(parsed.salt),
      senderAddress: parsed.senderAddress,
      takerAddress: parsed.takerAddress,
      takerAssetAmount: new BigNumber(parsed.takerAssetAmount),
      takerAssetData: parsed.takerAssetData,
      takerFee: new BigNumber(parsed.takerFee),
      signature: parsed.signature
    }

    console.log(signedOrder, taker)

    //get approval
    const approved = await contractWrappers.erc721Token.getApprovedIfExistsAsync(address,new BigNumber(tokenId))
    if(!approved){
      const takerErc721ApprovalTxHash = await contractWrappers.erc721Token.setProxyApprovalForAllAsync(
        address,
        taker,
        true,
        {
          from: taker,
          gasLimit: 2000000,
          gasPrice: new BigNumber(8000000000)
        }
        );
      await web3Wrapper.awaitTransactionSuccessAsync(takerErc721ApprovalTxHash);
    }
    //check if signature valid
    await contractWrappers.exchange.validateFillOrderThrowIfInvalidAsync(signedOrder, signedOrder.takerAssetAmount, taker);
    // fill
    const txHash = await contractWrappers.exchange.fillOrderAsync(signedOrder, signedOrder.takerAssetAmount, taker, {
      gasLimit: 5000000,
      gasPrice: new BigNumber(8000000000)
    });
    await web3Wrapper.awaitTransactionSuccessAsync(txHash);
  }

  render () {
    return (
      <Layout>
        <br />

        <div className="row" style={{ textAlign: 'center' }}>
          <div className="col s4">
            <img src={this.state.image} style={{ maxHeight: 240 }} /><br />

            <br />

            {this.state.tokenName}<br />
            #{this.state.tokenId}<br />
            {this.state.highestBid &&
              <div>
                Highest Bid<br />
                {this.state.highestBid} ETH
              </div>
            }
          </div>
          <div className="col s4">
            { this.state.supplyApproved > 0 &&
                <div>
                  <h5>Current Active Sell Order</h5>
                  <h6>{this.state.currentSellOrderProposer} proposed to sell this asset for {this.state.currentSellOrderPrice}</h6>

                  <hr />

                  <h5>Cap Table</h5>

                  <table>
                    <thead>
                      <tr>
                        <th>Shareholder</th>
                        <th>Percentage</th>
                        <th>Approval</th>
                      </tr>
                </thead>

                <tbody>
                  {this.state.capTable.map((tr, i) =>
                    <tr key={`tr-${i}`}>
                      <td>{tr[0]}</td>
                      <td>{tr[1]}</td>
                      <td>{tr[2]}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <br />
              <hr />
              <br />

              <div style={{ display: 'flex' }}>
                <div style={{ flex: '1 1 auto' }}>
                  <button className="btn" style={{ backgroundColor: '#ff5722' }}>Reject</button>
                </div>
                <div style={{ flex: '1 1 auto' }}>
                  <button className="btn" style={{ backgroundColor: '#ff5722' }}>Approve</button>
                </div>
                </div>
                <br />
                <hr />
                <br />
                <div>My Shares Balance</div>
                <div>PLACEHOLDER</div>
                <Link href={`/create-erc20-order`}>
                  <button className="btn" style={{ backgroundColor: '#ff5722' }}>Buy/Sell Shares</button>
                </Link>
              </div>
            }
          </div>
          <div className="col s4">
            <h5>Buy Orders</h5>

            <table>
              <thead>
                <tr>
                  <th>Buyer</th>
                  <th>Price</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {this.state.buyOrders.map((tr, i) =>
                  <tr key={`tr-${i}`}>
                    <td>{tr[0]}</td>
                    <td>{tr[1]} ETH</td>
                    <td><button className="btn" style={{ backgroundColor: '#ff5722' }} onClick={() => this.handleFillOrderErc721("0x2fb698dd012a07abdc7e35d7a149f8912f2b1d0a",17)}>Fill</button></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Layout>
    );
  }
}
