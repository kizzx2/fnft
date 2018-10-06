import Layout from '../components/layout';
import Router from 'next/router';
import Link from 'next/link';
import Bluebird from 'bluebird';
import { getWeb3 } from '../components/web3-utils';

export default class extends React.Component {
  go = (e) => {
    e.preventDefault();
    window.localStorage.setItem('walletAddresses', JSON.stringify(
      JSON.parse(window.localStorage.getItem('walletAddresses') || '[]') + [
        this.state.importWalletAddress]));
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
            <input placeholder="Import wallet address" type="text" id="import_wallet_address" value={this.state.inputWalletAddress} onChange={(e) => this.setState({ inputWalletAddress: e.target.value })} />
            <label for="import_wallet_address">Import wallet address</label>
          </div>

          <div>
            <button className="btn" style={{ backgroundColor: '#ff5722' }} onClick={this.go}>Go</button>
          </div>
        </form>
      </Layout>
    );
  }
}
