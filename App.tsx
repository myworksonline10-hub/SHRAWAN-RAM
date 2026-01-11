
import React, { useState } from 'react';
import { Test, TestResult } from './types';
import Dashboard from './components/Dashboard';
import TestInterface from './components/TestInterface';
import ResultView from './components/ResultView';
import AdminPanel from './components/AdminPanel';
import { BLOG_URL } from './constants';

enum View {
  DASHBOARD,
  TESTING,
  RESULT,
  ADMIN
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [activeTest, setActiveTest] = useState<Test | null>(null);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  const startTest = (test: Test) => {
    setActiveTest(test);
    setCurrentView(View.TESTING);
    window.scrollTo(0, 0);
  };

  const finishTest = (result: TestResult) => {
    setTestResult(result);
    setCurrentView(View.RESULT);
    window.scrollTo(0, 0);
  };

  const backToDashboard = () => {
    setActiveTest(null);
    setTestResult(null);
    setCurrentView(View.DASHBOARD);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen">
      {currentView === View.DASHBOARD && (
        <>
          <nav className="bg-white shadow-sm p-4 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="bg-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center text-white text-xl font-bold">PS</div>
                <span className="text-2xl font-bold text-gray-800 hindi-text tracking-tighter">परीक्षा सारथी</span>
              </div>
              <div className="hidden md:flex gap-6 text-gray-600 font-medium hindi-text">
                <button onClick={() => setCurrentView(View.DASHBOARD)} className="hover:text-indigo-600">होम</button>
                <a href={BLOG_URL} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600">मुख्य वेबसाइट</a>
                <button onClick={() => setCurrentView(View.ADMIN)} className="hover:text-indigo-600 text-orange-600 font-bold">प्रश्न बैंक (Admin)</button>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => setCurrentView(View.ADMIN)} className="bg-orange-50 text-orange-600 px-4 py-2 rounded-lg font-bold hindi-text border border-orange-100">एडमिन</button>
                <button className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg font-bold hindi-text">लॉगिन</button>
              </div>
            </div>
          </nav>
          <Dashboard onStartTest={startTest} />
        </>
      )}

      {currentView === View.ADMIN && (
        <>
          <nav className="bg-white shadow-sm p-4 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="bg-orange-600 w-10 h-10 rounded-xl flex items-center justify-center text-white text-xl font-bold">PS</div>
                <span className="text-2xl font-bold text-gray-800 hindi-text tracking-tighter">एडमिन पैनल</span>
              </div>
              <button onClick={backToDashboard} className="text-gray-500 font-bold hindi-text">डैशबोर्ड पर जाएँ</button>
            </div>
          </nav>
          <AdminPanel onBack={backToDashboard} />
        </>
      )}

      {currentView === View.TESTING && activeTest && (
        <TestInterface 
          test={activeTest} 
          onFinish={finishTest} 
          onCancel={backToDashboard}
        />
      )}

      {currentView === View.RESULT && activeTest && testResult && (
        <>
          <nav className="bg-white shadow-sm p-4 sticky top-0 z-50">
            <div className="max-w-4xl mx-auto flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="bg-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold">PS</div>
                <span className="text-xl font-bold text-gray-800 hindi-text">परीक्षा सारथी - रिपोर्ट</span>
              </div>
              <button onClick={backToDashboard} className="text-gray-500 hover:text-gray-800 font-medium hindi-text">वापस जाएं</button>
            </div>
          </nav>
          <ResultView 
            test={activeTest} 
            result={testResult} 
            onBackToDashboard={backToDashboard} 
          />
        </>
      )}

      <footer className="bg-white border-t py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500">
          <p className="hindi-text font-bold text-gray-800 mb-2">परीक्षा सारथी (Pariksha Sarathi)</p>
          <p className="hindi-text text-sm">© 2024 आपके कोचिंग के लिए समर्पित। सभी अधिकार सुरक्षित।</p>
          <a href={BLOG_URL} target="_blank" rel="noopener noreferrer" className="text-indigo-500 text-xs mt-2 inline-block">हमारी वेबसाइट पर जाएँ</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
