import React from "react";
import { Contract, Abi } from "starknet";
import { useStarknet } from "../providers/StarknetProvider";

import RECORDER from "./abi/result_recorder_abi.json";

const ADDRESS =
  "0x0746c1e1e08fe54fdc055e02897e8450c6483d2e979cdfe39904f7c630a01657";

export function useRecorderContract(): Contract | undefined {
  const { library } = useStarknet();
  const [contract, setContract] = React.useState<Contract | undefined>(
    undefined
  );

  React.useEffect(() => {
    setContract(new Contract(RECORDER as Abi[], ADDRESS, library));
  }, [library]);

  return contract;
}
