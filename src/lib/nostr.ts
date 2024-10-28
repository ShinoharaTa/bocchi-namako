import { createRxForwardReq } from "rx-nostr";
import {
  generatePrivateKey,
  finishEvent,
  SimplePool,
} from "nostr-tools";
import type { EventTemplate, Event } from "nostr-tools";
const pool = new SimplePool();
import { eventKind, NostrFetcher } from "nostr-fetch";
import type { NostrEvent, FetchFilter } from "nostr-fetch";
import { simplePoolAdapter } from "@nostr-fetch/adapter-nostr-tools";

export const req = createRxForwardReq();

export const relays = [
  "wss://relay-jp.nostr.wirednet.jp",
  "wss://r.kojira.io",
  "wss://yabu.me",
  "wss://relay-jp.shino3.net",
];

export const post = async (
  content: string
) => {
  const key = generatePrivateKey();
  const event: EventTemplate<10078> = {
    kind: 10078,
    content,
    tags: [],
    created_at: Math.floor(new Date().getTime() / 1000),
  };
  event.tags.push(["d", "bocchi-namako"]);
  event.tags.push(["client", "bocchi-namako"]);
  const post = finishEvent(event, key);
  new Promise(() => {
    const pub = pool.publish(relays, post);
    pub.on("failed", (ev: Event) => {
      console.error("failed to send event", ev);
    });
  });
  return true;
};

// export const newAuthor = async (seckey: string) => {
//   const hex = getPublicKey(seckey);
//   const content = {
//     display_name: `んちゃんねるの名無しさん${hex.slice(0, 6)}`,
//     name: `nchan_${hex.slice(0, 6)}`,
//     about:
//       "んちゃんねる (https://nchan.shino3.net) にて作られた匿名アカウントです",
//     nip05: "",
//     website: "",
//     lud16: "shino3@getalby.com",
//     picture: "https://nchan.shino3.net/channel_img.png",
//   };
//   const event: EventTemplate<Kind.Metadata> = {
//     kind: Kind.Metadata,
//     content: JSON.stringify(content),
//     tags: [],
//     created_at: Math.floor(new Date().getTime() / 1000),
//   };
//   event.tags.push(["client", "nchan.shino3.net"]);
//   const post = finishEvent(event, seckey);
//   new Promise(() => {
//     const pub = pool.publish(relays, post);
//     pub.on("failed", (ev: Event) => {
//       console.error("failed to send event", ev);
//     });
//   });
//   return;
// };

const fetcher = NostrFetcher.withCustomPool(simplePoolAdapter(pool));
export const getSingleItem = async (params: { kind: number; id: string }) => {
  const filters: FetchFilter = { kinds: [params.kind], "#e": [params.id] };
  const lastData: NostrEvent | undefined = await fetcher.fetchLastEvent(
    relays,
    filters
  );
  return lastData;
};
