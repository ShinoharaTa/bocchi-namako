<script lang="ts">
  import { parseContent, parseCreated } from "$lib/app";
  import type { Nostr } from "nosvelte";

  export let event: Nostr.Event<Nostr.Kind.Text>;
  // export let metadata: Nostr.Event<Nostr.Kind.Metadata>;
  const parsed = parseContent(event.content);
</script>

<article class="my-2">
  <div class="d-flex">
    <div style={`border: 3px solid #${event.pubkey.slice(0, 6)}88;`}>
      <!-- {event.pubkey.slice(0, 6)} -->
    </div>
    <div class="ms-2 flex-fill">
      <!-- <div class="time">{parseCreated(event.created_at)}</div> -->
      <div class="content">{parsed.text_without_urls}</div>
      {#each parsed.other_urls as url}
        <div class="content">
          <a href={url} target="_blank">
            {url}
          </a>
        </div>
      {/each}
    </div>
  </div>
</article>

<style>
  .time {
    font-size: 0.8rem;
    font-weight: 600;
    text-align: right;
  }

  .content {
    white-space: pre-wrap;
    word-wrap: break-word;
    word-break: break-word; /* break-allよりもbreak-wordの方が見た目が自然 */
  }
</style>