use std::process::{Command, Child};
use std::sync::{Arc, Mutex};
use tauri::Manager;

struct ExpressServerState {
  child: Arc<Mutex<Option<Child>>>,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  #[cfg(debug_assertions)]
  let child_handle: Arc<Mutex<Option<Child>>> = Arc::new(Mutex::new(None));
  #[cfg(debug_assertions)]
  let child_handle_clone = child_handle.clone();

  tauri::Builder::default()
    .setup(move |app| {
      #[cfg(debug_assertions)]
      {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }

      // Spawning the Express local server in development mode.
      #[cfg(debug_assertions)]
      {
        let resource_path = app.path().resource_dir().unwrap_or_else(|_| std::env::current_dir().unwrap());
        let mut backend_dir = resource_path.clone();
        
        let mut found = false;
        for _ in 0..5 {
          let test_path = backend_dir.join("backend");
          if test_path.is_dir() {
            backend_dir = test_path;
            found = true;
            break;
          }
          if !backend_dir.pop() {
            break;
          }
        }

        if !found {
          // Fallback to original behavior if not found
          backend_dir = resource_path.join("backend");
        }

        let mut backend_dir_str = backend_dir.to_string_lossy().into_owned();
        if backend_dir_str.starts_with("\\\\?\\") {
          backend_dir_str = backend_dir_str[4..].to_string();
        }

        println!("Spawning Node backend in: {}", backend_dir_str);

        let child = Command::new("node")
          .arg("server.js")
          .current_dir(&backend_dir_str)
          .spawn();

        match child {
          Ok(c) => {
            *child_handle_clone.lock().unwrap() = Some(c);
            println!("Local Express backend process spawned successfully!");
          }
          Err(e) => {
            eprintln!("Failed to spawn local Express backend: {:?}", e);
          }
        }
      }

      Ok(())
    })
    .on_window_event(move |_app, event| {
      #[cfg(debug_assertions)]
      {
        if let tauri::WindowEvent::Destroyed = event {
          let mut lock = child_handle.lock().unwrap();
          if let Some(mut child) = lock.take() {
            println!("Terminating local Express backend process...");
            let _ = child.kill();
          }
        }
      }
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
