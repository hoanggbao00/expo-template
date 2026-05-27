#!/bin/bash
set -e

echo "🚀 Setup Expo Dev Container..."

# 0. Configure Intel architecture for Rosetta Apple Silicon to run Android SDK
echo "🧠 Configuring Intel architecture for Apple Silicon..."
sudo dpkg --add-architecture amd64
sudo apt-get update
sudo apt-get install -y libc6:amd64 libstdc++6:amd64 zlib1g:amd64

# 1. Handle volume permissions
fix_perms_once() {
    local dir="$1"
    local marker="${dir}/.perms-fixed-by-devcontainer"

    sudo mkdir -p "$dir" # ensure the directory exists

    # If we've already fixed this directory in a previous run, skip expensive recursion.
    if [ -f "$marker" ]; then
        return 0
    fi

    if [ "$(stat -c '%u' "$dir")" != "1000" ]; then
        echo "🔧 Fixing permissions for $dir..."
        sudo chown -R node:node "$dir"
    fi

    # Mark as fixed (even if already correct) to avoid re-walking on every rebuild.
    sudo touch "$marker" || true
    sudo chown node:node "$marker" 2>/dev/null || true
}

for dir in "/home/node/.gradle" "/home/node/.bun" "/home/node/.android" "$(pwd)/node_modules"; do
    fix_perms_once "$dir"
done

# Android SDK/NDK (installed by devcontainer feature) lives here in this repo.
# Gradle needs to be able to write (e.g. install NDK side-by-side, create install props).
for dir in "/usr/local/android" "/usr/local/android/licenses" "/usr/local/android/ndk"; do
    if [ -d "$dir" ]; then
        fix_perms_once "$dir"
    fi
done

# 2. Install Bun if not installed
if ! command -v bun &> /dev/null; then
    echo "📦 Installing Bun..."
    curl -fsSL https://bun.sh/install | bash -s "bun-v1.3.11"
    sudo ln -s /home/node/.bun/bin/bun /usr/local/bin/bun
    sudo ln -s /home/node/.bun/bin/bun /usr/local/bin/b
fi

# Bun-installed CLIs (including tsgo) live here.
export PATH="/home/node/.bun/bin:$PATH"

# 3. Install tsgo (TypeScript native preview) globally
if ! command -v tsgo &> /dev/null; then
    echo "🧩 Installing tsgo (via @typescript/native-preview)..."
    bun add -g @typescript/native-preview
fi

# Ensure tsgo is accessible even if PATH is customized elsewhere.
if [ -f "/home/node/.bun/bin/tsgo" ] && [ ! -L "/usr/local/bin/tsgo" ]; then
    sudo ln -s /home/node/.bun/bin/tsgo /usr/local/bin/tsgo
fi

# 3. Create ADB Wrapper to 'trick' Expo CLI to identify Emulator from Mac
# Feature android-sdk is usually installed in /usr/local/sdk
ADB_PATH="/usr/local/android/platform-tools/adb"
if [ -f "$ADB_PATH" ] && [ ! -f "${ADB_PATH}-real" ]; then
    echo "🛠 Configuring ADB Wrapper..."
    sudo mv "$ADB_PATH" "${ADB_PATH}-real"
    sudo bash -c "cat > $ADB_PATH" <<EOF
#!/bin/bash
if [[ "\$*" == *"emu avd name"* ]]; then
  echo "Mac_Emulator"
  echo "OK"
  exit 0
fi
exec ${ADB_PATH}-real "\$@"
EOF
    sudo chmod +x "$ADB_PATH"
fi

# 4. Install dependencies using Bun
echo "🚚 Installing dependencies using Bun..."
bun install

echo "✅ Done! Happy coding!"