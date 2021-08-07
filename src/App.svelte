<script lang="ts">
  import TimestampsDialog from "./lib/TimestampsDialog.svelte";

  import { sets } from "./stores";

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
      ...$sets,
      {
        id: String(new Date().getTime() + Math.random()),
        exercise: "",
        modality: "",
        repetitions: 0,
        workload: 0,
        exertion: 0,
        timestamps: [],
      },
    ];
  }
</script>

<main>
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
            <input
              bind:value={set.exercise}
              type="text"
              id={`exercise-${set.id}`}
              name={`exercise-${set.id}`}
              pattern="[\w\-\(\) ]+"
              required
              list={`exercise-suggestions-${set.id}`}
            />
            <datalist id={`exercise-suggestions-${set.id}`} />
          </td>
          <td>
            <input
              bind:value={set.modality}
              type="text"
              id={`modality-${set.id}`}
              name={`modality-${set.id}`}
              pattern="[\w\-\(\) ]+"
              list={`modality-suggestions-${set.id}`}
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
              min="0"
              max="9999"
              required
            />
          </td>
          <td>
            <input
              bind:value={set.exertion}
              type="range"
              id={`exertion-${set.id}`}
              name={`exertion-${set.id}`}
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
                <span>
                  {set.timestamps.length
                    ? new Date(set.timestamps[0]).toLocaleString()
                    : ""}
                </span>
                <button
                  on:click={onEditTimestamps.bind(null, set)}
                  id={`timestamps-${set.id}`}
                  name={`timestamps-${set.id}`}
                >
                  Edit
                </button>
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
      <tr>
        <td>
          <button on:click={onAdd}>Add Set</button>
        </td>
      </tr>
    </tbody>
  </table>
</main>
