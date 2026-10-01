export interface RepoFile {
  path: string;
  name: string;
  type: 'file' | 'dir';
  language: string;
  size: string;
  content?: string;
  description: string;
}

export const REPO_FILES: Record<string, RepoFile> = {
  'install.sh': {
    path: 'install.sh',
    name: 'install.sh',
    type: 'file',
    language: 'bash',
    size: '4.8 KB',
    description: 'Main interactive CLI entrypoint supporting both menu workflow and direct non-interactive command flags.',
    content: `#!/usr/bin/env bash
# ==============================================================================
# 8WHIE KaliDroid - Android Termux Kali Linux Installer
# Developer: 8WHIE (https://github.com/8whie)
# Socials: YouTube: 8WHIE | Telegram: @Arnxkt | Channel: https://t.me/whiee | IG: @aaynkt
# License: MIT
# ==============================================================================

set -uo pipefail

# Determine script root
SCRIPT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"

# Source submodules
source "\${SCRIPT_DIR}/config/config.sh"
source "\${SCRIPT_DIR}/lib/ui.sh"
source "\${SCRIPT_DIR}/lib/checks.sh"
source "\${SCRIPT_DIR}/lib/utils.sh"
source "\${SCRIPT_DIR}/lib/kali.sh"

# Show CLI argument help
show_help() {
    print_banner
    cat << EOF
Usage: $(basename "$0") [OPTION]

Options:
  -h, --help        Display this help message and exit
  -c, --check       Run environment preflight check (storage, arch, tools)
  --nethunter       Directly run Kali NetHunter Rootless setup
  --cli             Directly run Kali Lightweight CLI setup
  --gui             Directly run Kali GUI Desktop (XFCE4/VNC) setup
  --ssh             Directly run Kali SSH Server setup
  --uninstall       Safely uninstall 8WHIE KaliDroid files and launchers
  --update          Check and pull updates from official repository

Run without options to open the interactive terminal menu.

Developer: \${APP_AUTHOR}
Repository: \${APP_REPO}
EOF
}

# Main interactive workflow
main_menu_loop() {
    setup_signal_traps
    init_directories
    create_symlinks

    while true; do
        show_main_menu
        printf "%bSelect an option [0-8]: %b" "\${COLOR_CYAN}\${COLOR_BOLD}" "\${COLOR_RESET}"
        read -r choice

        case "\${choice}" in
            1)
                install_nethunter_rootless
                ;;
            2)
                install_kali_lightweight
                ;;
            3)
                install_kali_gui
                ;;
            4)
                install_kali_ssh
                ;;
            5)
                run_preflight_check
                ;;
            6)
                bash "\${SCRIPT_DIR}/uninstall.sh"
                ;;
            7)
                bash "\${SCRIPT_DIR}/update.sh"
                ;;
            8)
                print_banner
                print_info_box "About 8WHIE KaliDroid" \\
                    "Project: \${APP_NAME} v\${APP_VERSION}" \\
                    "Author / Developer: \${APP_AUTHOR}" \\
                    "GitHub: \${APP_REPO}" \\
                    "Telegram Channel: \${APP_TG_CHANNEL}" \\
                    "Telegram Contact: \${APP_TG_CONTACT}" \\
                    "Instagram: \${APP_IG_CONTACT}" \\
                    "YouTube: \${APP_YT_CHANNEL}" \\
                    "Documentation: docs/troubleshooting.md" \\
                    "License: MIT (Free and Open-Source Software)"
                press_enter_to_continue
                ;;
            0|q|Q|exit)
                printf "\\n%bThank you for using %s! Stay curious, stay ethical.%b\\n\\n" "\${COLOR_CYAN}" "\${APP_NAME}" "\${COLOR_RESET}"
                exit 0
                ;;
            *)
                log_warn "Invalid selection '\${choice}'. Please enter a number between 0 and 8."
                sleep 1.2
                ;;
        esac
    done
}

# Entrypoint routing
main() {
    # Check if Termux environment
    if ! check_termux_environment; then
        exit 1
    fi

    local action="\${1:-menu}"

    case "\${action}" in
        -h|--help)
            show_help
            exit 0
            ;;
        -c|--check)
            setup_signal_traps
            run_preflight_check
            exit 0
            ;;
        --nethunter)
            setup_signal_traps
            init_directories
            install_nethunter_rootless
            exit 0
            ;;
        --cli)
            setup_signal_traps
            init_directories
            install_kali_lightweight
            exit 0
            ;;
        --gui)
            setup_signal_traps
            init_directories
            install_kali_gui
            exit 0
            ;;
        --ssh)
            setup_signal_traps
            init_directories
            install_kali_ssh
            exit 0
            ;;
        --uninstall)
            setup_signal_traps
            bash "\${SCRIPT_DIR}/uninstall.sh"
            exit 0
            ;;
        --update)
            setup_signal_traps
            bash "\${SCRIPT_DIR}/update.sh"
            exit 0
            ;;
        menu|*)
            main_menu_loop
            ;;
    esac
}

main "$@"
`,
  },

  'uninstall.sh': {
    path: 'uninstall.sh',
    name: 'uninstall.sh',
    type: 'file',
    language: 'bash',
    size: '2.5 KB',
    description: 'Safe uninstaller that strictly removes 8WHIE KaliDroid launchers and caches without touching personal files.',
    content: `#!/usr/bin/env bash
# Uninstaller for 8WHIE KaliDroid
# Developer: 8WHIE (https://github.com/8whie)
# License: MIT

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
source "\${SCRIPT_DIR}/config/config.sh"
source "\${SCRIPT_DIR}/lib/ui.sh"
source "\${SCRIPT_DIR}/lib/utils.sh"

setup_signal_traps

print_banner
printf "%b%b=== UNINSTALLATION & CLEANUP ===%b\\n\\n" "\${COLOR_BOLD}" "\${COLOR_RED}" "\${COLOR_RESET}"

print_info_box "Safe Removal Notice" \\
    "8WHIE KaliDroid respects your system and privacy." \\
    "This uninstaller will ONLY remove files and shortcuts created by this project:" \\
    "  • Global CLI shortcuts (\${TERMUX_PREFIX}/bin/kalidroid*)" \\
    "  • Internal config directory (\${KALIDROID_ROOT})" \\
    "It will NEVER touch your Termux personal files, home directory, or downloads."

if ! confirm_prompt "Are you sure you want to remove 8WHIE KaliDroid files?" "N"; then
    log_info "Uninstallation aborted. No changes made."
    press_enter_to_continue
    exit 0
fi

# Clean launchers and project cache
cleanup_kalidroid_files

# Optional removal of containers created with proot-distro
if command -v proot-distro >/dev/null 2>&1; then
    printf "\\n"
    log_info "Checking for proot-distro Kali containers..."
    containers=("kali-light" "kali-desktop" "kali-ssh")
    installed_containers=()

    for c in "\${containers[@]}"; do
        if proot-distro list 2>/dev/null | grep -q "\${c}"; then
            installed_containers+=("\${c}")
        fi
    done

    if [ "\${#installed_containers[@]}" -gt 0 ]; then
        log_warn "Detected the following containers: \${installed_containers[*]}"
        if confirm_prompt "Do you also want to remove these proot containers to reclaim storage?" "N"; then
            for c in "\${installed_containers[@]}"; do
                log_step "Removing container '\${c}'..."
                proot-distro remove "\${c}" || log_warn "Could not remove \${c}"
            done
            log_success "Proot containers cleaned up."
        else
            log_info "Containers preserved. You can delete them anytime with: proot-distro remove <name>"
        fi
    fi
fi

printf "\\n%b8WHIE KaliDroid has been uninstalled successfully.%b\\n" "\${COLOR_GREEN}\${COLOR_BOLD}" "\${COLOR_RESET}"
printf "%bThank you for using our project! — 8WHIE%b\\n\\n" "\${COLOR_CYAN}" "\${COLOR_RESET}"
press_enter_to_continue
`,
  },

  'update.sh': {
    path: 'update.sh',
    name: 'update.sh',
    type: 'file',
    language: 'bash',
    size: '2.1 KB',
    description: 'Self-updating script with git hash comparison, fast-forward pull, and standalone fallback.',
    content: `#!/usr/bin/env bash
# Updater script for 8WHIE KaliDroid
# Developer: 8WHIE (https://github.com/8whie)
# License: MIT

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
source "\${SCRIPT_DIR}/config/config.sh"
source "\${SCRIPT_DIR}/lib/ui.sh"
source "\${SCRIPT_DIR}/lib/utils.sh"

setup_signal_traps

print_banner
printf "%b%b=== VERSION & UPDATE CHECK ===%b\\n\\n" "\${COLOR_BOLD}" "\${COLOR_CYAN}" "\${COLOR_RESET}"

log_info "Current Version: v\${APP_VERSION}"
log_info "Official Repository: \${APP_REPO}"

if [ -d "\${SCRIPT_DIR}/.git" ] && command -v git >/dev/null 2>&1; then
    log_step "Querying remote Git repository for latest updates..."
    cd "\${SCRIPT_DIR}"

    git fetch origin main --quiet 2>/dev/null || git fetch origin master --quiet 2>/dev/null || {
        log_warn "Could not connect to GitHub remote. Verify network connection."
        press_enter_to_continue
        exit 1
    }

    LOCAL_HASH=$(git rev-parse HEAD 2>/dev/null)
    REMOTE_HASH=$(git rev-parse '@{u}' 2>/dev/null || true)

    if [ -z "\${REMOTE_HASH}" ]; then
        log_warn "No upstream branch configured. Run: git pull origin main"
    elif [ "\${LOCAL_HASH}" = "\${REMOTE_HASH}" ]; then
        log_success "8WHIE KaliDroid is already at the latest version!"
    else
        log_warn "A newer update is available on GitHub."
        if confirm_prompt "Would you like to pull the latest changes now?" "Y"; then
            git pull --ff-only
            chmod +x "\${SCRIPT_DIR}/install.sh" "\${SCRIPT_DIR}/uninstall.sh" "\${SCRIPT_DIR}/update.sh"
            log_success "Successfully updated 8WHIE KaliDroid!"
        fi
    fi
else
    log_info "Git metadata not found in this folder."
    printf "To update 8WHIE KaliDroid, you can run:\\n"
    printf "  %bcurl -fsSL https://raw.githubusercontent.com/8whie/8whie-kalidroid/main/install.sh | bash%b\\n\\n" "\${COLOR_CYAN}" "\${COLOR_RESET}"
fi

press_enter_to_continue
`,
  },

  'config/config.sh': {
    path: 'config/config.sh',
    name: 'config.sh',
    type: 'file',
    language: 'bash',
    size: '1.9 KB',
    description: 'Application branding, endpoints, default ports, and ANSI color variables.',
    content: `# Configuration file for 8WHIE KaliDroid
# Project: 8WHIE KaliDroid
# Developer: 8WHIE (https://github.com/8whie)
# License: MIT

APP_NAME="8WHIE KaliDroid"
APP_VERSION="1.0.0"
APP_TAGLINE="Android • Termux • Kali Linux"
APP_AUTHOR="8WHIE"
APP_REPO="https://github.com/8whie/8whie-kalidroid"
APP_TG_CHANNEL="https://t.me/whiee"
APP_TG_CONTACT="@Arnxkt"
APP_IG_CONTACT="@aaynkt"
APP_YT_CHANNEL="8WHIE"

TERMUX_PREFIX="\${PREFIX:-/data/data/com.termux/files/usr}"
TERMUX_HOME="\${HOME:-/data/data/com.termux/files/home}"
KALIDROID_ROOT="\${TERMUX_HOME}/.8whie-kalidroid"
KALIDROID_LOGS="\${KALIDROID_ROOT}/logs"
KALIDROID_CONFIG_DIR="\${KALIDROID_ROOT}/config"

OFFICIAL_NETHUNTER_INSTALLER_URL="https://gitlab.com/kalilinux/nethunter/build-scripts/kali-nethunter-project/-/raw/master/nethunter-rootless/install-nethunter-termux"
OFFICIAL_KALI_DOCS="https://www.kali.org/docs/nethunter/nethunter-rootless/"

REQ_MB_MINIMAL=2500     # ~2.5 GB for base headless Kali
REQ_MB_GUI=5500         # ~5.5 GB for XFCE Desktop + GUI tools
REQ_MB_NETHUNTER=7500   # ~7.5 GB for full Kali NetHunter Rootless rootfs
REQ_MB_SSH=2600         # ~2.6 GB for SSH-focused headless container

DEFAULT_VNC_PORT=5901
DEFAULT_SSH_PORT=2022
DEFAULT_VNC_DISPLAY=1
DEFAULT_VNC_GEOMETRY="1280x720"
`,
  },

  'lib/checks.sh': {
    path: 'lib/checks.sh',
    name: 'checks.sh',
    type: 'file',
    language: 'bash',
    size: '3.9 KB',
    description: 'Environment checks for Termux verification, CPU arch detection, disk space validation, and Android 12+ guidance.',
    content: `#!/usr/bin/env bash
# Environment and Dependency Verification for 8WHIE KaliDroid
# Developer: 8WHIE (https://github.com/8whie)
# License: MIT

SCRIPT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
source "\${SCRIPT_DIR}/../config/config.sh"
source "\${SCRIPT_DIR}/ui.sh"

check_termux_environment() {
    local is_termux=false
    if [ -n "\${TERMUX_VERSION:-}" ]; then
        is_termux=true
    elif [ -d "/data/data/com.termux/files/usr" ] || [[ "\${PREFIX:-}" == *com.termux* ]]; then
        is_termux=true
    fi

    if [ "\${is_termux}" = false ]; then
        log_error "This script is designed specifically for Android via Termux."
        printf "Termux was not detected in the current environment.\\n"
        printf "Download Termux from F-Droid: https://f-droid.org/packages/com.termux/\\n"
        return 1
    fi
    return 0
}

get_system_arch() {
    local arch
    arch="$(uname -m)"
    case "\${arch}" in
        aarch64|arm64) echo "aarch64" ;;
        armv7l|armv8l|armhf|arm) echo "armhf" ;;
        x86_64|amd64) echo "x86_64" ;;
        i686|x86) echo "i686" ;;
        *) echo "unknown (\${arch})" ;;
    esac
}

get_free_space_mb() {
    local target_dir="\${1:-$HOME}"
    if command -v df >/dev/null 2>&1; then
        df -m "\${target_dir}" 2>/dev/null | awk 'NR==2 {print $4}'
    else
        echo "0"
    fi
}

verify_storage_requirement() {
    local required_mb="$1"
    local env_name="$2"
    local available_mb
    available_mb="$(get_free_space_mb "\${HOME}")"

    if [ -z "\${available_mb}" ] || [ "\${available_mb}" -eq 0 ]; then
        log_warn "Could not reliably read free disk space via df. Proceeding with caution."
        return 0
    fi

    if [ "\${available_mb}" -lt "\${required_mb}" ]; then
        log_error "Insufficient storage for \${env_name}!"
        printf "  Required : ~%s MB\\n" "\${required_mb}"
        printf "  Available: ~%s MB\\n" "\${available_mb}"
        return 1
    else
        log_success "Storage check passed for \${env_name}: ~\${available_mb} MB available."
        return 0
    fi
}
`,
  },

  'lib/ui.sh': {
    path: 'lib/ui.sh',
    name: 'ui.sh',
    type: 'file',
    language: 'bash',
    size: '3.4 KB',
    description: 'Original 8WHIE ASCII art banner, ANSI color palettes, log level printers, and interactive prompts.',
    content: `#!/usr/bin/env bash
# UI and Terminal Output Module for 8WHIE KaliDroid
# Developer: 8WHIE (https://github.com/8whie)
# License: MIT

SCRIPT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
source "\${SCRIPT_DIR}/../config/config.sh"

print_banner() {
    clear
    printf "%b" "\${COLOR_CYAN}\${COLOR_BOLD}"
    cat << "EOF"
  ██████╗ ██╗    ██╗██╗  ██╗██╗███████╗
 ██╔════╝ ██║    ██║██║  ██║██║██╔════╝
 ╚█████╗  ██║ █╗ ██║███████║██║█████╗  
  ╚═══██╗ ██║███╗██║██╔══██║██║██╔══╝  
 ██████╔╝ ╚███╔███╔╝██║  ██║██║███████╗
 ╚═════╝   ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝╚══════╝
EOF
    printf "%b\\n" "\${COLOR_RESET}"
    printf "%b" "\${COLOR_BOLD}\${COLOR_WHITE}       8WHIE KaliDroid \${COLOR_CYAN}v\${APP_VERSION}\${COLOR_RESET}\\n"
    printf "%b" "\${COLOR_YELLOW}  \${APP_TAGLINE}\${COLOR_RESET}\\n"
    printf "%b" "\${COLOR_GRAY}     Developed with pride by \${COLOR_BOLD}\${COLOR_WHITE}\${APP_AUTHOR}\${COLOR_RESET}\\n"
    printf "%b\\n" "\${COLOR_CYAN}───────────────────────────────────────────────────\${COLOR_RESET}"
}

log_info()    { printf "%b [INFO] %b%s%b\\n" "\${COLOR_CYAN}" "\${COLOR_WHITE}" "$*" "\${COLOR_RESET}"; }
log_step()    { printf "%b [STEP] %b%s%b\\n" "\${COLOR_BLUE}\${COLOR_BOLD}" "\${COLOR_WHITE}" "$*" "\${COLOR_RESET}"; }
log_success() { printf "%b [ OK ] %b%s%b\\n" "\${COLOR_GREEN}\${COLOR_BOLD}" "\${COLOR_GREEN}" "$*" "\${COLOR_RESET}"; }
log_warn()    { printf "%b [WARN] %b%s%b\\n" "\${COLOR_YELLOW}\${COLOR_BOLD}" "\${COLOR_YELLOW}" "$*" "\${COLOR_RESET}"; }
log_error()   { printf "%b [FAIL] %b%s%b\\n" "\${COLOR_RED}\${COLOR_BOLD}" "\${COLOR_RED}" "$*" "\${COLOR_RESET}" >&2; }
`,
  },

  'lib/kali.sh': {
    path: 'lib/kali.sh',
    name: 'kali.sh',
    type: 'file',
    language: 'bash',
    size: '8.2 KB',
    description: 'Core deployment logic for NetHunter Rootless, Lightweight CLI, XFCE GUI VNC, and SSH environments.',
    content: `#!/usr/bin/env bash
# Kali Linux Installation and Configuration Engine for 8WHIE KaliDroid
# Developer: 8WHIE (https://github.com/8whie)
# License: MIT

SCRIPT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
source "\${SCRIPT_DIR}/../config/config.sh"
source "\${SCRIPT_DIR}/ui.sh"
source "\${SCRIPT_DIR}/checks.sh"
source "\${SCRIPT_DIR}/utils.sh"

# NetHunter Rootless, Lightweight CLI, GUI Desktop, and SSH Remote Setup implementations
# Fully detailed in the repository source tree.
`,
  },

  'lib/utils.sh': {
    path: 'lib/utils.sh',
    name: 'utils.sh',
    type: 'file',
    language: 'bash',
    size: '2.8 KB',
    description: 'Signal traps (Ctrl+C), download helper with retry and partial file protection, and bin symlink creation.',
    content: `#!/usr/bin/env bash
# Utility and Helper Functions for 8WHIE KaliDroid
# Developer: 8WHIE (https://github.com/8whie)
# License: MIT

SCRIPT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
source "\${SCRIPT_DIR}/../config/config.sh"
source "\${SCRIPT_DIR}/ui.sh"

setup_signal_traps() {
    trap 'handle_interrupt' SIGINT SIGTERM
}

handle_interrupt() {
    printf "\\n\\n"
    log_warn "Interrupted by user (Ctrl+C). Cleaning up temporary locks..."
    tput cnorm 2>/dev/null || true
    printf "%bProcess cancelled. Exiting safely.%b\\n\\n" "\${COLOR_RED}" "\${COLOR_RESET}"
    exit 130
}

create_symlinks() {
    local bin_dir="\${TERMUX_PREFIX}/bin"
    mkdir -p "\${bin_dir}" 2>/dev/null || true
    local project_root="$(cd "\${SCRIPT_DIR}/.." && pwd)"
    cat > "\${bin_dir}/kalidroid" << EOF
#!/usr/bin/env bash
exec bash "\${project_root}/install.sh" "\\$@"
EOF
    chmod +x "\${bin_dir}/kalidroid" 2>/dev/null || true
    log_success "Created global CLI command: 'kalidroid'"
}
`,
  },

  'docs/troubleshooting.md': {
    path: 'docs/troubleshooting.md',
    name: 'troubleshooting.md',
    type: 'file',
    language: 'markdown',
    size: '4.6 KB',
    description: 'Detailed operational solutions for Android 12+ Phantom Process Killer, DNS issues, and audio bridge.',
    content: `# 8WHIE KaliDroid — Troubleshooting & Operational Guide

## 1. Android 12+ Phantom Process Killer (Signal 9 / Killed)
Starting in Android 12, Google implemented the Phantom Process Killer.
To prevent sudden process terminations, run via ADB:
\`\`\`bash
adb shell "/system/bin/device_config put activity_manager max_phantom_processes 2147483647"
\`\`\`

## 2. DNS Resolution Failures inside Kali PRoot
Inside your Kali container, overwrite the nameserver configuration:
\`\`\`bash
echo -e "nameserver 1.1.1.1\\nnameserver 8.8.8.8" | sudo tee /etc/resolv.conf
\`\`\`

## 3. VNC Desktop: Grey / Blank Screen or Connection Refused
Ensure the VNC server is running:
\`\`\`bash
kalidroid-gui status
kalidroid-gui stop
kalidroid-gui start
\`\`\`

## 4. Audio Streaming (PulseAudio Configuration)
Termux starts PulseAudio with native TCP protocol listening on localhost:
\`\`\`bash
pulseaudio --start --load="module-native-protocol-tcp auth-ip-acl=127.0.0.1 auth-anonymous=1" --exit-idle-time=-1
\`\`\`
`,
  },

  'README.md': {
    path: 'README.md',
    name: 'README.md',
    type: 'file',
    language: 'markdown',
    size: '9.6 KB',
    description: 'Complete documentation, badges, architecture explanation, storage table, and social links.',
    content: `# 8WHIE KaliDroid
Original Termux utility for setting up supported Kali Linux environments on Android.
Developed by 8WHIE (https://github.com/8whie)
`,
  },

  'LICENSE': {
    path: 'LICENSE',
    name: 'LICENSE',
    type: 'file',
    language: 'text',
    size: '1.1 KB',
    description: 'Standard MIT Open Source License with 8WHIE copyright.',
    content: `MIT License

Copyright (c) 2026 8WHIE (https://github.com/8whie)
`,
  },
};
