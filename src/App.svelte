<script>
  import Modal from 'svelte-simple-modal';

	import RecorderDialog from './RecorderDialog.svelte';
	import  'WebAudioRecorder';

  if (false) {
    var audioContext = new AudioContext;
    var mixer = audioContext.createGain();

    let audioRecorder = new window.WebAudioRecorder(mixer, {
      workerDir: "build/"     // must end with slash
    });
  }

  let recorderDialogFlag;

  async function loadRecorderDialog() {
    recorderDialogFlag = true;
  }


	export let name;

</script>

<!-- ----------------------------------------------------------------------  -->

<Modal>

<main>
	<h1>Hello {name}!</h1>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
</main>

<button on:click={loadRecorderDialog()}>
  Show the Recorder dialog
</button>

{#if recorderDialogFlag}
{/if}
  <RecorderDialog/>

</Modal>

<!-- ----------------------------------------------------------------------  -->

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>

<!-- ----------------------------------------------------------------------  -->
