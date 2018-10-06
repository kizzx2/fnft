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

  handleFillOrder = async (orderId) => {
    
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
                    <td><button className="btn" style={{ backgroundColor: '#ff5722' }} onClick={() => this.handleFillOrder(orderId)}>Fill</button></td>
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
