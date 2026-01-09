
import React, { useState } from 'react';
import { SUBJECTS, CLASSES, MOCK_TESTS } from '../constants';
import { Test, BankQuestion, Question } from '../types';
import { generateCustomQuestions } from '../services/geminiService';

interface DashboardProps {
  onStartTest: (test: Test) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onStartTest }) => {
  const [loading, setLoading] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [selectedClass, setSelectedClass] = useState('10');
  const [selectedSubject, setSelectedSubject] = useState<{id: string, name: string, icon: string} | null>(null);
  
  // Config states
  const [qCount, setQCount] = useState(10);
  const [difficulty, setDifficulty] = useState('मध्यम (Medium)');
  const [timeLimit, setTimeLimit] = useState(15);

  const openConfig = (sub: {id: string, name: string, icon: string}) => {
    setSelectedSubject(sub);
    setShowConfig(true);
  };

  const handleCustomTest = async () => {
    if (!selectedSubject) return;
    
    setLoading(true);
    try {
      // Fetch local bank questions
      const savedBank = localStorage.getItem('ps_question_bank');
      let localQuestions: BankQuestion[] = savedBank ? JSON.parse(savedBank) : [];
      
      // Filter questions matching current subject and class
      const matchingBankQuestions = localQuestions.filter(q => 
        q.subject === selectedSubject.name && q.classLevel === selectedClass
      );

      // Fix: Explicitly type finalQuestions as Question[] to allow merging BankQuestion and Question
      let finalQuestions: Question[] = [...matchingBankQuestions];
      
      // If we need more questions, get them from Gemini
      if (finalQuestions.length < qCount) {
        const needed = qCount - finalQuestions.length;
        const aiQuestions = await generateCustomQuestions(selectedSubject.name, selectedClass, needed, difficulty);
        finalQuestions = [...finalQuestions, ...aiQuestions];
      }

      // Shuffle if we have too many
      if (finalQuestions.length > qCount) {
        finalQuestions = finalQuestions.sort(() => 0.5 - Math.random()).slice(0, qCount);
      }

      const newTest: Test = {
        id: `custom-${Date.now()}`,
        title: `कक्षा ${selectedClass}: ${selectedSubject.name} - अभ्यास`,
        subject: selectedSubject.name,
        classLevel: selectedClass,
        durationMinutes: timeLimit,
        questions: finalQuestions
      };
      onStartTest(newTest);
      setShowConfig(false);
    } catch (error) {
      console.error("Test generation error:", error);
      alert("प्रश्न उत्पन्न करने में समस्या आई। कृपया पुनः प्रयास करें।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-700 via-blue-600 to-indigo-800 rounded-[2rem] p-8 md:p-12 text-white mb-12 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-block px-4 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-4 hindi-text tracking-wide uppercase">
            BSEB - बिहार बोर्ड विशेष
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 hindi-text leading-tight">अपनी तैयारी को शिखर पर पहुँचाएं! 🚀</h1>
          <p className="text-xl opacity-90 hindi-text mb-8">कक्षा 6 से 10 तक के लिए बिहार बोर्ड के नवीनतम सिलेबस पर आधारित टेस्ट।</p>
          
          {/* Class Selection */}
          <div className="flex flex-wrap items-center gap-4 bg-black/10 p-2 rounded-2xl backdrop-blur-sm border border-white/10 w-fit">
            <span className="hindi-text font-bold ml-4">अपनी कक्षा चुनें:</span>
            {CLASSES.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedClass(c)}
                className={`w-12 h-12 rounded-xl font-bold transition-all ${selectedClass === c ? 'bg-white text-indigo-700 shadow-xl scale-110' : 'bg-white/10 text-white hover:bg-white/20'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-white opacity-5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-400 opacity-20 rounded-full blur-3xl"></div>
      </section>

      {/* Subjects Grid */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-3 hindi-text text-gray-800">
            <span className="w-2.5 h-10 bg-indigo-600 rounded-full"></span>
            विषय चुनें (कक्षा {selectedClass})
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {SUBJECTS.map((sub) => (
            <button
              key={sub.id}
              onClick={() => openConfig(sub)}
              className="group bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-400 hover:shadow-xl hover:-translate-y-1 transition-all text-center"
            >
              <div className="text-4xl mb-3 transform group-hover:scale-125 transition-transform duration-300">{sub.icon}</div>
              <h3 className="font-bold text-sm hindi-text text-gray-800 mb-1 leading-tight">{sub.name}</h3>
              <div className="w-8 h-1 bg-indigo-100 mx-auto rounded-full group-hover:w-16 group-hover:bg-indigo-500 transition-all"></div>
            </button>
          ))}
        </div>
      </section>

      {/* Popular Tests */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 hindi-text text-gray-800">
          <span className="w-2.5 h-10 bg-orange-500 rounded-full"></span>
          मॉक टेस्ट सीरीज
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_TESTS.filter(t => t.classLevel === selectedClass || !t.classLevel).map((test) => (
            <div key={test.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all border-b-4 border-indigo-100">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
                    कक्षा {test.classLevel || selectedClass}
                  </span>
                  <span className="text-gray-400 text-sm font-medium flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {test.durationMinutes} मि.
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2 hindi-text text-gray-900 leading-tight">{test.title}</h3>
                <p className="text-gray-500 text-xs mb-6 hindi-text font-medium flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  BSEB सिलेबस के अनुसार
                </p>
                <button
                  onClick={() => onStartTest(test)}
                  className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-600 shadow-sm transition-all hindi-text active:scale-95"
                >
                  टेस्ट शुरू करें
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Config Modal */}
      {showConfig && selectedSubject && (
        <div className="fixed inset-0 bg-gray-900/60 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in duration-300">
            <div className="bg-indigo-600 p-8 text-white relative">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-4xl shadow-inner">
                  {selectedSubject.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-black hindi-text">{selectedSubject.name}</h3>
                  <p className="text-indigo-100 text-sm font-bold hindi-text">BSEB कक्षा {selectedClass} - सेटअप</p>
                </div>
              </div>
              <button onClick={() => setShowConfig(false)} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="p-8 space-y-8">
              {/* Question Count */}
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4 hindi-text">प्रश्नों की संख्या (Questions):</label>
                <div className="flex gap-3">
                  {[5, 10, 20, 50].map(n => (
                    <button 
                      key={n}
                      onClick={() => setQCount(n)}
                      className={`flex-1 py-3.5 rounded-2xl font-bold border-2 transition-all ${qCount === n ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-indigo-200'}`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4 hindi-text">परीक्षा का स्तर (Level):</label>
                <div className="grid grid-cols-3 gap-3">
                  {['आसान (Basic)', 'मध्यम (Board)', 'कठिन (Competitive)'].map(d => (
                    <button 
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`py-3 rounded-xl text-xs font-bold border-2 transition-all hindi-text ${difficulty === d ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-indigo-200'}`}
                    >
                      {d.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Limit */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest hindi-text">समय सीमा (Minutes):</label>
                  <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg font-black text-sm">
                    {timeLimit} मि.
                  </span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="60" 
                  step="5" 
                  value={timeLimit} 
                  onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <button
                disabled={loading}
                onClick={handleCustomTest}
                className="w-full bg-gray-900 text-white py-5 rounded-2xl font-bold text-lg shadow-2xl hover:bg-indigo-600 hover:-translate-y-1 transition-all flex items-center justify-center gap-4 disabled:opacity-50 disabled:translate-y-0"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span className="hindi-text">बिहार बोर्ड टेस्ट तैयार हो रहा है...</span>
                  </>
                ) : (
                  <>
                    <span className="hindi-text">परीक्षा आरंभ करें</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
