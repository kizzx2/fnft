import Layout from '../components/layout';
import Link from 'next/link';

const MY_TOKENS = [
  ['0x5d00d312e171be5342067c09bae883f9bcb2003b', '39856', '.png'],
  ['0x06012c8cf97bead5deae237070f9587f8e7a266d', '585392', '.svg'],
];

export default () => (
  <Layout>
    <table>
      <thead>
        <tr>
          <th>NFT</th>
          <th>Highest Bid</th>
        </tr>
      </thead>

      <tbody>
        { MY_TOKENS.map((token) =>
          <tr>
            <td style={{ width: 1, paddingRight: 32 }}>
              <Link href={`/token?contract=${token[0]}&id=${token[1]}&ext=${token[2]}`}>
                <img src={`https://storage.googleapis.com/opensea-prod.appspot.com/${token[0]}/${token[1]}${token[2]}`} style={{ maxHeight: 240, cursor: 'pointer' }} />
              </Link>
            </td>
            <td>ETH 1234</td>
          </tr>
        ) }
      </tbody>
    </table>
  </Layout>
)
