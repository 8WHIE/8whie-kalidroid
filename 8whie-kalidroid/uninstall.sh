#!/usr/bin/env bash
# Uninstaller for 8WHIE KaliDroid
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
printf "%b%b=== UNINSTALLATION & CLEANUP ===%b\n\n" "${COLOR_BOLD}" "${COLOR_RED}" "${COLOR_RESET}"

print_info_box "Safe Removal Notice" \
    "8WHIE KaliDroid respects your system and privacy." \
    "This uninstaller will ONLY remove files and shortcuts created by this project:" \
    "  • Global CLI shortcuts (${TERMUX_PREFIX}/bin/kalidroid*)" \
    "  • Internal config directory (${KALIDROID_ROOT})" \
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
    printf "\n"
    log_info "Checking for proot-distro Kali containers..."
    containers=("kali-light" "kali-desktop" "kali-ssh")
    installed_containers=()

    for c in "${containers[@]}"; do
        if proot-distro list 2>/dev/null | grep -q "${c}"; then
            installed_containers+=("${c}")
        fi
    done

    if [ "${#installed_containers[@]}" -gt 0 ]; then
        log_warn "Detected the following containers: ${installed_containers[*]}"
        if confirm_prompt "Do you also want to remove these proot containers to reclaim storage?" "N"; then
            for c in "${installed_containers[@]}"; do
                log_step "Removing container '${c}'..."
                proot-distro remove "${c}" || log_warn "Could not remove ${c}"
            done
            log_success "Proot containers cleaned up."
        else
            log_info "Containers preserved. You can delete them anytime with: proot-distro remove <name>"
        fi
    fi
fi

printf "\n%b8WHIE KaliDroid has been uninstalled successfully.%b\n" "${COLOR_GREEN}${COLOR_BOLD}" "${COLOR_RESET}"
printf "%bThank you for using our project! — 8WHIE%b\n\n" "${COLOR_CYAN}" "${COLOR_RESET}"
press_enter_to_continue
