#!/bin/bash

# ==============================================================================
# 🤖 ANDROID LOCAL BUILD SCRIPT (Smart Cache & Anti-Lag)
# NOTE: Must `chmod +x scripts/build-android.sh` this script to make it executable
# ==============================================================================
# FEATURES: Smart Caching, Anti-Lag (CPU Limit), Clean Logs, Auto-Signing.
#
# EXAMPLES:
#   1. ./scripts/build-android.sh                (APK)
#   2. ./scripts/build-android.sh --aab          (AAB)
#   3. ./scripts/build-android.sh --apk          (APK)
# ==============================================================================

# =========================================================
# 0. COLORS & SETUP
# =========================================================
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
RED='\033[1;31m'
CYAN='\033[1;36m'
NC='\033[0m'

# =========================================================
# 1. CONFIGURATION
# =========================================================
# Keystore Configuration
APP_NAME="MyApp"

KEYSTORE_FILE_NAME="release.keystore"
KEYSTORE_ALIAS="hoanggbao.myapp.alias"
KEYSTORE_PASS="hoanggbao@password@myapp@123"

KEY_ALG="RSA"
KEY_SIZE=2048
KEY_VALIDITY=10000
KEY_DNAME="CN=Hoang Bao, OU=Personal, O=Personal, L=Bac Ninh, S=Bac Ninh, C=VN"

# Directories
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
ANDROID_DIR="$ROOT_DIR/android"
APP_DIR="$ANDROID_DIR/app"
SOURCE_KEYSTORE="$ROOT_DIR/$KEYSTORE_FILE_NAME"
DEST_KEYSTORE="$APP_DIR/$KEYSTORE_FILE_NAME"

# Sentry release string for native builds (Gradle / Sentry tooling)
# Example: SENTRY_RELEASE="app@1.0.0" (prefix defaults to "app", override with SENTRY_RELEASE_PREFIX)
NATIVE_VERSION="$(
  node -e "const fs=require('fs'); const p=require('path').join(process.argv[1], 'package.json'); const v=JSON.parse(fs.readFileSync(p,'utf8')).version; if(!v) process.exit(2); process.stdout.write(v);" "$ROOT_DIR"
)" || {
  echo -e "${RED}❌ Error: Could not read version from $ROOT_DIR/package.json${NC}"
  exit 1
}

SENTRY_RELEASE_PREFIX="${SENTRY_RELEASE_PREFIX:-app}"
if [ -z "${SENTRY_RELEASE:-}" ]; then
  export SENTRY_RELEASE="${SENTRY_RELEASE_PREFIX}@${NATIVE_VERSION}"
fi

# Force prod-only builds
export NODE_ENV="production"
export EXPO_PUBLIC_ENVIRONMENT="prod"

ENV_FILE=""

if [ -f "$ROOT_DIR/.env.production.local" ]; then
  ENV_FILE="$ROOT_DIR/.env.production.local"
elif [ -f "$ROOT_DIR/.env.local" ]; then
  ENV_FILE="$ROOT_DIR/.env.local"
fi
if [ -n "$ENV_FILE" ]; then
  set -a
  source "$ENV_FILE"
  set +a
else
  echo -e "${YELLOW}no .env.(production).local found ignore...${NC}"
fi

# =========================================================
# 2. ARGUMENT PARSING
# =========================================================
BUILD_FORMAT="apk"

while [[ "$#" -gt 0 ]]; do
    case $1 in
        --aab) BUILD_FORMAT="aab"; shift ;;
        --apk) BUILD_FORMAT="apk"; shift ;;
        *) echo -e "${RED}❌ Error: Unknown argument: $1${NC}"; exit 1 ;;
    esac
done

BUILD_LOG_FILE="$ANDROID_DIR/android_build.log"

if [ "$BUILD_FORMAT" == "aab" ]; then
    GRADLE_TASK="bundleRelease"
    OUTPUT_EXT="aab"
    INTERNAL_OUTPUT_PATH="$APP_DIR/build/outputs/bundle/release"
else
    GRADLE_TASK="assembleRelease"
    OUTPUT_EXT="apk"
    INTERNAL_OUTPUT_PATH="$APP_DIR/build/outputs/apk/release"
fi

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
FINAL_FILENAME="${APP_NAME}-${TIMESTAMP}.${OUTPUT_EXT}"
DEST_FILE="$ROOT_DIR/$FINAL_FILENAME"

# =========================================================
# 4. SUMMARY
# =========================================================
echo ""
echo -e "${GREEN}==========================================${NC}"
echo -e "${GREEN}📋 BUILD SUMMARY${NC}"
echo -e "${GREEN}==========================================${NC}"
echo -e "📂 Target Dir : ${CYAN}$ANDROID_DIR${NC}"
echo -e "📦 Build Type : ${CYAN}$BUILD_FORMAT${NC}"
echo -e "📄 Output     : $FINAL_FILENAME"
echo -e "🧷 Sentry Rel : ${CYAN}$SENTRY_RELEASE${NC}"
echo -e "${GREEN}==========================================${NC}"
echo ""

read -p "👉 Press [Enter] to start..."
echo ""

# =========================================================
# 5. EXECUTION
# =========================================================

# Ensure we are at the ROOT of the project
cd "$ROOT_DIR"

echo -e "${CYAN}1️⃣  Step 1/5: Running Expo prebuild (Android)... ${NC}"
bun prebuild:android
PREBUILD_STATUS=$?

if [ $PREBUILD_STATUS -ne 0 ]; then
    echo -e "${RED}❌ Expo prebuild failed.${NC}"
    exit 1
fi

# Verify prebuild output exists
if [ ! -d "$ANDROID_DIR" ] || [ ! -d "$APP_DIR" ]; then
    echo -e "${RED}❌ Error: Android native project not found after prebuild.${NC}"
    exit 1
fi

echo -n -e "${CYAN}2️⃣  Step 2/5: Checking Keystore... ${NC}"
if [ ! -f "$SOURCE_KEYSTORE" ]; then
    keytool -genkey -v -keystore "$SOURCE_KEYSTORE" -alias "$KEYSTORE_ALIAS" -keyalg "$KEY_ALG" -keysize "$KEY_SIZE" -validity "$KEY_VALIDITY" -storepass "$KEYSTORE_PASS" -keypass "$KEYSTORE_PASS" -dname "$KEY_DNAME" > /dev/null 2>&1
    echo ""
    echo -e "${GREEN}Keystore generated successfully${NC}"
fi
cp -f "$SOURCE_KEYSTORE" "$DEST_KEYSTORE"
echo -e "${GREEN}DONE${NC}"

# Enter Android project and build
echo -e "${CYAN}3️⃣  Step 3/5: Compiling Native Code in $ANDROID_DIR... ${NC}"
cd "$ANDROID_DIR"

# Define CMD_PREFIX based on OS -> Limit cpu usage to not freeze the machine
CMD_PREFIX=""

if [[ "$OSTYPE" == "darwin"* ]]; then
    TOTAL_CORES=$(sysctl -n hw.ncpu)
    CMD_PREFIX="nice -n 10"
else
    TOTAL_CORES=$(nproc)
    CMD_PREFIX="nice -n 19 ionice -c 3"
fi

MAX_WORKERS=$((TOTAL_CORES - 2))
[ "$MAX_WORKERS" -lt 1 ] && MAX_WORKERS=1

set -o pipefail

# ⚡ LIVE LOGGING: Tee directly to android/
$CMD_PREFIX ./gradlew $GRADLE_TASK \
    --max-workers=$MAX_WORKERS \
    --build-cache \
    --configure-on-demand \
    --console=plain \
    -Pandroid.injected.signing.store.file=$DEST_KEYSTORE \
    -Pandroid.injected.signing.store.password=$KEYSTORE_PASS \
    -Pandroid.injected.signing.key.alias=$KEYSTORE_ALIAS \
    -Pandroid.injected.signing.key.password=$KEYSTORE_PASS 2>&1 \
    | tee "$BUILD_LOG_FILE" \
    | grep --line-buffered -E "^> Task|BUILD|FAILURE"

BUILD_STATUS=$?

echo "---------------------------------------------------------"

if [ $BUILD_STATUS -eq 0 ]; then
    echo -e "    ${GREEN}✅ Gradle Build Finished.${NC}"
    rm "$BUILD_LOG_FILE" # Remove log inside android/
else
    echo -e "    ${RED}❌ Gradle Build Failed!${NC}"
    echo "    Check full logs at: $BUILD_LOG_FILE"
    exit 1
fi

# --- STEP 3 ---
echo -n -e "${CYAN}4️⃣  Step 4/5: Moving Artifact... ${NC}"
SOURCE_FILE="$INTERNAL_OUTPUT_PATH/app-release.$OUTPUT_EXT"
if [ -f "$SOURCE_FILE" ]; then
    mv "$SOURCE_FILE" "$DEST_FILE"
    echo -e "${GREEN}DONE${NC}"

    echo -e "${CYAN}5️⃣  Step 5/5: 16 KB native alignment (check-align)${NC}"
    CHECK_ALIGN_SCRIPT="$SCRIPT_DIR/check-align.sh"
    if [ ! -f "$CHECK_ALIGN_SCRIPT" ]; then
        echo -e "${YELLOW}⚠️  SKIP — check-align.sh not found${NC}"
    else
        if ! bash "$CHECK_ALIGN_SCRIPT" "$DEST_FILE"; then
            echo -e "${RED}❌ Build stopped: 16 KB alignment check failed.${NC}"
            exit 1
        fi
    fi

    echo ""
    echo -e "${GREEN}==========================================${NC}"
    echo -e "${GREEN}🎉 BUILD SUCCESSFUL!${NC}"
    echo -e "📂 Output: ${CYAN}$FINAL_FILENAME${NC}"
    echo -e "📍 Path  : ${CYAN}$DEST_FILE${NC}"
    echo -e "💾 16KB  : ${CYAN}All Supported${NC}"
    echo -e "${GREEN}==========================================${NC}"
else
    echo -e "${RED}FAILED (File not found)${NC}"
    exit 1
fi
