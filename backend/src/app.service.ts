import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { 
  createPublicClient, 
  createWalletClient,
  http,
  Address,
  parseEther,
  formatEther,
  keccak256,
  toBytes
} from 'viem';
import { sepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import * as tokenJson from './assets/BallotDappToken.json'
import * as ballotJson from './assets/Ballot.json'

@Injectable()
export class AppService {
  walletClient;
  publicClient;
  
  constructor(private configServie: ConfigService){
    const account = privateKeyToAccount(`0x${this.configServie.get<string>('PRIVATE_KEY')}`);
    this.publicClient = createPublicClient({
      chain: sepolia,
      transport: http(this.configServie.get<Address>('RPC_ENDPOINT_URL'))
    })
    this.walletClient = createWalletClient({
      transport: http(process.env.RPC_ENDPOINT_URL),
      chain: sepolia,
      account: account,
    });
  }

  getBDTContractAddress(){
    return this.configServie.get<Address>('BALLOTDAPP_TOKEN_ADDRESS')
  }

  getBallotContractAddress(){
    return this.configServie.get<Address>('BALLOT_ADDRESS')
  }

  async getTokenDetails(){
    const tokenName = await this.publicClient.readContract({
      address: this.getBDTContractAddress(),
      abi: tokenJson.abi,
      functionName: "name"
    })

    const tokenSymbol = await this.publicClient.readContract({
      address: this.getBDTContractAddress(),
      abi: tokenJson.abi,
      functionName: "symbol"
    })

    const totalSupply = formatEther(await this.publicClient.readContract({
      address: this.getBDTContractAddress(),
      abi: tokenJson.abi,
      functionName: "totalSupply"
    }))

    return {
      tokenName,
      tokenSymbol,
      totalSupply
    }

  }

  async checkRole(address): Promise<boolean> {
    // const minterRole = await this.publicClient.readContract({
    //   address: this.getContractAddress(),
    //   abi: tokenJson.abi,
    //   functionName: "MINTER_ROLE",
    // })
      
    const minterRole = keccak256(toBytes("MINTER_ROLE"));

    const role = await this.publicClient.readContract({
      address: this.getBDTContractAddress(),
      abi: tokenJson.abi,
      functionName: "hasRole",
      args:[minterRole, address]
    })
    return role;    
  }

  async mintTokens(address) {
    const amount = parseEther('3')
    const txHash = await this.walletClient.writeContract({
      address: this.getBDTContractAddress(),
      abi: tokenJson.abi,
      functionName: "mint",
      args: [address, amount]
    })

    const receipt = await this.publicClient.waitForTransactionReceipt({
      hash: txHash
    })
    
    return {
      success: true,
      message: `Minted ${amount} tokens to ${address}`,
    };
  }

  async delegateTokens(address){
    const delegateTx = await this.walletClient.writeContract({
      address: this.getBDTContractAddress(),
      abi: tokenJson.abi,
      functionName: "delegate",
      args:[address]
    })

    await this.publicClient.waitForTransactionReceipt({
      hash: delegateTx
    })

    return `BDT successfully delegated to ${address} for voting`
  }

  async vote(proposalIndex: number, voteAmount: string){
    const voteTx = await this.walletClient.writeContract({
      address: this.getBallotContractAddress(),
      abi: ballotJson.abi,
      functionName: "vote",
      args:[proposalIndex, parseEther(voteAmount)]
    })

    await this.publicClient.waitForTransactionReceipt({
      hash: voteTx
    })

    return `You have successfully casted ${voteAmount} vote(s) for the proposal at index ${proposalIndex}`
    
  }
}
