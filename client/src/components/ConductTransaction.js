import React, { Component } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import history from '../history';

class ConductTransaction extends Component {
    state = { recipient: '', amount: 0, knownAddresses: [] };

    componentDidMount(){
        fetch(`${document.location.origin}/api/known-addresses`)
            .then(response => response.json())
            .then(json => this.setState({ knownAddresses: json }));
    }

    updateRecipient = event => {
        this.setState({ recipient: event.target.value });
    }

    updateAmount = event => {
        this.setState({ amount: Number(event.target.value) });
    }

    conductTransaction = () => {
        const {recipient, amount } = this.state;

        fetch(`${document.location.origin}/api/transact`, {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({ recipient, amount })
        }).then(response => response.json())
        .then(json => {
            alert(json.message || json.type);
            history.push('transaction-pool');
        });
    }

    render(){
        
        return (
            <div className='ConductTransaction'>
                <Link to='/'>Home</Link>
                <h3 id="textTitle">Conduct a Transaction</h3>
                <br/>
                <h4 class="subTitle">Known Addresses</h4>
                {
                    this.state.knownAddresses.map(knownAddress => {
                        return (
                            <div key={knownAddress}>
                                <div>{knownAddress}</div>
                                <br/>
                            </div>
                        );
                    })
                }
                <br/>
                <FormGroup>
                    <FormControl
                        input='text'
                        placeholder='recipient'
                        value={this.state.recipient}
                        onChange={this.updateRecipient}
                    />
                </FormGroup>
                <FormGroup>
                <FormControl
                        input='number'
                        placeholder='amount'
                        value={this.state.amount}
                        onChange={this.updateAmount}
                    />
                </FormGroup>
                <div>
                    <Button
                    bsStyle="info"
                    onClick={this.conductTransaction}
                    >Send</Button>
                </div>

            </div>
        )
    }
};

export default ConductTransaction;