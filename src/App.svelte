<script lang="ts">
  import Text from "./input/Text.svelte";
  import TimestampsDialog from "./lib/TimestampsDialog.svelte";

  import { exercises, modalities, sets } from "./stores";

  import type { Dict, Set, TimeElapsed } from "./types";
  import { parseElapsed } from "./util";

  let timestampDialogTarget: Set = null;

  $: elapsed = $sets.reduce<Dict<TimeElapsed>>(
    (acc, set) => ({
      ...acc,
      [set.id]: parseElapsed(set.timestamps.map((ts) => new Date(ts))),
    }),
    {}
  );

  function onShowDetails(timestamps: Set["timestamps"], e: Event) {
    if (timestamps.length === 0) e.preventDefault();
  }
  function onEditTimestamps(set: Set) {
    timestampDialogTarget = set;
  }
  function onCloseTimestampDialog() {
    timestampDialogTarget = null;
  }
  function onDelete(set: Set) {
    $sets = $sets.filter((item) => item !== set);
  }
  function onAdd() {
    $sets = [
      {
        id: String(new Date().getTime() + Math.random()),
        exercise: "",
        modality: "",
        repetitions: 0,
        workload: 0,
        exertion: 0,
        timestamps: [],
      },
      ...$sets,
    ];
  }
  function onExportCSV() {
    const headers = [
      "id",
      "exercise",
      "modality",
      "repetitions",
      "workload",
      "exertion",
      "timestamps",
    ];
    const rows = $sets.map((set) => {
      return [
        set.id,
        set.exercise,
        set.modality,
        set.repetitions,
        set.workload,
        set.exertion,
        set.timestamps.join(","),
      ];
    });

    const text = [headers, ...rows]
      .map((row) => row.map((col) => JSON.stringify(col)).join(","))
      .join("\n");
    const a = window.document.createElement("a");
    a.href = window.URL.createObjectURL(new Blob([text], { type: "text/csv" }));
    a.download = "ex-app-export.csv";
    a.click();
  }
</script>

<main>
  <button on:click={onAdd}>Add Set</button>
  <button on:click={onExportCSV}>Export as CSV</button>
  <table>
    <thead>
      <tr>
        <th><label for="exercise">Exercise</label></th>
        <th><label for="modality">Modality</label></th>
        <th><label for="repetitions">Repetitions</label></th>
        <th><label for="workload">Workload</label></th>
        <th><label for="exertion">Exertion</label></th>
        <th><label for="timestamps">Timestamps</label></th>
        <th><label for="delete">Delete</label></th>
      </tr>
    </thead>
    <tbody>
      {#each $sets as set (set.id)}
        <tr>
          <td>
            <Text
              bind:value={set.exercise}
              type="text"
              id={`exercise-${set.id}`}
              name={`exercise-${set.id}`}
              pattern="[\w\(\)\- ]"
              options={$exercises}
              required
            />
          </td>
          <td>
            <Text
              bind:value={set.modality}
              type="text"
              id={`modality-${set.id}`}
              name={`modality-${set.id}`}
              pattern="[\w\(\)\- ]"
              options={$modalities[set.exercise]}
            />
            <datalist id={`modality-suggestions-${set.id}`} />
          </td>
          <td>
            <input
              bind:value={set.repetitions}
              type="number"
              id={`repetitions-${set.id}`}
              name={`repetitions-${set.id}`}
              step="1"
              min="0"
              max="9999"
              required
            />
          </td>
          <td>
            <input
              bind:value={set.workload}
              type="number"
              id={`workload-${set.id}`}
              name={`workload-${set.id}`}
              step="0.25"
              min="0"
              max="9999"
              required
            />
          </td>
          <td>
            <input
              bind:value={set.exertion}
              type="range"
              step="1"
              min="0"
              max="10"
              required
            />
            <input
              bind:value={set.exertion}
              readonly
              id={`exertion-${set.id}`}
              name={`exertion-${set.id}`}
              type="number"
              step="1"
              min="0"
              max="10"
              required
            />
          </td>
          <td>
            <details
              on:click={onShowDetails.bind(null, set.timestamps)}
              title={elapsed[set.id].aria}
            >
              <summary>
                <button
                  on:click={onEditTimestamps.bind(null, set)}
                  id={`timestamps-${set.id}`}
                  name={`timestamps-${set.id}`}
                >
                  Edit
                </button>
                <span>
                  {set.timestamps.length
                    ? new Date(set.timestamps[0]).toLocaleString()
                    : ""}
                </span>
              </summary>
              <div>
                <span>{elapsed[set.id].timestamp}</span>
                <span>({elapsed[set.id].elapsed})</span>
              </div>
            </details>
            <TimestampsDialog
              bind:set
              on:close={onCloseTimestampDialog}
              open={set === timestampDialogTarget}
            />
          </td>
          <td>
            <button
              on:click={onDelete.bind(null, set)}
              id={`delete-${set.id}`}
              name={`delete-${set.id}`}
              aria-label="delete"
            >
              &times;
            </button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</main>

<style>
  table {
    border-collapse: collapse;
  }
  th {
    text-align: left;
    border-bottom: 2px solid black;
  }
</style>
