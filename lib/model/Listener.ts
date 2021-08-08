export class Listener {
    /** @private {boolean} */

    recognition;
    public _connected = false;
    public root = window;
    public _isListening = true;
    private setLanguage;
    private _has_initialized = false;
    private controller;

    isListening() {
        return this._isListening;
    }

    update() {
        let display;

        if (document.getElementById('display')) {
            display = document.getElementById('display');
            let ih = '<i class="fas fa-microphone' + (!this._isListening ? "-slash" : '') + ' fa-fw"></i>';
            if (display.innerHTML !== ih) {
                display.innerHTML = ih;
            }
        }
    }

    public start(controller?) {

        console.log("starting voice");

        const self = this;
        const synth = window['speechSynthesis'];
        let utterance = new window['SpeechSynthesisUtterance']();
        utterance.lang = 'en-US';

        function synthVoice(text, cb) {
            utterance = new window['SpeechSynthesisUtterance'](text);
            utterance.rate = 1.5;
            //utterance.text = text;
            synth.speak(utterance);
            utterance.onend = function (evt) {
                cb(evt);
            }
        }

        /**
         * @nocollapse
         */
        let recognition = null;
        recognition = (window['webkitSpeechRecognition'] || window['SpeechRecognition'] ||
            window['mozSpeechRecognition'] ||
            window['msSpeechRecognition'] ||
            window['oSpeechRecognition']) || recognition;

        if (!recognition) {
            return false;
        }

        recognition = new recognition();
        self.recognition = recognition;

        var lastStartedAt = new Date().getTime();
        var autoRestartCount = 0;
        var debugState = true;

        this.setLanguage = function (lang) {
            utterance.lang = lang;
        };

        let container = document.getElementById("voicebox"), transcript, potential;
        console.log(container);
        if (!self._has_initialized) {
            console.log("has not initialized");
            transcript = document.createElement("div");
            transcript.style.width = "100%";
            transcript.style.maxHeight = "50vh";
            transcript.style.fontSize = "115%";
            transcript.style.lineHeight = "180%";
            transcript.style.overflowY = "scroll";
            transcript.id = "transcript";
            transcript.contentEditable = "true";
            console.log(controller);
            if (controller) {
                console.log(controller.transcript);
                controller.transcript.forEach(function (v) {
                    let d = document.createElement('span');
                    d.innerHTML = v;
                    transcript.appendChild(d);
                });
            }

            potential = document.createElement("input");
            potential.type = "text";
            potential.readOnly = true;
            potential.disabled = true;
            potential.id = "potential";
            potential.placeholder = "say something...";
            potential.style.width = "100%";

            let p = document.createElement('p');

            p.appendChild(transcript);
            container.appendChild(p);
            container.appendChild(potential);
            self._has_initialized = true;
        } else {
            console.log("has initialized");
            transcript = document.getElementById("transcript");
            potential = document.getElementById("potential");
        }


        recognition['continuous'] = false;
        recognition['interimResults'] = true;
        //recognition['lang'] = 'sw-SW';
        //recognition['lang'] = 'de-DE';
        //recognition['lang'] = 'en-US';
        recognition['onresult'] = function (event) {

            var interim_transcript = '';
            var final_transcript = '';

            for (var i = event['resultIndex']; i < event['results'].length; ++i) {
                if (event['results'][i]['isFinal']) {

                    final_transcript += event['results'][i][0]['transcript'];
                    if (self._isListening) {
                        let sentence = document.createElement("span");
                        sentence.className = "sentence";
                        sentence.innerHTML = final_transcript + ". &nbsp; ";
                        // transcript.appendChild(sentence);
                        potential.value = "";

                        if (controller) {
                            controller.transcript.push(final_transcript + ". ");
                        }

                        transcript.innerHTML += final_transcript + ". "
                        transcript.scrollTop = transcript.scrollHeight;
                        if (document.activeElement.getAttribute('type') == "text") {
                        }
                    }

                } else {
                    interim_transcript += event['results'][i][0]['transcript'];
                    potential.value = interim_transcript;
                    console.log(interim_transcript)
                }
            }

            if (final_transcript.indexOf('enable voice') !== -1) {
                if (!self._isListening) {
                    synthVoice('Hello Friend!', function () {
                    });
                    self._isListening = true;
                }

            }

            if (final_transcript.indexOf('set language english') !== -1) {
                recognition['lang'] = 'en-US';
            }
            if (final_transcript.indexOf('set language spanish') !== -1) {
                recognition['lang'] = 'es';
            }
            if (final_transcript.indexOf('set language german') !== -1) {
                recognition['lang'] = 'de';
            }

            if (final_transcript.indexOf('goodbye neighbor') !== -1) {
                self._isListening = false;
            }

            console.log(interim_transcript, self._isListening);

        };
        recognition['onend'] = function () {
            recognition.stop();
            var timeSinceLastStart = new Date().getTime() - lastStartedAt;
            autoRestartCount += 1;
            if (autoRestartCount % 10 === 0) {
                if (debugState) {
                    console.warn('Speech Recognition is repeatedly stopping and starting. See http://is.gd/annyang_restarts for tips.');
                }
            }
            if (timeSinceLastStart < 10000) {
                setTimeout(function () {
                    lastStartedAt = new Date().getTime();
                    recognition.start();
                }, Math.max(1, 5000 - timeSinceLastStart));
            } else {
                recognition.start();
            }
        };
        recognition.start();
        console.log("called start");
    }
}
