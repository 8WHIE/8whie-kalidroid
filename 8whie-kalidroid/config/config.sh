# Configuration file for 8WHIE KaliDroid
# Project: 8WHIE KaliDroid
# Developer: 8WHIE (https://github.com/8whie)
# License: MIT

# ==========================================
# Application Identity & Versioning
# ==========================================
APP_NAME="8WHIE KaliDroid"
APP_VERSION="1.0.0"
APP_TAGLINE="Android • Termux • Kali Linux"
APP_AUTHOR="8WHIE"
APP_REPO="https://github.com/8whie/8whie-kalidroid"
APP_TG_CHANNEL="https://t.me/whiee"
APP_TG_CONTACT="@Arnxkt"
APP_IG_CONTACT="@aaynkt"
APP_YT_CHANNEL="8WHIE"

# ==========================================
# Paths & Environments
# ==========================================
# Termux prefix detection
TERMUX_PREFIX="${PREFIX:-/data/data/com.termux/files/usr}"
TERMUX_HOME="${HOME:-/data/data/com.termux/files/home}"
KALIDROID_ROOT="${TERMUX_HOME}/.8whie-kalidroid"
KALIDROID_LOGS="${KALIDROID_ROOT}/logs"
KALIDROID_CONFIG_DIR="${KALIDROID_ROOT}/config"

# Official distribution endpoints
OFFICIAL_NETHUNTER_INSTALLER_URL="https://gitlab.com/kalilinux/nethunter/build-scripts/kali-nethunter-project/-/raw/master/nethunter-rootless/install-nethunter-termux"
OFFICIAL_KALI_DOCS="https://www.kali.org/docs/nethunter/nethunter-rootless/"

# Minimum storage requirements in megabytes
REQ_MB_MINIMAL=2500     # ~2.5 GB for base headless Kali
REQ_MB_GUI=5500         # ~5.5 GB for XFCE Desktop + GUI tools
REQ_MB_NETHUNTER=7500   # ~7.5 GB for full Kali NetHunter Rootless rootfs
REQ_MB_SSH=2600         # ~2.6 GB for SSH-focused headless container

# Default Ports
DEFAULT_VNC_PORT=5901
DEFAULT_SSH_PORT=2022
DEFAULT_VNC_DISPLAY=1
DEFAULT_VNC_GEOMETRY="1280x720"

# ANSI Terminal Colors
if [ -t 1 ]; then
    COLOR_RESET="\033[0m"
    COLOR_BOLD="\033[1m"
    COLOR_DIM="\033[2m"
    COLOR_RED="\033[38;5;196m"
    COLOR_GREEN="\033[38;5;46m"
    COLOR_YELLOW="\033[38;5;220m"
    COLOR_BLUE="\033[38;5;39m"
    COLOR_MAGENTA="\033[38;5;201m"
    COLOR_CYAN="\033[38;5;51m"
    COLOR_GRAY="\033[38;5;244m"
    COLOR_WHITE="\033[38;5;255m"
    COLOR_BG_DARK="\033[48;5;234m"
else
    COLOR_RESET=""
    COLOR_BOLD=""
    COLOR_DIM=""
    COLOR_RED=""
    COLOR_GREEN=""
    COLOR_YELLOW=""
    COLOR_BLUE=""
    COLOR_MAGENTA=""
    COLOR_CYAN=""
    COLOR_GRAY=""
    COLOR_WHITE=""
    COLOR_BG_DARK=""
fi
