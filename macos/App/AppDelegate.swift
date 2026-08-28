import Cocoa
import WebKit

@main
class AppDelegate: NSObject, NSApplicationDelegate {

    var window: NSWindow!

    func applicationDidFinishLaunching(_ aNotification: Notification) {
        let screenSize = NSScreen.main?.frame.size ?? CGSize(width: 1280, height: 800)
        let windowSize = CGSize(width: 1200, height: 800)

        let rect = NSRect(
            x: (screenSize.width - windowSize.width) / 2,
            y: (screenSize.height - windowSize.height) / 2,
            width: windowSize.width,
            height: windowSize.height
        )

        window = NSWindow(
            contentRect: rect,
            styleMask: [.titled, .closable, .miniaturizable, .resizable],
            backing: .buffered,
            defer: false
        )

        window.title = "Site Security and Surveillance (GMT SSS) macOS Native"

        let webView = WKWebView(frame: rect)
        window.contentView = webView
        window.makeKeyAndOrderFront(nil)

        if let htmlPath = Bundle.main.path(forResource: "index", ofType: "html", inDirectory: "public") {
            let fileURL = URL(fileURLWithPath: htmlPath)
            webView.loadFileURL(fileURL, allowingReadAccessTo: fileURL.deletingLastPathComponent())
        }
    }
}
