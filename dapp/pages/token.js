import Layout from '../components/layout';
import { getWeb3 } from '../components/web3-utils';
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
      tokenContract: query.contract,
      tokenId: query.id,
      tokenImageExt: query.ext,
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
    this.setState({
      currentSellOrderProposer: '0x12345',
      currentSellOrderPrice: '111 ETH',
      capTable: [
        ['0x12345', '45%', 'Approved'],
        ['0x22345', '30%', 'Rejected'],
        ['0x32345', '25%', ''],
      ],
      buyOrders: [
        ['0x9876', 2500],
        ['0x9876', 500],
        ['0x9876', 10],
      ],
      tokenName: 'CryptoTulip',
      tokenId: '12345',
      highestBid: 1828,
    });

    const web3 = await getWeb3()

    const contractWrappers = new ContractWrappers(web3.currentProvider, { networkId: 3 });
    const web3Wrapper = new Web3Wrapper(web3.currentProvider);

    console.log(contractWrappers,web3Wrapper)

    this.setState({
      web3,
      contractWrappers,
      web3Wrapper
    })
  }

  handleFillOrder = async (address,tokenId) => {
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

    // allow 0x ERC721 proxy to move the NFT on behalf of taker
    const takerErc721ApprovalTxHash = await contractWrappers.erc721Token.setProxyApprovalForAllAsync(
      address,
      taker,
      true,
      {
        from: taker,
        gasLimit: 5000000,
        gasPrice: new BigNumber(8000000000)
      }
      );
    await web3Wrapper.awaitTransactionSuccessAsync(takerErc721ApprovalTxHash);

    await contractWrappers.exchange.validateFillOrderThrowIfInvalidAsync(signedOrder, signedOrder.takerAssetAmount, taker);

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
            <img src={`https://storage.googleapis.com/opensea-prod.appspot.com/${this.props.tokenContract}/${this.props.tokenId}${this.props.tokenImageExt}`} style={{ maxHeight: 240 }} /><br />

            <br />

            {this.state.tokenName}<br />
            #{this.state.tokenId}<br />
            <br />
            Highest Bid<br />
            {this.state.highestBid} ETH
          </div>
          <div className="col s4">
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
                {this.state.capTable.map((tr) =>
                  <tr>
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
                {this.state.buyOrders.map((tr) =>
                  <tr>
                    <td>{tr[0]}</td>
                    <td>{tr[1]} ETH</td>
                    <td><button className="btn" style={{ backgroundColor: '#ff5722' }} onClick={() => this.handleFillOrder("0x2fb698dd012a07abdc7e35d7a149f8912f2b1d0a",17)}>Fill</button></td>
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
