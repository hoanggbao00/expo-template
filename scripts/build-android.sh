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
KEYSTORE_FILE_NAME="release.keystore"
KEYSTORE_ALIAS="hoanggbao.alias"
KEYSTORE_PASS="hoanggbao00"

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

CLI_APP_VARIANT="${APP_VARIANT:-}"

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
fi

if [ -n "$CLI_APP_VARIANT" ]; then
  export APP_VARIANT="$CLI_APP_VARIANT"
else
  export APP_VARIANT="${APP_VARIANT:-development}"
fi
export NODE_ENV="production"

read_package_json_field() {
  bun -e "const fs=require('fs'); const p=require('path').join(process.argv[1], 'package.json'); const field=process.argv[2]; const v=JSON.parse(fs.readFileSync(p,'utf8'))[field]; if(v===undefined||v===null||v==='') process.exit(2); process.stdout.write(String(v));" "$ROOT_DIR" "$1"
}

read_app_config_field() {
  bun -e "import config from './app.config.ts'; const mode=process.argv[1]; const name=config.name; if(!name) process.exit(2); if(mode==='display') { process.stdout.write(name); } else { const pascal=name.split(/[\\s\\-_]+/).filter(Boolean).map((w)=>w.charAt(0).toUpperCase()+w.slice(1).toLowerCase()).join(''); if(!pascal) process.exit(2); process.stdout.write(pascal); }" "$1"
}

APP_DISPLAY_NAME="$(cd "$ROOT_DIR" && read_app_config_field display)" || {
  echo -e "${RED}❌ Error: Could not read app name from $ROOT_DIR/app.config.ts${NC}"
  exit 1
}

APP_NAME="$(cd "$ROOT_DIR" && read_app_config_field pascal)" || {
  echo -e "${RED}❌ Error: Could not read app name from $ROOT_DIR/app.config.ts${NC}"
  exit 1
}

APP_VERSION="$(read_package_json_field androidVersion)" || {
  echo -e "${RED}❌ Error: Could not read androidVersion from $ROOT_DIR/package.json${NC}"
  exit 1
}

APP_VERSION_CODE="$(read_package_json_field androidVersionCode)" || {
  echo -e "${RED}❌ Error: Could not read androidVersionCode from $ROOT_DIR/package.json${NC}"
  exit 1
}

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
GRADLE_PROPERTIES_FILE="$ANDROID_DIR/gradle.properties"

detect_total_memory_mb() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sysctl -n hw.memsize 2>/dev/null | awk '{ print int($1 / 1024 / 1024) }'
        return
    fi

    if command -v free >/dev/null 2>&1; then
        free -m 2>/dev/null | awk '/^Mem:/ { print $2 }'
        return
    fi

    echo ""
}

choose_gradle_jvm_args() {
    local memory_mb="$1"

    if [ -n "${GRADLE_JVM_ARGS:-}" ]; then
        printf '%s' "$GRADLE_JVM_ARGS"
        return
    fi

    if [ -z "$memory_mb" ]; then
        printf '%s' '-Xmx3072m -XX:MaxMetaspaceSize=768m'
        return
    fi

    if [ "$memory_mb" -ge 32768 ]; then
        printf '%s' '-Xmx6144m -XX:MaxMetaspaceSize=1024m'
    elif [ "$memory_mb" -ge 16384 ]; then
        printf '%s' '-Xmx4096m -XX:MaxMetaspaceSize=1024m'
    elif [ "$memory_mb" -ge 8192 ]; then
        printf '%s' '-Xmx3072m -XX:MaxMetaspaceSize=768m'
    else
        printf '%s' '-Xmx2048m -XX:MaxMetaspaceSize=512m'
    fi
}

TOTAL_MEMORY_MB="$(detect_total_memory_mb)"
GRADLE_JVM_ARGS="$(choose_gradle_jvm_args "$TOTAL_MEMORY_MB")"

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
echo -e "📱 App Name   : ${CYAN}$APP_DISPLAY_NAME${NC}"
echo -e "🏷️  Variant    : ${CYAN}$APP_VARIANT${NC}"
echo -e "📦 Build Type : ${CYAN}$BUILD_FORMAT${NC}"
echo -e "📄 Output     : $FINAL_FILENAME"
echo -e "🔢 App Version: ${CYAN}$APP_VERSION ($APP_VERSION_CODE)${NC}"
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
APP_VARIANT="$APP_VARIANT" bun expo prebuild --platform android --no-clean
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

echo -n -e "${CYAN}1️⃣  Step 1.5/5: Applying Gradle heap settings... ${NC}"
if [ -f "$GRADLE_PROPERTIES_FILE" ]; then
    if grep -q '^org.gradle.jvmargs=' "$GRADLE_PROPERTIES_FILE"; then
        perl -0pi -e "s/^org\\.gradle\\.jvmargs=.*/org.gradle.jvmargs=${GRADLE_JVM_ARGS}/m" "$GRADLE_PROPERTIES_FILE"
    else
        printf '\norg.gradle.jvmargs=%s\n' "$GRADLE_JVM_ARGS" >> "$GRADLE_PROPERTIES_FILE"
    fi
    echo -e "${GREEN}DONE${NC}"
else
    echo -e "${RED}FAILED${NC}"
    echo -e "${RED}❌ Error: $GRADLE_PROPERTIES_FILE not found after prebuild.${NC}"
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
