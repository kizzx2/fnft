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
    web3Wrapper: {}
  };

  handleCreateOrder = async (erc721Address, tokenId) => {
    const {
      contractWrappers, 
      web3Wrapper, 
      web3,
      price,
      expiration,
    } = this.state

    const [maker] = await web3Wrapper.getAvailableAddressesAsync();
    const taker = "0xba8ec1f5ee094912266fbcca6331dff6f1a719f1" //set taker hardcoded for now. need to update with contract address

    const etherTokenAddress = contractWrappers.etherToken.getContractAddressIfExists();
    const DECIMALS = 18;
    const makerAssetData = assetDataUtils.encodeERC20AssetData(etherTokenAddress);
    const takerAssetData = assetDataUtils.encodeERC721AssetData(erc721Address, new BigNumber(tokenId));

    // the amount the maker is selling of maker asset
    const makerAssetAmount = Web3Wrapper.toBaseUnitAmount(new BigNumber(price), DECIMALS);
    // the amount the maker wants of taker asset
    const takerAssetAmount = Web3Wrapper.toBaseUnitAmount(new BigNumber(1), DECIMALS);

    //allow 0x ERC721 proxy to move the NFT on behalf of taker
    const takerErc721ApprovalTxHash = await contractWrappers.erc721Token.setProxyApprovalForAllAsync(
      erc721Address,
      taker,
      true,
      {
        from: taker,
        gasLimit: 2000000,
        gasPrice: new BigNumber(8000000000)
      }
      );
    await web3Wrapper.awaitTransactionSuccessAsync(takerErc721ApprovalTxHash);

    // Allow the 0x ERC20 Proxy to move WETH on behalf of maker
    const makerWETHApprovalTxHash = await contractWrappers.erc20Token.setUnlimitedProxyAllowanceAsync(
      etherTokenAddress,
      maker,
      );
    await web3Wrapper.awaitTransactionSuccessAsync(makerWETHApprovalTxHash);

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
    console.log(signedOrder)
    // await contractWrappers.exchange.validateFillOrderThrowIfInvalidAsync(signedOrder, takerAssetAmount, taker);
    // console.log(signedOrder)
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
        <button onClick={() => this.handleCreateOrder("0x2fb698dd012a07abdc7e35d7a149f8912f2b1d0a",0)}>Create Order</button>
      </Layout>
    );
  }
}
