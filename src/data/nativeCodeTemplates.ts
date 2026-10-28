import { PlatformDocumentation } from '../types/browser';

export const PLATFORM_DOCUMENTATIONS: PlatformDocumentation[] = [
  {
    platform: 'react-native',
    title: 'React Native & Expo (Cross-Platform)',
    subtitle: 'Production TypeScript stack using react-native-webview & PanResponder resize handles',
    icon: '⚛️',
    files: [
      {
        filename: 'App.tsx',
        filepath: 'App.tsx',
        language: 'typescript',
        description: 'Main application container with draggable resize handles, zoom slider, omnibox, and bottom bar',
        code: `import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  PanResponder,
  Dimensions,
  StatusBar,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { DesktopWebView } from './components/DesktopWebView';
import { DESKTOP_USER_AGENTS } from './constants/userAgents';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function App() {
  const [url, setUrl] = useState('https://news.ycombinator.com');
  const [inputUrl, setInputUrl] = useState('https://news.ycombinator.com');
  const [scale, setScale] = useState(0.40); // 40% default desktop scale for mobile
  const [targetDesktopWidth, setTargetDesktopWidth] = useState(1280);
  
  // Resizable Container Dimensions
  const [containerWidth, setContainerWidth] = useState(SCREEN_WIDTH - 24);
  const [containerHeight, setContainerHeight] = useState(SCREEN_HEIGHT * 0.68);

  const webViewRef = useRef<any>(null);

  // Auto-fit calculation: calculate scale so target desktop width fits in container
  const handleAutoFit = () => {
    const optimalScale = Math.min(1.0, Math.max(0.25, containerWidth / targetDesktopWidth));
    setScale(parseFloat(optimalScale.toFixed(2)));
  };

  const handleNavigate = () => {
    let clean = inputUrl.trim();
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = clean.includes('.') ? \`https://\${clean}\` : \`https://www.google.com/search?q=\${encodeURIComponent(clean)}\`;
    }
    setUrl(clean);
    setInputUrl(clean);
  };

  // Draggable Right Edge Handle
  const rightPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newWidth = Math.min(SCREEN_WIDTH - 16, Math.max(260, SCREEN_WIDTH - 24 + gestureState.dx));
        setContainerWidth(newWidth);
      },
    })
  ).current;

  // Draggable Bottom Edge Handle
  const bottomPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newHeight = Math.min(SCREEN_HEIGHT * 0.78, Math.max(240, SCREEN_HEIGHT * 0.68 + gestureState.dy));
        setContainerHeight(newHeight);
      },
    })
  ).current;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      {/* 1. Omnibox / URL Search Bar */}
      <View style={styles.omniboxContainer}>
        <TextInput
          style={styles.omniboxInput}
          value={inputUrl}
          onChangeText={setInputUrl}
          onSubmitEditing={handleNavigate}
          placeholder="Search Google or enter web URL..."
          placeholderTextColor="#64748b"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          returnKeyType="go"
        />
        <TouchableOpacity style={styles.goButton} onPress={handleNavigate}>
          <Text style={styles.goButtonText}>Go</Text>
        </TouchableOpacity>
      </View>

      {/* 2. Resizable Web View Frame */}
      <View style={styles.workspace}>
        <View style={[styles.resizableFrame, { width: containerWidth, height: containerHeight }]}>
          <DesktopWebView
            ref={webViewRef}
            url={url}
            scale={scale}
            targetDesktopWidth={targetDesktopWidth}
            userAgent={DESKTOP_USER_AGENTS.macOSSafari}
          />

          {/* Draggable Right Edge Handle */}
          <View style={styles.rightHandle} {...rightPanResponder.panHandlers}>
            <View style={styles.handleBarVertical} />
          </View>

          {/* Draggable Bottom Edge Handle */}
          <View style={styles.bottomHandle} {...bottomPanResponder.panHandlers}>
            <View style={styles.handleBarHorizontal} />
          </View>

          {/* Dimension Tag */}
          <View style={styles.dimensionBadge}>
            <Text style={styles.dimensionText}>
              {Math.round(containerWidth)}×{Math.round(containerHeight)} px
            </Text>
          </View>
        </View>
      </View>

      {/* 3. Interactive Zoom / Scale Slider & Auto-Fit */}
      <View style={styles.sliderPanel}>
        <View style={styles.sliderHeader}>
          <Text style={styles.sliderLabel}>Desktop Viewport Scale:</Text>
          <Text style={styles.sliderValue}>{Math.round(scale * 100)}%</Text>
          <TouchableOpacity style={styles.autoFitBtn} onPress={handleAutoFit}>
            <Text style={styles.autoFitBtnText}>Auto-Fit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resetBtn} onPress={() => setScale(1.0)}>
            <Text style={styles.resetBtnText}>100%</Text>
          </TouchableOpacity>
        </View>
        
        <Slider
          style={styles.slider}
          minimumValue={0.25}
          maximumValue={1.00}
          step={0.01}
          value={scale}
          onValueChange={setScale}
          minimumTrackTintColor="#38bdf8"
          maximumTrackTintColor="#334155"
          thumbTintColor="#38bdf8"
        />
        <View style={styles.scalePresets}>
          {[0.25, 0.33, 0.50, 0.75, 1.0].map((preset) => (
            <TouchableOpacity key={preset} onPress={() => setScale(preset)}>
              <Text style={[styles.presetText, scale === preset && styles.presetTextActive]}>
                {Math.round(preset * 100)}%
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 4. Bottom Navigation Controls */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navBtn} onPress={() => webViewRef.current?.goBack()}>
          <Text style={styles.navBtnText}>‹ Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn} onPress={() => webViewRef.current?.goForward()}>
          <Text style={styles.navBtnText}>Forward ›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn} onPress={() => webViewRef.current?.reload()}>
          <Text style={styles.navBtnText}>↻ Reload</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn} onPress={() => {
          setUrl('https://news.ycombinator.com');
          setInputUrl('https://news.ycombinator.com');
          handleAutoFit();
        }}>
          <Text style={styles.navBtnText}>⌂ Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#090d16' },
  omniboxContainer: { flexDirection: 'row', padding: 8, gap: 8, backgroundColor: '#1e293b' },
  omniboxInput: { flex: 1, height: 40, backgroundColor: '#0f172a', borderRadius: 8, paddingHorizontal: 12, color: '#f8fafc', fontSize: 13 },
  goButton: { backgroundColor: '#2563eb', paddingHorizontal: 16, justifyContent: 'center', borderRadius: 8 },
  goButtonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
  workspace: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  resizableFrame: { backgroundColor: '#ffffff', borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#334155', position: 'relative' },
  rightHandle: { position: 'absolute', right: 0, top: 0, bottom: 0, width: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(56, 189, 248, 0.15)' },
  handleBarVertical: { width: 4, height: 32, borderRadius: 2, backgroundColor: '#38bdf8' },
  bottomHandle: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(56, 189, 248, 0.15)' },
  handleBarHorizontal: { height: 4, width: 32, borderRadius: 2, backgroundColor: '#38bdf8' },
  dimensionBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(15, 23, 42, 0.85)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  dimensionText: { color: '#38bdf8', fontSize: 10, fontWeight: 'bold' },
  sliderPanel: { backgroundColor: '#0f172a', paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: 1, borderColor: '#1e293b' },
  sliderHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  sliderLabel: { color: '#94a3b8', fontSize: 12, fontWeight: '600' },
  sliderValue: { color: '#38bdf8', fontSize: 14, fontWeight: 'bold' },
  autoFitBtn: { backgroundColor: '#1e293b', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  autoFitBtnText: { color: '#38bdf8', fontSize: 11, fontWeight: 'bold' },
  resetBtn: { backgroundColor: '#1e293b', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  resetBtnText: { color: '#94a3b8', fontSize: 11 },
  slider: { width: '100%', height: 32 },
  scalePresets: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 },
  presetText: { color: '#64748b', fontSize: 11, fontWeight: '500' },
  presetTextActive: { color: '#38bdf8', fontWeight: 'bold' },
  bottomNav: { flexDirection: 'row', height: 50, backgroundColor: '#1e293b', borderTopWidth: 1, borderColor: '#334155', justifyContent: 'space-around', alignItems: 'center' },
  navBtn: { padding: 10 },
  navBtnText: { color: '#e2e8f0', fontSize: 13, fontWeight: '600' },
});`,
      },
      {
        filename: 'components/DesktopWebView.tsx',
        filepath: 'components/DesktopWebView.tsx',
        language: 'typescript',
        description: 'WebView wrapper implementing UserAgent spoofing, viewport meta overrides, and transform scale injection',
        code: `import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface DesktopWebViewProps {
  url: string;
  scale: number;
  targetDesktopWidth: number;
  userAgent: string;
}

export const DesktopWebView = forwardRef<any, DesktopWebViewProps>(
  ({ url, scale, targetDesktopWidth, userAgent }, ref) => {
    const webViewRef = useRef<WebView>(null);

    useImperativeHandle(ref, () => ({
      goBack: () => webViewRef.current?.goBack(),
      goForward: () => webViewRef.current?.goForward(),
      reload: () => webViewRef.current?.reload(),
    }));

    // Injected JavaScript that runs before content loads:
    // 1. Removes any existing mobile viewport <meta> tags
    // 2. Injects a wide desktop viewport (width=1280)
    // 3. Modifies navigator.userAgent & navigator.platform to emulate macOS/Windows
    const injectedBeforeScript = \`
      (function() {
        // Override navigator properties to fool client-side sniffing scripts
        try {
          Object.defineProperty(navigator, 'userAgent', { get: () => '\${userAgent}' });
          Object.defineProperty(navigator, 'platform', { get: () => 'MacIntel' });
          Object.defineProperty(navigator, 'maxTouchPoints', { get: () => 0 });
        } catch(e) {}

        // Enforce desktop viewport meta tag
        function forceDesktopViewport() {
          var metas = document.getElementsByTagName('meta');
          for (var i = metas.length - 1; i >= 0; i--) {
            if (metas[i].name === 'viewport') {
              metas[i].parentNode.removeChild(metas[i]);
            }
          }
          var meta = document.createElement('meta');
          meta.name = 'viewport';
          meta.content = 'width=\${targetDesktopWidth}, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
          document.getElementsByTagName('head')[0].appendChild(meta);
        }

        if (document.head) {
          forceDesktopViewport();
        } else {
          document.addEventListener('DOMContentLoaded', forceDesktopViewport);
        }
      })();
      true;
    \`;

    // Dynamic zoom updater whenever scale slider moves
    useEffect(() => {
      if (!webViewRef.current) return;
      const scaleUpdateScript = \`
        (function() {
          // Method A: CSS Transform matrix (broadest cross-engine compatibility)
          var html = document.documentElement;
          var body = document.body;
          if (html && body) {
            // Apply scale from top-left origin
            body.style.transformOrigin = '0 0';
            body.style.transform = 'scale(\${scale})';
            body.style.width = (\${1 / scale} * 100) + '%';
          }
        })();
        true;
      \`;
      webViewRef.current.injectJavaScript(scaleUpdateScript);
    }, [scale, targetDesktopWidth]);

    return (
      <View style={styles.container}>
        <WebView
          ref={webViewRef}
          source={{ uri: url }}
          userAgent={userAgent}
          injectedJavaScriptBeforeContentLoaded={injectedBeforeScript}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scalesPageToFit={true}
          bounces={false}
          scrollEnabled={true}
          startInLoadingState={true}
          style={styles.webview}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  webview: { flex: 1 },
});`,
      },
      {
        filename: 'constants/userAgents.ts',
        filepath: 'constants/userAgents.ts',
        language: 'typescript',
        description: 'Authentic modern desktop User-Agent strings',
        code: `export const DESKTOP_USER_AGENTS = {
  macOSSafari:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15',
  windowsChrome:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
  linuxFirefox:
    'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:135.0) Gecko/20100101 Firefox/135.0',
};`,
      },
    ],
    setupGuide: [
      {
        step: 1,
        title: 'Initialize Expo Project',
        commands: [
          'npx create-expo-app@latest DesktopBrowserApp --template blank-typescript',
          'cd DesktopBrowserApp',
        ],
        explanation: 'Create a clean React Native TypeScript project using the official Expo CLI template.',
      },
      {
        step: 2,
        title: 'Install Native Dependencies',
        commands: [
          'npx expo install react-native-webview @react-native-community/slider',
        ],
        explanation: 'Install the native WebView component and the smooth native Slider module.',
      },
      {
        step: 3,
        title: 'Copy Source Code Files',
        commands: [
          'mkdir -p components constants',
          '# Paste App.tsx, DesktopWebView.tsx, and constants/userAgents.ts',
        ],
        explanation: 'Place the provided source files into your project repository.',
      },
      {
        step: 4,
        title: 'Run on iOS Simulator or Android Emulator',
        commands: [
          'npx expo run:ios       # For macOS iOS Simulator',
          'npx expo run:android   # For Android Emulator or USB Device',
          'npx expo start         # For Expo Go or Development Client',
        ],
        explanation: 'Launch the development server and test the interactive zoom slider and desktop emulation.',
      },
    ],
    architectureNotes: [
      'Two-Tier Desktop Enforcement: Spoofing userAgent alone is insufficient because modern web layouts trigger responsive CSS media queries based on CSS pixels (window.innerWidth). We pair the UserAgent spoof with an injected JavaScript document modifier that rewrites the <meta name="viewport"> tag to a wide width (1280px).',
      'Lossless Transform Origin: When scaling down desktop layouts, CSS transformOrigin must be set to "0 0" (top-left) and the body width expanded inversely (1/scale * 100%) to preserve full content rendering without edge clipping.',
      'Touch Coordination: Native touch coordinates seamlessly pass through react-native-webview to the transformed DOM elements.',
    ],
  },
  {
    platform: 'ios-swift',
    title: 'iOS Swift & SwiftUI (Native WKWebView)',
    subtitle: 'Native Apple WebKit engine with customUserAgent and WKUserScript viewport injection',
    icon: '🍎',
    files: [
      {
        filename: 'DesktopWKWebView.swift',
        filepath: 'Views/DesktopWKWebView.swift',
        language: 'swift',
        description: 'UIViewRepresentable wrapper for WKWebView with customUserAgent and scale injection',
        code: `import SwiftUI
import WebKit

struct DesktopWKWebView: UIViewRepresentable {
    let url: URL
    let scale: Double
    let targetDesktopWidth: Int
    @Binding var webViewRef: WKWebView?

    func makeUIView(context: Context) -> WKWebView {
        let configuration = WKWebViewConfiguration()
        let controller = WKUserContentController()

        // 1. Forced Desktop Viewport Meta Script (Runs at Document Start)
        let viewportScriptSource = """
        (function() {
            function setDesktopViewport() {
                var metas = document.getElementsByTagName('meta');
                for (var i = metas.length - 1; i >= 0; i--) {
                    if (metas[i].name === 'viewport') {
                        metas[i].parentNode.removeChild(metas[i]);
                    }
                }
                var meta = document.createElement('meta');
                meta.name = 'viewport';
                meta.content = 'width=\\(targetDesktopWidth), initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
                document.getElementsByTagName('head')[0].appendChild(meta);
            }
            if (document.head) {
                setDesktopViewport();
            } else {
                document.addEventListener('DOMContentLoaded', setDesktopViewport);
            }
        })();
        """
        
        let viewportScript = WKUserScript(
            source: viewportScriptSource,
            injectionTime: .atDocumentStart,
            forMainFrameOnly: true
        )
        controller.addUserScript(viewportScript)
        configuration.userContentController = controller

        // 2. Enable desktop media playback & preferences
        configuration.defaultWebpagePreferences.preferredContentMode = .desktop
        configuration.allowsInlineMediaPlayback = true

        let webView = WKWebView(frame: .zero, configuration: configuration)
        
        // 3. Override User-Agent to modern macOS Safari
        webView.customUserAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15"
        
        webView.scrollView.bounces = false
        webView.navigationDelegate = context.coordinator

        DispatchQueue.main.async {
            self.webViewRef = webView
        }

        let request = URLRequest(url: url)
        webView.load(request)
        return webView
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {
        // If scale changes dynamically, execute transform script
        let scaleScript = """
        (function() {
            var body = document.body;
            if (body) {
                body.style.transformOrigin = '0 0';
                body.style.transform = 'scale(\\(scale))';
                body.style.width = '\\(1.0 / scale * 100.0)%';
            }
        })();
        """
        uiView.evaluateJavaScript(scaleScript, completionHandler: nil)
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    class Coordinator: NSObject, WKNavigationDelegate {
        var parent: DesktopWKWebView

        init(_ parent: DesktopWKWebView) {
            self.parent = parent
        }

        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            // Apply scale upon page load completion
            let scaleScript = "document.body.style.transform = 'scale(\\(parent.scale))'; document.body.style.transformOrigin = '0 0';"
            webView.evaluateJavaScript(scaleScript, completionHandler: nil)
        }
    }
}`,
      },
      {
        filename: 'ContentView.swift',
        filepath: 'Views/ContentView.swift',
        language: 'swift',
        description: 'SwiftUI layout with resizable container, drag gesture handles, scale slider, and omnibox',
        code: `import SwiftUI
import WebKit

struct ContentView: View {
    @State private var currentURL = URL(string: "https://news.ycombinator.com")!
    @State private var urlString = "https://news.ycombinator.com"
    @State private var scale: Double = 0.40
    @State private var containerWidth: CGFloat = UIScreen.main.bounds.width - 32
    @State private var containerHeight: CGFloat = UIScreen.main.bounds.height * 0.65
    @State private var webView: WKWebView? = nil

    var body: some View {
        ZStack {
            Color(red: 0.05, green: 0.07, blue: 0.11).ignoresSafeArea()

            VStack(spacing: 8) {
                // Top Omnibox
                HStack {
                    TextField("Enter URL or Google Search...", text: $urlString)
                        .padding(10)
                        .background(Color(red: 0.1, green: 0.15, blue: 0.22))
                        .foregroundColor(.white)
                        .cornerRadius(8)
                        .autocapitalization(.none)
                        .disableAutocorrection(true)
                        .onSubmit(loadURL)

                    Button(action: loadURL) {
                        Text("Go")
                            .fontWeight(.bold)
                            .foregroundColor(.white)
                            .padding(.horizontal, 14)
                            .padding(.vertical, 10)
                            .background(Color.blue)
                            .cornerRadius(8)
                    }
                }
                .padding(.horizontal, 12)

                // Resizable Web Container
                ZStack(alignment: .bottomTrailing) {
                    DesktopWKWebView(
                        url: currentURL,
                        scale: scale,
                        targetDesktopWidth: 1280,
                        webViewRef: $webView
                    )
                    .frame(width: containerWidth, height: containerHeight)
                    .cornerRadius(12)
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(Color.gray.opacity(0.3), lineWidth: 1)
                    )

                    // Drag Resize Handle (Bottom-Right Corner)
                    Image(systemName: "arrow.down.right.and.arrow.up.left")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(.white)
                        .padding(8)
                        .background(Color.blue.opacity(0.8))
                        .clipShape(Circle())
                        .offset(x: -8, y: -8)
                        .gesture(
                            DragGesture()
                                .onChanged { value in
                                    let newW = containerWidth + value.translation.width
                                    let newH = containerHeight + value.translation.height
                                    containerWidth = min(UIScreen.main.bounds.width - 16, max(260, newW))
                                    containerHeight = min(UIScreen.main.bounds.height * 0.75, max(250, newH))
                                }
                        )
                }

                // Interactive Zoom / Scale Slider
                VStack(spacing: 4) {
                    HStack {
                        Text("Desktop Viewport Scale:")
                            .font(.caption)
                            .foregroundColor(.gray)
                        Spacer()
                        Text("\\(Int(scale * 100))%")
                            .font(.caption.bold())
                            .foregroundColor(.cyan)

                        Button("Auto-Fit") {
                            let optimal = Double(containerWidth / 1280.0)
                            scale = min(1.0, max(0.25, optimal))
                        }
                        .font(.caption.bold())
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color(red: 0.15, green: 0.2, blue: 0.3))
                        .foregroundColor(.cyan)
                        .cornerRadius(6)
                    }

                    Slider(value: $scale, in: 0.25...1.0, step: 0.01)
                        .accentColor(.cyan)
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
                .background(Color(red: 0.08, green: 0.11, blue: 0.17))
                .cornerRadius(10)
                .padding(.horizontal, 12)

                // Navigation Controls Bar
                HStack(spacing: 36) {
                    Button(action: { webView?.goBack() }) {
                        Image(systemName: "chevron.backward").font(.title3)
                    }
                    Button(action: { webView?.goForward() }) {
                        Image(systemName: "chevron.forward").font(.title3)
                    }
                    Button(action: { webView?.reload() }) {
                        Image(systemName: "arrow.clockwise").font(.title3)
                    }
                    Button(action: {
                        urlString = "https://news.ycombinator.com"
                        loadURL()
                    }) {
                        Image(systemName: "house").font(.title3)
                    }
                }
                .foregroundColor(.white)
                .padding(.vertical, 12)
                .frame(maxWidth: .infinity)
                .background(Color(red: 0.1, green: 0.14, blue: 0.2))
            }
        }
    }

    private func loadURL() {
        var str = urlString.trimmingCharacters(in: .whitespacesAndNewlines)
        if !str.hasPrefix("http://") && !str.hasPrefix("https://") {
            str = str.contains(".") ? "https://\\(str)" : "https://www.google.com/search?q=\\(str.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? "")"
        }
        if let url = URL(string: str) {
            currentURL = url
            webView?.load(URLRequest(url: url))
        }
    }
}`,
      },
    ],
    setupGuide: [
      {
        step: 1,
        title: 'Create Xcode Project',
        commands: [
          '# Open Xcode -> File -> New -> Project',
          '# Choose iOS -> App -> Interface: SwiftUI, Language: Swift',
          '# Project Name: DesktopBrowserApp',
        ],
        explanation: 'Create a modern native iOS application using SwiftUI and WebKit framework.',
      },
      {
        step: 2,
        title: 'Configure WebKit & ATS in Info.plist',
        commands: [
          '# In Info.plist, enable App Transport Security for arbitrary web loading:',
          'NSAppTransportSecurity -> NSAllowsArbitraryLoads = YES',
        ],
        explanation: 'Allows user to browse both HTTP and HTTPS websites freely.',
      },
      {
        step: 3,
        title: 'Add Swift Code Files',
        commands: [
          '# Add DesktopWKWebView.swift and ContentView.swift to your Xcode project target',
        ],
        explanation: 'Integrate the WKWebView UIViewRepresentable with customUserAgent and the SwiftUI View.',
      },
      {
        step: 4,
        title: 'Build and Run',
        commands: [
          '# Select iOS Simulator (e.g. iPhone 16 Pro) or physical device',
          '# Press ⌘R to build and launch',
        ],
        explanation: 'Experience hardware-accelerated 60 FPS viewport scaling powered by Apple WebKit.',
      },
    ],
    architectureNotes: [
      'preferredContentMode = .desktop: iOS 13+ introduced WKWebpagePreferences.preferredContentMode = .desktop which requests desktop assets, but setting customUserAgent explicitly guarantees macOS Safari recognition on all sites.',
      'WKUserScript Injection: By injecting the viewport meta rewrites at .atDocumentStart, the web page parses the initial layout at 1280px rather than phone width (393px), completely eliminating mobile one-column responsive collapses.',
    ],
  },
  {
    platform: 'android-kotlin',
    title: 'Android Kotlin & Jetpack Compose',
    subtitle: 'Native Android WebView with WebSettings wide viewport and evaluateJavascript scaler',
    icon: '🤖',
    files: [
      {
        filename: 'MainActivity.kt',
        filepath: 'app/src/main/java/com/desktopbrowser/MainActivity.kt',
        language: 'kotlin',
        description: 'Jetpack Compose activity with resizable Box container, Slider, Omnibox, and AndroidView WebView',
        code: `package com.desktopbrowser

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.ViewGroup
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView

class MainActivity : ComponentActivity() {
    private var webViewInstance: WebView? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            DesktopBrowserScreen()
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    @Composable
    fun DesktopBrowserScreen() {
        var url by remember { mutableStateOf("https://news.ycombinator.com") }
        var inputUrl by remember { mutableStateOf("https://news.ycombinator.com") }
        var scale by remember { mutableFloatStateOf(0.40f) }
        var containerWidthDp by remember { mutableFloatStateOf(360f) }
        var containerHeightDp by remember { mutableFloatStateOf(520f) }

        Surface(modifier = Modifier.fillMaxSize(), color = Color(0xFF090D16)) {
            Column(modifier = Modifier.fillMaxSize()) {
                // 1. Omnibox Top Bar
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color(0xFF1E293B))
                        .padding(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    TextField(
                        value = inputUrl,
                        onValueChange = { inputUrl = it },
                        modifier = Modifier.weight(1f),
                        placeholder = { Text("Search or URL...", color = Color.Gray) },
                        singleLine = true,
                        colors = TextFieldDefaults.colors(
                            focusedContainerColor = Color(0xFF0F172A),
                            unfocusedContainerColor = Color(0xFF0F172A),
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White
                        )
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Button(
                        onClick = {
                            var target = inputUrl.trim()
                            if (!target.startsWith("http://") && !target.startsWith("https://")) {
                                target = if (target.contains(".")) "https://$target" else "https://www.google.com/search?q=$target"
                            }
                            url = target
                            webViewInstance?.loadUrl(target)
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2563EB))
                    ) {
                        Text("Go")
                    }
                }

                // 2. Resizable Web Frame
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxWidth(),
                    contentAlignment = Alignment.Center
                ) {
                    Box(
                        modifier = Modifier
                            .size(containerWidthDp.dp, containerHeightDp.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .border(1.dp, Color(0xFF334155), RoundedCornerShape(12.dp))
                            .background(Color.White)
                    ) {
                        AndroidView(
                            factory = { context ->
                                WebView(context).apply {
                                    layoutParams = ViewGroup.LayoutParams(
                                        ViewGroup.LayoutParams.MATCH_PARENT,
                                        ViewGroup.LayoutParams.MATCH_PARENT
                                    )
                                    webViewClient = object : WebViewClient() {
                                        override fun onPageFinished(view: WebView?, url: String?) {
                                            super.onPageFinished(view, url)
                                            applyScale(view, scale)
                                        }
                                    }
                                    webChromeClient = WebChromeClient()

                                    // Key Desktop Configurations
                                    settings.apply {
                                        javaScriptEnabled = true
                                        domStorageEnabled = true
                                        // 1. Emulate Windows 11 Chrome Desktop User-Agent
                                        userAgentString = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36"
                                        // 2. Force wide desktop viewport mode
                                        useWideViewPort = true
                                        loadWithOverviewMode = true
                                        // 3. Built-in zoom mechanism
                                        setSupportZoom(true)
                                        builtInZoomControls = true
                                        displayZoomControls = false
                                    }
                                    webViewInstance = this
                                    loadUrl(url)
                                }
                            },
                            update = { view ->
                                applyScale(view, scale)
                            },
                            modifier = Modifier.fillMaxSize()
                        )

                        // Drag resize handle at bottom-right corner
                        Box(
                            modifier = Modifier
                                .align(Alignment.BottomEnd)
                                .size(32.dp)
                                .background(Color(0xFF38BDF8))
                                .pointerInput(Unit) {
                                    detectDragGestures { _, dragAmount ->
                                        containerWidthDp = (containerWidthDp + dragAmount.x / 2.5f).coerceIn(240f, 420f)
                                        containerHeightDp = (containerHeightDp + dragAmount.y / 2.5f).coerceIn(250f, 650f)
                                    }
                                }
                        )
                    }
                }

                // 3. Interactive Zoom Slider
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color(0xFF0F172A))
                        .padding(12.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("Desktop Viewport Zoom: \${(scale * 100).toInt()}%", color = Color(0xFF38BDF8))
                        Button(
                            onClick = {
                                val auto = (containerWidthDp / 1280f).coerceIn(0.25f, 1.0f)
                                scale = auto
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1E293B))
                        ) {
                            Text("Auto-Fit", color = Color(0xFF38BDF8))
                        }
                    }
                    Slider(
                        value = scale,
                        onValueChange = {
                            scale = it
                            applyScale(webViewInstance, it)
                        },
                        valueRange = 0.25f..1.0f
                    )
                }

                // 4. Navigation Bottom Bar
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(52.dp)
                        .background(Color(0xFF1E293B)),
                    horizontalArrangement = Arrangement.SpaceEvenly,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(onClick = { webViewInstance?.goBack() }) { Text("‹", color = Color.White) }
                    IconButton(onClick = { webViewInstance?.goForward() }) { Text("›", color = Color.White) }
                    IconButton(onClick = { webViewInstance?.reload() }) { Text("↻", color = Color.White) }
                    IconButton(onClick = { webViewInstance?.loadUrl("https://news.ycombinator.com") }) { Text("⌂", color = Color.White) }
                }
            }
        }
    }

    private fun applyScale(webView: WebView?, scale: Float) {
        val js = """
            (function() {
                var body = document.body;
                if (body) {
                    body.style.transformOrigin = '0 0';
                    body.style.transform = 'scale($scale)';
                    body.style.width = '\${(1.0f / scale) * 100}%';
                }
            })();
        """.trimIndent()
        webView?.evaluateJavascript(js, null)
    }
}`,
      },
      {
        filename: 'AndroidManifest.xml',
        filepath: 'app/src/main/AndroidManifest.xml',
        language: 'xml',
        description: 'Android manifest with INTERNET permission and hardware acceleration enabled',
        code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.desktopbrowser">

    <!-- Essential Internet & Network Permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:hardwareAccelerated="true"
        android:icon="@mipmap/ic_launcher"
        android:label="DesktopBrowser"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.Material3.Dark"
        android:usesCleartextTraffic="true">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`,
      },
    ],
    setupGuide: [
      {
        step: 1,
        title: 'Create Android Studio Project',
        commands: [
          '# Open Android Studio -> New Project',
          '# Select "Empty Activity" (Jetpack Compose)',
          '# Language: Kotlin, Minimum SDK: API 26 (Android 8.0 Oreo)',
        ],
        explanation: 'Initialize a native Android project with Jetpack Compose UI toolkit.',
      },
      {
        step: 2,
        title: 'Add Permissions & Manifest Settings',
        commands: [
          '# Ensure INTERNET permission and android:hardwareAccelerated="true" are in AndroidManifest.xml',
        ],
        explanation: 'Hardware acceleration is critical for stutter-free CSS transform matrix rendering.',
      },
      {
        step: 3,
        title: 'Build & Deploy on Android Emulator or Device',
        commands: [
          './gradlew assembleDebug',
          '# Or press Run (Shift+F10) in Android Studio to launch on Pixel emulator',
        ],
        explanation: 'Test wide viewport loading and observe desktop sites rendering in true 1280px mode.',
      },
    ],
    architectureNotes: [
      'WebSettings.useWideViewPort = true: Tells Android WebView to evaluate viewport sizing similar to a desktop browser rather than clamping to the mobile device display width.',
      'WebSettings.loadWithOverviewMode = true: Automatically zooms out the web page so that the entire wide desktop viewport is visible in the container.',
      'Hardware Acceleration: CSS scale transforms on Android WebViews achieve 60 FPS through GPU compositor layers when android:hardwareAccelerated="true" is set in AndroidManifest.xml.',
    ],
  },
  {
    platform: 'flutter',
    title: 'Flutter (flutter_inappwebview)',
    subtitle: 'High-performance cross-platform Flutter engine with InAppWebView desktop settings',
    icon: '💙',
    files: [
      {
        filename: 'main.dart',
        filepath: 'lib/main.dart',
        language: 'dart',
        description: 'Complete Flutter application with InAppWebView, interactive scale slider, and resizable frame',
        code: `import 'package:flutter/material.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const DesktopBrowserApp());
}

class DesktopBrowserApp extends StatelessWidget {
  const DesktopBrowserApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Desktop Viewport Browser',
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: const Color(0xFF090D16),
      ),
      home: const BrowserScreen(),
    );
  }
}

class BrowserScreen extends StatefulWidget {
  const BrowserScreen({super.key});

  @override
  State<BrowserScreen> createState() => _BrowserScreenState();
}

class _BrowserScreenState extends State<BrowserScreen> {
  InAppWebViewController? webViewController;
  final TextEditingController urlController =
      TextEditingController(text: 'https://news.ycombinator.com');
  double scale = 0.40;
  double containerWidth = 360.0;
  double containerHeight = 520.0;

  final String desktopUserAgent =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15';

  void applyScale(double newScale) {
    setState(() => scale = newScale);
    webViewController?.evaluateJavascript(source: """
      (function() {
        var body = document.body;
        if (body) {
          body.style.transformOrigin = '0 0';
          body.style.transform = 'scale(\${newScale})';
          body.style.width = '\${(1.0 / newScale) * 100}%';
        }
      })();
    """);
  }

  void loadUrl() {
    String text = urlController.text.trim();
    if (!text.startsWith('http://') && !text.startsWith('https://')) {
      text = text.contains('.') ? 'https://\$text' : 'https://www.google.com/search?q=\${Uri.encodeComponent(text)}';
    }
    webViewController?.loadUrl(urlRequest: URLRequest(url: WebUri(text)));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            // 1. Omnibox
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: urlController,
                      style: const TextStyle(fontSize: 13, color: Colors.white),
                      decoration: InputDecoration(
                        filled: true,
                        fillColor: const Color(0xFF1E293B),
                        hintText: 'Search or enter URL...',
                        contentPadding: const EdgeInsets.symmetric(horizontal: 12),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                          borderSide: BorderSide.none,
                        ),
                      ),
                      onSubmitted: (_) => loadUrl(),
                    ),
                  ),
                  const SizedBox(width: 8),
                  ElevatedButton(
                    onPressed: loadUrl,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF2563EB),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                    child: const Text('Go', style: TextStyle(color: Colors.white)),
                  ),
                ],
              ),
            ),

            // 2. Resizable Web View Container
            Expanded(
              child: Center(
                child: Container(
                  width: containerWidth,
                  height: containerHeight,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFF334155)),
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: InAppWebView(
                      initialUrlRequest: URLRequest(url: WebUri(urlController.text)),
                      initialSettings: InAppWebViewSettings(
                        userAgent: desktopUserAgent,
                        useWideViewPort: true,
                        loadWithOverviewMode: true,
                        preferredContentMode: UserPreferredContentMode.DESKTOP,
                        javaScriptEnabled: true,
                      ),
                      onWebViewCreated: (controller) => webViewController = controller,
                      onLoadStop: (controller, url) => applyScale(scale),
                    ),
                  ),
                ),
              ),
            ),

            // 3. Zoom / Scale Slider & Auto-Fit
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              color: const Color(0xFF0F172A),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Desktop Viewport Scale: \${(scale * 100).toInt()}%',
                          style: const TextStyle(color: Color(0xFF38BDF8), fontWeight: FontWeight.bold)),
                      TextButton(
                        onPressed: () => applyScale((containerWidth / 1280.0).clamp(0.25, 1.0)),
                        child: const Text('Auto-Fit', style: TextStyle(color: Color(0xFF38BDF8))),
                      ),
                    ],
                  ),
                  Slider(
                    value: scale,
                    min: 0.25,
                    max: 1.0,
                    activeColor: const Color(0xFF38BDF8),
                    onChanged: (val) => applyScale(val),
                  ),
                ],
              ),
            ),

            // 4. Bottom Nav Bar
            Container(
              height: 50,
              color: const Color(0xFF1E293B),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  IconButton(icon: const Icon(Icons.arrow_back), onPressed: () => webViewController?.goBack()),
                  IconButton(icon: const Icon(Icons.arrow_forward), onPressed: () => webViewController?.goForward()),
                  IconButton(icon: const Icon(Icons.refresh), onPressed: () => webViewController?.reload()),
                  IconButton(
                    icon: const Icon(Icons.home),
                    onPressed: () {
                      urlController.text = 'https://news.ycombinator.com';
                      loadUrl();
                    },
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}`,
      },
    ],
    setupGuide: [
      {
        step: 1,
        title: 'Create Flutter Project',
        commands: ['flutter create desktop_browser_mobile', 'cd desktop_browser_mobile'],
        explanation: 'Initialize standard Flutter mobile project.',
      },
      {
        step: 2,
        title: 'Add flutter_inappwebview Dependency',
        commands: ['flutter pub add flutter_inappwebview'],
        explanation: 'InAppWebView provides granular desktop mode configuration for both iOS and Android.',
      },
      {
        step: 3,
        title: 'Run on Emulator or Device',
        commands: ['flutter run'],
        explanation: 'Launch the application on Android or iOS.',
      },
    ],
    architectureNotes: [
      'InAppWebViewSettings.preferredContentMode = UserPreferredContentMode.DESKTOP automatically sets WebKit desktop flags on iOS and desktop emulation on Android.',
    ],
  },
];
