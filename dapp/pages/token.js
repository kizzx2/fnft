import Layout from '../components/layout';

const CURRENT_SELL_ORDER_PROPOSER = '0x12345';

const CURRENT_SELL_ORDER_PRICE = '111 ETH';

const CAP_TABLE = [
  ['0x12345', '45%', 'Approved'],
  ['0x22345', '30%', 'Rejected'],
  ['0x32345', '25%', ''],
];

const BUY_ORDERS = [
  ['0x9876', 2500],
  ['0x9876', 500],
  ['0x9876', 10],
];

const TOKEN_NAME = 'CryptoTulip';

const TOKEN_ID = '12345';

const HIGHEST_BID = 1828;

export default class extends React.Component {
  static async getInitialProps({ query }) {
    return {
      tokenContract: query.contract,
      tokenId: query.id,
      tokenImageExt: query.ext,
    };
  }

  render () {
    return (
      <Layout>
        <br />

        <div className="row" style={{ textAlign: 'center' }}>
          <div className="col s4">
            <img src={`https://storage.googleapis.com/opensea-prod.appspot.com/${this.props.tokenContract}/${this.props.tokenId}${this.props.tokenImageExt}`} style={{ maxHeight: 240 }} /><br />

            <br />

            {TOKEN_NAME}<br />
            #{TOKEN_ID}<br />
            <br />
            Highest Bid<br />
            {HIGHEST_BID} ETH
          </div>
          <div className="col s4">
            <h5>Current Active Sell Order</h5>
            <h6>{CURRENT_SELL_ORDER_PROPOSER} proposed to sell this asset for {CURRENT_SELL_ORDER_PRICE}</h6>

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
                {CAP_TABLE.map((tr) =>
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
                {BUY_ORDERS.map((tr) =>
                  <tr>
                    <td>{tr[0]}</td>
                    <td>{tr[1]} ETH</td>
                    <td><button className="btn" style={{ backgroundColor: '#ff5722' }}>Fill</button></td>
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
