<script lang="ts">
  export let invertColor = false;
  export let color = "";
  let colorClass = "";

  if (!invertColor) {
    colorClass = invertColor
      ? "text-white dark:text-black"
      : "text-black dark:text-white";
  } else if (color) {
    colorClass = `text-${color}`;
  }
</script>

<svg
  class={colorClass}
  id="Cancel_24"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  ><rect width="24" height="24" stroke="none" fill="#000000" opacity="0" />

  <g transform="matrix(1 0 0 1 12 12)">
    <path
      style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"
      transform=" translate(-12, -12)"
      d="M 12 2 C 6.47 2 2 6.47 2 12 C 2 17.53 6.47 22 12 22 C 17.53 22 22 17.53 22 12 C 22 6.469999999999999 17.53 2 12 2 z M 17 15.59 L 15.59 17 L 12 13.41 L 8.41 17 L 7 15.59 L 10.59 12 L 7 8.41 L 8.41 7 L 12 10.59 L 15.59 7 L 17 8.41 L 13.41 12 L 17 15.59 z"
      stroke-linecap="round" />
  </g>
</svg>
