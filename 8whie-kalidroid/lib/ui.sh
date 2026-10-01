#!/usr/bin/env bash
# UI and Terminal Output Module for 8WHIE KaliDroid
# Developer: 8WHIE (https://github.com/8whie)
# License: MIT

# Source config if not already loaded
if [ -z "${APP_NAME:-}" ]; then
    # shellcheck source=../config/config.sh
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    source "${SCRIPT_DIR}/../config/config.sh"
fi

# Print original 8WHIE ASCII banner
print_banner() {
    clear
    printf "%b" "${COLOR_CYAN}${COLOR_BOLD}"
    cat << "EOF"
  ██████╗ ██╗    ██╗██╗  ██╗██╗███████╗
 ██╔════╝ ██║    ██║██║  ██║██║██╔════╝
 ╚█████╗  ██║ █╗ ██║███████║██║█████╗  
  ╚═══██╗ ██║███╗██║██╔══██║██║██╔══╝  
 ██████╔╝ ╚███╔███╔╝██║  ██║██║███████╗
 ╚═════╝   ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝╚══════╝
EOF
    printf "%b\n" "${COLOR_RESET}"
    printf "%b" "${COLOR_BOLD}${COLOR_WHITE}       8WHIE KaliDroid ${COLOR_CYAN}v${APP_VERSION}${COLOR_RESET}\n"
    printf "%b" "${COLOR_YELLOW}  ${APP_TAGLINE}${COLOR_RESET}\n"
    printf "%b" "${COLOR_GRAY}     Developed with pride by ${COLOR_BOLD}${COLOR_WHITE}${APP_AUTHOR}${COLOR_RESET}\n"
    printf "%b\n" "${COLOR_CYAN}───────────────────────────────────────────────────${COLOR_RESET}"
}

# Logging helpers
log_info() {
    printf "%b [INFO] %b%s%b\n" "${COLOR_CYAN}" "${COLOR_WHITE}" "$*" "${COLOR_RESET}"
}

log_step() {
    printf "%b [STEP] %b%s%b\n" "${COLOR_BLUE}${COLOR_BOLD}" "${COLOR_WHITE}" "$*" "${COLOR_RESET}"
}

log_success() {
    printf "%b [ OK ] %b%s%b\n" "${COLOR_GREEN}${COLOR_BOLD}" "${COLOR_GREEN}" "$*" "${COLOR_RESET}"
}

log_warn() {
    printf "%b [WARN] %b%s%b\n" "${COLOR_YELLOW}${COLOR_BOLD}" "${COLOR_YELLOW}" "$*" "${COLOR_RESET}"
}

log_error() {
    printf "%b [FAIL] %b%s%b\n" "${COLOR_RED}${COLOR_BOLD}" "${COLOR_RED}" "$*" "${COLOR_RESET}" >&2
}

# Print horizontal divider
print_divider() {
    printf "%b%s%b\n" "${COLOR_GRAY}" "───────────────────────────────────────────────────" "${COLOR_RESET}"
}

# Display a highlighted information panel
print_info_box() {
    local title="$1"
    shift
    printf "\n%b┌── [ %b%s%b ] %s\n" "${COLOR_CYAN}" "${COLOR_BOLD}${COLOR_WHITE}" "${title}" "${COLOR_CYAN}" "───────────────────────────────────"
    while [ "$#" -gt 0 ]; do
        printf "│ %b%s%b\n" "${COLOR_WHITE}" "$1" "${COLOR_RESET}"
        shift
    done
    printf "%b└──%s%b\n\n" "${COLOR_CYAN}" "───────────────────────────────────────────────────────" "${COLOR_RESET}"
}

# Display warning panel
print_warning_box() {
    local title="$1"
    shift
    printf "\n%b┌── [ %b%s%b ] %s\n" "${COLOR_YELLOW}" "${COLOR_BOLD}${COLOR_RED}" "${title}" "${COLOR_YELLOW}" "───────────────────────────────────"
    while [ "$#" -gt 0 ]; do
        printf "%b│%b %s\n" "${COLOR_YELLOW}" "${COLOR_WHITE}" "$1"
        shift
    done
    printf "%b└──%s%b\n\n" "${COLOR_YELLOW}" "───────────────────────────────────────────────────────" "${COLOR_RESET}"
}

# Prompt user for confirmation (Y/N)
confirm_prompt() {
    local prompt_msg="$1"
    local default_choice="${2:-Y}"
    local response

    if [ "${default_choice}" = "Y" ]; then
        local hint="[Y/n]"
    else
        local hint="[y/N]"
    fi

    printf "%b%s %s: %b" "${COLOR_YELLOW}${COLOR_BOLD}" "${prompt_msg}" "${hint}" "${COLOR_RESET}"
    read -r response
    response="${response:-${default_choice}}"

    case "${response}" in
        [yY]|[yY][eE][sS])
            return 0
            ;;
        *)
            return 1
            ;;
    esac
}

# Prompt for keypress to return to menu
press_enter_to_continue() {
    printf "\n%bPress %b[Enter]%b to return to main menu...%b" "${COLOR_GRAY}" "${COLOR_WHITE}${COLOR_BOLD}" "${COLOR_GRAY}" "${COLOR_RESET}"
    read -r _
}

# Show interactive menu options
show_main_menu() {
    print_banner
    printf "%b%b  INSTALLATION CHOICES:%b\n" "${COLOR_BOLD}" "${COLOR_WHITE}" "${COLOR_RESET}"
    printf "  %b[1]%b Kali NetHunter Rootless  %b(Full Kali Suite via Official Script)%b\n" "${COLOR_GREEN}${COLOR_BOLD}" "${COLOR_RESET}" "${COLOR_GRAY}" "${COLOR_RESET}"
    printf "  %b[2]%b Kali Lightweight CLI      %b(Proot minimal container, fast & clean)%b\n" "${COLOR_CYAN}${COLOR_BOLD}" "${COLOR_RESET}" "${COLOR_GRAY}" "${COLOR_RESET}"
    printf "  %b[3]%b Kali GUI Desktop (XFCE)    %b(Graphical desktop + TigerVNC/KeX)%b\n" "${COLOR_MAGENTA}${COLOR_BOLD}" "${COLOR_RESET}" "${COLOR_GRAY}" "${COLOR_RESET}"
    printf "  %b[4]%b Kali SSH Remote Server     %b(Headless background workspace)%b\n" "${COLOR_BLUE}${COLOR_BOLD}" "${COLOR_RESET}" "${COLOR_GRAY}" "${COLOR_RESET}"
    print_divider
    printf "%b%b  MANAGEMENT & UTILITIES:%b\n" "${COLOR_BOLD}" "${COLOR_WHITE}" "${COLOR_RESET}"
    printf "  %b[5]%b System Pre-Flight Check    %b(Verify dependencies, RAM & storage)%b\n" "${COLOR_YELLOW}${COLOR_BOLD}" "${COLOR_RESET}" "${COLOR_GRAY}" "${COLOR_RESET}"
    printf "  %b[6]%b Uninstall / Cleanup        %b(Safely remove 8WHIE KaliDroid files)%b\n" "${COLOR_RED}${COLOR_BOLD}" "${COLOR_RESET}" "${COLOR_GRAY}" "${COLOR_RESET}"
    printf "  %b[7]%b Check for Updates          %b(Sync latest version from GitHub)%b\n" "${COLOR_WHITE}${COLOR_BOLD}" "${COLOR_RESET}" "${COLOR_GRAY}" "${COLOR_RESET}"
    printf "  %b[8]%b Help & Documentation       %b(Troubleshooting, FAQ & Credits)%b\n" "${COLOR_CYAN}${COLOR_BOLD}" "${COLOR_RESET}" "${COLOR_GRAY}" "${COLOR_RESET}"
    printf "  %b[0]%b Exit%b\n" "${COLOR_DIM}" "${COLOR_RESET}" "${COLOR_RESET}"
    print_divider
}
