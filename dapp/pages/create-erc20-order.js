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
    contractWrappers: {},
    web3Wrapper: {},
    erc20Quantity: 0,
  };

  handleFillOrderErc20 = async (address) => {
    const {web3Wrapper, contractWrappers} = this.state
    const JSONSignedOrder = window.localStorage.getItem("signedOrder")
    const [taker] = await web3Wrapper.getAvailableAddressesAsync();
    const parsed = JSON.parse(JSONSignedOrder)
    const signedOrder = {
      exchangeAddress: parsed.exchangeAddress,
      expirationTimeSeconds: new BigNumber(parsed.expirationTimeSeconds),
      feeRecipientAddress: parsed.feeRecipientAddress,
      makerAddress: parsed.makerAddress,
      makerAssetAmount: new BigNumber(parsed.makerAssetAmount),
      makerAssetData: parsed.makerAssetData,
      makerFee: new BigNumber(parsed.makerFee),
      salt: new BigNumber(parsed.salt),
      senderAddress: parsed.senderAddress,
      takerAddress: parsed.takerAddress,
      takerAssetAmount: new BigNumber(parsed.takerAssetAmount),
      takerAssetData: parsed.takerAssetData,
      takerFee: new BigNumber(parsed.takerFee),
      signature: parsed.signature
    }


    //get approval
    const proxyAllowance = await contractWrappers.erc20Token.getProxyAllowanceAsync(address,taker)
    if(contractWrappers.erc20Token.UNLIMITED_ALLOWANCE_IN_BASE_UNITS.comparedTo(proxyAllowance)===1){
      const takerErc20ApprovalTxhash = await contractWrappers.erc20Token.setUnlimitedProxyAllowanceAsync(
        address,
        taker,
        
        );
      await web3Wrapper.awaitTransactionSuccessAsync(takerErc20ApprovalTxhash);
    }
    //check if signature valid
    await contractWrappers.exchange.validateFillOrderThrowIfInvalidAsync(signedOrder, signedOrder.takerAssetAmount, taker);
    // fill
    const txHash = await contractWrappers.exchange.fillOrderAsync(signedOrder, signedOrder.takerAssetAmount, taker, {
      gasLimit: 5000000,
      gasPrice: new BigNumber(8000000000)
    });
    await web3Wrapper.awaitTransactionSuccessAsync(txHash);
  }

  handleCreateOrder = async (erc20Address, price, erc20Quantity, expiration) => {
    const {
      contractWrappers, 
      web3Wrapper, 
      web3,
    } = this.state

    const addresses = await web3Wrapper.getAvailableAddressesAsync();
    const maker = addresses[0]

    const etherTokenAddress = contractWrappers.etherToken.getContractAddressIfExists();
    const DECIMALS = 18;
    const makerAssetData = assetDataUtils.encodeERC20AssetData(etherTokenAddress);
    const takerAssetData = assetDataUtils.encodeERC20AssetData(erc20Address);

    // the amount the maker is selling of maker asset
    const makerAssetAmount = Web3Wrapper.toBaseUnitAmount(new BigNumber(price*erc20Quantity), DECIMALS);
    // the amount the maker wants of taker asset
    const takerAssetAmount = Web3Wrapper.toBaseUnitAmount(new BigNumber(erc20Quantity), DECIMALS)

    // Allow the 0x ERC20 Proxy to move WETH on behalf of maker
    const proxyAllowance = await contractWrappers.erc20Token.getProxyAllowanceAsync(etherTokenAddress,maker)
    if(contractWrappers.erc20Token.UNLIMITED_ALLOWANCE_IN_BASE_UNITS.comparedTo(proxyAllowance)===1){
      const makerWETHApprovalTxHash = await contractWrappers.erc20Token.setUnlimitedProxyAllowanceAsync(
        etherTokenAddress,
        maker,
        );
      await web3Wrapper.awaitTransactionSuccessAsync(makerWETHApprovalTxHash);
    }

    // Convert ETH into WETH for maker by depositing ETH into the WETH contract
    const makerWETHDepositTxHash = await contractWrappers.etherToken.depositAsync(
      etherTokenAddress,
      makerAssetAmount,
      maker,
      );
    await web3Wrapper.awaitTransactionSuccessAsync(makerWETHDepositTxHash);

    //generate order, hardcoded some values right now
    const exchangeAddress = contractWrappers.exchange.getContractAddress();
    const order = {
      exchangeAddress: exchangeAddress,
      expirationTimeSeconds: new BigNumber(Math.floor(Date.now()/1000) + expiration),
      feeRecipientAddress: "0x0000000000000000000000000000000000000000",
      makerAddress: maker,
      makerAssetAmount: makerAssetAmount,
      makerAssetData: makerAssetData,
      makerFee: new BigNumber(0),
      salt: new BigNumber(Date.now()),
      senderAddress: "0x0000000000000000000000000000000000000000",
      takerAddress: "0x0000000000000000000000000000000000000000",
      takerAssetAmount: takerAssetAmount,
      takerAssetData: takerAssetData,
      takerFee: new BigNumber(0),
    }

    const orderHashHex = orderHashUtils.getOrderHashHex(order);
    const signature = await signatureUtils.ecSignOrderHashAsync(web3.currentProvider, orderHashHex, maker, SignerType.Metamask);
    const signedOrder = { ...order, signature };

    // await contractWrappers.exchange.validateFillOrderThrowIfInvalidAsync(signedOrder, takerAssetAmount, taker);

    console.log(signedOrder)
    const JSONSignedOrder = JSON.stringify(signedOrder)
    window.localStorage.setItem("signedOrder", JSONSignedOrder)
  }

  render() {
    console.log(this.state)
    const {price, expiration, erc20Quantity} = this.state
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
          <label>Input Buy Quantity of FNFT</label>
          <input 
          type="number"
          value={erc20Quantity}
          onChange={(e) => this.setState({erc20Quantity : e.target.value})} 
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
        <button onClick={() => this.handleCreateOrder("0x02Ca5A9c33585C06336481559FB0eadd3d656324",0.01,0.01,1000000)}>Create Order</button>
        <br />
        <hr />
        <br />
        <div>
          <header>Current Orders</header>
          <div>PLACEHOLDER</div>
          <button onClick={() => this.handleFillOrderErc20("0x02Ca5A9c33585C06336481559FB0eadd3d656324")}>Fill Order</button>
        </div>
      </Layout>
    );
  }
}
