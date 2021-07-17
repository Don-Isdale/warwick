<svelte:options tag="war-wc-recorderdialog" />


<!-- ----------------------------------------------------------------------  -->


<script>
import { onMount } from 'svelte';
import jQuery from 'jquery';
// let jQ = jQuery;
import 'WebAudioRecorder.min.js';
import 'jquery-modal';

import '@vaadin/vaadin-dialog/vaadin-dialog.js';

  import { getContext } from 'svelte';
  // const { open, close } = getContext('simple-modal');
  function open() { }
  function close() { }

  import ModalLoading from './ModalLoading.svelte';
  import ModalProgress from './ModalProgress.svelte';
  import ModalError from './ModalError.svelte';

  let modalProgress_progress;
  let container;
  let vdialog;

 onMount(function() {
  let host = container.parentNode.host.parentElement;
  console.log('container=', container, 'host=', host);
  const jQ = (query) => jQuery(query, container);

  let _audioInLevel, _audioInSelect, _bufferSize, _cancel, _dateTime, _echoCancellation, _encoding, _encodingOption, _encodingProcess, modalError, modalLoading, modalProgress,  _record, _recording, _recordingList, _reportInterval, _testToneLevel, _timeDisplay, _timeLimit, BUFFER_SIZE, ENCODING_OPTION, MP3_BIT_RATE, OGG_KBPS, OGG_QUALITY, URL, audioContext, audioIn, audioInLevel, audioRecorder, defaultBufSz, disableControlsOnRecord, encodingProcess, iDefBufSz, minSecStr, mixer, onChangeAudioIn, onError, onGotAudioIn, onGotDevices, optionValue, plural, progressComplete, saveRecording, setProgress, startRecording, stopRecording, testTone, testToneLevel, updateBufferSizeText, updateDateTime;

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

  URL = window.URL || window.webkitURL;

  audioContext = new AudioContext;

  if (audioContext.createScriptProcessor == null) {
    audioContext.createScriptProcessor = audioContext.createJavaScriptNode;
  }

  _testToneLevel = jQ('#test-tone-level');

  _audioInSelect = jQ('#audio-in-select');

  _audioInLevel = jQ('#audio-in-level');

  _echoCancellation = jQ('#echo-cancellation');

  _timeLimit = jQ('#time-limit');

  _encoding = jQ('input[name="encoding"]');

  _encodingOption = jQ('#encoding-option');

  _encodingProcess = jQ('input[name="encoding-process"]');

  _reportInterval = jQ('#report-interval');

  _bufferSize = jQ('#buffer-size');

  _recording = jQ('#recording');

  _timeDisplay = jQ('#time-display');

  _record = jQ('#record');

  _cancel = jQ('#cancel');

  _dateTime = jQ('#date-time');

  _recordingList = jQ('#recording-list');

  let modalLoadingjQ = jQ('div#modal-loading');
  console.log('modalLoadingjQ', modalLoadingjQ);
  modalLoadingjQ.click(function(event) {	//[data-modal]
    jQ(this).modal();
    return false;
  });

  if (! vdialog) {
    console.warn('<vaadin-dialog> not found');
  } else {
    vdialog.renderer = function(root, vdialog) {
      root.textContent = 'Sample dialog';
    };
  }


  _audioInLevel.attr('disabled', false);

  _audioInLevel[0].valueAsNumber = 0;

  _testToneLevel.attr('disabled', false);

  _testToneLevel[0].valueAsNumber = 0;

  _timeLimit.attr('disabled', false);

  _timeLimit[0].valueAsNumber = 3;

  _encoding.attr('disabled', false);

  _encoding[0].checked = true;

  _encodingProcess.attr('disabled', false);

  _encodingProcess[0].checked = true;

  _reportInterval.attr('disabled', false);

  _reportInterval[0].valueAsNumber = 1;

  _bufferSize.attr('disabled', false);

  testTone = (function() {
    var lfo, osc, oscMod, output;
    osc = audioContext.createOscillator();
    lfo = audioContext.createOscillator();
    lfo.type = 'square';
    lfo.frequency.value = 2;
    oscMod = audioContext.createGain();
    osc.connect(oscMod);
    lfo.connect(oscMod.gain);
    output = audioContext.createGain();
    output.gain.value = 0.5;
    oscMod.connect(output);
    osc.start();
    lfo.start();
    return output;
  })();

  testToneLevel = audioContext.createGain();

  testToneLevel.gain.value = 0;

  testTone.connect(testToneLevel);

  audioInLevel = audioContext.createGain();

  audioInLevel.gain.value = 0;

  mixer = audioContext.createGain();

  testToneLevel.connect(mixer);

  audioIn = void 0;

  audioInLevel.connect(mixer);

  mixer.connect(audioContext.destination);

  audioRecorder = new WebAudioRecorder(mixer, {
    workerDir: '/wp/wp-content/plugins/dco-comment-attachment/assets/warwc/js/',
    onEncoderLoading: function(recorder, encoding) {
      let title = "Loading " + (encoding.toUpperCase()) + " encoder ...";
      // open(ModalLoading, { title });
      modalLoadingjQ.modal();
    }
  });

  audioRecorder.onEncoderLoaded = function() {
    // close(ModalLoading);
    modalLoadingjQ.hide();
  };

  _testToneLevel.on('input', function() {
    var level;
    level = _testToneLevel[0].valueAsNumber / 100;
    testToneLevel.gain.value = level * level;
  });

  _audioInLevel.on('input', function() {
    var level;
    level = _audioInLevel[0].valueAsNumber / 100;
    audioInLevel.gain.value = level * level;
  });

  onGotDevices = function(devInfos) {
    var index, info, name, options, _i, _len;
    options = '<option value="no-input" selected>(No input)</option>';
    index = 0;
    for (_i = 0, _len = devInfos.length; _i < _len; _i++) {
      info = devInfos[_i];
      if (info.kind !== 'audioinput') {
        continue;
      }
      name = info.label || ("Audio in " + (++index));
      options += "<option value=" + info.deviceId + ">" + name + "</option>";
    }
    _audioInSelect.html(options);
  };

  onError = function(msg) {
    open(ModalError, {message : msg});
  };

  if ((navigator.mediaDevices != null) && (navigator.mediaDevices.enumerateDevices != null)) {
    navigator.mediaDevices.enumerateDevices().then(onGotDevices)["catch"](function(err) {
      return onError("Could not enumerate audio devices: " + err);
    });
  } else {
    _audioInSelect.html('<option value="no-input" selected>(No input)</option><option value="default-audio-input">Default audio input</option>');
  }

  onGotAudioIn = function(stream) {
    if (audioIn != null) {
      audioIn.disconnect();
    }
    audioIn = audioContext.createMediaStreamSource(stream);
    audioIn.connect(audioInLevel);
    return _audioInLevel.removeClass('hidden');
  };

  onChangeAudioIn = function() {
    var constraint, deviceId;
    deviceId = _audioInSelect[0].value;
    if (deviceId === 'no-input') {
      if (audioIn != null) {
        audioIn.disconnect();
      }
      audioIn = void 0;
      _audioInLevel.addClass('hidden');
    } else {
      if (deviceId === 'default-audio-input') {
        deviceId = void 0;
      }
      constraint = {
        audio: {
          deviceId: deviceId != null ? {
            exact: deviceId
          } : void 0,
          mandatory: {
            echoCancellation: _echoCancellation[0].checked
          }
        }
      };
      if ((navigator.mediaDevices != null) && (navigator.mediaDevices.getUserMedia != null)) {
        navigator.mediaDevices.getUserMedia(constraint).then(onGotAudioIn)["catch"](function(err) {
          return onError("Could not get audio media device: " + err);
        });
      } else {
        navigator.getUserMedia(constraint, onGotAudioIn, function() {
          return onError("Could not get audio media device: " + err);
        });
      }
    }
  };

  _audioInSelect.on('change', onChangeAudioIn);

  _echoCancellation.on('change', onChangeAudioIn);

  plural = function(n) {
    if (n > 1) {
      return 's';
    } else {
      return '';
    }
  };

  _timeLimit.on('input', function() {
    var min;
    min = _timeLimit[0].valueAsNumber;
    jQ('#time-limit-text').html("" + min + " minute" + (plural(min)));
  });

  OGG_QUALITY = [-0.1, 0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];

  OGG_KBPS = [45, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 500];

  MP3_BIT_RATE = [64, 80, 96, 112, 128, 160, 192, 224, 256, 320];

  ENCODING_OPTION = {
    wav: {
      label: '',
      hidden: true,
      max: 1,
      text: function(val) {
        return '';
      }
    },
    ogg: {
      label: 'Quality',
      hidden: false,
      max: OGG_QUALITY.length - 1,
      text: function(val) {
        return "" + (OGG_QUALITY[val].toFixed(1)) + " (~" + OGG_KBPS[val] + "kbps)";
      }
    },
    mp3: {
      label: 'Bit rate',
      hidden: false,
      max: MP3_BIT_RATE.length - 1,
      text: function(val) {
        return "" + MP3_BIT_RATE[val] + "kbps";
      }
    }
  };

  optionValue = {
    wav: null,
    ogg: 6,
    mp3: 5
  };

  _encoding.on('click', function(event) {
    var encoding, option;
    encoding = jQ(event.target).attr('encoding');
    audioRecorder.setEncoding(encoding);
    option = ENCODING_OPTION[encoding];
    jQ('#encoding-option-label').html(option.label);
    jQ('#encoding-option-text').html(option.text(optionValue[encoding]));
    _encodingOption.toggleClass('hidden', option.hidden).attr('max', option.max);
    _encodingOption[0].valueAsNumber = optionValue[encoding];
  });

  _encodingOption.on('input', function() {
    var encoding, option;
    encoding = audioRecorder.encoding;
    option = ENCODING_OPTION[encoding];
    optionValue[encoding] = _encodingOption[0].valueAsNumber;
    jQ('#encoding-option-text').html(option.text(optionValue[encoding]));
  });

  encodingProcess = 'background';

  _encodingProcess.on('click', function(event) {
    var hidden;
    encodingProcess = jQ(event.target).attr('mode');
    hidden = encodingProcess === 'background';
    jQ('#report-interval-label').toggleClass('hidden', hidden);
    _reportInterval.toggleClass('hidden', hidden);
    jQ('#report-interval-text').toggleClass('hidden', hidden);
  });

  _reportInterval.on('input', function() {
    var sec;
    sec = _reportInterval[0].valueAsNumber;
    jQ('#report-interval-text').html("" + sec + " second" + (plural(sec)));
  });

  defaultBufSz = (function() {
    var processor;
    processor = audioContext.createScriptProcessor(void 0, 2, 2);
    return processor.bufferSize;
  })();

  BUFFER_SIZE = [256, 512, 1024, 2048, 4096, 8192, 16384];

  iDefBufSz = BUFFER_SIZE.indexOf(defaultBufSz);

  updateBufferSizeText = function() {
    var iBufSz, text;
    iBufSz = _bufferSize[0].valueAsNumber;
    text = "" + BUFFER_SIZE[iBufSz];
    if (iBufSz === iDefBufSz) {
      text += ' (browser default)';
    }
    jQ('#buffer-size-text').html(text);
  };

  _bufferSize.on('input', updateBufferSizeText);

  _bufferSize[0].valueAsNumber = iDefBufSz;

  updateBufferSizeText();

  saveRecording = function(blob, enc) {
    var html, time, url;
    time = new Date();
    url = URL.createObjectURL(blob);
    html = ("<p recording='" + url + "'>") + ("<audio controls src='" + url + "'></audio> ") + ("(" + enc + ") " + (time.toString()) + " ") + ("<a class='btn btn-default' href='" + url + "' download='recording." + enc + "'>") + "Save..." + "</a> " + ("<button class='btn btn-danger' recording='" + url + "'>Delete</button>");
    "</p>";
    _recordingList.prepend(jQ(html));
  };

  _recordingList.on('click', 'button', function(event) {
    var url;
    url = jQ(event.target).attr('recording');
    jQ("p[recording='" + url + "']").remove();
    URL.revokeObjectURL(url);
  });

  minSecStr = function(n) {
    return (n < 10 ? "0" : "") + n;
  };

  updateDateTime = function() {
    var sec;
    _dateTime.html((new Date).toString());
    sec = audioRecorder.recordingTime() | 0;
    _timeDisplay.html("" + (minSecStr(sec / 60 | 0)) + ":" + (minSecStr(sec % 60)));
  };

  window.setInterval(updateDateTime, 200);

  progressComplete = false;

  setProgress = function(progress) {
    modalProgress_progress = progress;
    progressComplete = progress === 1;
  };


  function modalProgress_onClose () {
    if (!progressComplete) {
      audioRecorder.cancelEncoding();
    }
  }

  disableControlsOnRecord = function(disabled) {
    _audioInSelect.attr('disabled', disabled);
    _echoCancellation.attr('disabled', disabled);
    _timeLimit.attr('disabled', disabled);
    _encoding.attr('disabled', disabled);
    _encodingOption.attr('disabled', disabled);
    _encodingProcess.attr('disabled', disabled);
    _reportInterval.attr('disabled', disabled);
    _bufferSize.attr('disabled', disabled);
  };

  startRecording = function() {
    _recording.removeClass('hidden');
    _record.html('STOP');
    _cancel.removeClass('hidden');
    disableControlsOnRecord(true);
    audioRecorder.setOptions({
      timeLimit: _timeLimit[0].valueAsNumber * 60,
      encodeAfterRecord: encodingProcess === 'separate',
      progressInterval: _reportInterval[0].valueAsNumber * 1000,
      ogg: {
        quality: OGG_QUALITY[optionValue.ogg]
      },
      mp3: {
        bitRate: MP3_BIT_RATE[optionValue.mp3]
      }
    });
    audioRecorder.startRecording();
    setProgress(0);
  };

  stopRecording = function(finish) {
    _recording.addClass('hidden');
    _record.html('RECORD');
    _cancel.addClass('hidden');
    disableControlsOnRecord(false);
    if (finish) {
      audioRecorder.finishRecording();
      if (audioRecorder.options.encodeAfterRecord) {
	let title = "Encoding " + (audioRecorder.encoding.toUpperCase());
        modalProgress = open(ModalProgress, {title, progress : modalProgress_progress},
          {onClose : modalProgress_onClose});
      }
    } else {
      audioRecorder.cancelRecording();
    }
  };

  _record.on('click', function() {
    if (audioRecorder.isRecording()) {
      stopRecording(true);
    } else {
      startRecording();
    }
  });

  _cancel.on('click', function() {
    stopRecording(false);
  });

  audioRecorder.onTimeout = function(recorder) {
    stopRecording(true);
  };

  audioRecorder.onEncodingProgress = function(recorder, progress) {
    setProgress(progress);
  };

  audioRecorder.onComplete = function(recorder, blob) {
    if (recorder.options.encodeAfterRecord) {
      close(modalProgress);
    }
    saveRecording(blob, recorder.encoding);
  };

  audioRecorder.onError = function(recorder, message) {
    onError(message);
  };


 }); // .call(this);

</script>

<!-- ----------------------------------------------------------------------  -->


    <div bind:this={container} class="container">
      <h1><a href="https://github.com/higuma/web-audio-recorder-js">WebAudioRecorder.js</a> demo</h1>
      <p>Audio recording to WAV / OGG / MP3 with Web Audio API</p>
      <hr>
      <div class="form-horizontal">
        <div class="form-group">
          <label class="col-sm-3 control-label">Audio input</label>
          <div class="col-sm-3">
            <select id="audio-in-select" class="form-control"></select>
          </div>
          <div class="col-sm-3">
            <input id="audio-in-level" type="range" min="0" max="100" value="0" class="hidden">
          </div>
        </div>
        <div class="form-group">
          <div class="col-sm-3"></div>
          <div class="col-sm-3">
            <input id="echo-cancellation" type="checkbox"> Enable echo cancellation
          </div>
          <div class="col-sm-6 text-warning"><strong>Experimental:</strong> cancellation on/off may work on Chrome only.</div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">Test tone</label>
          <div class="col-sm-3"></div>
          <div class="col-sm-3">
            <input id="test-tone-level" type="range" min="0" max="100" value="0">
          </div>
        </div><br>
        <div class="form-group">
          <label class="col-sm-3 control-label">Recording time limit</label>
          <div class="col-sm-3">
            <input id="time-limit" type="range" min="1" max="10" value="3">
          </div>
          <div id="time-limit-text" class="col-sm-6">3 minutes</div>
        </div><br>
        <div class="form-group">
          <label class="col-sm-3 control-label">Encoding</label>
          <div class="col-sm-3">
            <input type="radio" name="encoding" encoding="wav" checked> .wav &nbsp; 
            <input type="radio" name="encoding" encoding="ogg"> .ogg &nbsp; 
            <input type="radio" name="encoding" encoding="mp3"> .mp3
          </div>
          <label id="encoding-option-label" class="col-sm-2 control-label"></label>
          <div class="col-sm-2">
            <input id="encoding-option" type="range" min="0" max="11" value="6" class="hidden">
          </div>
          <div id="encoding-option-text" class="col-sm-2"></div>
        </div><br>
        <div class="form-group">
          <label class="col-sm-3 control-label">Encoding process</label>
          <div class="col-sm-9">
            <input type="radio" name="encoding-process" mode="background" checked> Encode on recording background
          </div>
        </div>
        <div class="form-group">
          <div class="col-sm-3"></div>
          <div class="col-sm-3">
            <input type="radio" name="encoding-process" mode="separate"> Encode after recording (safer)
          </div>
          <label id="report-interval-label" class="col-sm-2 control-label hidden">Reports every</label>
          <div class="col-sm-2">
            <input id="report-interval" type="range" min="1" max="5" value="1" class="hidden">
          </div>
          <div id="report-interval-text" class="col-sm-2 hidden">1 second</div>
        </div><br>
        <div class="form-group">
          <label class="col-sm-3 control-label">Recording buffer size</label>
          <div class="col-sm-2">
            <input id="buffer-size" type="range" min="0" max="6">
          </div>
          <div id="buffer-size-text" class="col-sm-7"></div>
        </div>
        <div class="form-group">
          <div class="col-sm-3"></div>
          <div class="col-sm-9 text-warning"><strong>Notice: </strong> recording becomes unstable if buffer size is below browser default.</div>
        </div><br>
        <div class="form-group">
          <div class="col-sm-3 control-label"><span id="recording" class="text-danger hidden"><strong>RECORDING</strong></span>&nbsp; <span id="time-display">00:00</span></div>
          <div class="col-sm-3">
            <button id="record" class="btn btn-danger">RECORD</button>
            <button id="cancel" class="btn btn-default hidden">CANCEL</button>
          </div>
          <div class="col-sm-6"><span id="date-time" class="text-info"></span></div>
        </div>
      </div>
      <hr>
      <h3>Recordings</h3>
      <div id="recording-list"></div>

    <div id="modal-loading" class="modal fade" data-modal="">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">Loading test</h4>
          </div>
        </div>
      </div>
    </div>

<vaadin-dialog bind:this={vdialog} opened>
 <p>vaadin-dialog</p>
</vaadin-dialog>


    </div>



    <!-- script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
    <script src="js/WebAudioRecorder.min.js"></script -->
    <!-- script src="js/RecorderDemo.js"></script -->
