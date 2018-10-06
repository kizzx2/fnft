import Layout from '../components/layout';

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
  };

  componentDidMount() {
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
  }

  handleFillOrder = async (address,tokenId) => {
    const JSONSignedOrder = window.localStorage.getItem("signedOrder")
    const [taker] = await web3Wrapper.getAvailableAddressesAsync();
    const parsed = JSON.parse(JSONSignedOrder)
    const signedOrder = parsed
    // const order = {
    //   exchangeAddress: exchangeAddress,
    //   expirationTimeSeconds: new BigNumber(Math.floor(Date.now()/1000) + expiration),
    //   feeRecipientAddress: "0x0000000000000000000000000000000000000000",
    //   makerAddress: maker,
    //   makerAssetAmount: makerAssetAmount,
    //   makerAssetData: makerAssetData,
    //   makerFee: new BigNumber(0),
    //   salt: new BigNumber(Date.now()),
    //   senderAddress: "0x0000000000000000000000000000000000000000",
    //   takerAddress: "0x0000000000000000000000000000000000000000",
    //   takerAssetAmount: takerAssetAmount,
    //   takerAssetData: takerAssetData,
    //   takerFee: new BigNumber(0),
    // }

    //allow 0x ERC721 proxy to move the NFT on behalf of taker
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

    await contractWrappers.exchange.validateFillOrderThrowIfInvalidAsync(signedOrder, takerAssetAmount, taker);

    const txHash = await contractWrappers.exchange.fillOrderAsync(signedOrder, takerAssetAmount, taker, {
      gasLimit: 4000000,
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
