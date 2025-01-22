// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Transaction } from "@mysten/sui/transactions";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import type { NextApiRequest, NextApiResponse } from "next";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { fromHex } from "@mysten/sui/utils";

type Body = {
  rawTxBytesHex: string;
  sender: string;
};

type Response = {
  txBytes: string;
  sponsorSignature: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const { rawTxBytesHex, sender } = req.body as Body;
  const rawTxBytes = fromHex(rawTxBytesHex);
  const tx = Transaction.fromKind(rawTxBytes);
  tx.setSender(sender);
  const suiClient = new SuiClient({
    url: getFullnodeUrl((process.env.NETWORK as any) || "testnet"),
  });
  const gasObject = await suiClient.getObject({
    id: process.env.GAS_OBJECT_ID || "",
  });
  if (!gasObject.data) {
    throw new Error("Gas object not found");
  }

  const keypair = Ed25519Keypair.fromSecretKey(
    process.env.SUI_PRIVATE_KEY || ""
  );
  const address = keypair.getPublicKey().toSuiAddress();
  tx.setGasBudget(1000000000);
  tx.setGasOwner(address);
  tx.setGasPayment([gasObject.data]);

  const { signature: sponsorSignature, bytes: txBytes } = await tx.sign({
    client: suiClient,
    signer: keypair,
  });

  res.status(200).json({ txBytes, sponsorSignature });
}
