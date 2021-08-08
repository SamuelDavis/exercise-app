<script lang="ts">
  export let id: string;
  export let value: string = null;
  export let pattern: string = null;
  export let options: ArrayLike<string> = null;

  let content = value ?? "";
  let el: HTMLInputElement;
  let timeout: NodeJS.Timeout;

  $: list = options ? $$props.list ?? `${id}-suggestions` : null;
  $: regexp = new RegExp(pattern ?? ".");
  $: {
    // preserve cursor
    const start = el?.selectionStart;
    const end = el?.selectionEnd;
    // sanitize input
    content = content
      .replaceAll(/\s+/g, " ")
      .split("")
      .filter((v) => regexp.test(v))
      .join("");
    value = content;
    // restore cursor on next tick
    clearTimeout(timeout);
    timeout = setTimeout(() => el?.setSelectionRange(start, end));
  }
</script>

<input
  bind:this={el}
  bind:value={content}
  type="text"
  {pattern}
  {id}
  {list}
  {...$$props}
/>
{#if options}
  <datalist id={list}>
    {#each options ?? [] as value}
      <option {value} />
    {/each}
  </datalist>
{/if}
