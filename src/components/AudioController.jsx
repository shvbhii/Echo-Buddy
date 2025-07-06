// src/components/AudioController.jsx
import React, { useEffect, useRef } from 'react';
import * as Tone from 'tone';

const SPEECH_THRESHOLD = 0.02;
const MAX_RECORDING_SECONDS = 10;

const AudioController = ({
  // Recording props
  isActive,
  onRecordingStart,
  onRecordingComplete,

  // Playback props
  audioUrlToPlay,
  activeFilter,
  onPlaybackStart,
  onPlaybackComplete,
  onAudioActivity,
}) => {
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const silenceTimerRef = useRef(null);
  const hardLimitTimerRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);

  // --- Effect for RECORDING ---
  useEffect(() => {
    if (isActive) {
      handleStartListening();
    }
  }, [isActive]);

  const handleStartListening = async () => {
    if (mediaRecorderRef.current) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      onRecordingStart();

      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);

      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.addEventListener('dataavailable', event => {
        audioChunksRef.current.push(event.data);
      });

      mediaRecorderRef.current.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        onRecordingComplete(audioUrl);
      });

      mediaRecorderRef.current.start();
      hardLimitTimerRef.current = setTimeout(() => handleStopListening(), MAX_RECORDING_SECONDS * 1000);
      checkForSilence(analyser);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const handleStopListening = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (hardLimitTimerRef.current) clearTimeout(hardLimitTimerRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    mediaRecorderRef.current = null;
    streamRef.current = null;
  };

  const checkForSilence = (analyser) => {
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteTimeDomainData(dataArray);
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const x = dataArray[i] / 128.0 - 1.0;
      sum += x * x;
    }
    const rms = Math.sqrt(sum / dataArray.length);

    if (rms > SPEECH_THRESHOLD) {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    } else {
      if (!silenceTimerRef.current) {
        silenceTimerRef.current = setTimeout(() => handleStopListening(), 1500);
      }
    }
    animationFrameRef.current = requestAnimationFrame(() => checkForSilence(analyser));
  };


  // --- Effect for PLAYBACK with POWERFUL FILTERS and robust CLEANUP ---
  useEffect(() => {
    if (!audioUrlToPlay) return;

    let player, pitchShift, bitCrusher, analyserNode;
    let animationFrameId;

    const setupAndPlay = async () => {
      await Tone.start();
      onPlaybackStart();

      player = new Tone.Player(audioUrlToPlay).toDestination();
      pitchShift = new Tone.PitchShift().toDestination();
      bitCrusher = new Tone.BitCrusher(4).toDestination(); // Bit depth of 4 for crunchy sound
      analyserNode = new Tone.Analyser('fft', 256);

      if (activeFilter === 'high') {
        pitchShift.pitch = 12; // Full octave up
        player.connect(pitchShift);
      } else if (activeFilter === 'low') {
        pitchShift.pitch = -12; // Full octave down
        player.connect(pitchShift);
      } else if (activeFilter === 'robot') {
        player.connect(bitCrusher); // Digital robot effect
      }
      
      player.connect(analyserNode);
      player.autostart = true;
      player.onstop = () => onPlaybackComplete();

      const checkAudioLevel = () => {
        if (player && player.state === 'started') {
          const level = Tone.dbToGain(analyserNode.getValue()[0]);
          onAudioActivity(level * 2.5); // Multiply to make it more visible
          animationFrameId = requestAnimationFrame(checkAudioLevel);
        }
      };
      checkAudioLevel();
    };

    setupAndPlay();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (player) player.dispose();
      if (pitchShift) pitchShift.dispose();
      if (bitCrusher) bitCrusher.dispose();
      if (analyserNode) analyserNode.dispose();
    };
  }, [audioUrlToPlay, activeFilter, onPlaybackStart, onPlaybackComplete, onAudioActivity]);


  return null;
};

export default AudioController;