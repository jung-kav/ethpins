import React from 'react'
import Web3Provider, { Connectors } from 'web3-react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'

import GlobalStyle, { ThemeProvider } from '../theme'
import Web3ReactManager from '../components/Web3ReactManager'
import AppProvider from '../context'
import Main from './Main'

const { REACT_APP_PROVIDER_URL = 'http://localhost:8545', REACT_APP_CHAIN_ID = 31337 } = process.env

const { NetworkOnlyConnector, InjectedConnector } = Connectors
const Network = new NetworkOnlyConnector({
  providerURL: REACT_APP_PROVIDER_URL,
  defaultNetwork: REACT_APP_CHAIN_ID,
  supportedNetworks: [REACT_APP_CHAIN_ID],
  supportedNetworkURLs: {
    [REACT_APP_CHAIN_ID]: REACT_APP_PROVIDER_URL,
  },
})
const Injected = new InjectedConnector({ supportedNetworks: [REACT_APP_CHAIN_ID], defaultNetwork: REACT_APP_CHAIN_ID })

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
