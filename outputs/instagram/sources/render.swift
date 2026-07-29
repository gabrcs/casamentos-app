import WebKit
import AppKit

let args = CommandLine.arguments
guard args.count == 5 else { print("usage: render <html> <out.png> <w> <h>"); exit(1) }
let htmlURL = URL(fileURLWithPath: args[1])
let outPath = args[2]
let w = Double(args[3])!, h = Double(args[4])!

let app = NSApplication.shared
app.setActivationPolicy(.accessory)

let config = WKWebViewConfiguration()
let webView = WKWebView(frame: NSRect(x: 0, y: 0, width: w, height: h), configuration: config)

let window = NSWindow(contentRect: NSRect(x: 0, y: 0, width: w, height: h),
                      styleMask: [.borderless], backing: .buffered, defer: false)
window.contentView = webView

final class Delegate: NSObject, WKNavigationDelegate {
    let out: String
    let w: Double
    init(out: String, w: Double) { self.out = out; self.w = w }
    func webView(_ wv: WKWebView, didFinish nav: WKNavigation!) {
        wv.evaluateJavaScript("document.fonts.ready.then(() => true)") { _, _ in
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                let cfg = WKSnapshotConfiguration()
                cfg.snapshotWidth = NSNumber(value: self.w)
                wv.takeSnapshot(with: cfg) { img, err in
                    guard let img = img,
                          let tiff = img.tiffRepresentation,
                          let rep = NSBitmapImageRep(data: tiff),
                          let png = rep.representation(using: .png, properties: [:]) else {
                        print("snapshot failed: \(err?.localizedDescription ?? "?")"); exit(2)
                    }
                    try? png.write(to: URL(fileURLWithPath: self.out))
                    print("ok \(self.out)")
                    exit(0)
                }
            }
        }
    }
    func webView(_ wv: WKWebView, didFail nav: WKNavigation!, withError e: Error) {
        print("nav fail: \(e.localizedDescription)"); exit(3)
    }
}

let delegate = Delegate(out: outPath, w: w)
webView.navigationDelegate = delegate
webView.loadFileURL(htmlURL, allowingReadAccessTo: htmlURL.deletingLastPathComponent().deletingLastPathComponent())
DispatchQueue.main.asyncAfter(deadline: .now() + 20) { print("timeout"); exit(4) }
app.run()
