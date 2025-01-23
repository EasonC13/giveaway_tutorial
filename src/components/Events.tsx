import { phantom } from "@/giveaway/_framework/reified";
import { GiftWithdrawnEvent } from "@/giveaway/giveaway/giveaway/structs";
import { useSuiClient, useCurrentAccount } from "@mysten/dapp-kit";
import { fromBase64 } from "@mysten/sui/utils";
import { useEffect, useState } from "react";
import { DisplayAddress } from "./DisplayAddress";

export function Events() {
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const address = currentAccount?.address;
  const [events, setEvents] = useState<any[]>([]);
  const [showOnlyMine, setShowOnlyMine] = useState(false);

  useEffect(() => {
    const run = async () => {
      const result = await suiClient.queryEvents({
        query: {
          MoveEventType:
            "0xcf5ea60fe885e3f5162e30b6f3b3218c344be94ab9aece30f96ebee35be39b97::giveaway::GiftWithdrawnEvent<0x2::sui::SUI>",
        },
      });
      const events = result.data.map((event) => {
        return GiftWithdrawnEvent.fromBcs(
          phantom(event.type.split("<")[1].split(">")[0]),
          fromBase64(event.bcs)
        );
      });
      setEvents(events);
    };
    if (address) {
      run();
    }
  }, [address]);

  const filteredEvents =
    showOnlyMine && currentAccount
      ? events.filter((event) => event.recipient === currentAccount.address)
      : events;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="showOnlyMine"
          checked={showOnlyMine}
          onChange={(e) => setShowOnlyMine(e.target.checked)}
          className="rounded border-gray-700 bg-gray-800 text-blue-500"
        />
        <label htmlFor="showOnlyMine" className="text-gray-300">
          Only show gifts I received
        </label>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left p-2">Sender</th>
            <th className="text-left p-2">Receiver</th>
            <th className="text-right p-2">Value</th>
            <th className="text-left p-2">Coin Type</th>
          </tr>
        </thead>
        <tbody>
          {filteredEvents.map((event) => {
            return (
              <tr className="border-b border-gray-700">
                <td className="p-2 text-gray-300">
                  <DisplayAddress address={event.creator as string} />
                </td>
                <td className="p-2 text-gray-300">
                  <DisplayAddress address={event.recipient as string} />
                </td>
                <td className="p-2 text-right text-gray-300">
                  {Number(event.value) / 10 ** 9}
                </td>
                <td className="p-2 text-gray-300">
                  {event.$typeArgs[0].split("::")[2]}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
