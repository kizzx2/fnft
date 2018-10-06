import Layout from '../components/layout';
import Link from 'next/link';
import Bluebird from 'bluebird';
import { getWeb3 } from '../components/web3-utils';
import SetProtocol, {SignedIssuanceOrder} from 'setprotocol.js'
import { assetDataUtils, orderHashUtils, signatureUtils } from '0x.js';

export default class extends React.Component {
  async componentDidMount() {
    const web3 = await getWeb3()
    this.setState({
      web3
    })
  }

  state = { 
    price: 0,
    expiration: 0
  };

  handleCreateOrder = () => {

  }

  render() {
    console.log(this.state)
    const {price, expiration} = this.state
    return (
      <Layout>
        <div>
          <label>Input Buy Price</label>
          <input 
          type="number"
          value={price}
          onChange={(e) => this.setState({price: e.target.value})} 
          />
        </div>
        <div>
          <label>Input Order Expiration</label>
          <input 
          type="number"
          value={expiration}
          onChange={(e) => this.setState({expiration: e.target.value})} 
          />
        </div>
      </Layout>
    );
  }
}
