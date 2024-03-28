pub mod handlers {
    use tauri::Manager;

    
    

    

    

    #[tauri::command]
    pub async fn close_splashscreen(window: tauri::Window) {
        if let Some(splashscreen) = window.get_window("splash") {
            splashscreen.close().unwrap();
        }

        window.get_window("main").unwrap().show().unwrap();
        window
            .get_window("main")
            .unwrap()
            .set_always_on_top(false)
            .unwrap();
    }

    #[tauri::command]

    pub async fn show_splashscreen(window: tauri::Window) {
        window.get_window("splash").unwrap().show().unwrap();
    }

    
}
