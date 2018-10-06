import Link from 'next/link';
import Head from 'next/head';

export default ({ children, title = 'This is the default title' }) => (
  <div>
    <Head>
      <title>{ title }</title>
      <meta charSet='utf-8' />
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css" />
      <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
    </Head>

    <header>
      <nav style={{ paddingLeft: 16, backgroundColor: '#ff5722' }}>
        <Link href="/">FNFT Wallet</Link>
      </nav>
    </header>

    <div className="container">
      { children }
    </div>

    <footer>
    </footer>
  </div>
)
