
import React, { useState, useEffect } from 'react';
import { BankQuestion } from '../types';
import { SUBJECTS, CLASSES } from '../constants';

interface AdminPanelProps {
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [bank, setBank] = useState<BankQuestion[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  
  // Filter states
  const [filterClass, setFilterClass] = useState<string>('All');
  const [filterSubject, setFilterSubject] = useState<string>('All');

  const [formData, setFormData] = useState<Omit<BankQuestion, 'id'>>({
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    subject: SUBJECTS[0].name,
    classLevel: CLASSES[0]
  });

  useEffect(() => {
    const savedBank = localStorage.getItem('ps_question_bank');
    if (savedBank) {
      try {
        setBank(JSON.parse(savedBank));
      } catch (e) {
        console.error("Failed to parse question bank", e);
        setBank([]);
      }
    }
  }, []);

  const saveToLocalStorage = (newBank: BankQuestion[]) => {
    localStorage.setItem('ps_question_bank', JSON.stringify(newBank));
    setBank(newBank);
  };

  const handleSave = () => {
    if (!formData.questionText.trim() || formData.options.some(o => !o.trim())) {
      alert("कृपया प्रश्न और सभी चार विकल्प भरें।");
      return;
    }

    let newBank;
    if (isEditing) {
      newBank = bank.map(q => q.id === isEditing ? { ...formData, id: q.id } : q);
    } else {
      const newQuestion: BankQuestion = {
        ...formData,
        id: `bank-${Date.now()}`
      };
      newBank = [...bank, newQuestion];
    }

    saveToLocalStorage(newBank);
    resetForm();
    alert("प्रश्न सफलतापूर्वक सुरक्षित किया गया।");
  };

  const resetForm = () => {
    setFormData({
      ...formData,
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
    });
    setIsEditing(null);
  };

  const editQuestion = (q: BankQuestion) => {
    setFormData({
      questionText: q.questionText,
      options: [...q.options],
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      subject: q.subject,
      classLevel: q.classLevel
    });
    setIsEditing(q.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteQuestion = (id: string) => {
    if (window.confirm("क्या आप वाकई इस प्रश्न को हटाना चाहते हैं?")) {
      const newBank = bank.filter(q => q.id !== id);
      saveToLocalStorage(newBank);
    }
  };

  const filteredQuestions = bank.filter(q => {
    const matchClass = filterClass === 'All' || q.classLevel === filterClass;
    const matchSubject = filterSubject === 'All' || q.subject === filterSubject;
    return matchClass && matchSubject;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold hindi-text text-gray-900">प्रश्न बैंक प्रबंधन (Admin)</h1>
          <p className="text-gray-500 hindi-text mt-1">यहां आप अपने कोचिंग के लिए स्थाई प्रश्न जोड़ सकते हैं।</p>
        </div>
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 px-6 py-2 bg-white border-2 border-indigo-100 text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-all hindi-text shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          डैशबोर्ड पर वापस
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl border border-gray-100 sticky top-24">
            <h2 className="text-xl font-black mb-6 hindi-text text-indigo-700 flex items-center gap-2">
              <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
              {isEditing ? 'प्रश्न संपादित करें' : 'नया प्रश्न जोड़ें'}
            </h2>
            
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 hindi-text">कक्षा:</label>
                  <select 
                    value={formData.classLevel}
                    onChange={e => setFormData({...formData, classLevel: e.target.value})}
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  >
                    {CLASSES.map(c => <option key={c} value={c}>कक्षा {c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 hindi-text">विषय:</label>
                  <select 
                    value={formData.subject}
                    onChange={e => setFormData({...formData, subject: e.target.value})}
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  >
                    {SUBJECTS.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 hindi-text">प्रश्न (Question):</label>
                <textarea 
                  value={formData.questionText}
                  onChange={e => setFormData({...formData, questionText: e.target.value})}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl h-28 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="यहाँ प्रश्न लिखें..."
                />
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1 hindi-text">विकल्प और सही उत्तर चुनें:</label>
                {formData.options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-3 group">
                    <button
                      onClick={() => setFormData({...formData, correctAnswer: idx})}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold border-2 transition-all ${formData.correctAnswer === idx ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-200' : 'bg-white border-gray-100 text-gray-400 hover:border-green-200'}`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </button>
                    <input 
                      type="text" 
                      value={opt}
                      onChange={e => {
                        const newOpts = [...formData.options];
                        newOpts[idx] = e.target.value;
                        setFormData({...formData, options: newOpts});
                      }}
                      placeholder={`विकल्प ${String.fromCharCode(65+idx)}`}
                      className="flex-grow p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 hindi-text">व्याख्या (Explanation):</label>
                <textarea 
                  value={formData.explanation}
                  onChange={e => setFormData({...formData, explanation: e.target.value})}
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl h-20 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="सही उत्तर क्यों है? व्याख्या लिखें..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  onClick={handleSave}
                  className="flex-grow bg-gray-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-600 transition-all shadow-xl active:scale-95"
                >
                  {isEditing ? 'अपडेट करें' : 'बैंक में जोड़ें'}
                </button>
                {isEditing && (
                  <button onClick={resetForm} className="px-6 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-all">रद्द</button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-7 space-y-6">
          {/* Filters */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase hindi-text">फिल्टर:</span>
              <select 
                value={filterClass}
                onChange={e => setFilterClass(e.target.value)}
                className="p-2 bg-gray-50 border rounded-lg text-sm font-bold outline-none"
              >
                <option value="All">सभी कक्षाएं</option>
                {CLASSES.map(c => <option key={c} value={c}>कक्षा {c}</option>)}
              </select>
              <select 
                value={filterSubject}
                onChange={e => setFilterSubject(e.target.value)}
                className="p-2 bg-gray-50 border rounded-lg text-sm font-bold outline-none"
              >
                <option value="All">सभी विषय</option>
                {SUBJECTS.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div className="ml-auto bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-black">
              कुल: {filteredQuestions.length} प्रश्न
            </div>
          </div>

          <div className="space-y-4">
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-32 bg-white rounded-[2rem] border-2 border-dashed border-gray-100">
                <div className="text-6xl mb-6 grayscale opacity-20">📚</div>
                <h3 className="text-xl font-bold text-gray-400 hindi-text">कोई प्रश्न नहीं मिला</h3>
                <p className="text-gray-400 hindi-text text-sm">बाएं फॉर्म का उपयोग करके नया प्रश्न जोड़ें।</p>
              </div>
            ) : (
              filteredQuestions.slice().reverse().map(q => (
                <div key={q.id} className="group bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100 hover:shadow-xl hover:border-indigo-100 transition-all relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-2">
                      <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">कक्षा {q.classLevel}</span>
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">{q.subject}</span>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => editQuestion(q)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                      </button>
                      <button onClick={() => deleteQuestion(q.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold hindi-text text-gray-900 mb-6 leading-relaxed">
                    {q.questionText}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    {q.options.map((opt, i) => (
                      <div key={i} className={`p-3 rounded-xl text-sm hindi-text flex items-center gap-3 border transition-colors ${i === q.correctAnswer ? 'bg-green-50 border-green-200 text-green-800 font-bold' : 'bg-gray-50 border-gray-100 text-gray-500'}`}>
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${i === q.correctAnswer ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                          {String.fromCharCode(65+i)}
                        </span>
                        {opt}
                      </div>
                    ))}
                  </div>

                  {q.explanation && (
                    <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                      <p className="text-[10px] font-black text-amber-600 uppercase mb-1 tracking-widest hindi-text">व्याख्या (Hint):</p>
                      <p className="text-xs text-amber-800 hindi-text">{q.explanation}</p>
                    </div>
                  )}
                  
                  {/* Decorative element */}
                  <div className="absolute top-0 right-0 w-1 h-full bg-indigo-500/10"></div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
