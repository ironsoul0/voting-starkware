import React from "react";
import { Contract, Abi } from "starknet";
import { useStarknet } from "../providers/StarknetProvider";

import VOTER from "./abi/voter_modified_abi.json";

const ADDRESS =
  "0x070878e2ebb6b40b2e58832850e22b17d282dcaa52584dff0866c136e505b252";

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
