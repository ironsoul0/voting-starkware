import React from "react";
import { Contract, Abi } from "starknet";
import { useStarknet } from "../providers/StarknetProvider";

import RECORDER from "./abi/result_recorder_abi.json";

const ADDRESS =
  "0x0635f787e30bb2b6f15a08cc3bd11a75b2e6cde907297ac229ec99a83c72a8be";

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
