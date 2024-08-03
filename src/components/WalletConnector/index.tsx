import {useState, FC, useEffect} from 'react'
import {ethers} from 'ethers-ts'
import styles from './styles.module.scss'

interface Props {
    onConnect: (signer: ethers.Signer) => void
}

const WalletConnector: FC<Props> = ({onConnect}) => {
    const [account, setAccount] = useState<string | null>(null)
    const [networkError, setNetworkError] = useState<string | null>(null)

    //set up and clean up event listeners for account changes
    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', connectWallet)
        }
        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', connectWallet)
            }
        }
    }, [])

    // Function to connect to the wallet and set up the provider and signer
    const connectWallet = async () => {
        if (window.ethereum === undefined) {
            setNetworkError('Please install Metamask!')
            return
        }
        try {
            await window.ethereum.request({method: 'eth_requestAccounts'})
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const address = await signer.getAddress()
            setAccount(address)
            onConnect(signer)
        } catch (error) {
            setNetworkError('Error connecting to the wallet')
        }
    }

    return (
        <div>
            <h2>MetaMask Wallet Connector</h2>
            {account ? (
                <p>Connected Account: {account}</p>
            ) : (
                <div>
                    <button onClick={connectWallet}>Connect MetaMask</button>
                    {networkError && (
                        <p className={styles.error}>{networkError}</p>
                    )}
                </div>
            )}
        </div>
    )
}

export default WalletConnector
