#!/usr/bin/env bash
# Utility and Helper Functions for 8WHIE KaliDroid
# Developer: 8WHIE (https://github.com/8whie)
# License: MIT

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=../config/config.sh
source "${SCRIPT_DIR}/../config/config.sh"
# shellcheck source=./ui.sh
source "${SCRIPT_DIR}/ui.sh"

# Trap interrupt signals (Ctrl+C, SIGTERM)
setup_signal_traps() {
    trap 'handle_interrupt' SIGINT SIGTERM
}

handle_interrupt() {
    printf "\n\n"
    log_warn "Interrupted by user (Ctrl+C). Cleaning up temporary locks..."
    # Ensure terminal cursor is restored
    tput cnorm 2>/dev/null || true
    printf "%bProcess cancelled. Exiting safely.%b\n\n" "${COLOR_RED}" "${COLOR_RESET}"
    exit 130
}

# Ensure base application directories exist
init_directories() {
    mkdir -p "${KALIDROID_ROOT}"
    mkdir -p "${KALIDROID_LOGS}"
    mkdir -p "${KALIDROID_CONFIG_DIR}"
}

# Create command line shortcuts in $PREFIX/bin so user can launch anywhere
create_symlinks() {
    local bin_dir="${TERMUX_PREFIX}/bin"
    if [ ! -d "${bin_dir}" ]; then
        mkdir -p "${bin_dir}"
    fi

    local project_root
    project_root="$(cd "${SCRIPT_DIR}/.." && pwd)"

    # Wrapper script for launching 8whie-kalidroid menu
    local launcher_script="${bin_dir}/kalidroid"
    cat > "${launcher_script}" << EOF
#!/usr/bin/env bash
exec bash "${project_root}/install.sh" "\$@"
EOF
    chmod +x "${launcher_script}" 2>/dev/null || true
    log_success "Created global CLI command: 'kalidroid' (launch anytime from Termux)"
}

# Safe download file with curl or wget, status checking, and fallback
download_file() {
    local url="$1"
    local output_file="$2"
    local description="$3"

    log_step "Downloading ${description}..."
    log_info "Source: ${url}"

    # Remove stale partial file if exists
    rm -f "${output_file}.part"

    local download_success=false

    if command -v curl >/dev/null 2>&1; then
        if curl -fL --progress-bar --connect-timeout 20 --retry 3 -o "${output_file}.part" "${url}"; then
            download_success=true
        fi
    elif command -v wget >/dev/null 2>&1; then
        if wget --timeout=20 --tries=3 -O "${output_file}.part" "${url}"; then
            download_success=true
        fi
    fi

    if [ "${download_success}" = true ] && [ -s "${output_file}.part" ]; then
        mv "${output_file}.part" "${output_file}"
        log_success "Download complete: ${description}"
        return 0
    else
        rm -f "${output_file}.part"
        log_error "Failed to download ${description}."
        log_warn "Please check your internet connection or mirror availability."
        return 1
    fi
}

# Safely remove only 8WHIE KaliDroid created files
cleanup_kalidroid_files() {
    log_step "Initiating safe removal of 8WHIE KaliDroid created files..."

    # Remove launchers in $PREFIX/bin
    local launchers=("kalidroid" "kalidroid-cli" "kalidroid-gui" "kalidroid-ssh" "nh-kex-start" "nh-kex-stop")
    for launcher in "${launchers[@]}"; do
        if [ -f "${TERMUX_PREFIX}/bin/${launcher}" ]; then
            rm -f "${TERMUX_PREFIX}/bin/${launcher}"
            log_info "Removed launcher: ${TERMUX_PREFIX}/bin/${launcher}"
        fi
    done

    # Remove project internal storage folder
    if [ -d "${KALIDROID_ROOT}" ]; then
        rm -rf "${KALIDROID_ROOT}"
        log_info "Removed directory: ${KALIDROID_ROOT}"
    fi

    log_success "8WHIE KaliDroid configuration and launchers removed cleanly."
}
