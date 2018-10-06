import Layout from '../components/layout';
import Router from 'next/router';
import Link from 'next/link';
import Bluebird from 'bluebird';
import { getWeb3 } from '../components/web3-utils';

export default class extends React.Component {
  go = async (e) => {
    e.preventDefault();

    // TODO
    //
    // const web3 = await getWeb3();
    // const walletFactory = getWalletFactory();
    //
    // const owners = [];
    // const stakes = [];
    //
    // if (this.state.owner1Addr) {
    //   owners.push(this.state.owner1Addr);
    //   stakes.push(this.state.owner1Shares);
    // }
    // if (this.state.owner2Addr) {
    //   owners.push(this.state.owner2Addr);
    //   stakes.push(this.state.owner2Shares);
    // }
    // if (this.state.owner3Addr) {
    //   owners.push(this.state.owner3Addr);
    //   stakes.push(this.state.owner3Shares);
    // }
    // if (this.state.owner4Addr) {
    //   owners.push(this.state.owner4Addr);
    //   stakes.push(this.state.owner4Shares);
    // }
    // if (this.state.owner5Addr) {
    //   owners.push(this.state.owner5Addr);
    //   stakes.push(this.state.owner5Shares);
    // }
    //
    // const newWalletAddress = await new walletFactory(
    //   owners, stakes, this.state.tokenContract, this.state.tokenId);

    window.localStorage.setItem('walletAddresses', JSON.stringify(
      JSON.parse(window.localStorage.getItem('walletAddresses') || '[]') + [
        this.state.importWalletAddress]));

    Router.push('/');
  }

  state = {
    importWalletAddress: '',
  };

  go = (e) => {
  }

  render() {
    return (
      <Layout>
        <style jsx>{`
          .thin.row {
            margin-bottom: 0;

          }

          .thin.row .input-field {
            margin-top: 8px;
            margin-bottom: 8px;
          }
        `}</style>

        <br />
        <br />

        <form onSubmit={this.go}>
          <div className="row thin">
            <div className="input-field col s9">
              <input placeholder="Owner 1 address" type="text" id="owner_1_address" value={this.state.owner1Addr} onChange={(e) => this.setState({ owner1Addr: e.target.value })} />
              <label for="owner_1_address">Owner 1 Address</label>
            </div>

            <div className="input-field col s3">
              <input placeholder="Owner 1 shares" type="text" id="owner_1_shares" value={this.state.owner1Shares} onChange={(e) => this.setState({ owner1Shares: e.target.value })} />
              <label for="owner_1_shares">Owner 1 Shares</label>
            </div>
          </div>

          <div className="row thin">
            <div className="input-field col s9">
              <input placeholder="Owner 2 address" type="text" id="owner_2_address" value={this.state.owner2Addr} onChange={(e) => this.setState({ owner2Addr: e.target.value })} />
              <label for="owner_2_address">Owner 2 Address</label>
            </div>

            <div className="input-field col s3">
              <input placeholder="Owner 2 shares" type="text" id="owner_2_shares" value={this.state.owner2Shares} onChange={(e) => this.setState({ owner2Shares: e.target.value })} />
              <label for="owner_2_shares">Owner 2 Shares</label>
            </div>
          </div>

          <div className="row thin">
            <div className="input-field col s9">
              <input placeholder="Owner 3 address" type="text" id="owner_3_address" value={this.state.owner3Addr} onChange={(e) => this.setState({ owner3Addr: e.target.value })} />
              <label for="owner_3_address">Owner 3 Address</label>
            </div>

            <div className="input-field col s3">
              <input placeholder="Owner 3 shares" type="text" id="owner_3_shares" value={this.state.owner3Shares} onChange={(e) => this.setState({ owner3Shares: e.target.value })} />
              <label for="owner_3_shares">Owner 3 Shares</label>
            </div>
          </div>

          <div className="row thin">
            <div className="input-field col s9">
              <input placeholder="Owner 4 address" type="text" id="owner_4_address" value={this.state.owner4Addr} onChange={(e) => this.setState({ owner4Addr: e.target.value })} />
              <label for="owner_4_address">Owner 4 Address</label>
            </div>

            <div className="input-field col s3">
              <input placeholder="Owner 4 shares" type="text" id="owner_4_shares" value={this.state.owner4Shares} onChange={(e) => this.setState({ owner4Shares: e.target.value })} />
              <label for="owner_4_shares">Owner 4 Shares</label>
            </div>
          </div>

          <div className="row thin">
            <div className="input-field col s9">
              <input placeholder="Owner 5 address" type="text" id="owner_5_address" value={this.state.owner5Addr} onChange={(e) => this.setState({ owner5Addr: e.target.value })} />
              <label for="owner_5_address">Owner 5 Address</label>
            </div>

            <div className="input-field col s3">
              <input placeholder="Owner 5 shares" type="text" id="owner_5_shares" value={this.state.owner5Shares} onChange={(e) => this.setState({ owner5Shares: e.target.value })} />
              <label for="owner_5_shares">Owner 5 Shares</label>
            </div>
          </div>

          <br />

          <div className="row thin">
            <div className="col s9">
              <select className="browser-default"> <option value="" disabled selected onChange={(e) => this.setState({ tokenContract: e.target.value })}>ERC721 contract address</option>
                <option value="0x12345">0x12345 CryptoKitties</option>
                <option value="0x22345">0x22345 CryptoTulip</option>
                <option value="0x32345">0x32345 CryptoCountry</option>
              </select>
            </div>

            <div className="input-field col s3">
              <input placeholder="Token ID" type="text" id="token_id" value={this.state.tokenId} onChange={(e) => this.setState({ tokenId: e.target.value })} />
              <label for="token_id">Token ID</label>
            </div>
          </div>

          <div className="input-field col s12">
            <button className="btn" style={{ backgroundColor: '#ff5722' }} onClick={this.go}>Go</button>
          </div>
        </form>
      </Layout>
    );
  }
}
