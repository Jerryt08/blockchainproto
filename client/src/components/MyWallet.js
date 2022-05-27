import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import logo from '../assets/blockpng.png';

class MyWallet extends Component {
    state = { walletInfo: {} };

    componentDidMount(){
        fetch(`${document.location.origin}/api/wallet-info`)
        .then(response => response.json())
        .then(json => this.setState({ walletInfo: json }));
    }

    render() {
        const {address, balance } = this.state.walletInfo;
        return(
            <div className='MyWallet'>
                <div id="textTitle">My Wallet</div>
                <br/>
                <img className='logo' src= {logo}></img>
                <br/>
                
                

                <div className='WalletInfo'>
                    <div class="subTitle">Balance: {balance} JCS</div><br/>
                    <div class="subTitle">Address:</div>
                    <div>{address}</div>
                   <br/>
                </div>


                <div id="links"><Link to='/blocks'>See Blocks</Link>&nbsp;&nbsp;
                <Link to='/conduct-transaction'>Conduct a Transaction</Link>&nbsp;&nbsp;
                <Link to='/transaction-pool'>Transaction Pool</Link></div>
                <br/>
                
                
            </div>
        );
    }
}
export default MyWallet;
