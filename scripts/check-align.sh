#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="$SCRIPT_DIR/.check-align.log"

# Usage:
#   ./check-align.sh <path-to.apk|path-to.aab>
#   ./check-align.sh --verbose <path-to.apk|path-to.aab>
VERBOSE=0
if [ "${1:-}" = "--verbose" ]; then
  VERBOSE=1
  shift
fi

ARTIFACT_PATH="${1:-}"

if [ -z "$ARTIFACT_PATH" ] || [ ! -f "$ARTIFACT_PATH" ]; then
  echo "Usage: $0 [--verbose] <path-to.apk|path-to.aab>"
  exit 1
fi

UNZIP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/check_align.XXXXXX")"
cleanup() {
  rm -rf "$UNZIP_DIR"
}
trap cleanup EXIT

ANDROID_SDK_ROOT="${ANDROID_SDK_ROOT:-${ANDROID_HOME:-$HOME/Library/Android/sdk}}"
if [ -z "${OBJDUMP:-}" ]; then
  OBJDUMP="$(find "$ANDROID_SDK_ROOT/ndk" -maxdepth 8 -type f -name 'llvm-objdump' 2>/dev/null | sort -V | tail -n1)"
fi

exec > >(tee "$LOG_FILE") 2>&1

echo "=== check_align $(date) ==="
echo "Artifact: $ARTIFACT_PATH"
echo "Bỏ qua kiến trúc 32-bit: armeabi-v7a, armeabi, x86"

if [ ! -f "$OBJDUMP" ]; then
  echo "❌ llvm-objdump không tồn tại (OBJDUMP=\"$OBJDUMP\")."
  echo "Chi tiết: $LOG_FILE"
  exit 1
fi

so_count=0
skipped_count=0
bad_libs=()

is_32bit_arch_so() {
  case "$1" in
    */lib/armeabi-v7a/* | */lib/armeabi/* | */lib/x86/*) return 0 ;;
    *) return 1 ;;
  esac
}

unzip -o "$ARTIFACT_PATH" -d "$UNZIP_DIR" >/dev/null 2>&1

echo ""
echo "--- Tìm tất cả .so files trong thư mục ---"
while IFS= read -r sofile; do
  if is_32bit_arch_so "$sofile"; then
    echo "⏭️  Bỏ qua (32-bit): $sofile"
    skipped_count=$((skipped_count + 1))
    continue
  fi
  echo "🔍 Checking: $sofile"
  dump="$($OBJDUMP -p "$sofile" | grep LOAD | grep align)"
  if [ "$VERBOSE" -eq 1 ]; then
    echo "$dump"
  fi
  if echo "$dump" | grep -Fq 'align 2**12'; then
    bad_libs+=("$sofile")
    echo "   ❌ FAIL (align 2**12 / 4 KB)"
  else
    echo "   ✅ PASS"
  fi
  so_count=$((so_count + 1))
done < <(find "$UNZIP_DIR" -type f -name "*.so" 2>/dev/null)

echo ""
echo "Chi tiết: $LOG_FILE"

if [ "$so_count" -eq 0 ] && [ "$skipped_count" -eq 0 ]; then
  echo "❌ Không tìm thấy file .so."
  exit 1
fi

if [ "$so_count" -eq 0 ]; then
  echo "✅ Chỉ có thư viện 32-bit ($skipped_count file) — đã bỏ qua, không kiểm tra."
  exit 0
fi

if [ "${#bad_libs[@]}" -gt 0 ]; then
  echo "❌ Có ${#bad_libs[@]} thư viện chưa hỗ trợ 16 KB:"
  for lib in "${bad_libs[@]}"; do
    echo "   - $lib"
  done
  exit 1
fi

echo "✅ Tất cả thư viện 64-bit đều hỗ trợ 16 KB ($so_count file .so, bỏ qua $skipped_count file 32-bit)."
