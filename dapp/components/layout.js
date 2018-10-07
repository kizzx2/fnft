import Link from 'next/link';
import Head from 'next/head';

export default ({ children, title = 'FNFT' }) => (
  <div>
    <Head>
      <title>{ title }</title>
      <meta charSet='utf-8' />
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css" />
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
      <script src="https://www.gstatic.com/firebasejs/5.5.3/firebase.js"></script>
      <script dangerouslySetInnerHTML={{__html: `
				const config = {
					apiKey: "AIzaSyA7YwSPT25vuchMKY-J-DfLPTBwxWT_x6w",
					authDomain: "fnft-demo.firebaseapp.com",
					databaseURL: "https://fnft-demo.firebaseio.com",
					projectId: "fnft-demo",
					storageBucket: "fnft-demo.appspot.com",
					messagingSenderId: "749663978296"
				};
				firebase.initializeApp(config);

        const db = firebase.firestore();
        db.settings({timestampsInSnapshots: true});
      `}}>
      </script>
    </Head>

    <header>
      <nav style={{ paddingLeft: 16, backgroundColor: '#ff5722' }}>
        <a href="/">FNFT Wallet</a>
      </nav>
    </header>

    <div className="container">
      { children }
    </div>

    <footer>
    </footer>
  </div>
)
