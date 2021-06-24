import Web3 from 'web3'
import { provider } from 'web3-core'

const LOCAL_FALLBACK = 'http://127.0.0.1:8545'

let web3: Web3 | null = null
const getWeb3 = async (): Promise<Web3> => {
  if (!web3) {
    if (document.readyState === 'complete') {
      web3 = await createWeb3()
    } else {
      web3 = await loadWeb3()
    }
  }
  return web3
}

const createWeb3 = async (): Promise<Web3> => {
  const _window: typeof window & { ethereum?: provider; web3?: any } = window
  // Modern dapp browsers...
  if (_window.ethereum) {
    const web3 = new Web3(_window.ethereum)
    // Request account access if needed
    await (_window.ethereum as any).enable()
    // Accounts now exposed
    return web3
  }
  // Legacy dapp browsers...
  else if (_window.web3) {
    // Use Mist/MetaMask's provider.
    const web3 = _window.web3
    console.log('Injected web3 detected.')
    return web3
  }
  // Fallback to localhost; use dev console port by default...
  else {
    const provider = new Web3.providers.HttpProvider(LOCAL_FALLBACK)
    const web3 = new Web3(provider)
    console.log('No web3 instance injected, using Local web3.')
    return web3
  }
}

const loadWeb3 = async (): Promise<Web3> =>
  new Promise((resolve) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener('load', async () => {
      resolve(createWeb3())
    })
  })

export default getWeb3
