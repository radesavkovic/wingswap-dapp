import { getAddress, isAddress } from '@ethersproject/address'
import useActiveWeb3React from '../../hooks/useActiveWeb3React';
import { useReferralContract } from '../../hooks/useContract';
//
const separator = 'r=';
const offset = separator.length;

async function getReferralAddress(account: any, referralContract: any): Promise<string> {
 let refAddr = await referralContract.getReferral(account);
    refAddr = refAddr.toLowerCase();
    return refAddr;
}

async function setReferralAddress(refferAddress: any, referralContract: any) {
    await referralContract.setReferral(refferAddress);
}


const ReferralUrlParser =  ({ children }) => {
    const { account } = useActiveWeb3React();
     const referralContract = useReferralContract();
    
    if (account && referralContract) {
        const href = window.location.href;
        // console.log(href);
        const begin = href.indexOf(separator) + offset;
        const addrStr = href.slice(begin, begin + 42)
        if (addrStr && isAddress(addrStr)) {
            // console.log('set referral address' + addrStr);
            let refAddr = getReferralAddress(account, referralContract)
                .then(refAddr => {
                    if (refAddr != addrStr) {
                        console.log(refAddr)
                        setReferralAddress(addrStr, referralContract)
                            .catch(err => {
                                console.error(err)
                            })
                    }
                })
        }
    }
  return children

}

export default ReferralUrlParser
