// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod handlers;
use crate::handlers::handlers as Handlers;
use tauri_plugin_printer;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_printer::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            Handlers::close_splashscreen,
            Handlers::show_splashscreen,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
