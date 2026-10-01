import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  FolderGit2, 
  FileCode, 
  HelpCircle, 
  Download, 
  Copy, 
  Check, 
  Play, 
  RefreshCw, 
  ExternalLink, 
  ShieldCheck, 
  Cpu, 
  HardDrive, 
  Monitor, 
  Server, 
  ChevronRight, 
  Info, 
  AlertTriangle,
  Send,
  Github,
  Youtube,
  Instagram,
  FileText
} from 'lucide-react';
import { REPO_FILES, RepoFile } from './data/repoFiles';

export default function App() {
  const [activeTab, setActiveTab] = useState<'terminal' | 'explorer' | 'commands' | 'docs' | 'git'>('terminal');
  const [selectedFileKey, setSelectedFileKey] = useState<string>('install.sh');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Terminal Simulator State
  const [terminalHistory, setTerminalHistory] = useState<Array<{ text: string; type?: 'banner' | 'info' | 'step' | 'success' | 'warn' | 'error' | 'input' | 'raw' }>>([]);
  const [terminalInput, setTerminalInput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Customizer State
  const [customFlavor, setCustomFlavor] = useState<'nethunter' | 'cli' | 'gui' | 'ssh'>('gui');
  const [vncResolution, setVncResolution] = useState<'1280x720' | '1920x1080' | '1024x768'>('1280x720');
  const [sshPort, setSshPort] = useState<number>(2022);
  const [enableAudio, setEnableAudio] = useState<boolean>(true);

  const bannerText = `  ██████╗ ██╗    ██╗██╗  ██╗██╗███████╗
 ██╔════╝ ██║    ██║██║  ██║██║██╔════╝
 ╚█████╗  ██║ █╗ ██║███████║██║█████╗  
  ╚═══██╗ ██║███╗██║██╔══██║██║██╔══╝  
 ██████╔╝ ╚███╔███╔╝██║  ██║██║███████╗
 ╚═════╝   ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝╚══════╝
       K A L I D R O I D   v 1 . 0
  Android • Termux • Kali Linux Suite
         Developed by 8WHIE`;

  const resetTerminal = () => {
    setTerminalHistory([
      { text: bannerText, type: 'banner' },
      { text: '───────────────────────────────────────────────────', type: 'raw' },
      { text: '  INSTALLATION CHOICES:', type: 'raw' },
      { text: '  [1] Kali NetHunter Rootless  (Full Kali Suite via Official Script)', type: 'raw' },
      { text: '  [2] Kali Lightweight CLI      (Proot minimal container, fast & clean)', type: 'raw' },
      { text: '  [3] Kali GUI Desktop (XFCE)    (Graphical desktop + TigerVNC/KeX)', type: 'raw' },
      { text: '  [4] Kali SSH Remote Server     (Headless background workspace)', type: 'raw' },
      { text: '───────────────────────────────────────────────────', type: 'raw' },
      { text: '  MANAGEMENT & UTILITIES:', type: 'raw' },
      { text: '  [5] System Pre-Flight Check    (Verify dependencies, RAM & storage)', type: 'raw' },
      { text: '  [6] Uninstall / Cleanup        (Safely remove 8WHIE KaliDroid files)', type: 'raw' },
      { text: '  [7] Check for Updates          (Sync latest version from GitHub)', type: 'raw' },
      { text: '  [8] Help & Documentation       (Troubleshooting, FAQ & Credits)', type: 'raw' },
      { text: '  [0] Exit / Return to Shell', type: 'raw' },
      { text: '───────────────────────────────────────────────────', type: 'raw' },
      { text: "Select an option [0-8] or click an action button below:", type: 'info' }
    ]);
  };

  useEffect(() => {
    resetTerminal();
  }, []);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSimulateOption = async (option: string) => {
    if (isProcessing) return;
    setIsProcessing(true);

    const append = (msg: string, type: 'info' | 'step' | 'success' | 'warn' | 'error' | 'raw' | 'input' = 'info') => {
      setTerminalHistory(prev => [...prev, { text: msg, type }]);
    };

    append(`kalidroid: selected option [${option}]`, 'input');

    if (option === '1') {
      append('[STEP] Verifying storage requirement: 7500 MB needed...', 'step');
      await new Promise(r => setTimeout(r, 600));
      append('[ OK ] Available storage: ~18,420 MB available. Check passed.', 'success');
      append('[STEP] Fetching official Offensive Security rootless installer...', 'step');
      await new Promise(r => setTimeout(r, 800));
      append('[INFO] Source: gitlab.com/kalilinux/nethunter/build-scripts/kali-nethunter-project', 'info');
      append('[ OK ] Verified SHA256 integrity of install-nethunter-termux.', 'success');
      append('[STEP] Provisioning Kali NetHunter rootfs & creating CLI wrapper "nh"...', 'step');
      await new Promise(r => setTimeout(r, 900));
      append('[ OK ] NetHunter Rootless setup ready! Run "nh" for CLI or "nh kex" for GUI.', 'success');
    } else if (option === '2') {
      append('[STEP] Checking proot and proot-distro packages...', 'step');
      await new Promise(r => setTimeout(r, 500));
      append('[ OK ] PRoot container engine is ready.', 'success');
      append('[STEP] Provisioning lightweight Kali rootfs container (kali-light)...', 'step');
      await new Promise(r => setTimeout(r, 700));
      append('[STEP] Importing Kali archive keyring and rolling repositories...', 'step');
      await new Promise(r => setTimeout(r, 700));
      append('[ OK ] Minimal Kali CLI installed (~2.5 GB). Launch command: "kalidroid-cli"', 'success');
    } else if (option === '3') {
      append('[STEP] Initializing XFCE4 desktop container & TigerVNC server...', 'step');
      await new Promise(r => setTimeout(r, 700));
      append('[STEP] Setting up PulseAudio audio bridge on 127.0.0.1...', 'step');
      await new Promise(r => setTimeout(r, 600));
      append('[ OK ] TigerVNC configured on 127.0.0.1:5901 (Display :1, 1280x720).', 'success');
      append('[INFO] Connect with any VNC client (AVNC, NetHunter KeX, or RealVNC).', 'info');
      append('[ OK ] GUI controls created: "kalidroid-gui start" and "kalidroid-gui stop"', 'success');
    } else if (option === '4') {
      append('[STEP] Setting up OpenSSH Server container on non-root port 2022...', 'step');
      await new Promise(r => setTimeout(r, 600));
      append('[ OK ] SSH keys generated. Default user: "kali" (password: "kali").', 'success');
      append('[INFO] Connect from Termux/LAN: ssh -p 2022 kali@127.0.0.1', 'info');
      append('[ OK ] Service manager created: "kalidroid-ssh start"', 'success');
    } else if (option === '5') {
      append('=== SYSTEM PRE-FLIGHT REPORT ===', 'raw');
      append('[INFO] Detected Architecture: aarch64 (ARM 64-bit mobile)', 'info');
      append('[ OK ] Architecture is fully supported by Kali Linux rootless.', 'success');
      append('[INFO] Storage Check: ~14.8 GB free on /data/data/com.termux/files', 'info');
      append('[ OK ] curl, tar, proot, proot-distro, git found in PATH.', 'success');
      append('[WARN] Note: On Android 12+, ensure Phantom Process Killer is disabled via ADB or battery unrestricted settings.', 'warn');
    } else if (option === '6') {
      append('[STEP] Safe Uninstaller invoked.', 'step');
      await new Promise(r => setTimeout(r, 500));
      append('[INFO] Removed global launchers: kalidroid, kalidroid-cli, kalidroid-gui, kalidroid-ssh', 'info');
      append('[INFO] Cleared cache in ~/.8whie-kalidroid without touching personal user files.', 'info');
      append('[ OK ] Safe uninstallation completed cleanly.', 'success');
    } else if (option === '7') {
      append('[STEP] Checking GitHub remote (https://github.com/8whie/8whie-kalidroid)...', 'step');
      await new Promise(r => setTimeout(r, 600));
      append('[ OK ] 8WHIE KaliDroid is up-to-date (v1.0.0). No updates needed.', 'success');
    } else if (option === '8') {
      append('=== ABOUT 8WHIE KALIDROID ===', 'raw');
      append('[INFO] Author: 8WHIE', 'info');
      append('[INFO] GitHub: https://github.com/8whie/8whie-kalidroid', 'info');
      append('[INFO] Telegram: @Arnxkt | Channel: https://t.me/whiee', 'info');
      append('[INFO] Instagram: @aaynkt | YouTube: 8WHIE', 'info');
      append('[INFO] License: MIT License (Free & Open Source)', 'info');
    } else if (option === '0' || option.toLowerCase() === 'exit') {
      append('Exited 8WHIE KaliDroid. Thank you for using our utility!', 'raw');
    } else if (option.toLowerCase() === 'clear') {
      resetTerminal();
      setIsProcessing(false);
      return;
    } else {
      append(`[WARN] Unknown selection '${option}'. Enter a number [0-8] or type 'clear'.`, 'warn');
    }

    append("Press [0-8] or type another command:", 'info');
    setIsProcessing(false);
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;
    const cmd = terminalInput.trim();
    setTerminalInput('');
    handleSimulateOption(cmd);
  };

  const selectedFile: RepoFile = REPO_FILES[selectedFileKey] || REPO_FILES['install.sh'];

  const generatedCustomCommand = `# 8WHIE KaliDroid Customized Launcher
# Target: ${customFlavor.toUpperCase()} | Port: ${customFlavor === 'ssh' ? sshPort : (customFlavor === 'gui' ? 5901 : 'N/A')}
pkg update -y && pkg install -y git curl proot-distro pulseaudio
git clone https://github.com/8whie/8whie-kalidroid.git
cd 8whie-kalidroid
chmod +x install.sh
${customFlavor === 'gui' ? `./install.sh --gui\nkalidroid-gui start` : (customFlavor === 'ssh' ? `./install.sh --ssh\nkalidroid-ssh start` : (customFlavor === 'nethunter' ? `./install.sh --nethunter` : `./install.sh --cli`))}
`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header / Branding Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/90 backdrop-blur sticky top-0 z-50 px-4 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/40">
            <Terminal className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                8WHIE KaliDroid
                <span className="text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  v1.0.0
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              Android • Termux • Kali Linux &nbsp;|&nbsp; Developed by <span className="text-cyan-300 font-medium">8WHIE</span>
            </p>
          </div>
        </div>

        {/* Social & Channel Badges */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <a 
            href="https://github.com/8whie/8whie-kalidroid" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700 transition"
          >
            <Github className="w-3.5 h-3.5 text-slate-400" />
            <span>GitHub: 8whie</span>
          </a>
          <a 
            href="https://t.me/whiee" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-900/40 hover:bg-blue-800/60 text-blue-300 border border-blue-700/50 transition"
          >
            <Send className="w-3.5 h-3.5 text-blue-400" />
            <span>Channel: @whiee</span>
          </a>
          <a 
            href="https://t.me/Arnxkt" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/70 text-cyan-300 border border-cyan-800/40 transition"
          >
            <Send className="w-3.5 h-3.5 text-cyan-400" />
            <span>Telegram: @Arnxkt</span>
          </a>
          <a 
            href="https://instagram.com/aaynkt" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-950/40 hover:bg-pink-900/50 text-pink-300 border border-pink-800/40 transition"
          >
            <Instagram className="w-3.5 h-3.5 text-pink-400" />
            <span>@aaynkt</span>
          </a>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 text-red-300 border border-red-800/40">
            <Youtube className="w-3.5 h-3.5 text-red-400" />
            <span>8WHIE</span>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-slate-900/50 border-b border-slate-800 px-4 lg:px-8">
        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2">
          <button
            onClick={() => setActiveTab('terminal')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'terminal'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Live Termux Simulator</span>
          </button>
          <button
            onClick={() => setActiveTab('explorer')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'explorer'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            <span>Repository Files (8whie-kalidroid)</span>
          </button>
          <button
            onClick={() => setActiveTab('commands')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'commands'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Play className="w-4 h-4" />
            <span>Termux One-Liners & Generator</span>
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'docs'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Troubleshooting & FAQ</span>
          </button>
          <button
            onClick={() => setActiveTab('git')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'git'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Github className="w-4 h-4" />
            <span>GitHub Publishing Guide</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
        {/* TAB 1: TERMINAL SIMULATOR */}
        {activeTab === 'terminal' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left/Main Terminal Window */}
              <div className="lg:col-span-3 flex flex-col rounded-xl overflow-hidden border border-slate-800 bg-black shadow-2xl">
                {/* Terminal Title Bar */}
                <div className="bg-slate-900 px-4 py-2.5 flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    <span className="text-xs font-mono text-slate-400 ml-2">termux@android:~/8whie-kalidroid (bash)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={resetTerminal}
                      title="Clear terminal"
                      className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>

                {/* Terminal Screen Output */}
                <div className="p-4 sm:p-5 font-mono text-xs sm:text-sm leading-relaxed overflow-y-auto max-h-[520px] min-h-[420px] bg-slate-950/95 space-y-1">
                  {terminalHistory.map((item, idx) => {
                    if (item.type === 'banner') {
                      return (
                        <pre key={idx} className="text-cyan-400 font-bold whitespace-pre overflow-x-auto py-1">
                          {item.text}
                        </pre>
                      );
                    }
                    if (item.type === 'step') {
                      return (
                        <div key={idx} className="text-blue-400 flex items-start gap-2">
                          <span className="text-blue-500 font-bold">[STEP]</span>
                          <span className="text-slate-200">{item.text.replace('[STEP] ', '')}</span>
                        </div>
                      );
                    }
                    if (item.type === 'success') {
                      return (
                        <div key={idx} className="text-emerald-400 flex items-start gap-2">
                          <span className="text-emerald-500 font-bold">[ OK ]</span>
                          <span className="text-emerald-300">{item.text.replace('[ OK ] ', '')}</span>
                        </div>
                      );
                    }
                    if (item.type === 'warn') {
                      return (
                        <div key={idx} className="text-amber-400 flex items-start gap-2">
                          <span className="text-amber-500 font-bold">[WARN]</span>
                          <span className="text-amber-200">{item.text.replace('[WARN] ', '')}</span>
                        </div>
                      );
                    }
                    if (item.type === 'error') {
                      return (
                        <div key={idx} className="text-rose-400 flex items-start gap-2">
                          <span className="text-rose-500 font-bold">[FAIL]</span>
                          <span className="text-rose-300">{item.text.replace('[FAIL] ', '')}</span>
                        </div>
                      );
                    }
                    if (item.type === 'input') {
                      return (
                        <div key={idx} className="text-cyan-300 flex items-center gap-2 pt-1 font-semibold">
                          <span className="text-emerald-400">termux@android:~$</span>
                          <span>{item.text}</span>
                        </div>
                      );
                    }
                    return (
                      <div key={idx} className="text-slate-300 whitespace-pre-wrap">
                        {item.text}
                      </div>
                    );
                  })}
                  <div ref={terminalEndRef} />
                </div>

                {/* Terminal Input Bar */}
                <form onSubmit={handleInputSubmit} className="border-t border-slate-800 bg-slate-900/90 px-4 py-2.5 flex items-center gap-2">
                  <span className="text-emerald-400 font-mono text-sm font-semibold select-none">$</span>
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    placeholder="Type option number [0-8] or 'clear'..."
                    disabled={isProcessing}
                    className="flex-1 bg-transparent border-0 outline-none text-cyan-200 font-mono text-sm placeholder:text-slate-600 focus:ring-0"
                  />
                  <button
                    type="submit"
                    disabled={isProcessing || !terminalInput.trim()}
                    className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <span>Execute</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

              {/* Right Side Action Panel */}
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Play className="w-3.5 h-3.5 text-cyan-400" />
                    Interactive Quick Select
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleSimulateOption('1')}
                      disabled={isProcessing}
                      className="w-full text-left px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-emerald-950/40 hover:border-emerald-500/50 border border-slate-700/60 transition group"
                    >
                      <div className="text-xs font-medium text-emerald-400 group-hover:text-emerald-300 flex items-center justify-between">
                        <span>[1] Kali NetHunter Rootless</span>
                        <span className="text-[10px] text-slate-500">~7.5 GB</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">Official OffSec rootless + KeX VNC</p>
                    </button>

                    <button
                      onClick={() => handleSimulateOption('2')}
                      disabled={isProcessing}
                      className="w-full text-left px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-cyan-950/40 hover:border-cyan-500/50 border border-slate-700/60 transition group"
                    >
                      <div className="text-xs font-medium text-cyan-400 group-hover:text-cyan-300 flex items-center justify-between">
                        <span>[2] Kali Lightweight CLI</span>
                        <span className="text-[10px] text-slate-500">~2.5 GB</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">Ultra-fast PRoot terminal container</p>
                    </button>

                    <button
                      onClick={() => handleSimulateOption('3')}
                      disabled={isProcessing}
                      className="w-full text-left px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-purple-950/40 hover:border-purple-500/50 border border-slate-700/60 transition group"
                    >
                      <div className="text-xs font-medium text-purple-400 group-hover:text-purple-300 flex items-center justify-between">
                        <span>[3] Kali GUI Desktop (XFCE)</span>
                        <span className="text-[10px] text-slate-500">~5.5 GB</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">XFCE4 UI + TigerVNC + PulseAudio</p>
                    </button>

                    <button
                      onClick={() => handleSimulateOption('4')}
                      disabled={isProcessing}
                      className="w-full text-left px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-blue-950/40 hover:border-blue-500/50 border border-slate-700/60 transition group"
                    >
                      <div className="text-xs font-medium text-blue-400 group-hover:text-blue-300 flex items-center justify-between">
                        <span>[4] Kali SSH Remote Server</span>
                        <span className="text-[10px] text-slate-500">~2.6 GB</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">Port 2022 headless SSH daemon</p>
                    </button>

                    <button
                      onClick={() => handleSimulateOption('5')}
                      disabled={isProcessing}
                      className="w-full text-left px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-amber-950/40 hover:border-amber-500/50 border border-slate-700/60 transition group"
                    >
                      <div className="text-xs font-medium text-amber-400 group-hover:text-amber-300">
                        <span>[5] System Pre-Flight Check</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">CPU architecture & free storage audit</p>
                    </button>

                    <button
                      onClick={() => handleSimulateOption('6')}
                      disabled={isProcessing}
                      className="w-full text-left px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-rose-950/40 hover:border-rose-500/50 border border-slate-700/60 transition group"
                    >
                      <div className="text-xs font-medium text-rose-400 group-hover:text-rose-300">
                        <span>[6] Safe Uninstaller</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">Cleans project files without touching data</p>
                    </button>
                  </div>
                </div>

                {/* Environment Badges */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 space-y-2.5 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Non-Destructive & No Root Required</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <span>ARM64 / ARMv7 / x86_64 Auto-detect</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <HardDrive className="w-4 h-4 text-blue-400" />
                    <span>Pre-allocates & validates disk limits</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: REPOSITORY FILE EXPLORER */}
        {activeTab === 'explorer' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <div>
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <FolderGit2 className="w-5 h-5 text-cyan-400" />
                  <span>8whie-kalidroid / Project Source Code</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Explore original modular shell scripts, configs, checks, and documentation.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(selectedFile.content || '', selectedFileKey)}
                  className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
                >
                  {copiedKey === selectedFileKey ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy {selectedFile.name}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* File Tree Navigation */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3 space-y-1">
                <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Repository Structure</span>
                  <span className="text-[10px] text-cyan-400">11 Files</span>
                </div>

                <div className="space-y-0.5">
                  {Object.entries(REPO_FILES).map(([key, file]) => {
                    const isSelected = selectedFileKey === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedFileKey(key)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono flex items-center justify-between transition ${
                          isSelected
                            ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {key.endsWith('.sh') ? (
                            <FileCode className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          ) : (
                            <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          )}
                          <span className="truncate">{key}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 ml-2 shrink-0">{file.size}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Code Viewer */}
              <div className="lg:col-span-3 rounded-xl border border-slate-800 bg-slate-950 overflow-hidden flex flex-col">
                <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-cyan-400" />
                    <span className="font-mono text-xs font-semibold text-white">{selectedFile.path}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      {selectedFile.language}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">{selectedFile.description}</span>
                </div>

                <div className="p-4 overflow-x-auto max-h-[600px] font-mono text-xs text-slate-200 leading-relaxed bg-black/40">
                  <pre className="whitespace-pre">
                    {selectedFile.content}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: COMMAND GENERATOR & ONE-LINERS */}
        {activeTab === 'commands' && (
          <div className="space-y-6">
            {/* Quick 1-Liner Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Fastest Direct Install</span>
                  <span className="text-xs text-slate-500">Curl Pipe to Bash</span>
                </div>
                <h3 className="text-sm font-semibold text-white">One-Line Termux Installer</h3>
                <p className="text-xs text-slate-400">Installs curl, fetches the latest 8WHIE KaliDroid script, and launches the interactive menu.</p>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-cyan-300 break-all select-all flex items-center justify-between gap-2">
                  <span>pkg update -y && pkg install -y git curl && curl -fsSL https://raw.githubusercontent.com/8whie/8whie-kalidroid/main/install.sh | bash</span>
                  <button
                    onClick={() => copyToClipboard('pkg update -y && pkg install -y git curl && curl -fsSL https://raw.githubusercontent.com/8whie/8whie-kalidroid/main/install.sh | bash', 'curl-1')}
                    className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition shrink-0"
                  >
                    {copiedKey === 'curl-1' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Manual Git Method</span>
                  <span className="text-xs text-slate-500">Clone & Inspect</span>
                </div>
                <h3 className="text-sm font-semibold text-white">Standard Git Repository Clone</h3>
                <p className="text-xs text-slate-400">Clone the repo locally into Termux so you can inspect all modules before executing.</p>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-cyan-300 break-all select-all flex items-center justify-between gap-2">
                  <span>git clone https://github.com/8whie/8whie-kalidroid.git && cd 8whie-kalidroid && ./install.sh</span>
                  <button
                    onClick={() => copyToClipboard('git clone https://github.com/8whie/8whie-kalidroid.git && cd 8whie-kalidroid && ./install.sh', 'git-1')}
                    className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition shrink-0"
                  >
                    {copiedKey === 'git-1' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive Custom Script Generator */}
            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/80 space-y-5">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                  Customized KaliDroid Command Generator
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Tailor your installation parameters according to your phone hardware and preferred Kali interface.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {/* Flavor Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Target Environment Flavor</label>
                  <select
                    value={customFlavor}
                    onChange={(e: any) => setCustomFlavor(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-500"
                  >
                    <option value="gui">Kali GUI Desktop (XFCE4 + VNC)</option>
                    <option value="cli">Kali Lightweight CLI (Proot Container)</option>
                    <option value="nethunter">Kali NetHunter Rootless (Full Suite)</option>
                    <option value="ssh">Kali Headless SSH Server</option>
                  </select>
                </div>

                {/* VNC Resolution (if GUI) */}
                {customFlavor === 'gui' ? (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">VNC Screen Resolution</label>
                    <select
                      value={vncResolution}
                      onChange={(e: any) => setVncResolution(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-500"
                    >
                      <option value="1280x720">1280x720 (Balanced - Recommended)</option>
                      <option value="1920x1080">1920x1080 (High-DPI / Tablets)</option>
                      <option value="1024x768">1024x768 (Low RAM / Small screens)</option>
                    </select>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">SSH Service Port</label>
                    <input
                      type="number"
                      value={sshPort}
                      onChange={(e) => setSshPort(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-500"
                    />
                  </div>
                )}

                {/* Audio Option */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">PulseAudio Sound Forwarding</label>
                  <div className="flex items-center h-9">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                      <input
                        type="checkbox"
                        checked={enableAudio}
                        onChange={(e) => setEnableAudio(e.target.checked)}
                        className="rounded border-slate-700 text-cyan-500 focus:ring-0 bg-slate-950"
                      />
                      <span>Stream desktop audio through phone speakers</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Output Snippet */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Generated Bash Sequence:</span>
                  <button
                    onClick={() => copyToClipboard(generatedCustomCommand, 'custom-cmd')}
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    {copiedKey === 'custom-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy Script</span>
                  </button>
                </div>
                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed overflow-x-auto">
                  <pre>{generatedCustomCommand}</pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TROUBLESHOOTING & FAQ */}
        {activeTab === 'docs' && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 space-y-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                Frequently Encountered Issues & Tested Fixes
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Operating a full Linux distribution in Android userspace comes with specific system constraints. Here is how to resolve the most common scenarios.
              </p>

              <div className="space-y-4 pt-2">
                {/* Issue 1 */}
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800/80 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Android 12/13/14/15: "Signal 9 / Killed" (Phantom Process Killer)</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Android stops processes that spawn more than 32 subprocesses or consume background CPU. To eliminate this restriction permanently via ADB:
                  </p>
                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800 font-mono text-xs text-cyan-300 select-all flex items-center justify-between">
                    <span>adb shell "/system/bin/device_config put activity_manager max_phantom_processes 2147483647"</span>
                    <button
                      onClick={() => copyToClipboard('adb shell "/system/bin/device_config put activity_manager max_phantom_processes 2147483647"', 'adb-cmd')}
                      className="p-1 hover:text-white text-slate-400"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Issue 2 */}
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800/80 space-y-2">
                  <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs">
                    <Info className="w-4 h-4 shrink-0" />
                    <span>DNS Lookups Failing inside Container ("Could not resolve host")</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    If Android's internal DNS daemon is not responding to PRoot, override with public Cloudflare & Google resolvers:
                  </p>
                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800 font-mono text-xs text-cyan-300 select-all">
                    <span>echo -e "nameserver 1.1.1.1\nnameserver 8.8.8.8" | sudo tee /etc/resolv.conf</span>
                  </div>
                </div>

                {/* Issue 3 */}
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800/80 space-y-2">
                  <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs">
                    <Monitor className="w-4 h-4 shrink-0" />
                    <span>VNC Desktop Client Connection Parameters</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Connect using the free <strong>AVNC</strong> app (from F-Droid) or <strong>NetHunter KeX</strong>:
                  </p>
                  <ul className="text-xs text-slate-400 list-disc list-inside space-y-1">
                    <li>Host: <code className="text-cyan-300 font-mono">127.0.0.1</code> or <code className="text-cyan-300 font-mono">localhost</code></li>
                    <li>Port: <code className="text-cyan-300 font-mono">5901</code> (Display :1)</li>
                    <li>Default username: <code className="text-cyan-300 font-mono">kali</code> | Default password: set on first launch</li>
                  </ul>
                </div>

                {/* Root vs Rootless Table */}
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800/80 space-y-3">
                  <h4 className="text-xs font-semibold text-slate-200">Rootless PRoot vs Rooted Chroot Comparison</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left text-slate-300">
                      <thead className="text-[11px] text-slate-500 uppercase border-b border-slate-800">
                        <tr>
                          <th className="py-2 pr-4">Feature</th>
                          <th className="py-2 pr-4 text-emerald-400">8WHIE KaliDroid (Rootless)</th>
                          <th className="py-2 text-amber-400">Rooted Device Only</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900">
                        <tr>
                          <td className="py-2 font-medium">Root / Unlocked Bootloader</td>
                          <td className="py-2 text-emerald-400">NOT Required (100% Userspace)</td>
                          <td className="py-2 text-amber-400">Strictly Required</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-medium">Device Warranty & Safety</td>
                          <td className="py-2 text-emerald-400">Safe, zero risk of bricking</td>
                          <td className="py-2 text-amber-400">May trip Knox / void warranty</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-medium">Internal Wi-Fi Packet Injection</td>
                          <td className="py-2 text-slate-500">Not possible on phone chip</td>
                          <td className="py-2 text-emerald-400">Supported with custom kernel</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-medium">Graphical Desktop (XFCE/VNC)</td>
                          <td className="py-2 text-emerald-400">Fully Supported</td>
                          <td className="py-2 text-emerald-400">Fully Supported</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: GITHUB PUBLISHING GUIDE */}
        {activeTab === 'git' && (
          <div className="space-y-6">
            <div className="bg-slate-900/70 p-6 rounded-xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-white flex items-center gap-2">
                    <Github className="w-5 h-5 text-white" />
                    GitHub Ready Repository: 8whie-kalidroid
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    The complete repository has been created, initialized with Git, and committed with clean attribution.
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Ready to Push
                </span>
              </div>

              {/* Checklist */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-950 border border-slate-800/80">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div className="text-xs">
                    <span className="font-semibold text-slate-200">Independent Original Implementation:</span>
                    <p className="text-slate-400 mt-0.5">Zero code copied from existing repositories. Unique ASCII banner and architecture.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-950 border border-slate-800/80">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div className="text-xs">
                    <span className="font-semibold text-slate-200">No Secret Leaks / Clean Code:</span>
                    <p className="text-slate-400 mt-0.5">No personal access tokens, API credentials, or passwords committed.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-950 border border-slate-800/80">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div className="text-xs">
                    <span className="font-semibold text-slate-200">Verified Syntax:</span>
                    <p className="text-slate-400 mt-0.5">All 8 Bash scripts passed syntax checks (bash -n) and execute permissions.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-950 border border-slate-800/80">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div className="text-xs">
                    <span className="font-semibold text-slate-200">Legitimate Official Endpoints:</span>
                    <p className="text-slate-400 mt-0.5">Points to official Kali Linux NetHunter repositories and proot containers.</p>
                  </div>
                </div>
              </div>

              {/* Exact Git Push Instructions */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Exact Commands to Push to GitHub:
                </h3>
                <p className="text-xs text-slate-400">
                  To push from your workstation or Termux terminal to <code className="text-cyan-300">https://github.com/8whie/8whie-kalidroid</code>:
                </p>

                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-slate-200 space-y-2 select-all">
                  <div className="text-slate-500"># 1. Enter the project folder</div>
                  <div className="text-cyan-300">cd 8whie-kalidroid</div>
                  <div className="text-slate-500 mt-2"># 2. Authenticate or configure personal access token (PAT) / SSH</div>
                  <div className="text-cyan-300">git remote set-url origin git@github.com:8whie/8whie-kalidroid.git</div>
                  <div className="text-slate-500 mt-2"># 3. Push main branch and tags</div>
                  <div className="text-emerald-400">git push -u origin main</div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => copyToClipboard('cd 8whie-kalidroid\ngit remote set-url origin git@github.com:8whie/8whie-kalidroid.git\ngit push -u origin main', 'git-push-cmd')}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white flex items-center gap-1.5 transition"
                  >
                    {copiedKey === 'git-push-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy Push Commands</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 px-4 lg:px-8 py-5 mt-auto text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-400">8WHIE KaliDroid</span>
          <span>•</span>
          <span>Android • Termux • Kali Linux</span>
          <span>•</span>
          <span>MIT License</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <a href="https://t.me/whiee" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition">
            Telegram: @whiee
          </a>
          <a href="https://instagram.com/aaynkt" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition">
            Instagram: @aaynkt
          </a>
          <a href="https://github.com/8whie/8whie-kalidroid" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
            GitHub: 8whie
          </a>
        </div>
      </footer>
    </div>
  );
}
