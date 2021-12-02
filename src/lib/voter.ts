import React from "react";
import { Contract, Abi } from "starknet";
import { useStarknet } from "../providers/StarknetProvider";

import VOTER from "./abi/voter_modified_abi.json";

const ADDRESS =
  "0x079128aa0a94104fa16be8f9de5009e0edb26356ee5107683f813d00b9e54279";

export function useVotingContract(): Contract | undefined {
  const { library } = useStarknet();
  const [contract, setContract] = React.useState<Contract | undefined>(
    undefined
  );

  React.useEffect(() => {
    setContract(new Contract(VOTER as Abi[], ADDRESS, library));
  }, [library]);

  return contract;
}
