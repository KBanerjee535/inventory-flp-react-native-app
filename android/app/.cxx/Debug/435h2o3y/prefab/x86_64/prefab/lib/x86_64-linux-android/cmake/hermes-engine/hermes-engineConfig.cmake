if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "C:/Users/sumon/.gradle/caches/8.11.1/transforms/f26ded4a0ea8e254c380ba4876219d8c/transformed/jetified-hermes-android-0.77.2-debug/prefab/modules/libhermes/libs/android.x86_64/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "C:/Users/sumon/.gradle/caches/8.11.1/transforms/f26ded4a0ea8e254c380ba4876219d8c/transformed/jetified-hermes-android-0.77.2-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

