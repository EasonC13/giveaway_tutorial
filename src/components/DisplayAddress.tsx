import { useSuiClient } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { nameMapAtom } from "./atoms";

export function DisplayAddress({ address }: { address: string }) {
  const [nameMap, setNameMap] = useAtom(nameMapAtom);

  const suiClient = useSuiClient();

  useEffect(() => {
    if (nameMap[address]) {
      return;
    }

    suiClient
      .resolveNameServiceNames({ address, format: "dot" })
      .then((names) => {
        if (names.data.length > 0) {
          setNameMap((prev) => ({
            ...prev,
            [address]: names.data[0],
          }));
        } else {
          setNameMap((prev) => ({
            ...prev,
            [address]: "None",
          }));
        }
      });
  }, [address]);
  let display = nameMap[address];
  if (nameMap[address] === "None") {
    display = address.slice(0, 6) + "..." + address.slice(-4);
  }

  return (
    <a
      href={`https://testnet.suivision.xyz/account/${address}`}
      target="_blank"
      className="text-blue-200 hover:text-blue-300 hover:underline"
    >
      {display}
    </a>
  );
}
