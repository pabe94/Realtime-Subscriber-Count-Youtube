<template> 
    <section>
        <!-- <pre>{{stats}}</pre> -->
        <h6>Live Subscriber Count</h6>
        <h1>{{stats.subscriberCount}}</h1>
        <small>
            {{last_updated.toLocaleString()}}
        </small>
    </section>
</template>

<script>
import io from 'socket.io-client';
export default {
    data: () => ({
        stats: {},
        last_updated: new Date(),

    }),
    mounted() {
        fetch('http://localhost:5000/stats')
            .then(res => res.json())
            .then(stats => {
                this.stats = stats
                this.last_updated = new Date();
            });

        const socket = io('http://localhost:5000');
        socket.on('stats', (stats) => {
            this.stats = stats;
            this.last_updated = new Date();
        });
    }
};
</script>

<style>

@import url('https://fonts.googleapis.com/css?family=Inconsolata');

body {
    font-family: 'Inconsolata', monospace;
    font-size: 4em;
    height: 100vh;
    margin: 0px;
    background: black;
    color: white;
    text-align: center;
}

section {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
}

h1, h2, h3, h4, h5, h6 {
    margin: 0px;
}
</style>
