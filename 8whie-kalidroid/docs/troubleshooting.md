# 8WHIE KaliDroid — Troubleshooting & Operational Guide

Welcome to the official troubleshooting manual for **8WHIE KaliDroid**. This guide explains common mobile Linux issues on Android/Termux and provides battle-tested solutions.

---

## 1. Android 12+ Phantom Process Killer (Signal 9 / Killed)

### Symptom:
While downloading, extracting, or running heavy Kali packages, your Termux session abruptly prints:
```text
[Process completed (signal 9) - press Enter]
```
Or background VNC/SSH processes disappear without warning.

### Cause:
Starting in Android 12, Google implemented the **Phantom Process Killer**, which monitors child processes spawned by apps (such as `proot`, `apt`, `git`, or `vncserver`) and forcibly terminates them if total child processes exceed 32 or consume excessive CPU in the background.

### Resolution:

#### Option A: Via ADB (Recommended & Permanent)
Connect your Android phone to a computer with USB debugging enabled, or use a local wireless debugging app (such as Shizuku/LADB), and run:
```bash
adb shell "/system/bin/device_config put activity_manager max_phantom_processes 2147483647"
```

#### Option B: Termux In-App Setting (Android 14+)
1. Open Android **Settings > Apps > Termux > Battery**.
2. Set battery usage to **Unrestricted**.
3. Open Termux settings (or `termux-tools`) and ensure background execution permissions are granted.

---

## 2. DNS Resolution Failures inside Kali PRoot

### Symptom:
Commands like `apt update` or `ping google.com` fail with `Could not resolve host` or `Temporary failure in name resolution`.

### Cause:
Android dynamically configures DNS per network interface (Wi-Fi vs Cellular), and PRoot sometimes cannot read Android's internal DNS daemon sockets.

### Resolution:
Inside your Kali container, overwrite the nameserver configuration with public DNS servers:
```bash
echo -e "nameserver 1.1.1.1\nnameserver 8.8.8.8" | sudo tee /etc/resolv.conf
```
To make this stick across restarts in proot-distro, you can also set it in Termux:
```bash
proot-distro login kali-light -- bash -c 'echo -e "nameserver 1.1.1.1\nnameserver 8.8.8.8" > /etc/resolv.conf'
```

---

## 3. VNC Desktop: Grey / Blank Screen or Connection Refused

### Symptom:
When connecting via AVNC, bVNC, or NetHunter KeX to `127.0.0.1:5901`, you see a black/grey screen with an X cursor or connection refused.

### Resolution:
1. Ensure the VNC server is actually active:
   ```bash
   kalidroid-gui status
   ```
2. If another instance is frozen on display :1, kill it and start fresh:
   ```bash
   kalidroid-gui stop
   kalidroid-gui start
   ```
3. Check `~/.vnc/xstartup` inside your container:
   Ensure `dbus-x11` is installed:
   ```bash
   proot-distro login kali-desktop -- apt-get install -y dbus-x11 xfce4
   ```
4. Verify display port:
   - Display `:1` corresponds to port `5901`
   - Display `:2` corresponds to port `5902`

---

## 4. Audio Streaming (PulseAudio Configuration)

To hear system audio, media, and tools from your Kali desktop through your Android phone speakers:
1. Termux starts PulseAudio with native TCP protocol listening on localhost:
   ```bash
   pulseaudio --start --load="module-native-protocol-tcp auth-ip-acl=127.0.0.1 auth-anonymous=1" --exit-idle-time=-1
   ```
2. Inside your Kali environment, export the PulseAudio server address:
   ```bash
   export PULSE_SERVER=127.0.0.1
   ```
   *8WHIE KaliDroid sets this up automatically when running `kalidroid-gui`.*

---

## 5. Storage Access to Android Internal Files

To access your phone's downloads, documents, and pictures from within Termux and Kali:
1. Run in Termux:
   ```bash
   termux-setup-storage
   ```
2. Accept the Android storage permission prompt.
3. Your internal storage will be available at:
   - Termux: `~/storage/shared/`
   - You can mount or copy files directly between Termux and Kali containers.

---

## 6. Proot vs Rooted Chroot (Clear Explanation)

| Feature | 8WHIE KaliDroid (Rootless PRoot) | Rooted Chroot / Custom Kernel |
| :--- | :--- | :--- |
| **Root Required?** | **NO** (Runs 100% in userspace) | **YES** (Requires unlocked bootloader + Magisk/KernelSU) |
| **Device Warranty** | Fully safe, no warranty impact | May void warranty, Knox tripping |
| **Wi-Fi Monitor Mode**| Not possible on internal chip | Possible with supported OTG external Wi-Fi |
| **VNC GUI Desktop** | Full support (XFCE, MATE, LXDE) | Full support |
| **Network Tools** | Nmap (unprivileged), Nikto, Metasploit, Python, Burp Suite | Full raw packet crafting & sniffing |

---

## 7. Community Support & Official Links

If you encounter an issue not documented here:
- **Developer / Lead**: 8WHIE
- **Telegram Channel**: [https://t.me/whiee](https://t.me/whiee)
- **Telegram Contact**: [@Arnxkt](https://t.me/Arnxkt)
- **Instagram**: [@aaynkt](https://instagram.com/aaynkt)
- **YouTube**: [8WHIE](https://youtube.com/@8WHIE)
- **GitHub Repository**: [https://github.com/8whie/8whie-kalidroid](https://github.com/8whie/8whie-kalidroid)
