import {useState, useEffect} from 'react'
import {ethers} from 'ethers-ts'
import axios from 'axios'
import {ERC20_ABI, TOKEN_ADDRESS} from '../../const'
import styles from './styles.module.scss'

// Function to get the price of a token from CoinGecko
const getPrice = async (ids: string, vs_currencies: string) => {
    try {
        const response = await axios.get(
            'https://api.coingecko.com/api/v3/simple/price',
            {
                params: {
                    ids,
                    vs_currencies,
                },
            }
        )
        return response.data[ids][vs_currencies]
    } catch (error) {
        console.error('Error fetching price from CoinGecko:', error)
        return null
    }
}

const WrapUnwrap = ({signer}: {signer: ethers.Signer | null}) => {
    const [amount, setAmount] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [ethBalance, setEthBalance] = useState<string | null>(null)
    const [wethBalance, setWethBalance] = useState<string | null>(null)
    const [ethPrice, setEthPrice] = useState<number | null>(null)

    const [wethContract, setWethContract] = useState<ethers.Contract | null>(
        null
    )

    // Fetch balances and prices when the signer changes
    useEffect(() => {
        const fetchBalancesAndPrices = async () => {
            if (signer) {
                const address = await signer.getAddress()
                const provider = signer.provider

                if (provider) {
                    const ethBalance = await provider.getBalance(address)
                    setEthBalance(ethers.utils.formatEther(ethBalance))

                    const wethContract = new ethers.Contract(
                        TOKEN_ADDRESS,
                        ERC20_ABI,
                        signer
                    )
                    setWethContract(wethContract)

                    const wethBalance = await wethContract.balanceOf(address)
                    setWethBalance(ethers.utils.formatEther(wethBalance))
                }
            }
        }

        fetchBalancesAndPrices()
    }, [signer])

    // Fetch ETH price in USD
    useEffect(() => {
        const fetchPrice = async () => {
            try {
                const ethPriceResponse = await getPrice('ethereum', 'usd')
                setEthPrice(ethPriceResponse)
            } catch (err) {
                console.error('Error fetching ETH price:', err)
            }
        }
        fetchPrice()
    }, [signer, ethBalance, wethBalance])

    // Function to wrap ETH to WETH
    const wrapETH = async () => {
        if (!signer || !wethContract) return

        setIsLoading(true)
        setError(null)

        try {
            const tx = await wethContract.deposit({
                value: ethers.utils.parseEther(amount),
            })
            await tx.wait()
            alert('Successfully wrapped ETH to WETH')

            updateBalances()
            clear()
        } catch (err) {
            console.error(err)
            setError('Error wrapping ETH to WETH')
        } finally {
            setIsLoading(false)
        }
    }

    // Function to unwrap WETH to ETH
    const unwrapWETH = async () => {
        if (!signer || !wethContract) return

        setIsLoading(true)
        setError(null)

        try {
            const tx = await wethContract.withdraw(
                ethers.utils.parseEther(amount)
            )
            await tx.wait()
            alert('Successfully unwrapped WETH to ETH')

            updateBalances()
            clear()
        } catch (err) {
            console.error(err)
            setError('Error unwrapping WETH to ETH')
        } finally {
            setIsLoading(false)
        }
    }

    // Function to update ETH and WETH balances
    const updateBalances = async () => {
        if (!signer || !wethContract) return
        try {
            const provider = signer.provider
            const address = await signer.getAddress()
            if (provider) {
                const ethBalance = await provider.getBalance(address)
                setEthBalance(ethers.utils.formatEther(ethBalance))
                const wethBalance = await wethContract.balanceOf(address)
                setWethBalance(ethers.utils.formatEther(wethBalance))
            }
        } catch (error) {
            console.error(error)
            setError('Error updating balances')
        }
    }

    // Function to clear the amount input field
    const clear = () => {
        setAmount('')
    }

    // Function to render a balance card
    const renderCard = (
        title: string,
        currency: string,
        balance: string | null,
        price?: number | null
    ) => {
        return (
            <div className={styles.balanceInfo}>
                <div className={styles.balance}>
                    <p className={styles.title}>{title}</p>
                    <h3 className={styles.currency}>{currency}</h3>
                    <p>Balance: {Number(balance).toFixed(5)}</p>
                </div>
                {price && (
                    <div className={styles.price}>
                        <h3>Price:</h3>
                        <p>${price.toFixed(2)}</p>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.box}>
                {renderCard('Pay with', 'ETH', ethBalance, ethPrice)}
                {renderCard('Recieve', 'WETH', wethBalance)}
                <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="Amount"
                    disabled={isLoading}
                    className={styles.amountInput}
                />
                <div className={styles.buttons}>
                    <button onClick={wrapETH} disabled={isLoading || !amount}>
                        {isLoading ? 'Loading...' : 'Wrap ETH to WETH'}
                    </button>
                    <button
                        onClick={unwrapWETH}
                        disabled={isLoading || !amount}
                    >
                        {isLoading ? 'Loading...' : 'Unwrap WETH to ETH'}
                    </button>
                </div>
                {error && <p className={styles.error}>{error}</p>}
            </div>
        </div>
    )
}

export default WrapUnwrap
