import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { 
  createPublicClient, 
  createWalletClient,
  http,
  Address,
  parseEther,
} from 'viem';
import { sepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import * as tokenJson from './assets/BallotDappToken.json'

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

  getHello(): string {
    return 'Hello World!';
  }

  getContractAddress(){
    return this.configServie.get<Address>('BALLOTDAPP_TOKEN_ADDRESS')
  }

  async mintTokens(address) {
    const amount = parseEther('3')
    const txHash = await this.walletClient.writeContract({
      address: this.getContractAddress(),
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
}
