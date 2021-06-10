import React from 'react'
import Web3Provider, { Connectors } from 'web3-react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'

import GlobalStyle, { ThemeProvider } from '../theme'
import Web3ReactManager from '../components/Web3ReactManager'
import AppProvider from '../context'
import Main from './Main'

const { REACT_APP_CHAIN_ID } = process.env
const PROVIDER_URLS = {
  3: 'https://eth-ropsten.alchemyapi.io/v2/MFBQ3O5eVKvOxVY61SbrN-_KdxJgu9m6',
  97: 'https://apis.ankr.com/12fd59f781714a0a88e3e3f6859c9b0a/03394fb0b7c9ec31ca8ff50341130493/binance/full/test',
}

const { NetworkOnlyConnector, InjectedConnector } = Connectors
const Network = new NetworkOnlyConnector({
  providerURL: PROVIDER_URLS[REACT_APP_CHAIN_ID],
  defaultNetwork: REACT_APP_CHAIN_ID,
  supportedNetworks: [3, 97],
  supportedNetworkURLs: PROVIDER_URLS,
})
const Injected = new InjectedConnector({ supportedChainIds: [3, 97] })

const connectors = { Network, Injected }

export default function App() {
  return (
    <ThemeProvider>
      <>
        <GlobalStyle />
        <Web3Provider connectors={connectors} libraryName={'ethers.js'}>
          <Web3ReactManager>
            <AppProvider>
              <BrowserRouter>
                <Switch>
                  <Route exact strict path="/" render={() => <Main />} />
                  <Route exact strict path="/status" render={() => <Main status />} />
                  <Route exact strict path="/stats" render={() => <Main stats />} />
                  <Redirect to="/" />
                </Switch>
              </BrowserRouter>
            </AppProvider>
          </Web3ReactManager>
        </Web3Provider>
      </>
    </ThemeProvider>
  )
}
