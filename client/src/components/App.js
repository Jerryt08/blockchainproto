import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { Button } from 'react-bootstrap';
import logo from '../assets/blockpng.png';

class App extends Component {
    state = { walletInfo: {} };

    componentDidMount(){
        fetch(`${document.location.origin}/api/wallet-info`)
        .then(response => response.json());
    }
   

    render() {
        
        return(
            <div className='App'>
                <img className='logo' src= {logo}></img>
                <br/>
                <div id="textTitle">Welcome to JerryChain!</div>
                <br/>
                <div>
                    <div><Link to='/wallet-info'><Button bsSize='large' bsStyle='info'>My Wallet</Button></Link></div><br/>
                    <div><Link to='/conduct-transaction'><Button bsSize='large' bsStyle='info'>Send Crypto</Button></Link></div><br/>
                    <div><Link to='/blocks'><Button bsSize='large' bsStyle='info'>View Blocks</Button></Link></div><br/>
                    <div><Link to='/transaction-pool'><Button bsSize='large' bsStyle='info'>Transaction Pool</Button></Link></div>
                   
                </div>
                <br/>
                
                
            </div>
        );
    }

}
export default App;