#!/usr/bin/env bash
# Updater script for 8WHIE KaliDroid
# Developer: 8WHIE (https://github.com/8whie)
# License: MIT

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./config/config.sh
source "${SCRIPT_DIR}/config/config.sh"
# shellcheck source=./lib/ui.sh
source "${SCRIPT_DIR}/lib/ui.sh"
# shellcheck source=./lib/utils.sh
source "${SCRIPT_DIR}/lib/utils.sh"

setup_signal_traps

print_banner
printf "%b%b=== VERSION & UPDATE CHECK ===%b\n\n" "${COLOR_BOLD}" "${COLOR_CYAN}" "${COLOR_RESET}"

log_info "Current Version: v${APP_VERSION}"
log_info "Official Repository: ${APP_REPO}"

if [ -d "${SCRIPT_DIR}/.git" ] && command -v git >/dev/null 2>&1; then
    log_step "Querying remote Git repository for latest updates..."
    cd "${SCRIPT_DIR}"

    # Fetch updates from origin
    git fetch origin main --quiet 2>/dev/null || git fetch origin master --quiet 2>/dev/null || {
        log_warn "Could not connect to GitHub remote. Verify network connection."
        press_enter_to_continue
        exit 1
    }

    LOCAL_HASH=$(git rev-parse HEAD 2>/dev/null)
    REMOTE_HASH=$(git rev-parse '@{u}' 2>/dev/null || true)

    if [ -z "${REMOTE_HASH}" ]; then
        log_warn "No upstream branch configured. Run: git pull origin main"
    elif [ "${LOCAL_HASH}" = "${REMOTE_HASH}" ]; then
        log_success "8WHIE KaliDroid is already at the latest version!"
    else
        log_warn "A newer update is available on GitHub."
        if confirm_prompt "Would you like to pull the latest changes now?" "Y"; then
            git pull --ff-only
            chmod +x "${SCRIPT_DIR}/install.sh" "${SCRIPT_DIR}/uninstall.sh" "${SCRIPT_DIR}/update.sh"
            log_success "Successfully updated 8WHIE KaliDroid!"
        fi
    fi
else
    log_info "Git metadata not found in this folder."
    printf "To update 8WHIE KaliDroid, you can run:\n"
    printf "  %bcurl -fsSL https://raw.githubusercontent.com/8whie/8whie-kalidroid/main/install.sh | bash%b\n\n" "${COLOR_CYAN}" "${COLOR_RESET}"
fi

press_enter_to_continue
