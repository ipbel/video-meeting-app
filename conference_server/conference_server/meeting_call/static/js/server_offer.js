//const startButton = document.getElementById('startButton');
//const callButton = document.getElementById('callButton');
//const userInput = document.getElementById('username')
//callButton.disabled = true;
//startButton.addEventListener('click', start);
//callButton.addEventListener('click', call);
//
//let startTime;
//const localVideo = document.getElementById('localVideo');
//const remoteVideo = document.getElementById('remoteVideo');
//
//localVideo.addEventListener('loadedmetadata', function() {
//  console.log(`Local video videoWidth: ${this.videoWidth}px,  videoHeight: ${this.videoHeight}px`);
//});
//
//remoteVideo.addEventListener('loadedmetadata', function() {
//  console.log(`Remote video videoWidth: ${this.videoWidth}px,  videoHeight: ${this.videoHeight}px`);
//});
//
//remoteVideo.addEventListener('resize', () => {
//  console.log(`Remote video size changed to ${remoteVideo.videoWidth}x${remoteVideo.videoHeight} - Time since pageload ${performance.now().toFixed(0)}ms`);
//  // We'll use the first onsize callback as an indication that video has started
//  // playing out.
//  if (startTime) {
//    const elapsedTime = window.performance.now() - startTime;
//    console.log('Setup time: ' + elapsedTime.toFixed(3) + 'ms');
//    startTime = null;
//  }
//});
//
//let localStream;
//let pc1;
//let pc2;
//const offerOptions = {
//  offerToReceiveAudio: 1,
//  offerToReceiveVideo: 1
//};
//
//function connect() {
//    username = userInput.value
//    if (username === '') {
//        alert('Your name is empty!')
//        return;
//    }
//    conn = new WebSocket('ws://127.0.0.1:8080/offer')
//    conn.addEventListener('open', (e) => {
//        console.log("Connected to the signaling server");
//        initialize(username);
//    })
//    conn.addEventListener('message', onmessage)
//
//    btnCreateChat.style.display = 'block'
//    connectButton.style.display = 'none'
//    userInput.disabled = true
//}
//
//function getName(pc) {
//  return (pc === pc1) ? 'pc1' : 'pc2';
//}
//
//function getOtherPc(pc) {
//  return (pc === pc1) ? pc2 : pc1;
//}
//
//async function start() {
//  console.log('Requesting local stream');
//  startButton.disabled = true;
//  try {
//    const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
//    console.log('Received local stream');
//    localVideo.srcObject = stream;
//    localStream = stream;
//    callButton.disabled = false;
//  } catch (e) {
//    alert(`getUserMedia() error: ${e.name}`);
//  }
//}
//
//async function call() {
//  callButton.disabled = true;
//  console.log('Starting call');
//  startTime = window.performance.now();
//  const videoTracks = localStream.getVideoTracks();
//  const audioTracks = localStream.getAudioTracks();
//  if (videoTracks.length > 0) {
//    console.log(`Using video device: ${videoTracks[0].label}`);
//  }
//  if (audioTracks.length > 0) {
//    console.log(`Using audio device: ${audioTracks[0].label}`);
//  }
//  const configuration = {};
//  console.log('RTCPeerConnection configuration:', configuration);
//  pc1 = new RTCPeerConnection(configuration);
//  console.log('Created local peer connection object pc1');
//  pc1.addEventListener('icecandidate', e => onIceCandidate(pc1, e));
//  pc2 = new RTCPeerConnection(configuration);
//  console.log('Created remote peer connection object pc2');
//  pc2.addEventListener('icecandidate', e => onIceCandidate(pc2, e));
//  pc1.addEventListener('iceconnectionstatechange', e => onIceStateChange(pc1, e));
//  pc2.addEventListener('iceconnectionstatechange', e => onIceStateChange(pc2, e));
//  pc2.addEventListener('track', gotRemoteStream);
//
//  localStream.getTracks().forEach(track => pc1.addTrack(track, localStream));
//  console.log('Added local stream to pc1');
//
//  try {
//    console.log('pc1 createOffer start');
//    const offer = await pc1.createOffer(offerOptions);
//    await onCreateOfferSuccess(offer);
//  } catch (e) {
//    onCreateSessionDescriptionError(e);
//  }
//}
//
//function onCreateSessionDescriptionError(error) {
//  console.log(`Failed to create session description: ${error.toString()}`);
//}
//
//async function onCreateOfferSuccess(desc) {
//  console.log(`Offer from pc1\n${desc.sdp}`);
//  console.log('pc1 setLocalDescription start');
//  try {
//    await pc1.setLocalDescription(desc);
//    onSetLocalSuccess(pc1);
//  } catch (e) {
//    onSetSessionDescriptionError();
//  }
//
//  console.log('pc2 setRemoteDescription start');
//  try {
//    await pc2.setRemoteDescription(desc);
//    onSetRemoteSuccess(pc2);
//  } catch (e) {
//    onSetSessionDescriptionError();
//  }
//
//  console.log('pc2 createAnswer start');
//  // Since the 'remote' side has no media stream we need
//  // to pass in the right constraints in order for it to
//  // accept the incoming offer of audio and video.
//  try {
//    const answer = await pc2.createAnswer();
//    await onCreateAnswerSuccess(answer);
//  } catch (e) {
//    onCreateSessionDescriptionError(e);
//  }
//}
//
//function onSetLocalSuccess(pc) {
//  console.log(`${getName(pc)} setLocalDescription complete`);
//}
//
//function onSetRemoteSuccess(pc) {
//  console.log(`${getName(pc)} setRemoteDescription complete`);
//}
//
//function onSetSessionDescriptionError(error) {
//  console.log(`Failed to set session description: ${error.toString()}`);
//}
//
//function gotRemoteStream(e) {
//  if (remoteVideo.srcObject !== e.streams[0]) {
//    remoteVideo.srcObject = e.streams[0];
//    console.log('pc2 received remote stream');
//  }
//}
//
//async function onCreateAnswerSuccess(desc) {
//  console.log(`Answer from pc2:\n${desc.sdp}`);
//  console.log('pc2 setLocalDescription start');
//  try {
//    await pc2.setLocalDescription(desc);
//    onSetLocalSuccess(pc2);
//  } catch (e) {
//    onSetSessionDescriptionError(e);
//  }
//  console.log('pc1 setRemoteDescription start');
//  try {
//    await pc1.setRemoteDescription(desc);
//    onSetRemoteSuccess(pc1);
//  } catch (e) {
//    onSetSessionDescriptionError(e);
//  }
//}
//
//async function onIceCandidate(pc, event) {
//  try {
//    await (getOtherPc(pc).addIceCandidate(event.candidate));
//    onAddIceCandidateSuccess(pc);
//  } catch (e) {
//    onAddIceCandidateError(pc, e);
//  }
//  console.log(`${getName(pc)} ICE candidate:\n${event.candidate ? event.candidate.candidate : '(null)'}`);
//}
//
//function onAddIceCandidateSuccess(pc) {
//  console.log(`${getName(pc)} addIceCandidate success`);
//}
//
//function onAddIceCandidateError(pc, error) {
//  console.log(`${getName(pc)} failed to add ICE Candidate: ${error.toString()}`);
//}
//
//function onIceStateChange(pc, event) {
//  if (pc) {
//    console.log(`${getName(pc)} ICE state: ${pc.iceConnectionState}`);
//    console.log('ICE state change event: ', event);
//  }
//}
//
//function hangup() {
//  console.log('Ending call');
//  pc1.close();
//  pc2.close();
//  pc1 = null;
//  pc2 = null;
//  callButton.disabled = false;
//}




// get DOM elements
var dataChannelLog = document.getElementById('data-channel'),
    iceConnectionLog = document.getElementById('ice-connection-state'),
    iceGatheringLog = document.getElementById('ice-gathering-state'),
    signalingLog = document.getElementById('signaling-state');

// peer connection
var pc = null;

// data channel
var dc = null, dcInterval = null;

function createPeerConnection() {
    var config = {
        sdpSemantics: 'unified-plan'
    };

    if (document.getElementById('use-stun').checked) {
        config.iceServers = [{urls: ['stun:stun.l.google.com:19302']}];
    }

    pc = new RTCPeerConnection(config);

    // register some listeners to help debugging
    pc.addEventListener('icegatheringstatechange', function() {
        iceGatheringLog.textContent += ' -> ' + pc.iceGatheringState;
    }, false);
    iceGatheringLog.textContent = pc.iceGatheringState;

    pc.addEventListener('iceconnectionstatechange', function() {
        iceConnectionLog.textContent += ' -> ' + pc.iceConnectionState;
    }, false);
    iceConnectionLog.textContent = pc.iceConnectionState;

    pc.addEventListener('signalingstatechange', function() {
        signalingLog.textContent += ' -> ' + pc.signalingState;
    }, false);
    signalingLog.textContent = pc.signalingState;

    // connect audio / video
    pc.addEventListener('track', function(evt) {
        if (evt.track.kind == 'video')
            document.getElementById('localVideo').srcObject = evt.streams[0];
        else
            document.getElementById('audio').srcObject = evt.streams[0];
    });

    return pc;
}

function negotiate() {
    return pc.createOffer().then(function(offer) {
        return pc.setLocalDescription(offer + '13');
    }).then(function() {
        // wait for ICE gathering to complete
        return new Promise(function(resolve) {
            if (pc.iceGatheringState === 'complete') {
                resolve();
            } else {
                function checkState() {
                    if (pc.iceGatheringState === 'complete') {
                        pc.removeEventListener('icegatheringstatechange', checkState);
                        resolve();
                    }
                }
                pc.addEventListener('icegatheringstatechange', checkState);
            }
        });
    }).then(function() {
        var offer = pc.localDescription;
        var codec;
        console.log(<room_url>)

        codec = document.getElementById('audio-codec').value;
        if (codec !== 'default') {
            offer.sdp = sdpFilterCodec('audio', codec, offer.sdp);
        }

        codec = document.getElementById('video-codec').value;
        if (codec !== 'default') {
            offer.sdp = sdpFilterCodec('video', codec, offer.sdp);
        }

        document.getElementById('offer-sdp').textContent = offer.sdp;
        return fetch('/offer', {
            body: JSON.stringify({
                sdp: offer.sdp,
                type: offer.type,
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        });
    }).then(function(response) {
        return response.json();
    }).then(function(answer) {
        document.getElementById('answer-sdp').textContent = answer.sdp;
        return pc.setRemoteDescription(answer);
    }).catch(function(e) {
        alert(e);
    });
}

function start() {
    document.getElementById('start').style.display = 'none';

    pc = createPeerConnection();

    if (document.getElementById('use-datachannel').checked) {
        var parameters = JSON.parse(document.getElementById('datachannel-parameters').value);

        dc = pc.createDataChannel('chat', parameters);
        dc.onclose = function() {
            clearInterval(dcInterval);
            dataChannelLog.textContent += '- close\n';
        };
        dc.onmessage = function(evt) {
            dataChannelLog.textContent += '< ' + evt.data + '\n';

            if (evt.data.substring(0, 4) === 'pong') {
                var elapsed_ms = current_stamp() - parseInt(evt.data.substring(5), 10);
                dataChannelLog.textContent += ' RTT ' + elapsed_ms + ' ms\n';
            }
        };
    }

    var constraints = {
        audio: document.getElementById('use-audio').checked,
        video: false
    };

    if (document.getElementById('use-video').checked) {
        var resolution = document.getElementById('video-resolution').value;
        if (resolution) {
            resolution = resolution.split('x');
            constraints.video = {
                width: parseInt(resolution[0], 0),
                height: parseInt(resolution[1], 0)
            };
        } else {
            constraints.video = true;
        }
    }

    if (constraints.audio || constraints.video) {
        if (constraints.video) {
            document.getElementById('media').style.display = 'block';
        }
        navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
            stream.getTracks().forEach(function(track) {
                pc.addTrack(track, stream);
            });
            return negotiate();
        }, function(err) {
            alert('Could not acquire media: ' + err);
        });
    } else {
        negotiate();
    }

    document.getElementById('stop').style.display = 'inline-block';
}

function stop() {
    document.getElementById('stop').style.display = 'none';
    document.getElementById('start').style.display = 'inline-block';

    // close data channel
    if (dc) {
        dc.close();
    }

    // close transceivers
    if (pc.getTransceivers) {
        pc.getTransceivers().forEach(function(transceiver) {
            if (transceiver.stop) {
                transceiver.stop();
            }
        });
    }

    // close local audio / video
    pc.getSenders().forEach(function(sender) {
        sender.track.stop();
    });

    // close peer connection
    setTimeout(function() {
        pc.close();
    }, 500);
}

function sdpFilterCodec(kind, codec, realSdp) {
    var allowed = []
    var rtxRegex = new RegExp('a=fmtp:(\\d+) apt=(\\d+)\r$');
    var codecRegex = new RegExp('a=rtpmap:([0-9]+) ' + escapeRegExp(codec))
    var videoRegex = new RegExp('(m=' + kind + ' .*?)( ([0-9]+))*\\s*$')

    var lines = realSdp.split('\n');

    var isKind = false;
    for (var i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('m=' + kind + ' ')) {
            isKind = true;
        } else if (lines[i].startsWith('m=')) {
            isKind = false;
        }

        if (isKind) {
            var match = lines[i].match(codecRegex);
            if (match) {
                allowed.push(parseInt(match[1]));
            }

            match = lines[i].match(rtxRegex);
            if (match && allowed.includes(parseInt(match[2]))) {
                allowed.push(parseInt(match[1]));
            }
        }
    }

    var skipRegex = 'a=(fmtp|rtcp-fb|rtpmap):([0-9]+)';
    var sdp = '';

    isKind = false;
    for (var i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('m=' + kind + ' ')) {
            isKind = true;
        } else if (lines[i].startsWith('m=')) {
            isKind = false;
        }

        if (isKind) {
            var skipMatch = lines[i].match(skipRegex);
            if (skipMatch && !allowed.includes(parseInt(skipMatch[2]))) {
                continue;
            } else if (lines[i].match(videoRegex)) {
                sdp += lines[i].replace(videoRegex, '$1 ' + allowed.join(' ')) + '\n';
            } else {
                sdp += lines[i] + '\n';
            }
        } else {
            sdp += lines[i] + '\n';
        }
    }

    return sdp;
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}