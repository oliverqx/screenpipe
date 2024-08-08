pub mod apple;
pub mod core;
pub mod utils;
#[cfg(target_os = "macos")]
pub use apple::perform_ocr_apple;
pub use core::{continuous_capture, process_ocr_task, CaptureResult, ControlMessage};
pub use utils::{perform_ocr_tesseract, OcrEngine};
