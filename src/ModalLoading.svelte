<svelte:options tag="war-wc-modalloading" />


<!-- ----------------------------------------------------------------------  -->

<script>
  export let title;
</script>

<!-- ----------------------------------------------------------------------  -->

    <div id="modal-loading" class="modal fade">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{title}</h4>
          </div>
        </div>
      </div>
    </div>
