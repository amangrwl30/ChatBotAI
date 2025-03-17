import React, { useState, useRef } from "react";
import axios from "axios";

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [responseAudio, setResponseAudio] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Start Recording
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      setAudioURL(URL.createObjectURL(audioBlob));
      sendAudioToServer(audioBlob);
    };

    audioChunksRef.current = [];
    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  // Stop Recording
  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  // Send Audio to Flask API
  const sendAudioToServer = async (audioBlob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob, "user_input.wav");

    try {
      const response = await axios.post("http://localhost:5000/process-audio", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        responseType: "blob",
      });

      const botAudioUrl = URL.createObjectURL(response.data);
      setResponseAudio(botAudioUrl);
    } catch (error) {
      console.error("Error sending audio:", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-5">
      <h2 className="text-xl font-bold mb-4">Voice Chat with AI</h2>

      {/* Record Button */}
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`px-4 py-2 rounded text-white ${isRecording ? "bg-red-500" : "bg-blue-500"}`}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>

      {/* Play Recorded Audio */}
      {audioURL && (
        <div className="mt-4">
          <h3>Recorded Audio:</h3>
          <audio src={audioURL} controls />
        </div>
      )}

      {/* Play AI Response */}
      {responseAudio && (
        <div className="mt-4">
          <h3>AI Response:</h3>
          <audio src={responseAudio} controls />
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;