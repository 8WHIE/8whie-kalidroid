#!/usr/bin/env bash
# ==============================================================================
# 8WHIE KaliDroid - Android Termux Kali Linux Installer
# Developer: 8WHIE (https://github.com/8whie)
# Socials: YouTube: 8WHIE | Telegram: @Arnxkt | Channel: https://t.me/whiee | IG: @aaynkt
# License: MIT
# ==============================================================================

set -uo pipefail

# Determine script root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Source submodules
# shellcheck source=./config/config.sh
source "${SCRIPT_DIR}/config/config.sh"
# shellcheck source=./lib/ui.sh
source "${SCRIPT_DIR}/lib/ui.sh"
# shellcheck source=./lib/checks.sh
source "${SCRIPT_DIR}/lib/checks.sh"
# shellcheck source=./lib/utils.sh
source "${SCRIPT_DIR}/lib/utils.sh"
# shellcheck source=./lib/kali.sh
source "${SCRIPT_DIR}/lib/kali.sh"

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

Developer: ${APP_AUTHOR}
Repository: ${APP_REPO}
EOF
}

# Main interactive workflow
main_menu_loop() {
    setup_signal_traps
    init_directories
    create_symlinks

    while true; do
        show_main_menu
        printf "%bSelect an option [0-8]: %b" "${COLOR_CYAN}${COLOR_BOLD}" "${COLOR_RESET}"
        read -r choice

        case "${choice}" in
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
                bash "${SCRIPT_DIR}/uninstall.sh"
                ;;
            7)
                bash "${SCRIPT_DIR}/update.sh"
                ;;
            8)
                print_banner
                print_info_box "About 8WHIE KaliDroid" \
                    "Project: ${APP_NAME} v${APP_VERSION}" \
                    "Author / Developer: ${APP_AUTHOR}" \
                    "GitHub: ${APP_REPO}" \
                    "Telegram Channel: ${APP_TG_CHANNEL}" \
                    "Telegram Contact: ${APP_TG_CONTACT}" \
                    "Instagram: ${APP_IG_CONTACT}" \
                    "YouTube: ${APP_YT_CHANNEL}" \
                    "Documentation: docs/troubleshooting.md" \
                    "License: MIT (Free and Open-Source Software)"
                press_enter_to_continue
                ;;
            0|q|Q|exit)
                printf "\n%bThank you for using %s! Stay curious, stay ethical.%b\n\n" "${COLOR_CYAN}" "${APP_NAME}" "${COLOR_RESET}"
                exit 0
                ;;
            *)
                log_warn "Invalid selection '${choice}'. Please enter a number between 0 and 8."
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

    local action="${1:-menu}"

    case "${action}" in
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
            bash "${SCRIPT_DIR}/uninstall.sh"
            exit 0
            ;;
        --update)
            setup_signal_traps
            bash "${SCRIPT_DIR}/update.sh"
            exit 0
            ;;
        menu|*)
            main_menu_loop
            ;;
    esac
}

main "$@"
