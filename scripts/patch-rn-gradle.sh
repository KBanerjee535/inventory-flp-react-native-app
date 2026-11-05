#!/bin/bash
# Patch React Native Gradle Plugin to work with JDK 17
# 1. Remove foojay-resolver-convention (tries to download JetBrains JDK 21)
# 2. Downgrade Kotlin from 2.0.21 to 1.9.24 (Kotlin 2.0.21 requires JDK 21)

set -e

SETTINGS_FILE="node_modules/@react-native/gradle-plugin/settings.gradle.kts"
VERSIONS_FILE="node_modules/@react-native/gradle-plugin/gradle/libs.versions.toml"

if [ -f "$SETTINGS_FILE" ]; then
    sed -i '' '/foojay/d' "$SETTINGS_FILE"
    echo "[patch] Removed foojay from $SETTINGS_FILE"
fi

if [ -f "$VERSIONS_FILE" ]; then
    python3 -c "
p = '$VERSIONS_FILE'
with open(p) as f: c = f.read()
c = c.replace('kotlin = \"2.0.21\"', 'kotlin = \"1.9.24\"')
with open(p, 'w') as f: f.write(c)
"
    echo "[patch] Downgraded Kotlin to 1.9.24 in $VERSIONS_FILE"
fi

echo "[patch] RN Gradle Plugin patched successfully"
