<!-- src/routes/+page.svelte -->
<script lang="ts">
    import BusCard from "$lib/BusCard.svelte";
    import TrainCard from '$lib/TrainCard.svelte';
</script>

<div class="bg-gray-900 p-6">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 px-4">
        <BusCard
                stopId={8062}
                name={"Kaliskiego - Politechnika"}
        />
        <BusCard
                stopId={8063}
                name={"Kaliskiego - Politechnika"}
        />
        <BusCard
                stopId={8083}
                name={"Akademicka - Kaliskiego"}
        />
        <BusCard
                stopId={8060}
                name={"Akademicka - Kaliskiego"}
        />
        <BusCard
                stopId={8096}
                name={"Akademicka - Kaliskiego"}
        />
        <BusCard
                stopId={8095}
                name={"Akademicka - Kaliskiego"}
        />
        <BusCard
                stopId={7028}
                name={"Dworzec - Politechnika"}
        />
        <BusCard
                stopId={7027}
                name={"Dworzec - Politechnika"}
        />
        <TrainCard name="Bydgoszcz Politechnika - PKP" />
    </div>
</div>