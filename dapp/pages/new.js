import Layout from '../components/layout';
import Router from 'next/router';
import Link from 'next/link';
import Bluebird from 'bluebird';
import { getWeb3, web3Promisify } from '../components/web3-utils';
import FungibleNonFungibleToken from '../../truffle/build/contracts/FungibleNonFungibleToken.json';

export default class extends React.Component {
  async componentDidMount() {
    const web3 = await getWeb3();

    this.setState({
      owner1Addr: web3.eth.accounts[0],
      owner1Shares: 1000000
    });
  }

  go = async (e) => {
    e.preventDefault();

    const web3 = await getWeb3();
    const gasEstimate = (await web3Promisify(web3.eth.estimateGas)({
      data: FungibleNonFungibleToken.bytecode
    })) * 2;

    const owners = [];
    const stakes = [];

    if (this.state.owner1Addr) {
      owners.push(this.state.owner1Addr);
      stakes.push(this.state.owner1Shares);
    }
    if (this.state.owner2Addr) {
      owners.push(this.state.owner2Addr);
      stakes.push(this.state.owner2Shares);
    }
    if (this.state.owner3Addr) {
      owners.push(this.state.owner3Addr);
      stakes.push(this.state.owner3Shares);
    }
    if (this.state.owner4Addr) {
      owners.push(this.state.owner4Addr);
      stakes.push(this.state.owner4Shares);
    }
    if (this.state.owner5Addr) {
      owners.push(this.state.owner5Addr);
      stakes.push(this.state.owner5Shares);
    }

    const abi = web3.eth.contract(FungibleNonFungibleToken.abi);
    const fnftContract = await new Promise((resolve, reject) =>
      web3.eth.contract(FungibleNonFungibleToken.abi).new(
      "FNFT", "FNFT",
      owners, stakes,
      this.state.tokenContract, this.state.tokenId,
      {
        from: web3.eth.accounts[0],
        data: FungibleNonFungibleToken.bytecode,
        gas: gasEstimate,
      }, (err, res) => err ? reject(err) : resolve(res)
    ));

    let newContractAddress = null;

    // Wait for it to have an address
    while (true) {
      const receipt = await (web3Promisify(web3.eth.getTransactionReceipt)(fnftContract.transactionHash));

      if (receipt && receipt.contractAddress) {
        newContractAddress = receipt.contractAddress;
        break;
      }
    }

    window.localStorage.setItem('walletAddresses', JSON.stringify(
      JSON.parse(window.localStorage.getItem('walletAddresses') || '[]').concat([
        newContractAddress])));

    Router.push('/');
  }

  state = {
    importWalletAddress: '',
    nftAddress: "",
    nftId: ""
  };

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
              <input placeholder=" " type="text" id="owner_1_address" value={this.state.owner1Addr} onChange={(e) => this.setState({ owner1Addr: e.target.value })} />
              <label htmlFor="owner_1_address">Owner 1 Address</label>
            </div>

            <div className="input-field col s3">
              <input placeholder=" " type="text" id="owner_1_shares" value={this.state.owner1Shares} onChange={(e) => this.setState({ owner1Shares: e.target.value })} />
              <label htmlFor="owner_1_shares">Shares</label>
            </div>
          </div>

          <div className="row thin">
            <div className="input-field col s9">
              <input type="text" id="owner_2_address" value={this.state.owner2Addr} onChange={(e) => this.setState({ owner2Addr: e.target.value })} />
              <label htmlFor="owner_2_address">Owner 2 Address</label>
            </div>

            <div className="input-field col s3">
              <input type="text" id="owner_2_shares" value={this.state.owner2Shares} onChange={(e) => this.setState({ owner2Shares: e.target.value })} />
              <label htmlFor="owner_2_shares">Shares</label>
            </div>
          </div>

          <div className="row thin">
            <div className="input-field col s9">
              <input type="text" id="owner_3_address" value={this.state.owner3Addr} onChange={(e) => this.setState({ owner3Addr: e.target.value })} />
              <label htmlFor="owner_3_address">Owner 3 Address</label>
            </div>

            <div className="input-field col s3">
              <input type="text" id="owner_3_shares" value={this.state.owner3Shares} onChange={(e) => this.setState({ owner3Shares: e.target.value })} />
              <label htmlFor="owner_3_shares">Shares</label>
            </div>
          </div>

          <div className="row thin">
            <div className="input-field col s9">
              <input type="text" id="owner_4_address" value={this.state.owner4Addr} onChange={(e) => this.setState({ owner4Addr: e.target.value })} />
              <label htmlFor="owner_4_address">Owner 4 Address</label>
            </div>

            <div className="input-field col s3">
              <input type="text" id="owner_4_shares" value={this.state.owner4Shares} onChange={(e) => this.setState({ owner4Shares: e.target.value })} />
              <label htmlFor="owner_4_shares">Shares</label>
            </div>
          </div>

          <div className="row thin">
            <div className="input-field col s9">
              <input type="text" id="owner_5_address" value={this.state.owner5Addr} onChange={(e) => this.setState({ owner5Addr: e.target.value })} />
              <label htmlFor="owner_5_address">Owner 5 Address</label>
            </div>

            <div className="input-field col s3">
              <input type="text" id="owner_5_shares" value={this.state.owner5Shares} onChange={(e) => this.setState({ owner5Shares: e.target.value })} />
              <label htmlFor="owner_5_shares">Shares</label>
            </div>
          </div>

          <br />

          <div className="row thin">
            <div className="col s9">
              <select className="browser-default" defaultValue="">
                <option value="" disabled onChange={(e) => this.setState({ tokenContract: e.target.value })}>ERC721 contract address</option>
                <option value="0x496d699ddeb144f60e124d717e255101bfbb99c8">0x496d6...99c8 Fake Kitties</option>
                <option value="0x496d699ddeb144f60e124d717e255101bfbb99c8">0x496d6...99c8 Fake Tulip</option>
                <option value="0x496d699ddeb144f60e124d717e255101bfbb99c8">0x496d6...99c8 Fake Country</option>
              </select>
            </div>

            <div className="input-field col s3">
              <input type="text" id="token_id" value={this.state.tokenId} onChange={(e) => this.setState({ tokenId: e.target.value })} />
              <label htmlFor="token_id">Token ID</label>
            </div>
          </div>

          <div className="input-field col s12">
            <button type="button" className="btn" style={{ backgroundColor: '#ff5722' }} onClick={this.go}>Go</button>
          </div>
        </form>
      </Layout>
    );
  }
}
