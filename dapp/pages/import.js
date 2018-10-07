import Layout from '../components/layout';
import Router from 'next/router';
import Link from 'next/link';
import Bluebird from 'bluebird';
import { getWeb3 } from '../components/web3-utils';

export default class extends React.Component {
  go = (e) => {
    e.preventDefault();
    if (this.state.importWalletAddress !== '') {
      const addrs = JSON.parse(window.localStorage.getItem('walletAddresses') || '[]');

      if (addrs.includes(this.state.importWalletAddress)) {
        alert("address already added!");
        return;
      }

      window.localStorage.setItem('walletAddresses', JSON.stringify(
        addrs.concat([this.state.importWalletAddress])));
    }
    Router.push('/');
  }

  state = {
    importWalletAddress: '',
  };

  render() {
    return (
      <Layout>
        <br />
        <br />

        <form onSubmit={this.go}>
          <div className="input-field col s12">
            <input placeholder="Import wallet address" type="text" id="import_wallet_address" value={this.state.importWalletAddress} onChange={(e) => this.setState({ importWalletAddress: e.target.value })} />
            <label htmlFor="import_wallet_address">Import wallet address</label>
          </div>

          <div>
            <button className="btn" style={{ backgroundColor: '#ff5722' }} onClick={this.go}>Go</button>
          </div>
        </form>
      </Layout>
    );
  }
}
