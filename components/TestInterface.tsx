
import React, { useState, useEffect, useCallback } from 'react';
import { Test, UserAnswer, TestResult } from '../types';

interface TestInterfaceProps {
  test: Test;
  onFinish: (result: TestResult) => void;
  onCancel: () => void;
}

const TestInterface: React.FC<TestInterfaceProps> = ({ test, onFinish, onCancel }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(test.questions.length).fill(null));
  const [timeLeft, setTimeLeft] = useState(test.durationMinutes * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinish();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleFinish = () => {
    if (isSubmitted) return;
    setIsSubmitted(true);

    const userAnswers: UserAnswer[] = test.questions.map((q, idx) => ({
      questionId: q.id,
      selectedOption: answers[idx],
      isCorrect: answers[idx] === q.correctAnswer
    }));

    const score = userAnswers.filter(a => a.isCorrect).length;
    
    onFinish({
      testId: test.id,
      score,
      totalQuestions: test.questions.length,
      answers: userAnswers,
      timestamp: Date.now()
    });
  };

  const handleOptionSelect = (optionIdx: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIdx] = optionIdx;
    setAnswers(newAnswers);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentQuestion = test.questions[currentIdx];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-indigo-600 text-white p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold hindi-text">{test.title}</h1>
          <div className="flex items-center gap-4">
            <span className={`font-mono text-lg font-bold px-3 py-1 rounded-full ${timeLeft < 60 ? 'bg-red-500 animate-pulse' : 'bg-indigo-500'}`}>
              ⏳ {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-4xl mx-auto w-full p-4 md:p-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          {/* Question Status Bar */}
          <div className="bg-gray-100 p-4 border-b flex flex-wrap gap-2">
            {test.questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIdx(idx)}
                className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                  currentIdx === idx 
                    ? 'ring-2 ring-indigo-600 ring-offset-2 bg-indigo-600 text-white' 
                    : answers[idx] !== null 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <div className="p-6 md:p-8">
            <div className="mb-6">
              <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">प्रश्न {currentIdx + 1} / {test.questions.length}</span>
              <h2 className="text-xl md:text-2xl font-semibold mt-2 hindi-text leading-relaxed">
                {currentQuestion.questionText}
              </h2>
            </div>

            <div className="space-y-4">
              {currentQuestion.options.map((option, idx) => (
                <label
                  key={idx}
                  className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all hover:bg-indigo-50 ${
                    answers[currentIdx] === idx 
                      ? 'border-indigo-600 bg-indigo-50' 
                      : 'border-gray-100 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="question-option"
                    className="hidden"
                    checked={answers[currentIdx] === idx}
                    onChange={() => handleOptionSelect(idx)}
                  />
                  <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-4 text-sm font-bold ${
                    answers[currentIdx] === idx ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300 text-gray-400'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-lg hindi-text">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-6 flex justify-between items-center border-t">
            <button
              onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="px-6 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-200 disabled:opacity-30 hindi-text"
            >
              ← पिछला
            </button>
            
            {currentIdx === test.questions.length - 1 ? (
              <button
                onClick={handleFinish}
                className="bg-green-600 text-white px-8 py-2 rounded-lg font-bold shadow-md hover:bg-green-700 transition-colors hindi-text"
              >
                परीक्षा समाप्त करें
              </button>
            ) : (
              <button
                onClick={() => setCurrentIdx(prev => Math.min(test.questions.length - 1, prev + 1))}
                className="bg-indigo-600 text-white px-8 py-2 rounded-lg font-bold shadow-md hover:bg-indigo-700 transition-colors hindi-text"
              >
                अगला →
              </button>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
            <button onClick={onCancel} className="text-red-500 hover:underline hindi-text">
                परीक्षा रद्द करें और बाहर निकलें
            </button>
        </div>
      </main>
    </div>
  );
};

export default TestInterface;
