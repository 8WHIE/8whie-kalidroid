#!/usr/bin/env bash
# Environment and Dependency Verification for 8WHIE KaliDroid
# Developer: 8WHIE (https://github.com/8whie)
# License: MIT

# Source dependencies if needed
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=../config/config.sh
source "${SCRIPT_DIR}/../config/config.sh"
# shellcheck source=./ui.sh
source "${SCRIPT_DIR}/ui.sh"

# Verify that the script is strictly executing within Termux
check_termux_environment() {
    local is_termux=false

    if [ -n "${TERMUX_VERSION:-}" ]; then
        is_termux=true
    elif [ -d "/data/data/com.termux/files/usr" ] || [[ "${PREFIX:-}" == *com.termux* ]]; then
        is_termux=true
    fi

    if [ "${is_termux}" = false ]; then
        log_error "This script is designed specifically for Android via Termux."
        printf "Termux was not detected in the current environment.\n"
        printf "Please run 8WHIE KaliDroid inside the official Termux terminal.\n"
        printf "Download Termux from F-Droid: https://f-droid.org/packages/com.termux/\n"
        return 1
    fi

    return 0
}

# Detect CPU architecture
get_system_arch() {
    local arch
    arch="$(uname -m)"
    case "${arch}" in
        aarch64|arm64)
            echo "aarch64"
            ;;
        armv7l|armv8l|armhf|arm)
            echo "armhf"
            ;;
        x86_64|amd64)
            echo "x86_64"
            ;;
        i686|x86)
            echo "i686"
            ;;
        *)
            echo "unknown (${arch})"
            ;;
    esac
}

# Check free disk space in megabytes
get_free_space_mb() {
    local target_dir="${1:-$HOME}"
    if command -v df >/dev/null 2>&1; then
        # df -m output parsing: column 4 is available in MB
        df -m "${target_dir}" 2>/dev/null | awk 'NR==2 {print $4}'
    else
        echo "0"
    fi
}

# Verify storage against requirement
verify_storage_requirement() {
    local required_mb="$1"
    local env_name="$2"
    local available_mb
    available_mb="$(get_free_space_mb "${HOME}")"

    if [ -z "${available_mb}" ] || [ "${available_mb}" -eq 0 ]; then
        log_warn "Could not reliably read free disk space via df. Proceeding with caution."
        return 0
    fi

    if [ "${available_mb}" -lt "${required_mb}" ]; then
        log_error "Insufficient storage for ${env_name}!"
        printf "  Required : ~%s MB (%.1f GB)\n" "${required_mb}" "$(echo "${required_mb} 1024" | awk '{printf "%.1f", $1/$2}')"
        printf "  Available: ~%s MB (%.1f GB)\n" "${available_mb}" "$(echo "${available_mb} 1024" | awk '{printf "%.1f", $1/$2}')"
        printf "  Please free up storage on your internal device storage before continuing.\n"
        return 1
    else
        log_success "Storage check passed for ${env_name}: ~${available_mb} MB available (need ~${required_mb} MB)."
        return 0
    fi
}

# Check required core dependencies
check_and_install_dependencies() {
    log_step "Checking essential Termux dependencies..."

    local needed_pkgs=()
    local core_tools=("curl" "tar" "proot")

    for tool in "${core_tools[@]}"; do
        if ! command -v "${tool}" >/dev/null 2>&1; then
            needed_pkgs+=("${tool}")
        fi
    done

    # Check for git and proot-distro
    if ! command -v git >/dev/null 2>&1; then
        needed_pkgs+=("git")
    fi
    if ! command -v proot-distro >/dev/null 2>&1; then
        needed_pkgs+=("proot-distro")
    fi

    if [ "${#needed_pkgs[@]}" -gt 0 ]; then
        log_warn "The following missing packages are required: ${needed_pkgs[*]}"
        if confirm_prompt "Would you like 8WHIE KaliDroid to install them now using pkg?" "Y"; then
            log_step "Updating repository lists and installing packages..."
            pkg update -y || apt-get update -y
            pkg install -y "${needed_pkgs[@]}" || apt-get install -y "${needed_pkgs[@]}"

            # Re-verify
            local missing_after=()
            for pkg in "${needed_pkgs[@]}"; do
                if ! command -v "${pkg}" >/dev/null 2>&1; then
                    missing_after+=("${pkg}")
                fi
            done

            if [ "${#missing_after[@]}" -gt 0 ]; then
                log_error "Failed to install: ${missing_after[*]}"
                printf "Please run manually: pkg install %s\n" "${missing_after[*]}"
                return 1
            fi
            log_success "All required dependencies installed successfully."
        else
            log_error "Required dependencies were not installed. Aborting operation."
            return 1
        fi
    else
        log_success "All prerequisite dependencies are already installed."
    fi

    return 0
}

# Run a complete system pre-flight check report
run_preflight_check() {
    print_banner
    printf "%b%b=== SYSTEM PRE-FLIGHT REPORT ===%b\n\n" "${COLOR_BOLD}" "${COLOR_CYAN}" "${COLOR_RESET}"

    local arch
    arch="$(get_system_arch)"
    log_info "Detected Architecture: ${arch}"

    if [[ "${arch}" == "unknown"* ]]; then
        log_warn "Architecture '${arch}' is not standard for mobile Kali rootfs."
    else
        log_success "Architecture '${arch}' is supported by proot / NetHunter."
    fi

    local free_mb
    free_mb="$(get_free_space_mb "${HOME}")"
    log_info "Free Termux Storage: ~${free_mb} MB (approx $(echo "${free_mb} 1024" | awk '{printf "%.2f", $1/$2}') GB)"

    printf "\n%bChecking package statuses:%b\n" "${COLOR_BOLD}" "${COLOR_RESET}"
    local tools=("curl" "wget" "git" "proot" "proot-distro" "tar" "pulseaudio")
    for t in "${tools[@]}"; do
        if command -v "${t}" >/dev/null 2>&1; then
            printf "  %-15s %b[INSTALLED]%b\n" "${t}" "${COLOR_GREEN}" "${COLOR_RESET}"
        else
            printf "  %-15s %b[NOT FOUND]%b (will install when needed)\n" "${t}" "${COLOR_YELLOW}" "${COLOR_RESET}"
        fi
    done

    print_info_box "Android 12+ Notice" \
        "If you are on Android 12, 13, 14, or 15, Android may kill child processes" \
        "(Phantom Process Killer error / Signal 9). To avoid random terminations," \
        "either enable Termux 'Disable Child Process Restrictions' or run via ADB:" \
        "adb shell \"/system/bin/device_config put activity_manager max_phantom_processes 2147483647\""

    press_enter_to_continue
}
