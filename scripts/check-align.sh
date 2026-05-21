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

# Đường dẫn đến llvm-objdump trong Android NDK (cần thay đúng theo SDK của bạn)
OBJDUMP="${OBJDUMP:-$HOME/Library/Android/sdk/ndk/27.1.12297006/toolchains/llvm/prebuilt/darwin-x86_64/bin/llvm-objdump}"

if [ "$VERBOSE" -eq 1 ]; then
  echo "Đang kiểm tra 16 KB Android Page Size..."
fi

if [ ! -f "$OBJDUMP" ]; then
  {
    echo "=== check_align $(date) ==="
    echo "❌ llvm-objdump không tồn tại tại $OBJDUMP"
  } >"$LOG_FILE"
  echo "❌ llvm-objdump không tồn tại."
  echo "Chi tiết: $LOG_FILE"
  exit 1
fi

so_count=0
bad_libs=()

unzip -o "$ARTIFACT_PATH" -d "$UNZIP_DIR" >/dev/null 2>&1

{
  echo "=== check_align $(date) ==="
  echo "Artifact: $ARTIFACT_PATH"
  echo "LOG: $LOG_FILE"
  echo ""

  echo "--- Tìm tất cả .so files trong thư mục ---"
  while IFS= read -r sofile; do
    echo "🔍 Checking: $sofile"
    dump="$($OBJDUMP -p "$sofile" | grep LOAD | grep align)"
    echo "$dump"
    if echo "$dump" | grep -Fq 'align 2**12'; then
      bad_libs+=("$sofile")
    fi
    echo "------------------------------"
    so_count=$((so_count + 1))
  done < <(find "$UNZIP_DIR" -type f -name "*.so" 2>/dev/null)

  echo ""
  echo "--- Kết quả (chi tiết) ---"
  if [ "$so_count" -eq 0 ]; then
    echo "❌ Không tìm thấy file .so nào trong $UNZIP_DIR"
  elif [ "${#bad_libs[@]}" -gt 0 ]; then
    echo "❌ Các thư viện sau chưa hỗ trợ 16 KB (LOAD segment còn align 2**12 / 4 KB):"
    for lib in "${bad_libs[@]}"; do
      echo "   - $lib"
    done
  else
    echo "✅ Không thấy align 2**12 — đã quét $so_count file .so."
  fi
} >"$LOG_FILE" 2>&1

if [ "$so_count" -eq 0 ]; then
  echo "❌ Không tìm thấy file .so."
  echo "Chi tiết: $LOG_FILE"
  exit 1
fi

if [ "${#bad_libs[@]}" -gt 0 ]; then
  echo "❌ Có ${#bad_libs[@]} thư viện chưa hỗ trợ 16 KB."
  for lib in "${bad_libs[@]}"; do
    echo "   - $lib"
  done
  echo "Chi tiết: $LOG_FILE"
  exit 1
fi

if [ "$VERBOSE" -eq 1 ]; then
  echo "✅ Tất cả thư viện đều hỗ trợ 16 KB ($so_count file .so)."
  echo "Chi tiết: $LOG_FILE"
fi

rm -rf "$LOG_FILE"
