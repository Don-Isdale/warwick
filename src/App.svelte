<svelte:options tag="war-wc" />


<!-- ----------------------------------------------------------------------  -->

<script>

	import RecorderDialog from './RecorderDialog.svelte';
	import  'WebAudioRecorder';


  let recorderDialogFlag;
  let vdialog;

  console.log('App vdialog', vdialog, this);
  async function loadRecorderDialog() {
    console.log('loadRecorderDialog', vdialog, vdialog.opened, this);
    recorderDialogFlag = ! recorderDialogFlag;
    if (vdialog) {
      vdialog.opened = ! vdialog.opened;
    }
  }


	export let encoding;

  console.log('App encoding', encoding);
	

</script>

<!-- ----------------------------------------------------------------------  -->
<!-- add opened for initially-open -->
<vaadin-dialog bind:this={vdialog} >
   <template>
  <war-wc-recorderdialog encoding={encoding}>
  </war-wc-recorderdialog>
   </template>
</vaadin-dialog>

<main>
<div />
</main>


<button on:click={loadRecorderDialog}>
  Show the Recorder dialog
</button>

{#if recorderDialogFlag}
{/if}


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
