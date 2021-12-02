import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import { useStarknetCall, useStarknetInvoke } from "./lib/hooks";
import {
  BlockHashProvider,
  useBlockHash,
} from "./providers/BlockHashProvider";
import { StarknetProvider } from "./providers/StarknetProvider";
import {
  TransactionsProvider,
  useTransaction,
  useTransactions,
} from "./providers/TransactionsProvider";
import { ConnectedOnly } from "./components/ConnectedOnly";
import { VoyagerLink } from "./components/VoyagerLink";
import { useVotingContract } from "./lib/voter";
import { toHex, toBN } from "starknet/dist/utils/number";

function App() {
  const [poll, setPoll] = useState("");
  const [createdPoll, setCreatedPoll] = useState({ error: false, loading: false, value: "" });
  const blockNumber = useBlockHash();
  const votingContract = useVotingContract();
  const payload = useMemo(() => ({ poll_id: createdPoll.value }), [createdPoll]);
  const [votingLoading, setVotingLoading] = useState(false);

  const votingState = useStarknetCall(votingContract, "get_voting_state", payload);
  const { invoke, hash } = useStarknetInvoke(votingContract, "init_poll")
  const { invoke: vote, hash: voteHash } = useStarknetInvoke(votingContract, "vote")

  const { transactions } = useTransactions();

  const txStatus = useTransaction(hash)
  const voteTxStatus = useTransaction(voteHash)

  const initPoll = () => {
    const hex = toHex(toBN(poll))
    setCreatedPoll({ loading: true, value: hex, error: false })
    invoke?.({ poll_id: hex })
  }

  const votePoll = (result: string) => {
    setVotingLoading(true);
    vote?.({ poll_id: createdPoll.value, vote: result })
  }

  useEffect(() => {
    if (txStatus?.code === "REJECTED" || txStatus?.code === "NOT_RECEIVED") {
      setCreatedPoll({ loading: false, error: true, value: "" })
    } else if (txStatus?.code === 'PENDING') {
      setCreatedPoll(p => ({ ...p, loading: false, error: false }))
    }
  }, [txStatus]);

  useEffect(() => {
    const code = voteTxStatus?.code;
    if (code === "PENDING") {
      setVotingLoading(false);
      alert("Voted succesfully!");
    } else if (code === "REJECTED" || code === "NOT_RECEIVED") {
      setVotingLoading(false);
      alert("Error while voting!");
    }
  }, [voteTxStatus]);

  return (
    <div className="container">
      <div className="row">
        Current Block:{" "}
        {blockNumber}
      </div>
      <div className="row">
        Voting Address:{" "}
        {votingContract?.connectedTo && (
          <VoyagerLink.Contract contract={votingContract?.connectedTo} />
        )}
      </div>
      <div className="row">
        <ConnectedOnly>
          <input type="number" placeholder="0" onChange={(e) => setPoll(e.target.value)} />
          <button onClick={initPoll} style={{ margin: 10 }} disabled={createdPoll.loading}>Init poll</button>
          {createdPoll.error && <p>Some error occured.. Please try again.</p>}
          {createdPoll.loading && <p>Creating the poll {createdPoll.value}..</p>}
          {!createdPoll.loading && createdPoll.value && (
            <>
              <br />
              <b>Yes votes: {votingState?.["n_yes_votes"]}</b>
              <br />
              <b>No votes: {votingState?.["n_no_votes"]}</b>
              <br />
              {votingLoading && <p>Loading your vote..</p>}
              <br />
              <button onClick={() => votePoll("0x1")} style={{ marginRight: 10 }}>Vote yes</button>
              <button onClick={() => votePoll("0x0")}>Vote no</button>
            </>
          )}
        </ConnectedOnly>
      </div>
      <div className="row">
        <p>Transactions:</p>
        <ul>
          {transactions.map((tx, idx) => (
            <li key={idx}>
              <VoyagerLink.Transaction transactionHash={tx.hash} code={tx.code} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function AppWithProviders() {
  return (
    <StarknetProvider>
      <BlockHashProvider>
        <TransactionsProvider>
          <App />
        </TransactionsProvider>
      </BlockHashProvider>
    </StarknetProvider>
  );
}
export default AppWithProviders;
