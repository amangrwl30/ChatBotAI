// Agora client configuration
let client = null;
let localAudioTrack = null;
let isRecording = false;
let audioProcessor = null;
let audioContext = null;
let mediaStreamSource = null;
let lastProcessedTime = 0;
const PROCESS_INTERVAL = 3000; // Process audio every 3 seconds
let audioBuffer = [];

// UI elements
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const testButton = document.getElementById('testButton');
const messagesDiv = document.getElementById('messages');
const recordingIndicator = document.getElementById('recordingIndicator');

// Test speech recognition
async function testSpeechRecognition() {
    console.log('Starting speech recognition test...');
    try {
        testButton.disabled = true;
        addMessage('Testing speech recognition...', 'system');

        const response = await fetch('/test-speech');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Test result:', result);

        if (result.success) {
            addMessage(`Test result: ${result.recognized_text}`, 'system');
        } else {
            addMessage(`Test failed: ${result.error}`, 'error');
        }
    } catch (error) {
        console.error('Test error:', error);
        addMessage('Error during speech recognition test', 'error');
    } finally {
        testButton.disabled = false;
    }
}

// Initialize audio processing
async function initializeAudioProcessing(stream) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Create a processor node for audio processing
    const bufferSize = 4096;
    audioProcessor = audioContext.createScriptProcessor(bufferSize, 1, 1);

    // Connect the nodes
    mediaStreamSource.connect(audioProcessor);
    audioProcessor.connect(audioContext.destination);

    // Process audio data
    audioProcessor.onaudioprocess = async (e) => {
        if (isRecording) {
            const inputData = e.inputBuffer.getChannelData(0);
            for (let i = 0; i < inputData.length; i++) {
                // Apply a noise gate to reduce background noise
                const threshold = 0.01;
                if (Math.abs(inputData[i]) > threshold) {
                    audioBuffer.push(Math.max(-32768, Math.min(32767, Math.floor(inputData[i] * 32768))));
                } else {
                    audioBuffer.push(0);
                }
            }

            const currentTime = Date.now();
            if (currentTime - lastProcessedTime >= PROCESS_INTERVAL) {
                lastProcessedTime = currentTime;

                if (audioBuffer.length > 0) {
                    try {
                        console.log(`Sending audio data for processing... Buffer size: ${audioBuffer.length} samples`);
                        const audioData = new Int16Array(audioBuffer);

                        const response = await fetch('/chat/audio', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/octet-stream',
                            },
                            body: audioData.buffer,
                        });

                        if (response.ok) {
                            const result = await response.json();
                            console.log('Server response:', result);

                            if (result.recognized_text && result.recognized_text !== "Could not understand audio") {
                                addMessage(result.recognized_text, 'user');
                            }
                        } else {
                            const errorData = await response.json();
                            console.error('Server error:', errorData);
                            addMessage(`Error: ${errorData.error}`, 'error');
                        }
                    } catch (error) {
                        console.error('Error sending audio data:', error);
                        addMessage('Error processing audio. Please try again.', 'error');
                    }

                    // Clear the buffer after processing
                    audioBuffer = [];
                }
            }
        }
    };
}

// Initialize Agora client
async function initializeAgora() {
    try {
        const response = await fetch('/get_agora_token');
        if (!response.ok) {
            throw new Error('Failed to get Agora token');
        }

        const data = await response.json();
        console.log('Received data from server:', data);

        if (!data.appId) {
            throw new Error('Agora App ID is not configured');
        }

        // Initialize Agora client
        client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
        console.log('Agora client created with App ID:', data.appId);

        // Join the channel
        await client.join(data.appId, data.channel, null, null);
        console.log('Joined Agora channel successfully');

        // Create and publish the local audio track
        localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();

        // Initialize audio processing with the microphone stream
        const audioStream = new MediaStream([localAudioTrack.getMediaStreamTrack()]);
        await initializeAudioProcessing(audioStream);

        await client.publish([localAudioTrack]);
        console.log('Published local audio track');

        // Show recording indicator
        recordingIndicator.classList.add('active');

        return true;
    } catch (error) {
        console.error('Error initializing Agora:', error);
        addMessage(`Error: ${error.message}. Please check your Agora configuration and microphone permissions.`, 'error');
        return false;
    }
}

// Add message to chat
function addMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${type}-message`);
    if (type === 'error') {
        messageDiv.classList.add('error-message');
    }
    messageDiv.textContent = text;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Start recording
async function startRecording() {
    startButton.disabled = true;
    try {
        if (await initializeAgora()) {
            isRecording = true;
            stopButton.disabled = false;
            addMessage('Started listening...', 'system');
            recordingIndicator.classList.add('active');
        } else {
            startButton.disabled = false;
        }
    } catch (error) {
        console.error('Error starting recording:', error);
        addMessage(`Error: ${error.message}`, 'error');
        startButton.disabled = false;
    }
}

// Stop recording
async function stopRecording() {
    try {
        isRecording = false;

        if (audioProcessor) {
            audioProcessor.disconnect();
            audioProcessor = null;
        }

        if (mediaStreamSource) {
            mediaStreamSource.disconnect();
            mediaStreamSource = null;
        }

        if (audioContext) {
            await audioContext.close();
            audioContext = null;
        }

        if (localAudioTrack) {
            localAudioTrack.stop();
            localAudioTrack.close();
            localAudioTrack = null;
        }

        if (client) {
            await client.leave();
            client = null;
        }

        startButton.disabled = false;
        stopButton.disabled = true;
        recordingIndicator.classList.remove('active');
        addMessage('Stopped listening.', 'system');
    } catch (error) {
        console.error('Error stopping recording:', error);
        addMessage(`Error: ${error.message}`, 'error');
    }
}

// Event listeners
startButton.addEventListener('click', startRecording);
stopButton.addEventListener('click', stopRecording);
testButton.addEventListener('click', testSpeechRecognition);

// Handle client events
if (client) {
    client.on('user-published', async (user, mediaType) => {
        if (mediaType === 'audio') {
            await client.subscribe(user, mediaType);
            console.log('Subscribed to remote audio track');
        }
    });

    client.on('error', (err) => {
        console.error('Agora client error:', err);
        addMessage('Error: ' + err.message, 'error');
        recordingIndicator.classList.remove('active');
    });
}

// Clean up on window unload
window.addEventListener('unload', () => {
    if (localAudioTrack) {
        localAudioTrack.stop();
        localAudioTrack.close();
    }
    if (client) {
        client.leave();
    }
    recordingIndicator.classList.remove('active');
});