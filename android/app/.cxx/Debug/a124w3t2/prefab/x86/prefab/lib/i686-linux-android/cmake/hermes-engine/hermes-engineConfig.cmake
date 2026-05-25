if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "/Users/pwp/.gradle/caches/8.11.1/transforms/87faa63fa8b9a55dc829480864319287/transformed/jetified-hermes-android-0.77.0-debug/prefab/modules/libhermes/libs/android.x86/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/pwp/.gradle/caches/8.11.1/transforms/87faa63fa8b9a55dc829480864319287/transformed/jetified-hermes-android-0.77.0-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

