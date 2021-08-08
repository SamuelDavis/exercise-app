<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import type { Set } from "../types";
  import { parseElapsed, toDateTimeLocalString } from "../util";

  export let set: Set;

  const dispatch = createEventDispatcher();

  let dialog: HTMLDialogElement;

  $: elapsed = parseElapsed(set.timestamps.map((ts) => new Date(ts)));
  $: timestampPairs = new Array(Math.ceil(set.timestamps.length / 2))
    .fill(undefined)
    .map((_, i) => {
      let end = set.timestamps.length - 1 - i * 2;
      return [end - 1, end];
    });

  function onClose() {
    if ($$props.open) dispatch("close");
  }
  function onRemove(i: number) {
    set.timestamps = [
      ...set.timestamps.slice(0, i),
      ...set.timestamps.slice(i + 2),
    ];
  }
  function onAdd() {
    set.timestamps = [
      ...set.timestamps,
      toDateTimeLocalString(new Date()),
      toDateTimeLocalString(new Date()),
    ];
  }
</script>

<dialog bind:this={dialog} {...$$props}>
  <header>
    <h1>{set.exercise}</h1>
    <div title={elapsed.aria}>
      <span>{elapsed.timestamp}</span>
      <span>({elapsed.elapsed} elapsed)</span>
    </div>
    <button on:click={onClose}>Close Dialog</button>
  </header>
  <hr />
  <button on:click={onAdd}>Add Timestamps</button>
  <ol reversed>
    {#each timestampPairs as [a, b]}
      <li>
        <input
          required
          type="datetime-local"
          id={`timestamps[${set.id}][${a}]`}
          name={`timestamps[${set.id}][${a}]`}
          bind:value={set.timestamps[a]}
          step="1"
          min={a - 1 in set.timestamps ? set.timestamps[a - 1] : null}
        />
        <input
          aria-label="interval start"
          required
          type="datetime-local"
          id={`timestamps[${set.id}][${b}]`}
          name={`timestamps[${set.id}][${b}]`}
          bind:value={set.timestamps[b]}
          step="1"
          min={set.timestamps[a]}
        />
        <button on:click={onRemove.bind(null, a)} title="delete">
          &times;
        </button>
      </li>
    {/each}
  </ol>
</dialog>

<style>
  header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  header h1 {
    margin: 0;
  }
</style>
