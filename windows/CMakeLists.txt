cmake_minimum_required(VERSION 3.10)
project(GMTSSS_Windows)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(GMTSSS_Windows WIN32 src/main.cpp)

target_link_libraries(GMTSSS_Windows PRIVATE user32 gdi32 shell32)
