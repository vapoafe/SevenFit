# 🏆 SevenFit - 7-Minute Scientific Interval Training

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![GitHub Pages](https://img.shields.io/badge/Hosted%20On-GitHub%20Pages-brightgreen)](https://vapoafe.github.io/)
[![100% Offline](https://img.shields.io/badge/Offline-100%25-success)](#)
[![No Telemetry](https://img.shields.io/badge/Privacy-Zero%20Telemetry-purple)](#)
[![F-Droid Ready](https://img.shields.io/badge/F--Droid-Ready-blue)](#)

> A modern, 100% offline, privacy-first 7-minute interval workout web application inspired by scientific high-intensity circuit training (HICT). Features real-time biomechanical mannequin animations, synthesized coach personalities, a gamified 3-hearts streak system, custom workout builder, and full data export/import capabilities.

---


## 🚀 Key Features

- 🏋️‍♂️ **Scientifically Proven Circuits:** Classic 7-Minute HIIT routine, Core & Abs, Upper Body, Joint-Safe Low Impact, and Mobility circuits.

- 🧍 **Biomechanical Mannequin Canvas:** Interactive real-time animated human model displaying joint mechanics, movement trajectory, and target muscle highlights.

- 🗣️ **5 Motivating Coach Personalities:**
  - 🪖 **Sgt. Rex:** Tough-love military drill instructor

  - ✨ **Chloe:** Energetic, uplifting cheerleader

  - 🧘 **Kai:** Calm, mindful Zen master

  - 🤖 **Unit 7000:** Cybernetic futuristic coach
  
  - 🔔 **Minimalist:** Clean audio chimes, bells, and whistles only

- 💖 **Seven 3-Hearts & Streak System:** Daily streak protection discipline with heart recovery upon consistent workouts.

- 🎨 **Multi-Theme Support:** Dark Navy, OLED Pitch Black (battery-saving), and Crisp Light Mode.

- 🛠️ **Custom Routine Builder:** Sequence your own exercise circuits with custom work & rest intervals.

- 🔒 **100% Offline & Private:** Zero analytics, zero cookies, zero external API tracking, and local JSON backup/restore.

---

## 💻 Local Development

```bash
# 1. Clone the repository
git clone https://github.com/vapoafe/SevenFit.git
cd SevenFit

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Build for production (outputs to /dist)
npm run build

# 5. Preview production build locally
npm run preview
```

---

## 📱 Packaging for Android / F-Droid

This repository is built using standard web standards and can be packaged into a standalone Android APK using **Capacitor**:

```bash
# Install Capacitor CLI
npm install @capacitor/core @capacitor/cli @capacitor/android

# Initialize Capacitor
npx cap init "SevenFit" "io.github.vapoafe.sevenfit" --web-dir "dist"

# Add Android platform
npx cap add android

# Build web assets and sync to Android project
npm run build
npx cap sync android

# Open in Android Studio to build APK / AAB
npx cap open android
```

---

## 📄 License
This project is licensed under the terms of the [GNU General Public License v3.0](LICENSE).
