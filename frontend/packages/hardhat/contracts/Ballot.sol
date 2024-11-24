//SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

interface IMyToken {
    function getVotes(address) external view returns (uint256);
    // function getPastVotes(address, uint256) external view returns (uint256);
}

contract Ballot {
    struct Proposal {
        bytes32 name;
        uint voteCount;
    }

    IMyToken public tokenContract;

    Proposal[] public proposals;
    uint256 public targetBlockNumber;

    mapping(address => uint256) public votePowerSpent;
    mapping(address => uint256) public remainingVotePower;
    mapping(address => uint256) public callerVoteCount;

    constructor(bytes32[] memory proposalNames, IMyToken _tokenContract, uint256 _targetBlockNumber) {
        tokenContract = _tokenContract;
        targetBlockNumber = _targetBlockNumber;
        for (uint i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({
                name: proposalNames[i],
                voteCount: 0
            }));
        }
    }

    function vote(uint proposal, uint256 amount) external {
        uint256 votePower = getVotePower(msg.sender);
        callerVoteCount[msg.sender] == 0? remainingVotePower[msg.sender] = votePower : remainingVotePower[msg.sender] = votePower - votePowerSpent[msg.sender];
        require(remainingVotePower[msg.sender] >= amount, "Error: Trying to vote more than available");
        votePowerSpent[msg.sender] += amount;
        callerVoteCount[msg.sender]++;
        proposals[proposal].voteCount += amount;
    }

    function getVotePower(address voter) public view returns(uint256){
        // return tokenContract.getPastVotes(voter, targetBlockNumber);
        return tokenContract.getVotes(voter);
    }

    function winningProposal() public view
        returns (uint winningProposal_)
    {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    function winnerName() external view
        returns (bytes32 winnerName_)
    {
        winnerName_ = proposals[winningProposal()].name;
    }
}