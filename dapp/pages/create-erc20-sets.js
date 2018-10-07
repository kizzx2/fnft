import Layout from '../components/layout';
import Link from 'next/link';
import Bluebird from 'bluebird';
import { getWeb3 } from '../components/web3-utils';
import {addressesRopsten} from '../components/addresses'
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
  async componentDidMount() {
    const web3 = await getWeb3()
    const setProtocol = new SetProtocol(web3.currentProvider,addressesRopsten.setProtocol)
    console.log(setProtocol)
    this.setState({
      web3,
      setProtocol
    })
  }

  state = { 
    component2: 0,
    component1: 0,
    web3: {},
    setProtocol: {}
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

  render() {
    console.log(this.state)
    const {component2, component1} = this.state
    return (
      <Layout>
        <div>
          <label>Input % of FNFT 1 Component</label>
          <input 
          type="number"
          value={component1}
          onChange={(e) => this.setState({component1: e.target.value})} 
          />
        </div>
        <div>
          <label>Input % of FNFT 2 Component</label>
          <input 
          type="number"
          value={component2}
          onChange={(e) => this.setState({component2: e.target.value})} 
          />
        </div>
        <button onClick={() => this.handleCreateSet("0x02Ca5A9c33585C06336481559FB0eadd3d656324", "0xc778417E063141139Fce010982780140Aa0cD5Ab", 5, 5, "TEST FNFT", "TFNFT", 10)}>Create Set</button>
      </Layout>
    );
  }
}
