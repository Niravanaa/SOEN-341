<script lang="ts">
  /*
  Static Analysis: This file is responsible for rendering the browse vehicles page. It contains the logic for filtering cars based on user preferences and displaying them in a paginated format. It also includes the logic for handling user interactions such as favoriting/unfavoriting cars and displaying car details in a modal.
  1. Select Appropriate Tools: ESLINT and PRETTIER
  2. Integrate into Build Process - Done
  3. Establish Baseline: Done since first implementation of ESLINT and PRETTIER
  4. Define Coding Standards: Same as [3]
  5. Customize Rules: Same as [3]
  6. Regularly Update Rules : done.
  7. Use Pre-commit Hooks : done, always been implemented.
  8. Continuous Integration (CI) Integration: already included.
  9. Set Quality Gates: same as [8].
  10. Utilize Git Hooks: npx cz ~ done.
  11. Configure Exclusions: same as [5].
  12. Leverage Editor Integration: PRETTIER - done.
  13. Address False Positives - done.
  14. Educate the Team - done.
  15. Automated Code Reviews - on commit (save).
  16. Monitor Trends: history included.
  17. Include Security Scans: always done during npm.
  18. Documentation - Done by Jeremy for this page.
  19. Periodic Reviews - Done during scrum time and PR.

  */
  // Importing necessary types and utilities from the skeleton library and other modules.
  import {
    type PaginationSettings, // Types for pagination settings
    type ModalComponent, // Type for modal components
    type ToastSettings, // Type for toast settings
    getModeUserPrefers, // Utility function to get user's preferred mode
  } from "@skeletonlabs/skeleton";
  import {
    getModalStore,
    type ModalSettings,
    Paginator,
  } from "@skeletonlabs/skeleton";
  import { TreeView, TreeViewItem } from "@skeletonlabs/skeleton";
  import { getToastStore } from "@skeletonlabs/skeleton";
  import type { $Enums, Car } from "@prisma/client";
  import { ProgressRadial } from "@skeletonlabs/skeleton";
  import ViewCarModal from "$lib/components/modals/ViewCarModal.svelte";
  import RangeSlider from "svelte-range-slider-pips";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import flatpickr from "flatpickr";
  import { modeCurrent } from "@skeletonlabs/skeleton";

  // Declares reactive data and some local state variables for managing UI state.
  export let data;

  const modalStore = getModalStore();
  const toastStore = getToastStore();

  let { cars } = data; // Destructuring cars from external data
  let maximumPrice = 3000;
  let minimumPrice = 0;
  if (cars.length > 0)
    maximumPrice = Math.max(...cars.map((car) => car.dailyPrice)) / 100;
  if (cars.length > 0)
    minimumPrice = Math.min(...cars.map((car) => car.dailyPrice)) / 100;
  let values = [minimumPrice, maximumPrice];
  let { branches } = data;
  let { likedVehiclesIDs } = data;

  let selectedCarColour = "No Specific Color";
  let selectedCarType = "No Specific Type";
  let selectedBranch = Number(data.branchId) || -1;
  let filterByFavorites = false;
  let isLoading = false;
  let particularIndex = -1;

  let startDate: Date;
  let endDate: Date;
  let ref: Node;
  let disableFilterButton = false;

  $: likedVehiclesIDs;

  // Svelte store reactivity to update the theme for Flatpickr dynamically.
  let themeMode = getModeUserPrefers() ? "material_blue" : "dark";

  $: {
    // Update theme mode based on current mode
    themeMode = $modeCurrent ? "material_blue" : "dark";
    // Update Flatpickr theme dynamically
    onMount(() => {
      const link = document.getElementById(
        "flatpickr-theme",
      ) as HTMLAnchorElement;
      link.href = `https://npmcdn.com/flatpickr/dist/themes/${themeMode}.css`;
    });
  }
  let uniqueType: $Enums.CarType[];
  let uniqueColors: $Enums.CarColour[];

  if (cars) uniqueType = [...new Set(cars.map((car) => car.carsize))];
  if (cars) uniqueColors = [...new Set(cars.map((car) => car.colour))];

  onMount(() => {
    // If carId is provided in URL, show popup for that car
    if ($page.url.searchParams.get("carId")) {
      const popUpCar = cars.find(
        (car) => car.id == Number($page.url.searchParams.get("carId")),
      );

      if (!popUpCar) return;

      showPopup(popUpCar);
    }

    // Sets up date picking functionality using Flatpickr.
    flatpickr(ref, {
      allowInput: true,
      clickOpens: true,
      minDate: new Date(),
      static: true,
      mode: "range",
      enableTime: true,
      position: "below center",
      onChange: (selectedDates) => {
        if (selectedDates.length === 2) {
          startDate = selectedDates[0];
          endDate = selectedDates[1];
          disableFilterButton = false;
        } else {
          disableFilterButton = true;
        }
      },
    });
  });

  $: paginatedCars = cars.slice(
    paginationSettings.page * paginationSettings.limit,
    paginationSettings.page * paginationSettings.limit +
      paginationSettings.limit,
  );

  // Pagination settings and logic for handling user interactions.
  let paginationSettings = {
    page: 0,
    limit: 10,
    size: cars.length,
    amounts: [1, 2, 5, 10],
  } satisfies PaginationSettings;

  // Utility function to format strings into Title Case.
  function toTitleCase(str: string) {
    return str.toLowerCase().replace(/\b\w/g, function (char) {
      return char.toUpperCase();
    });
  }

  // Function to display a modal with car details.
  function showPopup(car: Car) {
    const modalComponent: ModalComponent = {
      ref: ViewCarModal,
      props: {
        car: car,
      },
    };

    const modal: ModalSettings = {
      type: "component",
      component: modalComponent,
      response: (r: boolean | undefined) => {
        if (!r) goto("/browse-vehicles");
      },
    };

    modalStore.trigger(modal);

    goto(`/browse-vehicles?carId=${car.id}`);

    return null;
  }

  // Event handler for filtering cars based on selected criteria.
  function handleFilter(): void {
    if ((startDate && !endDate) || (!startDate && endDate)) return; // Ensure both dates are selected.
    cars = [];
    isLoading = true;
    const formData = new FormData();

    // Code to fetch and update the cars list based on the filter criteria.
    if (selectedCarType !== "No Specific Car Type")
      formData.append("carsize", selectedCarType);

    if (selectedCarColour !== "No Specific Colour")
      formData.append("colour", selectedCarColour);

    formData.append("minPrice", values[0].toString());
    formData.append("maxPrice", values[1].toString());

    if (startDate && endDate) {
      formData.append("startDate", startDate.toISOString());
      formData.append("endDate", endDate.toISOString());
    }

    if (filterByFavorites) formData.append("filterFavorite", "true");

    // This function handles filtering cars based on the selected criteria.
    fetch("?/searchCars", {
      method: "POST", // Sending a POST request to the server
      body: formData, // Sending form data containing filter criteria
    })
      .then((res: Response) => {
        if (res.ok) {
          return res.json(); // If response is OK, parse JSON data
        } else {
          // If there's an error, trigger a toast notification
          const cancelErrorToast: ToastSettings = {
            message: "There was an error filtering cars.",
            background: "variant-filled-error",
            autohide: false,
          };

          toastStore.trigger(cancelErrorToast);
        }
      })
      .then((data) => {
        const jsonData = JSON.parse(data.data); // Parse JSON data

        const fetchedCars = []; // Initialize an array to store fetched cars

        // Loop through the JSON data and parse each item, then push it to the fetchedCars array
        for (const item of jsonData) {
          const parsedItem = JSON.parse(item);
          fetchedCars.push(parsedItem);
        }

        const flattenedCars = fetchedCars.reduce((acc, current) => {
          return acc.concat(current);
        }, []);

        // Update UI state variables
        isLoading = false;
        cars = flattenedCars;
        paginationSettings.size = cars.length;
        paginationSettings.page = 0;
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }

  // This function handles changing the like status of a car.
  function changeLikeStatus(carId: number, cardIndex: number) {
    particularIndex = cardIndex;

    const formData = new FormData();

    // If user data is not available, return
    if (!data.user) return;

    // Append user ID, car ID, and status (favorite/unfavorite) to FormData
    formData.append("userId", data.user.id.toString());
    formData.append("carId", carId.toString());
    formData.append(
      "status",
      likedVehiclesIDs.includes(carId) ? "Unfavorite" : "Favorite",
    );

    // Send a POST request to set the like status of the car
    fetch("?/setLikeStatus", {
      method: "POST",
      body: formData,
    })
      .then(() => {
        // If successful, trigger a success toast notification
        const successFavoriteToast: ToastSettings = {
          message:
            "Vehicle was " +
            (likedVehiclesIDs.includes(carId) ? "unfavorited" : "favorited") +
            " successfully.",
          background: "variant-filled-success",
        };

        toastStore.trigger(successFavoriteToast);

        // Update likedVehiclesIDs array based on the like status change
        if (!likedVehiclesIDs.includes(carId)) {
          likedVehiclesIDs.push(carId);
        } else {
          likedVehiclesIDs = likedVehiclesIDs.filter(
            (id: number) => id !== carId,
          );
        }

        // Reset particularIndex after a brief delay
        setTimeout(() => {
          particularIndex = -1;
        }, 100);
      })
      .catch((err) => {
        console.log(err);
        // If there's an error, trigger an error toast notification
        const errorFavoriteToast: ToastSettings = {
          message:
            "Could not " +
            (likedVehiclesIDs.includes(carId) ? "unfavorite" : "favorite") +
            " vehicle.",
          background: "variant-filled-error",
        };
        toastStore.trigger(errorFavoriteToast);

        // Reset particularIndex after a brief delay
        setTimeout(() => {
          particularIndex = -1;
        }, 100);
      });

    return null;
  }
</script>

<!-- Styling Import: Flatpickr theme -->
<link
  rel="stylesheet"
  type="text/css"
  href="https://npmcdn.com/flatpickr/dist/themes/{themeMode}.css"
  id="flatpickr-theme" />

<!-- Search Filters Section -->
<div class="card my-2 space-y-2 pb-2 pr-4">
  <!-- TreeView Component for Filter Options -->
  <TreeView>
    <TreeViewItem>
      <h6 class="h6 font-bold">Search Filters</h6>
      <svelte:fragment slot="children">
        <!-- Filter Options Container -->
        <div class="space-y-4 p-4">
          <!-- Car Type Filter -->
          <label class="label mt-2">
            <span>Car Type</span>
            <!-- Dropdown for Car Types -->
            <select class="select" bind:value={selectedCarType}>
              <option value={"No Specific Type"}>No Specific Type</option>
              <!-- Render Options for Each Unique Car Type -->
              {#each uniqueType as carsize}
                <option value={carsize}>{toTitleCase(carsize)}</option>
              {/each}
            </select>
          </label>
          <label class="label mt-2">
            <!-- Car Color Filter -->
            <span>Car Color</span>
            <!-- Dropdown for Car Colors -->
            <select class="select" bind:value={selectedCarColour}>
              <option value={"No Specific Color"}>No Specific Color</option>
              <!-- Render Options for Each Unique Car Color -->
              {#each uniqueColors as colour}
                <option value={colour}>{toTitleCase(colour)}</option>
              {/each}
            </select>
          </label>
          <!-- Branch Location Filter -->
          <label class="label">
            <span>Branch Location</span>
            <!-- Dropdown for Branch Locations -->
            <select class="select" bind:value={selectedBranch}>
              <option value={-1}>No Specific Branch</option>
              <!-- Render Options for Each Branch -->
              {#each branches as branch}
                <option value={branch.id}>{branch.name}</option>
              {/each}
            </select>
          </label>
          <!-- Price Range Slider -->
          <div class="row py-6">
            <p class="pb-6">Minimum and Maximum Price</p>
            <!-- Range Slider Component -->
            <RangeSlider
              bind:values
              min={minimumPrice}
              max={maximumPrice}
              range
              pips
              pushy
              pipstep={40}
              float
              first="label"
              suffix="$"
              last="label" />
          </div>
          <!-- Date Range Input -->
          <div class="space-y-4">
            <label class="label">
              <span>Start and End Dates</span>
              <!-- Input Field for Date Range -->
              <input
                class="center input mx-auto ml-4 mt-4 w-60 sm:w-80"
                bind:this={ref} />
            </label>
            <!-- Checkbox to Filter by Favorites -->
            {#if data.user}
              <label class="label">
                <input
                  class="checkbox"
                  type="checkbox"
                  bind:checked={filterByFavorites} />
                <span>Filter by Favorites</span>
              </label>
            {/if}
          </div>
          <!-- Filter Button -->
          <button
            class="btn mx-auto block w-20 bg-primary-500"
            on:click={handleFilter}
            disabled={disableFilterButton}>Filter</button>
        </div>
      </svelte:fragment>
    </TreeViewItem>
  </TreeView>
</div>

<!-- Loading and No Results Indicators -->
{#if isLoading}
  <!-- Loading Indicator -->
  <div class="mt-4 flex flex-col items-center justify-center space-y-4">
    <div class="flex items-center justify-center">
      <ProgressRadial value={undefined} class="w-9" />
    </div>
    <p>Searching for Cars</p>
  </div>
{:else if cars.length === 0}
  <!-- No Results Indicator -->
  <div class="mt-2 flex flex-col items-center justify-center">
    <p class="card my-12 p-4">No cars found</p>
  </div>
{/if}

<!-- Car Listings Display -->
<div class="my-2 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
  {#each paginatedCars as car, idx}
    <div class="card p-4">
      <!-- Car Image -->
      <img
        src={car.photoUrl || "https://placehold.co/600x400"}
        alt="Car"
        class="mx-auto mb-4 h-auto w-full rounded" />
      <!-- Car Model -->
      <h2 class="mb-2 text-lg font-semibold">{car.model}</h2>
      <!-- Car Description -->
      <p>{car.description}</p>
      <div class="mt-4 flex">
        <!-- Favorite Button -->
        {#if data.user}
          {#if particularIndex !== idx}
            <!-- Button to Favorite/Unfavorite Car -->
            <button
              on:click={() => changeLikeStatus(car.id, idx)}
              class="btn mx-auto mt-2 block {likedVehiclesIDs.includes(car.id)
                ? 'bg-tertiary-500'
                : 'bg-primary-500'}"
              disabled={particularIndex === idx}>
              {likedVehiclesIDs.includes(car.id) ? "Unfavorite" : "Favorite"}
            </button>
          {:else}
            <!-- Loading Button -->
            <button class="btn mx-auto mt-2 block bg-surface-500"
              >Loading</button>
          {/if}
        {/if}
        <!-- Button to Show Car Details -->
        <button
          on:click={showPopup(car)}
          class="btn mx-auto mt-2 block bg-primary-500">
          Show Details
        </button>
      </div>
    </div>
  {/each}
</div>

<!-- Pagination Component -->
<Paginator
  bind:settings={paginationSettings}
  showFirstLastButtons={false}
  showPreviousNextButtons={true}
  amountText="Cars" />

<!-- Custom CSS Variables for Range Slider -->
<style>
  :root {
    --range-slider: hwb(180 46% 51%);
    --range-handle-inactive: hsl(180, 4.6%, 61.8%);
    --range-handle: neon-green;
    --range-handle-focus: hsl(244.1, 63.2%, 54.1%);
    --range-handle-border: neon-green;
    --range-range-inactive: hsl(180, 4.6%, 61.8%);
    --range-range: hsl(244.1, 63.2%, 54.1%);
    --range-float-inactive: hsl(180, 4.6%, 61.8%);
    --range-float: hsl(244.1, 63.2%, 54.1%);
    --range-float-text: hsl(0, 0%, 100%);

    --range-pip: hsl(210, 14.3%, 53.3%);
    --range-pip-text: hsl(211, 38%, 75%);
    --range-pip-active: hsl(180, 25.4%, 24.7%);
    --range-pip-active-text: hsl(180, 39%, 60%);
    --range-pip-hover: hsl(180, 25.4%, 24.7%);
    --range-pip-hover-text: hsl(180, 25.4%, 24.7%);
    --range-pip-in-range: hsl(123, 70%, 42%);
    --range-pip-in-range-text: hsl(180, 25.4%, 24.7%);
  }
</style>
