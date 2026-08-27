import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Bug,
  Shield,
  CheckCircle2,
  Terminal,
  Globe,
  FileCode,
  Scale,
  ExternalLink,
  Copy,
  Check,
  Zap,
  Volume2,
  Sparkles
} from 'lucide-react';
import { coachAudio } from '../services/coachAudio';

interface TestingGuideModalProps {
  onClose: () => void;
}

export const TestingGuideModal: React.FC<TestingGuideModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'github' | 'license' | 'fdroid' | 'testing'>('github');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const workflowYAML = `name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
      - master
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build-and-deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm install
      - run: npm run build
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      - id: deployment
        uses: actions/deploy-pages@v4`;

  return (
    <div className="fixed inset-0 z-50 app-modal-backdrop backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="app-modal border app-border w-full max-w-3xl max-h-[92vh] rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b app-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-rose-500 flex items-center justify-center text-white shadow-md">
              <Globe size={18} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black app-text">
                GitHub Pages, Open Source & F-Droid Hub
              </h2>
              <div className="text-[11px] app-text-sub font-medium">
                Live hosting settings, software license selection, and mobile packaging
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full app-text-sub hover:app-text app-card-hover"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b app-border bg-slate-500/5 px-4 pt-2 gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'github', label: 'GitHub Pages Setup', icon: Globe },
            { id: 'license', label: 'License & FOSS Ideals', icon: Scale },
            { id: 'fdroid', label: 'Android & F-Droid', icon: Shield },
            { id: 'testing', label: 'Device & Audio Testing', icon: Smartphone }
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'border-rose-600 dark:border-rose-400 text-rose-700 dark:text-rose-400 font-black'
                    : 'border-transparent app-text-sub hover:app-text'
                }`}
              >
                <Icon size={15} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-xs app-text-sub">
          {/* TAB 1: GitHub Pages Setup */}
          {activeTab === 'github' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-gradient-to-r from-sky-500/15 via-rose-500/10 to-transparent border border-sky-500/30 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-black text-sm">
                  <Globe size={18} />
                  Target URL: https://vapoafe.github.io/
                </div>
                <p className="text-xs app-text leading-relaxed">
                  Your project is now fully configured with relative Vite assets (<code className="font-mono bg-black/20 px-1 py-0.5 rounded text-amber-500">base: './'</code>) and an automated GitHub Actions deployment workflow at <code className="font-mono bg-black/20 px-1 py-0.5 rounded text-sky-500">.github/workflows/deploy.yml</code>.
                </p>
              </div>

              {/* Step by step Repo Settings */}
              <div className="space-y-3">
                <div className="text-sm font-black app-text flex items-center gap-2">
                  <Sparkles size={16} className="text-rose-500" />
                  Step-by-Step GitHub Repository Settings:
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  <div className="app-card-subtle border app-border rounded-xl p-3.5 space-y-1.5">
                    <div className="font-bold app-text flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] font-black">1</span>
                      Open Repository Settings
                    </div>
                    <p className="app-text-sub text-xs pl-7">
                      Go to your GitHub repository and click on the <strong>Settings</strong> tab in the top navigation bar.
                    </p>
                  </div>

                  <div className="app-card-subtle border app-border rounded-xl p-3.5 space-y-1.5">
                    <div className="font-bold app-text flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] font-black">2</span>
                      Navigate to the "Pages" Section
                    </div>
                    <p className="app-text-sub text-xs pl-7">
                      On the left-hand sidebar, under the <em>"Code and automation"</em> heading, select <strong>Pages</strong>.
                    </p>
                  </div>

                  <div className="app-card-subtle border app-border rounded-xl p-3.5 space-y-1.5">
                    <div className="font-bold app-text flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] font-black">3</span>
                      Set Build Source to "GitHub Actions"
                    </div>
                    <p className="app-text-sub text-xs pl-7">
                      Under <strong>Build and deployment</strong> &gt; <strong>Source</strong>, switch the dropdown from <em>"Deploy from a branch"</em> to <strong className="text-emerald-500">"GitHub Actions"</strong>.
                    </p>
                  </div>

                  <div className="app-card-subtle border app-border rounded-xl p-3.5 space-y-1.5">
                    <div className="font-bold app-text flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] font-black">4</span>
                      Automatic Build & Live URL
                    </div>
                    <p className="app-text-sub text-xs pl-7">
                      Whenever you push code to <code className="text-amber-500">main</code> or trigger the action manually, GitHub Actions will compile Vite into <code className="text-sky-500">dist/</code> and deploy it to <strong className="text-rose-500">https://vapoafe.github.io/</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Workflow YAML Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold app-text flex items-center gap-1.5">
                    <FileCode size={15} className="text-sky-500" />
                    Generated Deployment Workflow (.github/workflows/deploy.yml)
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(workflowYAML, 'yaml')}
                    className="flex items-center gap-1 text-[11px] font-bold text-sky-500 hover:text-sky-400 p-1 rounded transition-colors"
                  >
                    {copiedCode === 'yaml' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    {copiedCode === 'yaml' ? 'Copied' : 'Copy YAML'}
                  </button>
                </div>
                <pre className="app-card p-3 rounded-xl border app-border font-mono text-[11px] overflow-x-auto text-slate-300">
                  {workflowYAML}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 2: License Selection & FOSS Ideals */}
          {activeTab === 'license' && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h3 className="text-sm font-black app-text mb-1 flex items-center gap-2">
                  <Scale size={16} className="text-amber-500" />
                  Choosing the Best License for Your Fitness App
                </h3>
                <p className="leading-relaxed app-text-sub">
                  Fitness applications deal with personal health data and community well-being. Choosing the right license protects user freedom and your intellectual contribution.
                </p>
              </div>

              {/* Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* GPLv3 */}
                <div className="app-card border-2 border-emerald-500/50 rounded-2xl p-4 space-y-3 relative shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-500 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                      ★ Recommended (Selected)
                    </span>
                    <span className="text-xs font-bold font-mono text-emerald-400">GPL-3.0</span>
                  </div>
                  <h4 className="text-base font-black app-text">GNU General Public License v3.0</h4>
                  <p className="text-xs app-text-sub leading-relaxed">
                    <strong>Strong Copyleft:</strong> Guarantees that anyone who distributes your code or modified versions <em>must</em> also release their source code under the same GPL-3.0 license.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-xs app-text">
                    <li>Prevents closed-source proprietary forks or paid clone apps.</li>
                    <li>Guarantees user privacy and zero-telemetry enforcement.</li>
                    <li>The default standard for F-Droid and European FOSS projects.</li>
                  </ul>
                </div>

                {/* MIT */}
                <div className="app-card-subtle border app-border rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider app-text-sub px-2 py-0.5 rounded app-card border app-border">
                      Permissive Alternative
                    </span>
                    <span className="text-xs font-bold font-mono text-sky-400">MIT</span>
                  </div>
                  <h4 className="text-base font-black app-text">MIT License</h4>
                  <p className="text-xs app-text-sub leading-relaxed">
                    <strong>Maximum Permissiveness:</strong> Allows anyone to do anything with the code (including bundling it into proprietary commercial apps with no source disclosure).
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-xs app-text-sub">
                    <li>Very short, simple, and unrestrictive.</li>
                    <li>Commercial companies can use it without sharing improvements.</li>
                  </ul>
                </div>
              </div>

              {/* FOSS Privacy Principles */}
              <div className="app-card border app-border rounded-2xl p-4 space-y-2">
                <div className="font-bold app-text text-xs uppercase flex items-center gap-2">
                  <Shield size={16} className="text-sky-500" />
                  Why 100% Free & Open-Source Fitness Software Matters:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
                  <div className="p-2.5 rounded-xl app-card-subtle border app-border">
                    <div className="font-bold text-rose-500 mb-0.5">Zero Subscriptions</div>
                    <p className="text-[11px] app-text-sub">Physical fitness is a human right, free from paywalls or premium unlocks.</p>
                  </div>
                  <div className="p-2.5 rounded-xl app-card-subtle border app-border">
                    <div className="font-bold text-amber-500 mb-0.5">Absolute Privacy</div>
                    <p className="text-[11px] app-text-sub">Workout logs and health habits stay entirely on local device storage.</p>
                  </div>
                  <div className="p-2.5 rounded-xl app-card-subtle border app-border">
                    <div className="font-bold text-emerald-500 mb-0.5">Auditability</div>
                    <p className="text-[11px] app-text-sub">Any athlete or engineer can inspect the biomechanics code and interval mathematics.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Android & F-Droid Packaging */}
          {activeTab === 'fdroid' && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <h3 className="text-sm font-black app-text mb-1 flex items-center gap-2">
                  <Shield size={16} className="text-emerald-500" />
                  Building Standalone Android APK & F-Droid Submission
                </h3>
                <p className="leading-relaxed app-text-sub">
                  Because this app has zero proprietary SDKs and works 100% offline, it qualifies for inclusion in the <strong>F-Droid</strong> repository.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="text-xs font-bold uppercase app-text">Packaging with Capacitor (CLI):</div>
                <div className="app-card p-3 rounded-xl border app-border font-mono text-[11px] space-y-1 text-slate-300">
                  <div><span className="text-slate-500"># 1. Install Capacitor dependencies</span></div>
                  <div className="text-sky-400">npm install @capacitor/core @capacitor/cli @capacitor/android</div>
                  <div className="pt-1"><span className="text-slate-500"># 2. Initialize project</span></div>
                  <div className="text-sky-400">npx cap init "SevenFit" "io.github.vapoafe.sevenfit" --web-dir "dist"</div>
                  <div className="pt-1"><span className="text-slate-500"># 3. Add Android platform & sync</span></div>
                  <div className="text-sky-400">npx cap add android</div>
                  <div className="text-sky-400">npm run build &amp;&amp; npx cap sync android</div>
                  <div className="pt-1"><span className="text-slate-500"># 4. Build signed APK / AAB</span></div>
                  <div className="text-emerald-400">npx cap open android</div>
                </div>
              </div>

              <div className="app-card-subtle border app-border rounded-xl p-3.5 space-y-2">
                <div className="font-bold app-text text-xs uppercase flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  F-Droid Anti-Features Verification:
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-300">
                    <Check size={14} /> No Ads (AdFree)
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-300">
                    <Check size={14} /> No Tracking / Analytics
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-300">
                    <Check size={14} /> No Non-Free Dependencies
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-300">
                    <Check size={14} /> 100% Offline Capability
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Device & Audio Testing */}
          {activeTab === 'testing' && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <h3 className="text-sm font-black app-text mb-1 flex items-center gap-2">
                  <Smartphone size={16} className="text-sky-500" />
                  Mobile Audio & Hardware Diagnostic Tester
                </h3>
                <p className="leading-relaxed app-text-sub">
                  Test your mobile browser's Web Audio synthesizer, Speech Synthesis TTS engine, and screen wake lock in real-time:
                </p>
              </div>

              {/* Interactive Audio Cues Test Bench */}
              <div className="app-card border app-border rounded-2xl p-4 space-y-3">
                <div className="text-xs font-bold uppercase app-text flex items-center gap-2">
                  <Volume2 size={16} className="text-rose-500" />
                  Sound & Voice Hardware Test Bench:
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => coachAudio.playWhistle()}
                    className="p-2.5 rounded-xl app-card-subtle hover:app-card-hover border app-border text-xs font-bold app-text text-center transition-colors"
                  >
                    Whistle Sound
                  </button>
                  <button
                    type="button"
                    onClick={() => coachAudio.playHalfwayChime()}
                    className="p-2.5 rounded-xl app-card-subtle hover:app-card-hover border app-border text-xs font-bold app-text text-center transition-colors"
                  >
                    Halfway Bell
                  </button>
                  <button
                    type="button"
                    onClick={() => coachAudio.playVictoryFanfare()}
                    className="p-2.5 rounded-xl app-card-subtle hover:app-card-hover border app-border text-xs font-bold app-text text-center transition-colors"
                  >
                    Victory Fanfare
                  </button>
                  <button
                    type="button"
                    onClick={() => coachAudio.speakPhrase('Let us push past our limits!', 'drill')}
                    className="p-2.5 rounded-xl bg-rose-500/20 text-rose-500 dark:text-rose-300 hover:bg-rose-500 hover:text-white border border-rose-500/30 text-xs font-bold text-center transition-colors"
                  >
                    Voice Coach TTS
                  </button>
                </div>
              </div>

              <div className="app-card-subtle border app-border rounded-xl p-3.5 space-y-2">
                <div className="font-bold app-text text-xs uppercase flex items-center gap-2">
                  <Bug size={16} className="text-amber-500" />
                  Mobile Browser Edge Cases & Solutions:
                </div>
                <ul className="list-disc list-inside space-y-1.5 text-xs app-text-sub">
                  <li>
                    <strong className="text-rose-500">AudioContext Suspension:</strong> Mobile Safari and Chrome restrict autoplay until first user gesture. The app initializes AudioContext immediately when any workout or test button is pressed.
                  </li>
                  <li>
                    <strong className="text-rose-500">OLED Dark Mode Battery Saving:</strong> The pure pitch-black OLED theme turns off display diodes on modern AMOLED/OLED screens during workouts.
                  </li>
                  <li>
                    <strong className="text-rose-500">Screen Dimming:</strong> Uses <code className="text-sky-500">navigator.wakeLock.request('screen')</code> to keep the screen active during interval timers.
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t app-border app-card-subtle flex items-center justify-between">
          <div className="text-[11px] app-text-sub font-mono">
            License: GPL-3.0 · Hosted at https://vapoafe.github.io/
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition-colors shadow-md shadow-rose-500/20"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
