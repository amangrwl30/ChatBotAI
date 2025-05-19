import React, { useState, useRef, useEffect } from 'react';
import { FaUpload, FaPlay, FaPause, FaSpinner, FaGlobe, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AudioTranscriptionBot = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const audioRef = useRef(null);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ar', name: 'Arabic' },
    { code: 'ru', name: 'Russian' },
    { code: 'nl', name: 'Dutch' },
    { code: 'sv', name: 'Swedish' },
    { code: 'no', name: 'Norwegian'},
    { code: 'da', name: 'Danish' },
    { code: 'tr', name: 'Turkish' },
    { code: 'pl', name: 'Polish' },
    { code: 'ro', name: 'Romanian' },
    { code: 'hu', name: 'Hungarian' },
    { code: 'cs', name: 'Czech' },
    { code: 'sk', name: 'Slovak' },
    
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      setAnalysis(null);
    } else {
      alert('Please upload a valid audio file');
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const analyzeAudio = async () => {
    if (!audioFile) return;

    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append('audio', audioFile);
    formData.append('language', selectedLanguage);

    try {
      const response = await fetch('http://localhost:4000/call/analyze-call', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result = await response.json();
      setAnalysis(result);
    } catch (error) {
      console.error('Error analyzing audio:', error);
      alert('Failed to analyze audio. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderScoreCard = (title, score) => (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="font-medium mb-2">{title}</h4>
      <div className="flex items-center gap-2">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              score >= 8 ? 'bg-green-500' : score >= 6 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${score * 10}%` }}
          />
        </div>
        <span className="text-sm font-semibold">{score}/10</span>
      </div>
    </div>
  );

  const prepareChartData = (scores) => {
    const labels = Object.keys(scores);
    const data = Object.values(scores);
    
    // Define gradient colors for each category
    const colors = [
      '#FF6384', // Red-Pink
      '#36A2EB', // Blue
      '#FFCE56', // Yellow
      '#4BC0C0', // Teal
      '#9966FF', // Purple
      '#FF9F40', // Orange
      '#FF6384', // Red-Pink
      '#36A2EB', // Blue
      '#FFCE56', // Yellow
      '#4BC0C0', // Teal
    ];

    return {
      labels,
      datasets: [{
        data,
        backgroundColor: colors.slice(0, data.length),
        borderColor: colors.slice(0, data.length).map(color => color.replace('0.8', '1')),
        borderWidth: 1,
        borderRadius: 6,
        barThickness: 30,
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Call Analysis Scores',
        color: '#374151',
        font: {
          size: 18,
          weight: 'bold',
          family: "'Inter', sans-serif"
        },
        padding: {
          top: 10,
          bottom: 30
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#374151',
        bodyColor: '#374151',
        bodyFont: {
          size: 14
        },
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `Score: ${context.raw}/10`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        ticks: {
          stepSize: 1,
          color: '#374151',
          font: {
            size: 12
          }
        },
        grid: {
          color: '#e5e7eb'
        }
      },
      x: {
        ticks: {
          color: '#374151',
          font: {
            size: 12
          },
          maxRotation: 45,
          minRotation: 45
        },
        grid: {
          display: false
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    },
    layout: {
      padding: {
        left: 20,
        right: 20
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Upload Section */}
      <div className="bg-white rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Call Analysis & Transcription
        </h2>

        <div className="flex flex-col items-center gap-6">
          {/* Language Selection */}
          <div className="w-full max-w-md">
            <label className="flex items-center gap-2 text-gray-700 mb-2">
              <FaGlobe className="text-purple-500" />
              <span>Select Language</span>
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* File Upload */}
          <label className="w-full max-w-md flex flex-col items-center px-4 py-6 bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-lg shadow-lg tracking-wide cursor-pointer hover:from-violet-600 hover:to-purple-700 transition-all">
            <FaUpload className="w-8 h-8 mb-2" />
            <span className="text-base">Select Audio File</span>
            <input type="file" className="hidden" accept="audio/*" onChange={handleFileUpload} />
          </label>

          {/* Audio Player */}
          {audioFile && (
            <div className="w-full max-w-md space-y-4">
              <div className="flex items-center justify-between gap-4 bg-gray-100 p-4 rounded-lg">
                <span className="truncate">{audioFile.name}</span>
                <div className="flex gap-4">
                  <button
                    onClick={togglePlayback}
                    className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                  >
                    {isPlaying ? <FaPause /> : <FaPlay />}
                  </button>
                  <button
                    onClick={analyzeAudio}
                    disabled={isAnalyzing}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
                  >
                    {isAnalyzing ? (
                      <span className="flex items-center gap-2">
                        <FaSpinner className="animate-spin" /> Analyzing...
                      </span>
                    ) : (
                      'Analyze Call'
                    )}
                  </button>
                </div>
              </div>
              <audio
                ref={audioRef}
                src={URL.createObjectURL(audioFile)}
                onEnded={() => setIsPlaying(false)}
                className="w-full"
                controls
              />
            </div>
          )}
        </div>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="bg-white rounded-xl p-8 shadow-lg space-y-6">
          {/* Language Info */}
          <div className="flex items-center gap-2 text-gray-600 mb-4">
            <FaGlobe />
            <span>Transcribed in: {languages.find(lang => lang.code === selectedLanguage)?.name}</span>
          </div>

          {/* Transcription */}
          <div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Transcription</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">{analysis.transcript}</p>
            </div>
          </div>

          {/* Scores */}
          <div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Call Analysis Scores</h3>
            
            {/* Score Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {Object.entries(analysis.scores).map(([key, value]) => (
                renderScoreCard(key, value)
              ))}
            </div>

            {/* Bar Chart */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
              <div className="h-[400px] w-full">
                <Bar 
                  data={prepareChartData(analysis.scores)} 
                  options={chartOptions}
                />
              </div>
            </div>
          </div>

          {/* Feedback Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* What Went Well */}
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-green-600">
                <FaCheckCircle />
                What Went Well
              </h3>
              <ul className="space-y-2">
                {analysis.what_went_well.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <span className="text-green-500">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas to Improve */}
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-orange-600">
                <FaExclamationCircle />
                Areas to Improve
              </h3>
              <ul className="space-y-2">
                {analysis.what_to_improve.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <span className="text-orange-500">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioTranscriptionBot;