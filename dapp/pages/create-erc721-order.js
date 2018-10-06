import Layout from '../components/layout';
import Link from 'next/link';
import Bluebird from 'bluebird';
import { getWeb3 } from '../components/web3-utils';
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
import { Web3Wrapper } from '@0xproject/web3-wrapper';


export default class extends React.Component {
  async componentDidMount() {
    const web3 = await getWeb3()

    const contractWrappers = new ContractWrappers(web3.currentProvider, { networkId: 3 });
    const web3Wrapper = new Web3Wrapper(web3.currentProvider);

    console.log(contractWrappers,web3Wrapper)

    this.setState({
      web3,
      contractWrappers,
      web3Wrapper
    })
  }

  state = { 
    price: 0,
    expiration: 0,
    web3: {},
    contractWrappers: {}
  };

  handleCreateOrder = async () => {
    const {contractWrappers, web3Wrapper} = this.state

    const [maker] = await web3Wrapper.getAvailableAddressesAsync();
    const taker = maker
    const zrxTokenAddress = contractWrappers.exchange.getZRXTokenAddress();
    const etherTokenAddress = contractWrappers.etherToken.getContractAddressIfExists();
    const DECIMALS = 18;
    const makerAssetData = assetDataUtils.encodeERC20AssetData(zrxTokenAddress);
    const takerAssetData = assetDataUtils.encodeERC20AssetData(etherTokenAddress);
    // the amount the maker is selling of maker asset
    const makerAssetAmount = Web3Wrapper.toBaseUnitAmount(new BigNumber(5), DECIMALS);
    // the amount the maker wants of taker asset
    const takerAssetAmount = Web3Wrapper.toBaseUnitAmount(new BigNumber(0.1), DECIMALS);

    const makerZRXApprovalTxHash = await contractWrappers.erc20Token.setUnlimitedProxyAllowanceAsync(
      zrxTokenAddress,
      maker,
      );
    await web3Wrapper.awaitTransactionSuccessAsync(makerZRXApprovalTxHash);

    // Allow the 0x ERC20 Proxy to move WETH on behalf of takerAccount
    const takerWETHApprovalTxHash = await contractWrappers.erc20Token.setUnlimitedProxyAllowanceAsync(
      etherTokenAddress,
      taker,
      );
    await web3Wrapper.awaitTransactionSuccessAsync(takerWETHApprovalTxHash);

    // Convert ETH into WETH for taker by depositing ETH into the WETH contract
    const takerWETHDepositTxHash = await contractWrappers.etherToken.depositAsync(
      etherTokenAddress,
      takerAssetAmount,
      taker,
      );
    await web3Wrapper.awaitTransactionSuccessAsync(takerWETHDepositTxHash);

    //generate order, hardcoded some values right now
    const exchangeAddress = contractWrappers.exchange.getContractAddress();
    const order = {
      exchangeAddress: exchangeAddress,
      expirationTimeSeconds: 1538848689651,
      feeRecipientAddress: "0x0000000000000000000000000000000000000000",
      makerAddress: maker,
      makerAssetAmount: makerAssetAmount,
      makerAssetData: makerAssetData,
      makerFee: new BigNumber(0),
      salt: Date.now(),
      senderAddress: "0x0000000000000000000000000000000000000000",
      takerAddress: "0x0000000000000000000000000000000000000000",
      takerAssetAmount: takerAssetAmount,
      takerAssetData: takerAssetData,
      takerFee: new BigNumber(0),
    }

    const orderHashHex = orderHashUtils.getOrderHashHex(order);
    const signature = await signatureUtils.ecSignOrderHashAsync(providerEngine, orderHashHex, maker, SignerType.Default);
    const signedOrder = { ...order, signature };

    await contractWrappers.exchange.validateFillOrderThrowIfInvalidAsync(signedOrder, takerAssetAmount, taker);
    console.log(signedOrder)
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
        <button onClick={this.handleCreateOrder}>Create Order</button>
      </Layout>
    );
  }
}
