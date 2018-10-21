#!/bin/bash

./gradlew ${1:-installDevMinSdkDevKernelDebug} --stacktrace && adb shell am start -n com.molinz.mockgram/host.exp.exponent.MainActivity
