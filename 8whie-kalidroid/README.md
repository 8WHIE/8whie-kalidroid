# 8WHIE KaliDroid

```text
  ██████╗ ██╗    ██╗██╗  ██╗██╗███████╗
 ██╔════╝ ██║    ██║██║  ██║██║██╔════╝
 ╚█████╗  ██║ █╗ ██║███████║██║█████╗  
  ╚═══██╗ ██║███╗██║██╔══██║██║██╔══╝  
 ██████╔╝ ╚███╔███╔╝██║  ██║██║███████╗
 ╚═════╝   ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝╚══════╝
       K A L I D R O I D   v 1 . 0
  Android • Termux • Kali Linux Suite
         Developed by 8WHIE
```

> **Original Termux utility for setting up supported Kali Linux environments on Android.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20Termux-brightgreen.svg)](#requirements)
[![Kali NetHunter](https://img.shields.io/badge/Kali-NetHunter%20Rootless-blueviolet.svg)](https://www.kali.org/)
[![Telegram Channel](https://img.shields.io/badge/Telegram-Channel-blue.svg)](https://t.me/whiee)

---

## 📌 Project Overview

**8WHIE KaliDroid** is an original, modular, and non-destructive terminal utility engineered specifically for Android devices running **Termux**. It provides a structured, safe, and transparent workflow to provision official and community-supported **Kali Linux** environments on Android—without requiring device root, bootloader unlocking, or voiding your manufacturer warranty.

Unlike legacy or opaque installer scripts, **8WHIE KaliDroid** focuses on safety, clean architecture, verifiable download endpoints, and precise system footprint controls.

---

## ✨ Features

- **No Device Root Required**: Runs entirely in userspace using standard PRoot containers and NetHunter rootless architecture.
- **Multiple Environment Flavors**:
  - **Kali NetHunter Rootless**: Official Offensive Security setup with Kali rolling repositories, `nh` CLI wrapper, and NetHunter KeX graphical desktop.
  - **Kali Lightweight CLI**: Lean, fast headless environment optimized for Python scripts, network utilities, and lightweight terminal penetration testing tools.
  - **Kali XFCE4 GUI Desktop**: Graphical desktop environment pre-configured with TigerVNC and local PulseAudio audio redirection.
  - **Kali SSH Server**: Dedicated background headless workspace accessible over Wi-Fi/LAN on custom non-root port 2022.
- **Comprehensive Pre-Flight Validation**: Automatic architecture detection (`aarch64`, `armhf`, `x86_64`), live free-storage calculation, and prerequisite verification.
- **Transparent & Non-Destructive**: Never deletes user personal files. Includes an isolated uninstaller that only cleans project-generated files and launchers.
- **Global Command Shortcuts**: Adds convenient launchers (`kalidroid`, `kalidroid-cli`, `kalidroid-gui`, `kalidroid-ssh`) to your Termux path.
- **Safe Signal Trapping**: Handles `Ctrl+C` cleanly without leaving terminal cursor corrupted or background zombie processes.

---

## ⚙️ Requirements

1. **Android Device**: Android 7.0 (Nougat) or newer (Android 11–15 supported).
2. **Termux App**: Use the official [Termux release from F-Droid](https://f-droid.org/packages/com.termux/) *(Do not use Google Play Store versions as they are deprecated)*.
3. **Storage Space**:
   - Lightweight CLI: **~2.5 GB free**
   - XFCE GUI Desktop: **~5.5 GB free**
   - Full NetHunter Rootless: **~7.5 to 10 GB free**
4. **Active Internet Connection** for repository updates and rootfs retrieval.

---

## 🚀 One-Line Quick Install

Launch Termux and execute:

```bash
pkg update -y && pkg install -y git curl && curl -fsSL https://raw.githubusercontent.com/8whie/8whie-kalidroid/main/install.sh | bash
```

Alternatively, clone the repository manually:

```bash
pkg update -y && pkg install -y git
git clone https://github.com/8whie/8whie-kalidroid.git
cd 8whie-kalidroid
chmod +x install.sh
./install.sh
```

---

## 📖 Usage & Menu Breakdown

When you run `kalidroid` (or `./install.sh`), you will be greeted by the interactive terminal menu:

```text
  INSTALLATION CHOICES:
  [1] Kali NetHunter Rootless  (Full Kali Suite via Official Script)
  [2] Kali Lightweight CLI      (Proot minimal container, fast & clean)
  [3] Kali GUI Desktop (XFCE)    (Graphical desktop + TigerVNC/KeX)
  [4] Kali SSH Remote Server     (Headless background workspace)
───────────────────────────────────────────────────
  MANAGEMENT & UTILITIES:
  [5] System Pre-Flight Check    (Verify dependencies, RAM & storage)
  [6] Uninstall / Cleanup        (Safely remove 8WHIE KaliDroid files)
  [7] Check for Updates          (Sync latest version from GitHub)
  [8] Help & Documentation       (Troubleshooting, FAQ & Credits)
  [0] Exit
```

### CLI Command Options

You can also pass arguments directly without entering the menu loop:

```bash
kalidroid --help         # Show command reference
kalidroid --check        # Run preflight verification
kalidroid --nethunter    # Direct NetHunter Rootless setup
kalidroid --cli          # Direct Lightweight CLI setup
kalidroid --gui          # Direct GUI Desktop setup
kalidroid --ssh          # Direct SSH environment setup
kalidroid --uninstall    # Run safe uninstaller
kalidroid --update       # Sync repository updates
```

---

## 💾 Storage Requirements Matrix

| Environment Flavor | Recommended Free Storage | Memory (RAM) Usage | Target Use Case |
| :--- | :--- | :--- | :--- |
| **Lightweight CLI** | **2.5 GB** | ~120 MB RAM | CLI tools (nmap, curl, python3, sqlmap, git) |
| **GUI Desktop (XFCE)** | **5.5 GB** | ~350 MB RAM | Full desktop UI, Wireshark GUI, Burp Suite, Browser |
| **NetHunter Rootless** | **7.5 – 10 GB** | ~400 MB RAM | Official NetHunter tools + KeX integration |
| **SSH Headless Server**| **2.6 GB** | ~90 MB RAM | Remote administration from laptop over Wi-Fi |

---

## 🛡️ Root vs Rootless: What You Need to Know

**8WHIE KaliDroid operates rootless using PRoot.**

- **What PRoot does**: It intercepts Linux system calls and translates filesystem paths in userspace. To the tools running inside Kali, they appear to have root (`uid 0`) permissions inside the chroot jail.
- **Safety guarantee**: Nothing inside the container can brick your Android device, overwrite system partitions, or alter hardware settings.
- **Limitations**:
  - Wi-Fi packet injection (Monitor Mode) is **not possible** with your phone's internal Wi-Fi chip because standard Android kernels do not expose raw 802.11 monitor mode to userspace.
  - Raw Bluetooth discovery packets are limited by Android SELinux policies.
  - Standard port numbers below 1024 cannot be bound on the Android host without root (hence SSH runs on port 2022 and VNC on port 5901).

---

## 🖥️ Graphical Desktop & VNC Guide

1. Install Option `[3]` from the menu.
2. Start the graphical server from Termux:
   ```bash
   kalidroid-gui start
   ```
3. Install any VNC client on your Android device (e.g., **AVNC** from F-Droid, **NetHunter KeX**, or **RealVNC**).
4. Connect to:
   - **Hostname**: `127.0.0.1`
   - **Port**: `5901`
5. To shut down the desktop server and release RAM:
   ```bash
   kalidroid-gui stop
   ```

---

## 🧹 Safe Uninstallation

8WHIE KaliDroid includes a dedicated cleanup utility that **strictly targets files generated by this project**:

```bash
kalidroid --uninstall
# or
bash uninstall.sh
```

It removes:
- `${PREFIX}/bin/kalidroid*` launchers
- `${HOME}/.8whie-kalidroid` temporary cache and installer metadata
- Prompts you whether you wish to retain or delete the PRoot container storage (`kali-light`, `kali-desktop`, `kali-ssh`).

Your Termux home folder, packages, and personal downloads will never be touched.

---

## 🔒 Security & Code Integrity

- **Zero Arbitrary Execution**: Scripts do not download untrusted binaries without explicit origin confirmation.
- **No Analytics / Telemetry**: 8WHIE KaliDroid does not phone home or collect telemetry.
- **Open and Auditable**: Every single shell module in `lib/` and `config/` is plain, well-commented Bash code.

---

## 🛠️ Troubleshooting

For in-depth fixes regarding:
- Android 12+ Phantom Process Killer (`Signal 9` termination)
- DNS lookup failures in PRoot
- VNC grey screen / connection refused
- Audio streaming with PulseAudio

Please refer to the detailed manual in **[`docs/troubleshooting.md`](docs/troubleshooting.md)**.

---

## ⚖️ Disclaimer & Educational Notice

**8WHIE KaliDroid** is an installation utility intended solely for cybersecurity research, educational purposes, network diagnostics, and authorized penetration testing within systems you own or have explicit written permission to assess. 

The developer (**8WHIE**) does not condone and is not liable for unauthorized access, misuse, or illegal activities carried out with software installed via this utility.

---

## 👥 Credits & Developer Information

- **Developer & Maintainer**: **8WHIE**
- **GitHub**: [@8whie](https://github.com/8whie)
- **Telegram Channel**: [https://t.me/whiee](https://t.me/whiee)
- **Telegram Contact**: [@Arnxkt](https://t.me/Arnxkt)
- **Instagram**: [@aaynkt](https://instagram.com/aaynkt)
- **YouTube**: [8WHIE](https://youtube.com/@8WHIE)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for complete details.
Copyright (c) 2026 8WHIE.
