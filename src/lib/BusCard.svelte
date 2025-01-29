<!-- src/lib/BusSchedule.svelte -->
<script lang="ts">
    import { fly, fade } from 'svelte/transition';

    let {stopId, name} = $props();

    interface Departure {
        line: string;
        direction: string;
        departure: string;
    }

    let departures = $state<Departure[]>([]);
    let loading = $state(true);
    let error = $state<string | null>(null);
    let refreshInterval = $state<NodeJS.Timeout>();

    async function fetchData() {
        error = null;
        loading = true;

        try {
            const cookieResponse = await fetch(`/api/schedule/GetSessionCookie/${stopId}`);
            const cookieData = await cookieResponse.json();
            const cookies = cookieData["AspCookie"];

            const response = await fetch(`/api/schedule/GetDepartures/${stopId}`, {
                method: 'POST',
                body: JSON.stringify({ AspCookie: cookies }),
            });
            const data = await response.json();

            if (data.error) throw new Error(data.error);

            departures = data.departures;
        } catch (err) {
            error = (err as Error).message;
        } finally {
            loading = false;
        }
    }

    $effect(() => {
        fetchData();
        refreshInterval = setInterval(fetchData, 30_000);

        return () => {
            clearInterval(refreshInterval);
            departures = [];
        };
    });
</script>

<div class="h-full w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-all duration-300 hover:shadow-md flex flex-col">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
        <div>
            <h2 class="text-xl font-semibold text-gray-800">
                {name}
            </h2>
        </div>
    </div>

    <!-- Content -->
    {#if loading}
        <div class="space-y-3">
            {#each { length: 3 } as _}
                <div class="h-12 bg-gray-100 animate-pulse rounded-lg" />
            {/each}
        </div>
    {:else if error}
        <div class="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-3">
            <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
            >
                <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
            </svg>
            <span>{error}</span>
        </div>
    {:else}
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                <tr class="text-left text-gray-500 border-b border-gray-200">
                    <th class="pb-3 font-medium">Linia</th>
                    <th class="pb-3 font-medium">Kierunek</th>
                    <th class="pb-3 font-medium text-right">Odjazd</th>
                </tr>
                </thead>
                <tbody>
                {#each departures as departure (departure.line + departure.direction + departure.departure)}
                    <tr
                            class="group hover:bg-gray-50 transition-colors"
                            in:fly={{ y: 10, duration: 200 }}
                            out:fade
                    >
                        <td class="py-3 font-medium text-gray-900">
                            <div class="w-10 h-6 flex items-center justify-center bg-blue-100 text-blue-800 rounded">
                                {departure.line}
                            </div>
                        </td>
                        <td class="py-3 text-gray-600">{departure.direction}</td>
                        <td class="py-3 text-right">
                <span
                        class:font-semibold={departure.departure.includes('min')}
                        class:text-green-600={departure.departure.includes('min')}
                        class:text-gray-500={!departure.departure.includes('min')}
                >
                  {departure.departure}
                </span>
                        </td>
                    </tr>
                {:else}
                    <tr>
                        <td colspan="3" class="py-6 text-center text-gray-500">
                            Brak odjazdów.
                        </td>
                    </tr>
                {/each}
                </tbody>
            </table>
        </div>
    {/if}
</div>