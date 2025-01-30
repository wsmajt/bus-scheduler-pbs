<script lang="ts">
	import { fly, fade } from 'svelte/transition';

	let { name } = $props();

	interface Departure {
		line: string;
		direction: string;
		departure: string;
		track: string;
		isLate: boolean;
	}

	let departures = $state<Departure[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let refreshInterval = $state<NodeJS.Timeout>();
	let initialLoad = $state(true);

	async function fetchData() {
		error = null;
		if (initialLoad) {
			loading = true;
		}

		try {
			const response = await fetch('/api/schedule/PKP');
			const data = await response.json();

			if (data.error) throw new Error(data.error);

			departures = data.map((train : any) => ({
				line: `${train.carrier} ${train.number}`,
				direction: train.direction,
				departure: train.time,
				track: train.track
			}));

			initialLoad = false;
		} catch (err) {
			error = (err as Error).message;
			departures = [];
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		fetchData();
		refreshInterval = setInterval(fetchData, 30_000);

		return () => {
			clearInterval(refreshInterval);
		};
	});
</script>

<div class="h-full w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-all duration-300 hover:shadow-md flex flex-col">
	<div class="flex items-center justify-between mb-6">
		<div>
			<h2 class="text-xl font-semibold text-gray-800">
				{name}
			</h2>
		</div>
	</div>

	{#if loading && initialLoad}
		<div class="space-y-3">
			{#each { length: 3 } as _}
				<div class="h-12 bg-gray-100 animate-pulse rounded-lg" />
			{/each}
		</div>
	{:else if error}
		<div class="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-3 animate-pulse">
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
				{#each departures as departure}
					<tr
						class="group hover:bg-gray-50 transition-colors"
						in:fly={{ y: 10, duration: 200 }}
						out:fade
					>
						<td class="py-3 font-medium text-gray-900">
							<div class="w-20 h-6 flex items-center justify-center bg-blue-100 text-blue-800 rounded">
								{departure.line}
							</div>
						</td>
						<td class="py-3 text-gray-600">{departure.direction}</td>
						<td class="py-3 text-right">
                                <span class="text-gray-500">
                                    {departure.departure}
                                </span>
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="4" class="py-6 text-center text-gray-500">
							Brak odjazdów.
						</td>
					</tr>
				{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>