<svelte:options tag="war-wc-modalerror" />


<!-- ----------------------------------------------------------------------  -->

<script>
  export let message;
</script>

<!-- ----------------------------------------------------------------------  -->

    <div id="modal-error" class="modal fade">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" data-dismiss="modal" class="close">&times;</button>
            <h4 class="modal-title">Error</h4>
          </div>
          <div class="modal-body">
            <div class="alert alert-warning">{message}</div>
          </div>
          <div class="modal-footer">
            <button type="button" data-dismiss="modal" class="btn btn-primary">Close</button>
          </div>
        </div>
      </div>
    </div>
