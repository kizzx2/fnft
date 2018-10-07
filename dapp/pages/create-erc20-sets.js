import Layout from '../components/layout';
import Link from 'next/link';
import Bluebird from 'bluebird';
import { getWeb3 } from '../components/web3-utils';
import {addressesKovan} from '../components/addresses'
import SetProtocol, {SignedIssuanceOrder} from 'setprotocol.js'

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


export default class extends React.Component {
  static async getInitialProps({ query }) {
    return {
      erc20Address: query.wallet,
    };
  }

  async componentDidMount() {
    const web3 = await getWeb3()
    const setProtocol = new SetProtocol(web3.currentProvider,addressesKovan.setProtocol)
    console.log(setProtocol)
    this.setState({
      web3,
      setProtocol
    })
  }

  state = { 
    component2: 0,
    component1: 0,
    fnft1: null,
    fnft2: null,
    web3: {},
    setProtocol: {},
    issueQty: 0,
    redeemQty: 0,
  };

  handleCreateSet = async (address1, address2, component1, component2, nme, sym, natUnit) => {
    const {setProtocol} = this.state

    const componentAddresses = [address1, address2];
    const componentUnits = [new BigNumber(component1), new BigNumber(component2)];
    const naturalUnit = new BigNumber(natUnit);
    const name = nme;
    const symbol = sym;

    const txOpts = {
      from: setProtocol.web3.eth.accounts[0],
      gas: 4000000,
      gasPrice: 8000000000,
    };

    const txHash = await setProtocol.createSetAsync(
      componentAddresses,
      componentUnits,
      naturalUnit,
      name,
      symbol,
      txOpts,
      );

    let setAddress =  await setProtocol.getSetAddressFromCreateTxHashAsync(txHash);
    console.log("TEST FNFT Address: ", setAddress)
    window.localStorage.setItem("set", setAddress)
  }

  issueFNFTSet = async (FNFTSetAddress) => {
    const {setProtocol, issueQty} = this.state
    const issueQuantity = new BigNumber(new BigNumber(10 ** 18).mul(issueQty));

    const isMultipleOfNaturalUnit = await setProtocol.setToken.isMultipleOfNaturalUnitAsync(FNFTSetAddress, issueQuantity);
    await setProtocol.setUnlimitedTransferProxyAllowanceAsync(FNFTSetAddress, { from: setProtocol.web3.eth.accounts[0] });
    if (isMultipleOfNaturalUnit) {
      try {
        await setProtocol.issueAsync(
          FNFTSetAddress,
          issueQuantity,
          {
            from: setProtocol.web3.eth.accounts[0],
            gas: 2000000,
            gasPrice: 8000000000,
          },
        );
      } catch (err) {
        console.error(`Error when issuing a new Set token: ${err}`)
      }
    }
    console.error(`Issue quantity is not multiple of natural unit. Confirm that your issue quantity is divisible by the natural unit.`);
  };

  redeemFNFTSet = async (FNFTSetAddress) => {
    const {redeemQty, setProtocol} = this.state

    const quantity = new BigNumber(new BigNumber(10 ** 18).mul(redeemQty));
    const withdraw = true;
    const tokensToExclude = [];
    const txOpts = {
      from: setProtocol.web3.eth.accounts[0],
      gas: 4000000,
      gasPrice: 8000000000,
    };

    const txHash = await setProtocol.redeemAsync(
      FNFTSetAddress,
      quantity,
      withdraw,
      tokensToExclude,
      txOpts,
      );

    console.log(txHash)
  };

  render() {
    console.log(this.state)
    const {component2, component1, issueQty, redeemQty} = this.state
    return (
      <Layout>

        <div>
          <h4>Create a FNFT Set</h4>

          <div>
            <label>FNFT 1 Address</label>
            <input value={this.state.fnft1} onChange={(e) => this.setState({fnft1: e.target.value})} />
          </div>
          <div>
            <label>Input % of FNFT 1 Component</label>
            <input type="number" value={component1} onChange={(e) => this.setState({component1: e.target.value})} />
          </div>

          <div>
            <label>FNFT 2 Address</label>
            <input value={this.state.fnft2} onChange={(e) => this.setState({fnft2: e.target.value})} />
          </div>
          <div>
            <label>Input % of FNFT 2 Component</label>
            <input type="number" value={component2} onChange={(e) => this.setState({component2: e.target.value})} />
          </div>

          <button onClick={() => this.handleCreateSet(this.state.fnft1, this.state.fnft2, 5, 5, "TEST FNFT", "TFNFT", 10)} className="btn" style={{ backgroundColor: '#ff5722' }}>Create Set</button>
        </div>
        <br />
        <br />
        <div>
          <header>Issue FakeKitty 1 / FakeKitty 2 Set</header>
          <div>
            <label>Input number of sets to issue</label>
            <input 
            type="number"
            value={issueQty}
            onChange={(e) => this.setState({issueQty: e.target.value})} 
            />
          </div>
          <button onClick={() => this.issueFNFTSet("0xBCdBA6380F1463c495A53553e9c6f06e8570A2Ef")} style={{ backgroundColor: '#ff5722' }} className="btn">Create Set</button>
        </div>
        <br />
        <br />

        <div>
          <header>Redeem FakeKitty 1 / FakeKitty 2 Set</header>
          <div>
            <label>Input number of sets to redeem</label>
            <input 
            type="number"
            value={redeemQty}
            onChange={(e) => this.setState({redeemQty: e.target.value})} 
            />
          </div>
          <button onClick={() => this.redeemFNFTSet("0xBCdBA6380F1463c495A53553e9c6f06e8570A2Ef")} className="btn" style={{ backgroundColor: '#ff5722' }}>Create Set</button>
        </div>
      </Layout>
    );
  }
}
