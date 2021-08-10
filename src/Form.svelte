<script lang="ts">
  import Text from "./input/Text.svelte";
  import { exercises, suggest, modalities } from "./stores";
  import type { Set } from "./types";
  import { toDateTimeLocalString } from "./util";

  export let set: Partial<Set> = {
    timestamps: [],
  };

  let interval: NodeJS.Timer;
  let currentTime = toDateTimeLocalString(new Date());

  $: running = Boolean(interval);
  $: timestampPairs = ((length) =>
    new Array(length).fill(undefined).map((_, i) => [i, i + 1]))(
    Math.floor((set.timestamps ?? []).length / 2)
  );

  function onToggleTimer() {
    if (running) {
      clearInterval(interval);
    } else {
      interval = setInterval(
        () => (currentTime = toDateTimeLocalString(new Date()))
      );
    }
  }
</script>

<form on:submit|preventDefault>
  <fieldset>
    <label for="exercise">Exercise</label>
    <Text
      bind:value={set.exercise}
      id="exercise"
      name="exercise"
      options={$exercises}
      required
    />
  </fieldset>
  <fieldset>
    <label for="modality">modality</label>
    <Text
      bind:value={set.modality}
      id="modality"
      name="modality"
      options={$modalities[set.exercise]}
    />
  </fieldset>
  <fieldset>
    <label for="repetitions">repetitions</label>
    <input
      bind:value={set.repetitions}
      list="repetitions-options"
      id="repetitions"
      name="repetitions"
      type="number"
      min="0"
      max="9999"
      step="1"
      required
    />
    <datalist id="repetitions-options">
      {#each $suggest("repetitions", set.repetitions) as value}
        <option {value} />
      {/each}
    </datalist>
  </fieldset>
  <fieldset>
    <label for="workload">Workload</label>
    <input
      bind:value={set.workload}
      id="workload"
      name="workload"
      type="number"
      min="0"
      max="9999"
      step="0.25"
    />
    <datalist id="workload-options">
      {#each $suggest("workload", set.workload) as value}
        <option {value} />
      {/each}
    </datalist>
  </fieldset>
  <fieldset>
    <label for="exertion">Exertion</label>
    <input
      bind:value={set.exertion}
      id="exertion"
      name="exertion"
      type="range"
      min="0"
      max="10"
      step="1"
    />
  </fieldset>
  <fieldset>
    <button type="button" on:click={onToggleTimer}>
      {running ? "Stop" : "Start"} Timer
    </button>
    <details>
      <summary>00:00 elapsed</summary>
      <ol reversed>
        {#each timestampPairs as [a, b]}
          <li>
            <input
              bind:value={set.timestamps[a]}
              type="datetime-local"
              id="timestamps[]"
              name="timestamps[]"
            />
            {#if b in set.timestamps ?? []}
              <input
                bind:value={set.timestamps[b]}
                type="datetime-local"
                id="timestamps[]"
                name="timestamps[]"
              />
            {:else}
              <input
                bind:value={currentTime}
                type="datetime-local"
                id="timestamps[]"
                name="timestamps[]"
              />
            {/if}
          </li>
        {/each}
      </ol>
    </details>
  </fieldset>
  <input
    type="hidden"
    id="id"
    value={set.id ?? `id-${new Date().getTime()}-${Math.random()}`}
  />
  <input type="submit" />
</form>
