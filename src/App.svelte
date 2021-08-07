<script lang="ts">
  import type { Dict, Set } from "./types";
  import { sets } from "./stores";

  type TimeElapsed = { timestamp: string; aria: string; elapsed: string };

  $: elapsed = $sets.reduce<Dict<TimeElapsed>>(
    (acc, set) => ({ ...acc, [set.id]: parseElapsed(set.timestamps) }),
    {}
  );

  function onEditTimestamps(id: Set["id"]) {
    throw new Error("not implemented");
  }
  function onDeleteSet(set: Set) {
    $sets = $sets.filter((item) => item !== set);
  }
  function onShowDetails(timestamps: Set["timestamps"], e: Event) {
    if (timestamps.length === 0) e.preventDefault();
  }
  function onAddSet() {
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

  function parseElapsed(timestamps: Date[]): TimeElapsed {
    if (timestamps.length < 2)
      return {
        timestamp: "",
        aria: "no time elapsed",
        elapsed: "00:00",
      };

    const first = timestamps[0];
    const last = timestamps[timestamps.length - 1];
    const msElapsed = timestamps.reduce((acc, timestamp, i) => {
      return i % 2 === 0
        ? acc - timestamp.getTime()
        : acc + timestamp.getTime();
    }, 0);
    const secElapsed = Math.floor(msElapsed / 1000);

    const minutesElapsed = Math.floor(secElapsed / 60);
    const secondsElapsed = secElapsed % 60;

    const timestamp = `${first.toLocaleString()} to ${last.toLocaleTimeString()}`;
    const aria = `${minutesElapsed} minutes and ${secondsElapsed} seconds elapsed`;
    const elapsed = [minutesElapsed, secondsElapsed]
      .map((n) => `0${n}`.slice(-2))
      .join(":");

    return { timestamp, aria, elapsed };
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
                <span>{set.timestamps[0]?.toLocaleString() ?? ""}</span>
                <button
                  on:click={onEditTimestamps.bind(null, set.timestamps)}
                  type="button"
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
            <span />
          </td>
          <td>
            <button
              on:click={onDeleteSet.bind(null, set)}
              type="button"
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
          <button on:click={onAddSet} type="button" title="add empty set">
            &plus;
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</main>
