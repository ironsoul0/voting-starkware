import React from "react";
import { Contract, Abi } from "starknet";
import { useStarknet } from "../providers/StarknetProvider";

import COUNTER from "./abi/counter.json";

const ADDRESS =
  "0x04dc48361a0da2a9b526ca2422b68e05f178adb3415e2c20507ee5efeacde4de";

/**
 * Load the counter contract.
 *
 * This example uses a hook because the contract address could depend on the
 * chain or come from an external api.
 * @returns The `counter` contract or undefined.
 */
export function useCounterContract(): Contract | undefined {
  const { library } = useStarknet();
  const [contract, setContract] = React.useState<Contract | undefined>(
    undefined
  );

  React.useEffect(() => {
    setContract(new Contract(COUNTER as Abi[], ADDRESS, library));
  }, [library]);

  return contract;
}
