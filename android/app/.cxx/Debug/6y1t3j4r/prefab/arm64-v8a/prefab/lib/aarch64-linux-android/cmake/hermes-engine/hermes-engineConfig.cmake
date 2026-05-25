if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "C:/Users/PWT 01/.gradle/caches/8.11.1/transforms/1de224860e0272a44301c6bf102a14ef/transformed/jetified-hermes-android-0.77.2-debug/prefab/modules/libhermes/libs/android.arm64-v8a/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "C:/Users/PWT 01/.gradle/caches/8.11.1/transforms/1de224860e0272a44301c6bf102a14ef/transformed/jetified-hermes-android-0.77.2-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

