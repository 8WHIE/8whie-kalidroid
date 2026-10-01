#!/usr/bin/env bash
# Kali Linux Installation and Configuration Engine for 8WHIE KaliDroid
# Developer: 8WHIE (https://github.com/8whie)
# License: MIT

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=../config/config.sh
source "${SCRIPT_DIR}/../config/config.sh"
# shellcheck source=./ui.sh
source "${SCRIPT_DIR}/ui.sh"
# shellcheck source=./checks.sh
source "${SCRIPT_DIR}/checks.sh"
# shellcheck source=./utils.sh
source "${SCRIPT_DIR}/utils.sh"

# ==============================================================================
# 1. Kali NetHunter Rootless (Official OffSec Method)
# ==============================================================================
install_nethunter_rootless() {
    print_banner
    print_info_box "Kali NetHunter Rootless Installation" \
        "Target: Official Offensive Security Kali NetHunter Rootless" \
        "Approximate Storage Required: ~${REQ_MB_NETHUNTER} MB (7.5 - 10.0 GB)" \
        "Root Privileges: NOT REQUIRED (Pure PRoot userspace isolation)" \
        "Features Included: Full Kali repo access, 'nh' CLI, NetHunter KeX VNC" \
        "Official Documentation: ${OFFICIAL_KALI_DOCS}"

    print_warning_box "Important Limitations" \
        "• Hardware monitor mode (Wi-Fi injection) requires root + external OTG Wi-Fi." \
        "• Raw Bluetooth sniffing is constrained by Android OS kernel permissions." \
        "• Network socket raw creation (raw ping/syn scans) may require fallback modes."

    if ! verify_storage_requirement "${REQ_MB_NETHUNTER}" "Kali NetHunter Rootless"; then
        press_enter_to_continue
        return 1
    fi

    if ! confirm_prompt "Do you wish to proceed with the official NetHunter rootless setup?" "Y"; then
        log_info "Installation cancelled by user."
        press_enter_to_continue
        return 0
    fi

    check_and_install_dependencies || return 1

    local installer_target="${KALIDROID_ROOT}/install-nethunter-termux"
    log_step "Retrieving verified Offensive Security NetHunter installer..."

    if ! download_file "${OFFICIAL_NETHUNTER_INSTALLER_URL}" "${installer_target}" "NetHunter Rootless Installer"; then
        log_error "Download failed. Check internet access or GitLab status."
        press_enter_to_continue
        return 1
    fi

    chmod +x "${installer_target}"

    log_step "Launching official Kali NetHunter Rootless setup script..."
    log_info "You will be prompted by the NetHunter installer for rootfs download mirror."

    # Execute NetHunter installer
    bash "${installer_target}"

    # Verify if installation succeeded (nethunter / nh binary created in $PREFIX/bin)
    if command -v nethunter >/dev/null 2>&1 || command -v nh >/dev/null 2>&1; then
        log_success "Kali NetHunter Rootless installed successfully!"

        # Create 8WHIE shortcut
        cat > "${TERMUX_PREFIX}/bin/kalidroid-nethunter" << 'EOF'
#!/usr/bin/env bash
if command -v nh >/dev/null 2>&1; then
    exec nh "$@"
elif command -v nethunter >/dev/null 2>&1; then
    exec nethunter "$@"
else
    echo "NetHunter launcher not found in PATH."
    exit 1
fi
EOF
        chmod +x "${TERMUX_PREFIX}/bin/kalidroid-nethunter" 2>/dev/null || true

        print_info_box "How to launch NetHunter" \
            "• CLI Terminal: Type 'nh' or 'kalidroid-nethunter'" \
            "• As root in container: Type 'nh -r'" \
            "• KeX VNC Desktop: Type 'nh kex passwd' once, then 'nh kex'" \
            "• Connect KeX App to: 127.0.0.1:5901"
    else
        log_warn "Installation script completed. If download was cancelled or failed,"
        log_warn "you can re-run this option anytime."
    fi

    press_enter_to_continue
}

# ==============================================================================
# 2. Kali Lightweight CLI (Proot Minimal Environment)
# ==============================================================================
install_kali_lightweight() {
    print_banner
    print_info_box "Kali Lightweight CLI Environment" \
        "Target: Minimal Headless Kali Linux PRoot Container" \
        "Approximate Storage Required: ~${REQ_MB_MINIMAL} MB (2.5 GB)" \
        "Root Privileges: NOT REQUIRED" \
        "Ideal for: Python security tools, nmap, nikto, curl, git, bash scripting" \
        "Footprint: Ultra-fast boot, minimal battery and RAM usage"

    if ! verify_storage_requirement "${REQ_MB_MINIMAL}" "Kali Lightweight"; then
        press_enter_to_continue
        return 1
    fi

    if ! confirm_prompt "Install the lightweight headless Kali environment?" "Y"; then
        log_info "Operation cancelled by user."
        press_enter_to_continue
        return 0
    fi

    check_and_install_dependencies || return 1

    local container_id="kali-light"
    log_step "Configuring container distribution via proot-distro..."

    # Ensure proot-distro is installed
    if ! command -v proot-distro >/dev/null 2>&1; then
        pkg install -y proot-distro || apt-get install -y proot-distro
    fi

    # Install or verify debian/kali container
    log_step "Installing base rootfs for ${container_id}..."
    if proot-distro list | grep -q "${container_id}"; then
        log_info "Container '${container_id}' already registered."
    else
        # We use proot-distro debian base and bootstrap kali repos or debian testing
        proot-distro install debian --override-alias "${container_id}" || {
            log_error "proot-distro failed to provision base image."
            press_enter_to_continue
            return 1
        }
    fi

    # Provision Kali repo & basic tools inside the container
    log_step "Configuring Kali repository and security essentials..."
    proot-distro login "${container_id}" -- bash -c '
        export DEBIAN_FRONTEND=noninteractive
        apt-get update -y
        apt-get install -y gnupg wget curl ca-certificates sudo
        # Install Kali archive keyring
        wget -q -O - https://archive.kali.org/archive-key.asc | gpg --dearmor -o /etc/apt/trusted.gpg.d/kali-archive-keyring.gpg 2>/dev/null || true
        echo "deb http://http.kali.org/kali kali-rolling main contrib non-free non-free-firmware" > /etc/apt/sources.list.d/kali.list
        apt-get update -y || true
        # Install fundamental lightweight tools
        apt-get install -y nmap netcat-traditional dnsutils whois jq git zsh htop || true
    '

    # Create dedicated launcher script
    cat > "${TERMUX_PREFIX}/bin/kalidroid-cli" << EOF
#!/usr/bin/env bash
# 8WHIE KaliDroid Lightweight CLI Launcher
echo -e "\033[38;5;51m[8WHIE KaliDroid]\033[0m Starting Lightweight Kali environment..."
exec proot-distro login "${container_id}" --user root --shared-tmp
EOF
    chmod +x "${TERMUX_PREFIX}/bin/kalidroid-cli" 2>/dev/null || true

    log_success "Lightweight Kali CLI successfully installed!"
    print_info_box "Quick Launch Instructions" \
        "• Run command: 'kalidroid-cli'" \
        "• Storage location: managed by proot-distro '${container_id}'" \
        "• To exit container: type 'exit'"

    press_enter_to_continue
}

# ==============================================================================
# 3. Kali GUI Desktop (XFCE4 + TigerVNC)
# ==============================================================================
install_kali_gui() {
    print_banner
    print_info_box "Kali GUI Desktop Environment (XFCE4)" \
        "Target: Full XFCE Desktop with VNC Server and Audio Bridge" \
        "Approximate Storage Required: ~${REQ_MB_GUI} MB (5.5 - 6.5 GB)" \
        "Root Privileges: NOT REQUIRED" \
        "Components: XFCE4, TigerVNC, PulseAudio, Terminal, File Manager" \
        "Client App: RealVNC, AVNC, bVNC, or NetHunter KeX (from F-Droid/Play Store)"

    if ! verify_storage_requirement "${REQ_MB_GUI}" "Kali GUI Desktop"; then
        press_enter_to_continue
        return 1
    fi

    if ! confirm_prompt "Proceed with Kali GUI Desktop installation?" "Y"; then
        log_info "Operation cancelled by user."
        press_enter_to_continue
        return 0
    fi

    check_and_install_dependencies || return 1

    local container_id="kali-desktop"
    log_step "Setting up desktop container '${container_id}'..."

    if ! proot-distro list | grep -q "${container_id}"; then
        proot-distro install debian --override-alias "${container_id}" || {
            log_error "Failed to provision base desktop container."
            press_enter_to_continue
            return 1
        }
    fi

    log_step "Installing XFCE4, TigerVNC, and graphical toolsets inside container..."
    log_info "This may take 5 to 15 minutes depending on device network speed..."

    proot-distro login "${container_id}" -- bash -c '
        export DEBIAN_FRONTEND=noninteractive
        apt-get update -y
        apt-get install -y wget curl gnupg dbus-x11 tigervnc-standalone-server tigervnc-common
        # Install XFCE desktop base
        apt-get install -y xfce4 xfce4-terminal xfce4-goodies
        # Create non-root kali user if not exists
        if ! id -u kali >/dev/null 2>&1; then
            useradd -m -s /bin/bash -G sudo kali
            echo "kali:kali" | chpasswd
        fi
        # Setup VNC configuration
        mkdir -p /home/kali/.vnc
        cat > /home/kali/.vnc/xstartup << "VNC_EOF"
#!/bin/sh
unset SESSION_MANAGER
unset DBUS_SESSION_BUS_ADDRESS
[ -x /etc/vnc/xstartup ] && exec /etc/vnc/xstartup
[ -r $HOME/.Xresources ] && xrdb $HOME/.Xresources
export XKL_XMODMAP_DISABLE=1
exec startxfce4
VNC_EOF
        chmod +x /home/kali/.vnc/xstartup
        chown -R kali:kali /home/kali/.vnc
    '

    # Create launcher script kalidroid-gui
    cat > "${TERMUX_PREFIX}/bin/kalidroid-gui" << EOF
#!/usr/bin/env bash
# 8WHIE KaliDroid GUI Manager
case "\$1" in
    stop)
        echo -e "\033[38;5;220m[8WHIE KaliDroid]\033[0m Stopping VNC Server on :${DEFAULT_VNC_DISPLAY}..."
        proot-distro login "${container_id}" --user kali -- bash -c "vncserver -kill :${DEFAULT_VNC_DISPLAY} 2>/dev/null || true"
        pkill -f pulseaudio 2>/dev/null || true
        echo -e "\033[38;5;46m[OK]\033[0m VNC Server stopped."
        ;;
    status)
        proot-distro login "${container_id}" --user kali -- bash -c "vncserver -list"
        ;;
    start|*)
        echo -e "\033[38;5;51m[8WHIE KaliDroid]\033[0m Initializing PulseAudio sound bridge..."
        pulseaudio --start --load="module-native-protocol-tcp auth-ip-acl=127.0.0.1 auth-anonymous=1" --exit-idle-time=-1 2>/dev/null || true
        echo -e "\033[38;5;51m[8WHIE KaliDroid]\033[0m Starting TigerVNC server on :${DEFAULT_VNC_DISPLAY} (${DEFAULT_VNC_GEOMETRY})..."
        proot-distro login "${container_id}" --user kali -- bash -c "vncserver :${DEFAULT_VNC_DISPLAY} -geometry ${DEFAULT_VNC_GEOMETRY} -depth 24"
        echo ""
        echo -e "\033[38;5;46m[OK] VNC Server is ACTIVE!\033[0m"
        echo -e "  Host: \033[1;37m127.0.0.1\033[0m"
        echo -e "  Port: \033[1;37m${DEFAULT_VNC_PORT}\033[0m (Display :${DEFAULT_VNC_DISPLAY})"
        echo -e "  Password: set during first vnc run (default user: kali)"
        echo -e "  To stop: \033[1;33mkalidroid-gui stop\033[0m"
        ;;
esac
EOF
    chmod +x "${TERMUX_PREFIX}/bin/kalidroid-gui" 2>/dev/null || true

    log_success "Kali GUI Desktop environment installed successfully!"
    print_info_box "VNC Desktop Quick Start" \
        "1. Launch VNC Server: type 'kalidroid-gui start'" \
        "2. Open your VNC Viewer app on Android (e.g., AVNC or RealVNC)" \
        "3. Address: 127.0.0.1:${DEFAULT_VNC_PORT}" \
        "4. To terminate session: type 'kalidroid-gui stop'"

    press_enter_to_continue
}

# ==============================================================================
# 4. Kali SSH Remote Server
# ==============================================================================
install_kali_ssh() {
    print_banner
    print_info_box "Kali SSH Remote Server" \
        "Target: Secure Shell (SSH) headless Kali workspace" \
        "Port: ${DEFAULT_SSH_PORT} (Custom non-privileged port to avoid Termux port conflict)" \
        "Storage Required: ~${REQ_MB_SSH} MB (2.6 GB)" \
        "Root Privileges: NOT REQUIRED" \
        "Use Case: Remote terminal access from laptop/PC via Wi-Fi or LAN"

    if ! verify_storage_requirement "${REQ_MB_SSH}" "Kali SSH Server"; then
        press_enter_to_continue
        return 1
    fi

    if ! confirm_prompt "Install Kali SSH environment?" "Y"; then
        log_info "Operation cancelled by user."
        press_enter_to_continue
        return 0
    fi

    check_and_install_dependencies || return 1

    local container_id="kali-ssh"
    log_step "Setting up container '${container_id}'..."

    if ! proot-distro list | grep -q "${container_id}"; then
        proot-distro install debian --override-alias "${container_id}" || {
            log_error "Failed to create SSH container."
            press_enter_to_continue
            return 1
        }
    fi

    log_step "Configuring OpenSSH server inside container..."
    proot-distro login "${container_id}" -- bash -c "
        export DEBIAN_FRONTEND=noninteractive
        apt-get update -y
        apt-get install -y openssh-server sudo curl wget net-tools
        # Ensure sshd directory exists
        mkdir -p /run/sshd
        # Configure custom port
        sed -i 's/#Port 22/Port ${DEFAULT_SSH_PORT}/g' /etc/ssh/sshd_config 2>/dev/null || true
        # Create default user 'kali'
        if ! id -u kali >/dev/null 2>&1; then
            useradd -m -s /bin/bash -G sudo kali
            echo 'kali:kali' | chpasswd
        fi
        # Generate host keys if absent
        ssh-keygen -A 2>/dev/null || true
    "

    # Create launcher
    cat > "${TERMUX_PREFIX}/bin/kalidroid-ssh" << EOF
#!/usr/bin/env bash
# 8WHIE KaliDroid SSH Server Manager
case "\$1" in
    stop)
        echo -e "\033[38;5;220m[8WHIE KaliDroid]\033[0m Stopping SSH server..."
        proot-distro login "${container_id}" -- bash -c "pkill -f sshd 2>/dev/null || true"
        echo -e "\033[38;5;46m[OK]\033[0m SSH daemon stopped."
        ;;
    start|*)
        echo -e "\033[38;5;51m[8WHIE KaliDroid]\033[0m Starting Kali SSH daemon on port ${DEFAULT_SSH_PORT}..."
        proot-distro login "${container_id}" -- bash -c "mkdir -p /run/sshd && /usr/sbin/sshd -p ${DEFAULT_SSH_PORT}"
        echo ""
        echo -e "\033[38;5;46m[OK] Kali SSH is running!\033[0m"
        echo -e "  Connect locally:   \033[1;37mssh -p ${DEFAULT_SSH_PORT} kali@127.0.0.1\033[0m"
        echo -e "  Connect from Wi-Fi:\033[1;37mssh -p ${DEFAULT_SSH_PORT} kali@<Your-Phone-IP>\033[0m"
        echo -e "  Default password:  \033[1;33mkali\033[0m"
        echo -e "  To stop server:    \033[1;33mkalidroid-ssh stop\033[0m"
        ;;
esac
EOF
    chmod +x "${TERMUX_PREFIX}/bin/kalidroid-ssh" 2>/dev/null || true

    log_success "Kali SSH environment ready!"
    print_info_box "SSH Access" \
        "• Start server: 'kalidroid-ssh start'" \
        "• Stop server: 'kalidroid-ssh stop'" \
        "• Connect: ssh -p ${DEFAULT_SSH_PORT} kali@127.0.0.1 (password: kali)"

    press_enter_to_continue
}
