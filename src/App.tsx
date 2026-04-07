import React, { useState, useEffect, useRef } from 'react';
import { analyzeStressTest } from './lib/gemini';
import { AnalysisResult } from './types';
import { 
  Code2, 
  AlertCircle, 
  Play, 
  Terminal, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  Copy,
  ChevronRight,
  Bug,
  Layout,
  Cpu,
  Zap,
  Activity,
  Search,
  Maximize2,
  Minimize2,
  Settings,
  HelpCircle,
  FileText,
  AlertTriangle,
  Keyboard,
  FastForward,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

export default function App() {
  const [problemDescription, setProblemDescription] = useState('');
  const [correctCode, setCorrectCode] = useState('');
  const [incorrectCode, setIncorrectCode] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [customOutput, setCustomOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Progress Simulation State
  const [progress, setProgress] = useState(0);
  const [passedCount, setPassedCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [isFoundAnimation, setIsFoundAnimation] = useState(false);

  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  const handleAnalyze = async () => {
    if (!problemDescription || !correctCode || !incorrectCode) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setProgress(0);
    setPassedCount(0);
    setFailedCount(0);
    setIsFoundAnimation(false);

    // Start progress simulation
    const targetPassed = Math.floor(Math.random() * 500) + 500;
    
    progressInterval.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 5;
      });
      
      setPassedCount(prev => {
        if (prev >= targetPassed) return prev;
        return prev + Math.floor(Math.random() * 50);
      });
    }, 150);

    try {
      const data = await analyzeStressTest({
        problemDescription,
        correctCode,
        incorrectCode,
      });
      
      // Stop simulation and show "Found It"
      if (progressInterval.current) clearInterval(progressInterval.current);
      setProgress(100);
      setFailedCount(1);
      setIsFoundAnimation(true);
      
      setTimeout(() => {
        setResult(data);
        setLoading(false);
      }, 1000);

    } catch (err) {
      console.error(err);
      setError('Analysis failed. Please try again.');
      setLoading(false);
      if (progressInterval.current) clearInterval(progressInterval.current);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="h-screen flex flex-col bg-[#0d1117] text-[#c9d1d9] font-sans selection:bg-[#58a6ff] selection:text-white overflow-hidden">
      {/* IDE Header */}
      <header className="h-12 border-b border-[#30363d] bg-[#161b22] px-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Bug className="w-5 h-5 text-[#bc8cff]" />
            <span className="text-sm font-bold tracking-tight font-mono">CP_DEBUGGER_v1.0</span>
          </div>
          <nav className="flex items-center gap-4 text-xs font-medium text-[#8b949e]">
            <span className="hover:text-[#c9d1d9] cursor-pointer">File</span>
            <span className="hover:text-[#c9d1d9] cursor-pointer">Edit</span>
            <span className="hover:text-[#c9d1d9] cursor-pointer">Selection</span>
            <span className="hover:text-[#c9d1d9] cursor-pointer">View</span>
            <span className="hover:text-[#c9d1d9] cursor-pointer">Go</span>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-[#0d1117] border border-[#30363d] rounded text-[10px] font-mono text-[#8b949e]">
            <Activity className="w-3 h-3 text-[#3fb950]" />
            <span>GEMINI_FLASH_LATEST</span>
          </div>
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#8b949e] hover:text-[#c9d1d9] cursor-pointer" />
            <HelpCircle className="w-4 h-4 text-[#8b949e] hover:text-[#c9d1d9] cursor-pointer" />
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden">
        {/* Activity Bar (Slim Left) */}
        <div className="w-12 border-r border-[#30363d] bg-[#0d1117] flex flex-col items-center py-4 gap-6">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 cursor-pointer text-[#c9d1d9]">
            <FileText className="w-5 h-5" />
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 cursor-pointer text-[#8b949e] hover:text-[#c9d1d9]">
            <Search className="w-5 h-5" />
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 cursor-pointer text-[#8b949e] hover:text-[#c9d1d9]">
            <Cpu className="w-5 h-5" />
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 cursor-pointer text-[#8b949e] hover:text-[#c9d1d9]">
            <Layout className="w-5 h-5" />
          </motion.div>
        </div>

        {/* Resizable Workspace */}
        <PanelGroup direction="horizontal" className="flex-1">
          {/* Column 1: Problem Description */}
          <Panel defaultSize={25} minSize={15}>
            <div className="h-full border-r border-[#30363d] bg-[#0d1117] flex flex-col">
              <div className="h-9 bg-[#161b22] border-b border-[#30363d] flex items-center px-4 gap-2">
                <FileText className="w-3 h-3 text-[#8b949e]" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8b949e]">Problem_Statement.md</span>
              </div>
              <div className="flex-1 p-4 overflow-y-auto scrollbar-thin">
                <textarea
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  placeholder="Paste problem description and constraints here..."
                  className="w-full h-full bg-transparent border-none focus:outline-none font-mono text-sm leading-relaxed resize-none text-[#8b949e] placeholder:text-[#30363d]"
                />
              </div>
            </div>
          </Panel>

          <PanelResizeHandle className="w-1.5 knurled-handle" />

          {/* Column 2: Code Editors */}
          <Panel defaultSize={40} minSize={30}>
            <PanelGroup direction="vertical" className="h-full border-r border-[#30363d]">
              {/* Correct Code Editor */}
              <Panel defaultSize={50} minSize={20}>
                <div className="h-full flex flex-col bg-[#0d1117]">
                  <div className="h-9 bg-[#161b22] border-b border-[#30363d] flex items-center px-4 justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-[#3fb950]" />
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#3fb950]">Solution_AC.cpp</span>
                    </div>
                    <Maximize2 className="w-3 h-3 text-[#8b949e] cursor-pointer" />
                  </div>
                  <div className="flex-1 p-4 overflow-y-auto scrollbar-thin">
                    <textarea
                      value={correctCode}
                      onChange={(e) => setCorrectCode(e.target.value)}
                      placeholder="// Reference AC code..."
                      className="w-full h-full bg-transparent border-none focus:outline-none font-mono text-sm leading-relaxed resize-none text-[#c9d1d9] placeholder:text-[#30363d]"
                    />
                  </div>
                </div>
              </Panel>

              <PanelResizeHandle className="h-1.5 knurled-handle knurled-handle-v" />

              {/* Incorrect Code Editor */}
              <Panel defaultSize={50} minSize={20}>
                <div className="h-full flex flex-col bg-[#0d1117]">
                  <div className="h-9 bg-[#161b22] border-b border-[#30363d] flex items-center px-4 justify-between">
                    <div className="flex items-center gap-2">
                      <XCircle className="w-3 h-3 text-[#f85149]" />
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#f85149]">Solution_WA.cpp</span>
                    </div>
                    <Maximize2 className="w-3 h-3 text-[#8b949e] cursor-pointer" />
                  </div>
                  <div className="flex-1 p-4 overflow-y-auto scrollbar-thin relative">
                    <textarea
                      value={incorrectCode}
                      onChange={(e) => setIncorrectCode(e.target.value)}
                      placeholder="// Your failing code..."
                      className="w-full h-full bg-transparent border-none focus:outline-none font-mono text-sm leading-relaxed resize-none text-[#c9d1d9] placeholder:text-[#30363d]"
                    />
                    {result && result.diagnosis.toLowerCase().includes('overflow') && (
                      <div className="absolute top-10 right-10 flex items-center gap-2 px-2 py-1 bg-[#f85149] bg-opacity-20 border border-[#f85149] rounded text-[10px] text-[#f85149] animate-pulse">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Potential Overflow Detected</span>
                      </div>
                    )}
                  </div>
                </div>
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle className="w-1.5 knurled-handle" />

          {/* Column 3: Debugger & Custom Input */}
          <Panel defaultSize={35} minSize={20}>
            <PanelGroup direction="vertical" className="h-full">
              {/* Debugger Console */}
              <Panel defaultSize={60} minSize={20}>
                <div className="h-full bg-[#0d1117] flex flex-col">
                  <div className="h-9 bg-[#161b22] border-b border-[#30363d] flex items-center px-4 gap-2">
                    <Terminal className="w-3 h-3 text-[#bc8cff]" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#bc8cff]">Debugger_Console</span>
                  </div>
                  
                  <div className="flex-1 p-4 overflow-y-auto scrollbar-thin space-y-6">
                    {!loading && !result && (
                      <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                        <Cpu className="w-12 h-12" />
                        <p className="text-xs font-mono uppercase tracking-widest">System Ready. Awaiting Input.</p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleAnalyze}
                          className="btn-metallic-blue px-8 py-3 rounded-lg text-xs font-mono uppercase tracking-[0.2em] transition-all"
                        >
                          Start Stress Test
                        </motion.button>
                      </div>
                    )}

                    {loading && (
                      <div className="space-y-6">
                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-mono text-[#8b949e]">
                            <span>STRESS_TEST_GENERATION</span>
                            <span>{Math.floor(progress)}%</span>
                          </div>
                          <div className="h-1 bg-[#30363d] rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              className="h-full bg-[#58a6ff]"
                            />
                          </div>
                        </div>

                        {/* Live Counter */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-3 bg-[#161b22] border border-[#30363d] rounded">
                            <div className="text-[8px] font-mono text-[#8b949e] uppercase mb-1">Passed</div>
                            <div className="text-xl font-mono text-[#3fb950]">{passedCount}</div>
                          </div>
                          <div className="p-3 bg-[#161b22] border border-[#30363d] rounded">
                            <div className="text-[8px] font-mono text-[#8b949e] uppercase mb-1">Failed</div>
                            <div className="text-xl font-mono text-[#f85149]">{failedCount}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-[10px] font-mono text-[#8b949e]">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>Searching for edge cases...</span>
                        </div>

                        {isFoundAnimation && (
                          <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="p-4 bg-[#f85149] bg-opacity-20 border border-[#f85149] rounded text-center space-y-2"
                          >
                            <Zap className="w-6 h-6 text-[#f85149] mx-auto" />
                            <div className="text-xs font-mono font-bold text-[#f85149] uppercase animate-pulse">Failing Case Found!</div>
                          </motion.div>
                        )}
                      </div>
                    )}

                    {result && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                      >
                        {/* Failing Input */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-mono text-[#8b949e] uppercase">Failing_Input.txt</span>
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => copyToClipboard(result.failingInput)}
                              className="btn-metallic p-1.5 rounded text-[#8b949e] hover:text-[#c9d1d9] transition-all"
                            >
                              <Copy className="w-3 h-3" />
                            </motion.button>
                          </div>
                          <pre className={`p-3 bg-[#0d1117] border border-[#30363d] rounded font-mono text-xs text-[#f85149] overflow-x-auto ${isFoundAnimation ? 'animate-[pulse_1s_ease-in-out_infinite]' : ''}`}>
                            {result.failingInput}
                          </pre>
                        </div>

                        {/* Side-by-Side Diff */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-mono text-[#8b949e] uppercase">Output_Comparison</span>
                          <div className="grid grid-cols-2 gap-px bg-[#30363d] border border-[#30363d] rounded overflow-hidden">
                            <div className="bg-[#0d1117] p-2">
                              <div className="text-[8px] font-mono text-[#3fb950] uppercase mb-1">Expected</div>
                              <div className="text-xs font-mono text-[#3fb950]">{result.expectedOutput}</div>
                            </div>
                            <div className="bg-[#0d1117] p-2">
                              <div className="text-[8px] font-mono text-[#f85149] uppercase mb-1">Actual</div>
                              <div className="text-xs font-mono text-[#f85149]">{result.userOutput}</div>
                            </div>
                          </div>
                        </div>

                        {/* Diagnosis Glass Card */}
                        <div className="glass p-4 rounded-lg space-y-2 border border-[#bc8cff] border-opacity-30">
                          <div className="flex items-center gap-2 text-[#bc8cff]">
                            <Bug className="w-4 h-4" />
                            <span className="text-[10px] font-mono uppercase font-bold">Logic_Diagnosis</span>
                          </div>
                          <p className="text-xs leading-relaxed text-[#c9d1d9] italic">
                            {result.diagnosis}
                          </p>
                        </div>

                        {/* Python Generator */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-mono text-[#8b949e] uppercase">Stress_Generator.py</span>
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => copyToClipboard(result.generatorCode)}
                              className="btn-metallic p-1.5 rounded text-[#8b949e] hover:text-[#c9d1d9] transition-all"
                            >
                              <Copy className="w-3 h-3" />
                            </motion.button>
                          </div>
                          <pre className="p-3 bg-[#161b22] border border-[#30363d] rounded font-mono text-[10px] text-[#8b949e] overflow-x-auto max-h-40 scrollbar-thin">
                            {result.generatorCode}
                          </pre>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </Panel>

              <PanelResizeHandle className="h-1.5 knurled-handle knurled-handle-v" />

              {/* Custom Test Case Area */}
              <Panel defaultSize={40} minSize={10}>
                <div className="h-full bg-[#0d1117] border-t border-[#30363d] flex flex-col">
                  <div className="h-9 bg-[#161b22] border-b border-[#30363d] flex items-center px-4 justify-between">
                    <div className="flex items-center gap-2">
                      <Keyboard className="w-3 h-3 text-[#58a6ff]" />
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#58a6ff]">Custom_Input.in</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-metallic px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-widest text-[#8b949e] hover:text-[#c9d1d9]"
                        onClick={() => setCustomInput('')}
                      >
                        Clear
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-metallic-blue px-3 py-0.5 rounded text-[8px] font-mono uppercase tracking-widest"
                        onClick={() => setCustomOutput('Running custom test case...')}
                      >
                        Run Input
                      </motion.button>
                    </div>
                  </div>
                  
                  <div className="flex-1 grid grid-rows-2 overflow-hidden">
                    <div className="p-3 border-b border-[#30363d] overflow-hidden flex flex-col">
                      <div className="text-[8px] font-mono text-[#8b949e] uppercase mb-1 flex items-center gap-1">
                        <Database className="w-2 h-2" /> Input
                      </div>
                      <textarea
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        placeholder="Enter custom test data..."
                        className="flex-1 bg-transparent border-none focus:outline-none font-mono text-xs leading-relaxed resize-none text-[#c9d1d9] placeholder:text-[#30363d] scrollbar-thin"
                      />
                    </div>
                    <div className="p-3 overflow-hidden flex flex-col bg-[#161b22] bg-opacity-30">
                      <div className="text-[8px] font-mono text-[#8b949e] uppercase mb-1 flex items-center gap-1">
                        <FastForward className="w-2 h-2" /> Output
                      </div>
                      <div className="flex-1 font-mono text-xs text-[#8b949e] overflow-y-auto scrollbar-thin whitespace-pre-wrap">
                        {customOutput || <span className="opacity-30 italic">No output generated yet.</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>

        {/* Bottom Action Bar (Moved into Footer/Status Bar for cleaner look or kept separate) */}
        <div className="absolute bottom-6 right-6 z-50">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            onClick={handleAnalyze}
            disabled={loading}
            className="btn-metallic-success flex items-center gap-3 px-8 py-4 text-white rounded-lg text-xs font-bold uppercase tracking-[0.2em] shadow-2xl disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            {loading ? 'Analyzing...' : 'Execute Stress Test'}
          </motion.button>
        </div>
      </main>

      {/* Status Bar */}
      <footer className="h-6 bg-[#0d1117] border-t border-[#30363d] flex items-center px-4 justify-between text-[10px] font-mono text-[#8b949e]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Activity className="w-3 h-3" />
            <span>Ready</span>
          </div>
          <span>0 Errors</span>
          <span>0 Warnings</span>
        </div>
        <div className="flex items-center gap-4">
          <span>CP Expert</span>
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[#3fb950]" />
            <span>Synced</span>
          </div>
        </div>
      </footer>

      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 p-4 glass border-[#f85149] rounded-lg flex items-center gap-3 text-sm text-[#f85149] z-[100]"
          >
            <AlertCircle className="w-5 h-5" />
            {error}
            <button onClick={() => setError(null)} className="ml-4 text-[#8b949e] hover:text-[#c9d1d9]">✕</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
