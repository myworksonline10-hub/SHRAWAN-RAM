
import React from 'react';
import { Test, TestResult } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ResultViewProps {
  test: Test;
  result: TestResult;
  onBackToDashboard: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ test, result, onBackToDashboard }) => {
  const percentage = Math.round((result.score / result.totalQuestions) * 100);
  
  const data = [
    { name: 'सही', value: result.score },
    { name: 'गलत/छोड़ा', value: result.totalQuestions - result.score }
  ];

  const COLORS = ['#10B981', '#EF4444'];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
        <div className="bg-indigo-600 p-8 text-white text-center">
          <h1 className="text-3xl font-bold hindi-text">आपका परीक्षा परिणाम</h1>
          <p className="mt-2 opacity-80">{test.title}</p>
        </div>

        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center -mt-36">
                <p className="text-4xl font-bold">{percentage}%</p>
                <p className="text-sm text-gray-500 hindi-text">कुल स्कोर</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex justify-between items-center">
                <span className="text-green-700 font-semibold hindi-text">सही उत्तर:</span>
                <span className="text-2xl font-bold text-green-700">{result.score}</span>
              </div>
              <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex justify-between items-center">
                <span className="text-red-700 font-semibold hindi-text">गलत उत्तर:</span>
                <span className="text-2xl font-bold text-red-700">{result.totalQuestions - result.score}</span>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex justify-between items-center">
                <span className="text-blue-700 font-semibold hindi-text">कुल प्रश्न:</span>
                <span className="text-2xl font-bold text-blue-700">{result.totalQuestions}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold hindi-text">प्रश्नों का विवरण (Analysis)</h2>
        {test.questions.map((q, idx) => {
          const userAnswer = result.answers[idx];
          const isCorrect = userAnswer.isCorrect;
          
          return (
            <div key={q.id} className={`p-6 rounded-xl border-l-4 shadow-sm bg-white ${isCorrect ? 'border-green-500' : 'border-red-500'}`}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold hindi-text">
                  <span className="mr-2">प्रश्न {idx + 1}:</span>
                  {q.questionText}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {isCorrect ? 'सही' : 'गलत'}
                </span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="p-3 rounded-lg bg-gray-50">
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">आपका उत्तर</p>
                  <p className="hindi-text">{userAnswer.selectedOption !== null ? q.options[userAnswer.selectedOption] : 'छोड़ दिया'}</p>
                </div>
                <div className="p-3 rounded-lg bg-indigo-50">
                  <p className="text-xs text-indigo-500 font-bold uppercase mb-1">सही उत्तर</p>
                  <p className="hindi-text font-semibold">{q.options[q.correctAnswer]}</p>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                <p className="text-xs text-yellow-700 font-bold mb-1">व्याख्या (Explanation):</p>
                <p className="text-sm text-gray-700 hindi-text">{q.explanation}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 mb-20 text-center">
        <button
          onClick={onBackToDashboard}
          className="bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-indigo-700 transition-all hindi-text"
        >
          डैशबोर्ड पर वापस जाएं
        </button>
      </div>
    </div>
  );
};

export default ResultView;
