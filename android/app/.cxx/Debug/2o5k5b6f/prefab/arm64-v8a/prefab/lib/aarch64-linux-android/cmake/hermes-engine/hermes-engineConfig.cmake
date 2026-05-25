if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "C:/Users/PWT 01/.gradle/caches/8.11.1/transforms/f215980e5c99621e5a5e54e408725d41/transformed/jetified-hermes-android-0.78.0-debug/prefab/modules/libhermes/libs/android.arm64-v8a/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "C:/Users/PWT 01/.gradle/caches/8.11.1/transforms/f215980e5c99621e5a5e54e408725d41/transformed/jetified-hermes-android-0.78.0-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

