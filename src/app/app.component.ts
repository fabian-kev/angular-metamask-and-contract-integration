import { Component } from '@angular/core';
import Web3 from "web3";


declare let require: any;
declare let window: any;
const artifact = require('../assets/contract/galaxy-token.json');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'playmetamask';
  web3
  
  token;
  currentAddress;
  tokenBalance;
  totalSupply;

  mintAmount = 0;

   constructor (){
  
    this.web3 = new Web3(window.web3.currentProvider);
    console.log('provider ' ,window.web3.currentProvider);
    this.connectMetaMask(async address => {
      console.log  ( address[0] )
      this.tokenBalance = await this.token.methods.balanceOf(address[0]).call();
      console.log(this.tokenBalance);
      this.totalSupply = await this.token.methods.totalSupply().call();
    });
    this.connectToSelectedNet();
    this.loadBalance();

  }
  async loadBalance(){
  }
  async connectToSelectedNet(){

    // await this.abi.methods.totalSupply().call(); 
    this.token = new this.web3.eth.Contract(artifact.abi, '0x69487658725f2e7E212F57b31683bD9FEe9CF6d3');
    // const devTokenSupply = await devtoken.methods.totalSupply().call((err, res) => {

    // });
    // console.log(devTokenSupply);
    return null;
  }


  connectMetaMask(cb) {
    console.log('??');
    // We need to make the connection to MetaMask work.
    // Send Request for accounts and to connect to metamask.
    this.web3.eth.requestAccounts()
    .then((result) => {
      // Whenever the user accepts this will trigger
      cb(result);
      //result is address of connected account
    })
    .catch((error) => {
      // Handle errors, such as when a user does not accept
      console.log('err ',error);
      throw new Error(error);
    });

  };
 
  getContractAddress() {
    return "0x296d51d2259FC31D954a34CD115a636382E5C5D3";
  }
  async getABI(){
    // DevToken.json should be placed inside the public folder so we can reach it
    // let ABI;
    // await fetch('../assets/contract/DevToken.json', {
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   }
    // }).then((response) => {
    //   // We have a Response, make sure its 200 or throw an error
    //   if (response.status == 200) {
    //     // This is actually also a promise so we need to chain it to grab data
    //     return response.json();
    //   } else {
    //     throw new Error('Error fetching ABI');
    //   }
    // }).then((data) => {
    //   // We have the data now, set it using the state
    //   ABI = data;
    // }).catch((error) => {
    //   throw new Error(error);
    // });

    return null;
  }
  

  async transfer(transferAmount, recepient){
    let tokenAmount = transferAmount * Math.pow(10, 5);
    // console.log(tokenAmount)
    // await this.token.methods.transfer(recepient, tokenAmount).send(s => {
    //   console.log('succ ',s);
    // }, err => {
    //   console.log('err ',err)
    // }, {from:'0xb83B7e4Ad2c08483553D2EC160c4857D9c3dd495'});
    const account = '0xb83B7e4Ad2c08483553D2EC160c4857D9c3dd495'

    this.token.methods.mint(recepient, tokenAmount).estimateGas({from: account})
    .then((gas) => {
      // We now have the gas amount, we can now send the transaction
      this.token.methods.mint(recepient, tokenAmount).send({from:account});
     
      // Fake update of account by changing stake, Trigger a reload when transaction is done later
    
    }).catch((error) => {
      throw new Error(error);
    });

    
    let options = {
      filter: {
          address: [account]
      },
    };
    this.token.events.Transfer(options)
    // data is when 
    .on('data', event => console.log("Data: " , event))
    .on('changed', changed => console.log("Changed: ", changed))
    .on('error', err => console.log("Err: ", err))
    .on('connected', str => console.log("Conntected: ", str))

  }
}
