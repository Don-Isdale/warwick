<script>
  export let title, progress;

  $: percent = "" + ((progress * 100).toFixed(1)) + "%";
  $: progressComplete = progress === 1;


</script>

<!-- ----------------------------------------------------------------------  -->

    <div id="modal-progress" class="modal fade">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{title}</h4>
          </div>
          <div class="modal-body">
            <div class="progress">
              <div style="width: {percent};" class="progress-bar"></div>
            </div>
            <div class="text-center">{percent}</div>
          </div>
          <div class="modal-footer">
            <button type="button" data-dismiss="modal" class="btn">Cancel</button>
          </div>
        </div>
      </div>
    </div>
