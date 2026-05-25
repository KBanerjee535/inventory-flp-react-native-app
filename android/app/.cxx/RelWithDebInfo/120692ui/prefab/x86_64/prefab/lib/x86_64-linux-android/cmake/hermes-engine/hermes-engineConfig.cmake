if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "/Users/pwp/.gradle/caches/8.11.1/transforms/a35c3a1e57c1819ea4c0e55a43cb25d7/transformed/jetified-hermes-android-0.77.0-release/prefab/modules/libhermes/libs/android.x86_64/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/pwp/.gradle/caches/8.11.1/transforms/a35c3a1e57c1819ea4c0e55a43cb25d7/transformed/jetified-hermes-android-0.77.0-release/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

