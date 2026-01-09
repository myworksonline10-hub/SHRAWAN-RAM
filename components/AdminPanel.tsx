
import React, { useState, useEffect } from 'react';
import { BankQuestion } from '../types';
import { SUBJECTS, CLASSES } from '../constants';

interface AdminPanelProps {
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [bank, setBank] = useState<BankQuestion[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
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
      setBank(JSON.parse(savedBank));
    }
  }, []);

  const saveToLocalStorage = (newBank: BankQuestion[]) => {
    localStorage.setItem('ps_question_bank', JSON.stringify(newBank));
    setBank(newBank);
  };

  const handleSave = () => {
    if (!formData.questionText || formData.options.some(o => !o)) {
      alert("कृपया सभी जानकारी भरें।");
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
  };

  const resetForm = () => {
    setFormData({
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      subject: SUBJECTS[0].name,
      classLevel: CLASSES[0]
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

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold hindi-text">प्रश्न बैंक प्रबंधन (Question Bank)</h1>
        <button onClick={onBack} className="text-indigo-600 hover:underline hindi-text font-bold">← डैशबोर्ड पर वापस</button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl shadow-xl sticky top-24 border border-indigo-50">
            <h2 className="text-xl font-bold mb-6 hindi-text text-indigo-700">
              {isEditing ? 'प्रश्न संपादित करें' : 'नया प्रश्न जोड़ें'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 hindi-text">कक्षा (Class):</label>
                <select 
                  value={formData.classLevel}
                  onChange={e => setFormData({...formData, classLevel: e.target.value})}
                  className="w-full p-3 bg-gray-50 border rounded-xl"
                >
                  {CLASSES.map(c => <option key={c} value={c}>कक्षा {c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 hindi-text">विषय (Subject):</label>
                <select 
                  value={formData.subject}
                  onChange={e => setFormData({...formData, subject: e.target.value})}
                  className="w-full p-3 bg-gray-50 border rounded-xl"
                >
                  {SUBJECTS.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 hindi-text">प्रश्न (Question):</label>
                <textarea 
                  value={formData.questionText}
                  onChange={e => setFormData({...formData, questionText: e.target.value})}
                  className="w-full p-3 bg-gray-50 border rounded-xl h-24"
                  placeholder="प्रश्न यहाँ लिखें..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 mb-1 hindi-text">विकल्प (Options):</label>
                {formData.options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      name="correct-opt"
                      checked={formData.correctAnswer === idx}
                      onChange={() => setFormData({...formData, correctAnswer: idx})}
                    />
                    <input 
                      type="text" 
                      value={opt}
                      onChange={e => {
                        const newOpts = [...formData.options];
                        newOpts[idx] = e.target.value;
                        setFormData({...formData, options: newOpts});
                      }}
                      placeholder={`विकल्प ${String.fromCharCode(65+idx)}`}
                      className="flex-grow p-2 bg-gray-50 border rounded-lg text-sm"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 hindi-text">व्याख्या (Explanation):</label>
                <textarea 
                  value={formData.explanation}
                  onChange={e => setFormData({...formData, explanation: e.target.value})}
                  className="w-full p-3 bg-gray-50 border rounded-xl h-20 text-sm"
                  placeholder="सही उत्तर की व्याख्या..."
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button 
                  onClick={handleSave}
                  className="flex-grow bg-indigo-600 text-white py-3 rounded-xl font-bold hindi-text hover:bg-indigo-700 transition-all shadow-lg"
                >
                  {isEditing ? 'अपडेट करें' : 'सुरक्षित करें'}
                </button>
                {isEditing && (
                  <button onClick={resetForm} className="px-4 py-3 bg-gray-100 rounded-xl font-bold text-gray-500">रद्द</button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-indigo-50 p-4 rounded-2xl flex justify-between items-center mb-4">
            <span className="font-bold hindi-text">कुल प्रश्न: {bank.length}</span>
            <div className="text-sm text-gray-500 hindi-text italic">ये प्रश्न आपके द्वारा बनाए गए हैं।</div>
          </div>

          {bank.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
              <div className="text-6xl mb-4 text-gray-200">📭</div>
              <p className="text-gray-400 hindi-text">बैंक में कोई प्रश्न नहीं है। नया प्रश्न जोड़ें!</p>
            </div>
          ) : (
            bank.slice().reverse().map(q => (
              <div key={q.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex gap-2">
                    <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-bold">कक्षा {q.classLevel}</span>
                    <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-[10px] font-bold">{q.subject}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => editQuestion(q)} className="text-blue-500 hover:text-blue-700">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </button>
                    <button onClick={() => deleteQuestion(q.id)} className="text-red-500 hover:text-red-700">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </div>
                <h3 className="font-bold hindi-text mb-4">{q.questionText}</h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                  {q.options.map((opt, i) => (
                    <div key={i} className={`p-2 rounded ${i === q.correctAnswer ? 'bg-green-50 border border-green-200 text-green-700 font-bold' : 'bg-gray-50'}`}>
                      {String.fromCharCode(65+i)}. {opt}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 hindi-text italic">व्याख्या: {q.explanation}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
