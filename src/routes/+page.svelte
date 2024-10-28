<script lang="ts">
  import Post from "$lib/components/post.svelte";
  import { post, relays, req } from "$lib/nostr";
  import type { Nostr } from "nosvelte";
  import { NostrApp, UniqueEventList } from "nosvelte";
  import "websocket-polyfill";

  // 取得したイベントをかなりランダムに並べ替える
  const sorted = (events: Nostr.Event[]) => {
    return [...events].sort(() => Math.random() - 0.5);
  };

  let postContent = "";
  $: submitDisabled = !postContent.trim();

  const submit = async () => {
    const result = await post(postContent);
    if (result) {
      postContent = "";
    }
  };

  const submitKeydown = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === "Enter") {
      submit();
    }
  };
</script>

<NostrApp {relays}>
  <UniqueEventList
    queryKey={["timeline", "feed"]}
    filters={[
      {
        kinds: [10078],
        limit: 200,
        "#d": ["bocchi-namako"],
      },
    ]}
    {req}
    let:events
  >
    <div slot="loading" class="container">
      <p class="center">Loading...</p>
    </div>
    <div slot="error" let:error class="container">
      <p class="center">{error}</p>
    </div>
    <main>
      <div class="p-2 text-end">
        <div class="form mb-2">
          <textarea
            bind:value={postContent}
            on:keydown={submitKeydown}
            placeholder="最近どう？"
            class="form-control"
          ></textarea>
        </div>
        <button on:click={submit} disabled={submitDisabled} class="btn btn-primary"
          >書き込む</button
        >
      </div>
      <section>
        {#each sorted(events) as event (event.id)}
          <Post {event} />
        {/each}
      </section>
    </main>
  </UniqueEventList>
</NostrApp>
