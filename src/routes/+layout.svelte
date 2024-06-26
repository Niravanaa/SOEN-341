<script lang="ts" context="module">
  import type { PageData } from "./$types";
  import type { SvelteComponent } from "svelte";
  import ViewCarModal from "$lib/components/modals/ViewCarModal.svelte";

  export type User = PageData["user"];

  export type Link = {
    name: string;
    href: string;
    icon: typeof SvelteComponent;
  };
</script>

<script lang="ts">
  import "../app.postcss";
  import { dev } from "$app/environment";
  import { inject } from "@vercel/analytics";
  inject({ mode: dev ? "development" : "production" });

  import {
    computePosition,
    autoUpdate,
    offset,
    shift,
    flip,
    arrow,
  } from "@floating-ui/dom";

  import {
    initializeStores,
    AppShell,
    AppBar,
    Avatar,
    Drawer,
    getDrawerStore,
    Toast,
    LightSwitch,
    Modal,
    popup,
    storePopup,
    type PopupSettings,
    modeCurrent,
  } from "@skeletonlabs/skeleton";
  import type { ModalComponent } from "@skeletonlabs/skeleton";
  import ModalComponentTest from "$lib/components/modals/ModalComponentTest.svelte";
  import MobileNavigation from "$lib/components/MobileNavigation.svelte";
  import MagnifyingGlass from "$lib/icons/MagnifyingGlass.svelte";
  import HamburgerMenuIcon from "$lib/icons/HamburgerMenuIcon.svelte";
  import CarIcon from "$lib/icons/CarIcon.svelte";
  import HomeIcon from "$lib/icons/HomeIcon.svelte";
  import ProfilePopup from "$lib/components/ProfilePopup.svelte";
  import NavBar from "$lib/components/NavBar.svelte";

  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

  initializeStores();

  export let data;
  const modalRegistry: Record<string, ModalComponent> = {
    modalComponentTest: { ref: ModalComponentTest },
    viewCarModalComponent: { ref: ViewCarModal },
  };

  const drawerStore = getDrawerStore();

  function drawerOpen() {
    drawerStore.open();
  }

  const profilePopup: PopupSettings = {
    event: "click",
    target: "profilePopup",
    placement: "bottom",
  };

  $: initials =
    data?.user?.name
      .match(/(\b\S)?/g)
      ?.join("")
      ?.match(/(^\S|\S$)?/g)
      ?.join("") ?? "?";

  type SvelteComponent = typeof import("svelte").SvelteComponent;

  const links: Link[] = [
    { name: "Home", href: "/", icon: HomeIcon as SvelteComponent },
    {
      name: "Browse Vehicles",
      href: "/browse-vehicles",
      icon: CarIcon as SvelteComponent,
    },
    {
      name: "Find a Branch",
      href: "/find-branch",
      icon: MagnifyingGlass as SvelteComponent,
    },
  ];
</script>

<Toast position="br" zIndex="z-[1000]" />

<Modal components={modalRegistry} />

<Drawer>
  <MobileNavigation {links} />
</Drawer>

<AppShell slotSidebarLeft="w-0 md:w-52 bg-surface-500/10" class="bg-light-100">
  <svelte:fragment slot="header">
    <AppBar padding="py-0 px-4">
      <svelte:fragment slot="lead">
        <button class="btn btn-sm mr-4 md:hidden" on:click={drawerOpen}>
          <HamburgerMenuIcon />
        </button>
        <a href="/" class="h-10">
          <img
            src={$modeCurrent
              ? "/SiteLogoForDark.png"
              : "/SiteLogoForLight.png"}
            alt="DriveXperience"
            class="h-full" />
        </a>
      </svelte:fragment>
      <NavBar {links} />
      <svelte:fragment slot="trail">
        <LightSwitch class="mr-2" />
        <div use:popup={profilePopup}>
          <div use:popup={profilePopup}>
            <Avatar
              {initials}
              background="bg-tertiary-500"
              width="w-12"
              border="border-4 border-surface-300-600-token hover:!border-primary-500"
              cursor="cursor-pointer" />
          </div>
          <ProfilePopup user={data.user} />
        </div></svelte:fragment>
    </AppBar>
  </svelte:fragment>
  <div class="container mx-auto p-10">
    <slot />
  </div>
  <svelte:fragment slot="pageFooter">
    <footer
      class="py-20 text-center"
      style="background-color: var(--color-surface-800);">
      <div class="footer-links">
        <a href="/contact-us" class="p-2">Contact Us</a>
        <a href="/our-policies" class="p-2">Our Policies</a>
        <a href="/our-promotions" class="p-2">Our Promotions</a>
      </div>
      <div>© 2024 DriveXperience. All rights reserved.</div>
    </footer>
  </svelte:fragment>
</AppShell>
