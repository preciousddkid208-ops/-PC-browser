export interface SampleSite {
  id: string;
  title: string;
  url: string;
  favicon: string;
  category: 'cloud' | 'encyclopedia' | 'community' | 'ecommerce' | 'developer';
  targetDesktopWidth: number; // e.g. 1280px
  htmlContent: string;
}

export const SAMPLE_DESKTOP_SITES: SampleSite[] = [
  {
    id: 'analytics-dashboard',
    title: 'CloudOps Pro — Desktop Enterprise Console',
    url: 'https://console.cloudops-enterprise.io/dashboard/infrastructure',
    favicon: '📊',
    category: 'cloud',
    targetDesktopWidth: 1280,
    htmlContent: `
      <div style="width: 1280px; min-height: 900px; background: #0f172a; color: #e2e8f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; box-sizing: border-box; display: flex; flex-direction: column;">
        <!-- Top Desktop Header Bar (1280px wide) -->
        <header style="background: #1e293b; border-bottom: 1px solid #334155; height: 56px; display: flex; align-items: center; justify-content: space-between; padding: 0 24px;">
          <div style="display: flex; align-items: center; gap: 20px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <div style="width: 28px; height: 28px; background: linear-gradient(135deg, #3b82f6, #6366f1); border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: bold; color: white; font-size: 14px;">⚡</div>
              <span style="font-weight: 700; font-size: 16px; letter-spacing: -0.02em; color: #ffffff;">CloudOps Enterprise</span>
            </div>
            <span style="background: #334155; color: #94a3b8; font-size: 11px; padding: 2px 8px; border-radius: 4px; font-weight: 600;">FORCED DESKTOP 1280px</span>
            <nav style="display: flex; gap: 16px; font-size: 13px; color: #94a3b8; margin-left: 16px;">
              <span style="color: #60a5fa; font-weight: 600; border-bottom: 2px solid #60a5fa; padding-bottom: 16px;">Clusters & Nodes</span>
              <span>Global Load Balancer</span>
              <span>PostgreSQL Shards</span>
              <span>IAM & RBAC</span>
              <span>Audit Logs</span>
            </nav>
          </div>
          <div style="display: flex; align-items: center; gap: 14px; font-size: 13px;">
            <span style="color: #34d399; font-weight: 500;">● 48/48 Nodes Healthy</span>
            <span style="color: #64748b;">|</span>
            <span style="color: #cbd5e1;">us-east-1a (Active)</span>
            <div style="width: 32px; height: 32px; border-radius: 50%; background: #475569; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px;">JD</div>
          </div>
        </header>

        <!-- Main Desktop Content Area -->
        <div style="display: flex; flex: 1;">
          <!-- Left Sidebar Navigation (240px) -->
          <aside style="width: 240px; background: #131d31; border-right: 1px solid #1e293b; padding: 20px 16px; display: flex; flex-direction: column; gap: 8px;">
            <div style="font-size: 11px; font-weight: 700; color: #64748b; letter-spacing: 0.05em; margin-bottom: 4px; padding-left: 8px;">COMPUTE CLUSTERS</div>
            <div style="background: #1e293b; color: #ffffff; padding: 8px 12px; border-radius: 6px; font-size: 13px; font-weight: 500; display: flex; justify-content: space-between;">
              <span>k8s-prod-primary</span>
              <span style="color: #34d399; font-size: 11px;">100%</span>
            </div>
            <div style="color: #94a3b8; padding: 8px 12px; border-radius: 6px; font-size: 13px; font-weight: 500; display: flex; justify-content: space-between;">
              <span>k8s-staging-west</span>
              <span style="color: #38bdf8; font-size: 11px;">Idle</span>
            </div>
            <div style="color: #94a3b8; padding: 8px 12px; border-radius: 6px; font-size: 13px; font-weight: 500; display: flex; justify-content: space-between;">
              <span>gpu-inference-v100</span>
              <span style="color: #fbbf24; font-size: 11px;">91%</span>
            </div>

            <div style="font-size: 11px; font-weight: 700; color: #64748b; letter-spacing: 0.05em; margin-top: 16px; margin-bottom: 4px; padding-left: 8px;">INFRASTRUCTURE METRICS</div>
            <div style="color: #cbd5e1; padding: 6px 12px; font-size: 12px;">Memory: 412.8 GB / 512 GB</div>
            <div style="color: #cbd5e1; padding: 6px 12px; font-size: 12px;">Ingress: 4.82 Gbps peak</div>
            <div style="color: #cbd5e1; padding: 6px 12px; font-size: 12px;">P99 Latency: 14.2 ms</div>

            <div style="margin-top: auto; padding: 12px; background: #1e293b; border-radius: 8px; font-size: 11px; color: #94a3b8;">
              <div style="font-weight: 600; color: #f8fafc; margin-bottom: 4px;">Desktop Layout Mode</div>
              Fixed 1280px desktop grid. Scale down with slider to fit mobile phone frame without clipping!
            </div>
          </aside>

          <!-- Main Desktop Panel (1040px) -->
          <main style="flex: 1; padding: 24px; box-sizing: border-box; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
              <div>
                <h1 style="font-size: 22px; font-weight: 700; color: #ffffff; margin: 0 0 6px 0;">Cluster Infrastructure & Telemetry</h1>
                <p style="font-size: 13px; color: #94a3b8; margin: 0;">Multi-region Kubernetes telemetry spanning 48 high-memory compute instances.</p>
              </div>
              <div style="display: flex; gap: 10px;">
                <button style="background: #334155; border: 1px solid #475569; color: #f1f5f9; padding: 7px 14px; border-radius: 6px; font-size: 12px; font-weight: 500; cursor: pointer;">Export Prometheus CSV</button>
                <button style="background: #2563eb; border: none; color: white; padding: 7px 16px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer;">+ Deploy Canary Pod</button>
              </div>
            </div>

            <!-- 4-Column Desktop KPI Cards -->
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
              <div style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 16px;">
                <div style="font-size: 12px; color: #94a3b8; font-weight: 500; margin-bottom: 4px;">Total CPU Utilization</div>
                <div style="font-size: 26px; font-weight: 700; color: #38bdf8;">68.4%</div>
                <div style="font-size: 11px; color: #34d399; margin-top: 4px;">↓ -4.2% vs previous hour</div>
              </div>
              <div style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 16px;">
                <div style="font-size: 12px; color: #94a3b8; font-weight: 500; margin-bottom: 4px;">Active HTTP Requests / sec</div>
                <div style="font-size: 26px; font-weight: 700; color: #a78bfa;">142,850</div>
                <div style="font-size: 11px; color: #34d399; margin-top: 4px;">↑ +18.7% peak spike</div>
              </div>
              <div style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 16px;">
                <div style="font-size: 12px; color: #94a3b8; font-weight: 500; margin-bottom: 4px;">Error Rate (5xx HTTP)</div>
                <div style="font-size: 26px; font-weight: 700; color: #4ade80;">0.003%</div>
                <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">Target SLA: &lt; 0.05%</div>
              </div>
              <div style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 16px;">
                <div style="font-size: 12px; color: #94a3b8; font-weight: 500; margin-bottom: 4px;">Monthly Compute Cost</div>
                <div style="font-size: 26px; font-weight: 700; color: #f43f5e;">$14,290</div>
                <div style="font-size: 11px; color: #cbd5e1; margin-top: 4px;">Forecast: $15,800 (-9%)</div>
              </div>
            </div>

            <!-- Wide Desktop Multi-Series Chart Mock & Table -->
            <div style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <h3 style="font-size: 15px; font-weight: 600; margin: 0; color: #ffffff;">Throughput & Latency Distribution Across 24h</h3>
                <div style="display: flex; gap: 12px; font-size: 11px; color: #94a3b8;">
                  <span style="display: flex; align-items: center; gap: 4px;"><span style="width: 8px; height: 8px; background: #3b82f6; border-radius: 2px;"></span> Ingress (GB/s)</span>
                  <span style="display: flex; align-items: center; gap: 4px;"><span style="width: 8px; height: 8px; background: #10b981; border-radius: 2px;"></span> Egress (GB/s)</span>
                  <span style="display: flex; align-items: center; gap: 4px;"><span style="width: 8px; height: 8px; background: #f59e0b; border-radius: 2px;"></span> P99 ms</span>
                </div>
              </div>
              <!-- Bar chart graphic (wide desktop visual) -->
              <div style="display: flex; align-items: flex-end; gap: 14px; height: 160px; padding-top: 20px; border-bottom: 1px solid #334155;">
                <div style="flex: 1; height: 60%; background: linear-gradient(to top, #1e40af, #3b82f6); border-radius: 4px 4px 0 0;"></div>
                <div style="flex: 1; height: 75%; background: linear-gradient(to top, #1e40af, #3b82f6); border-radius: 4px 4px 0 0;"></div>
                <div style="flex: 1; height: 45%; background: linear-gradient(to top, #1e40af, #3b82f6); border-radius: 4px 4px 0 0;"></div>
                <div style="flex: 1; height: 90%; background: linear-gradient(to top, #1e40af, #3b82f6); border-radius: 4px 4px 0 0;"></div>
                <div style="flex: 1; height: 65%; background: linear-gradient(to top, #1e40af, #3b82f6); border-radius: 4px 4px 0 0;"></div>
                <div style="flex: 1; height: 85%; background: linear-gradient(to top, #1e40af, #3b82f6); border-radius: 4px 4px 0 0;"></div>
                <div style="flex: 1; height: 50%; background: linear-gradient(to top, #1e40af, #3b82f6); border-radius: 4px 4px 0 0;"></div>
                <div style="flex: 1; height: 95%; background: linear-gradient(to top, #1e40af, #3b82f6); border-radius: 4px 4px 0 0;"></div>
                <div style="flex: 1; height: 80%; background: linear-gradient(to top, #1e40af, #3b82f6); border-radius: 4px 4px 0 0;"></div>
                <div style="flex: 1; height: 70%; background: linear-gradient(to top, #1e40af, #3b82f6); border-radius: 4px 4px 0 0;"></div>
                <div style="flex: 1; height: 85%; background: linear-gradient(to top, #1e40af, #3b82f6); border-radius: 4px 4px 0 0;"></div>
                <div style="flex: 1; height: 60%; background: linear-gradient(to top, #1e40af, #3b82f6); border-radius: 4px 4px 0 0;"></div>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 11px; color: #64748b; margin-top: 8px;">
                <span>00:00 UTC</span><span>04:00</span><span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span><span>Current (24:00)</span>
              </div>
            </div>

            <!-- Wide Node Registry Table -->
            <div style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; overflow: hidden;">
              <table style="width: 100%; border-collapse: collapse; font-size: 12px; text-align: left;">
                <thead>
                  <tr style="background: #131d31; color: #94a3b8; border-bottom: 1px solid #334155;">
                    <th style="padding: 12px 16px;">Node Instance ID</th>
                    <th style="padding: 12px 16px;">Zone</th>
                    <th style="padding: 12px 16px;">Role</th>
                    <th style="padding: 12px 16px;">Core Count</th>
                    <th style="padding: 12px 16px;">Memory Used</th>
                    <th style="padding: 12px 16px;">Status</th>
                    <th style="padding: 12px 16px;">Actions</th>
                  </tr>
                </thead>
                <tbody style="color: #cbd5e1;">
                  <tr style="border-bottom: 1px solid #233149;">
                    <td style="padding: 10px 16px; font-weight: 600; color: #ffffff;">worker-node-prod-01</td>
                    <td style="padding: 10px 16px;">us-east-1a</td>
                    <td style="padding: 10px 16px;">API Gateway & Ingress</td>
                    <td style="padding: 10px 16px;">32 vCPU</td>
                    <td style="padding: 10px 16px;">48.2 GB / 64 GB (75%)</td>
                    <td style="padding: 10px 16px;"><span style="color: #34d399; font-weight: 600;">HEALTHY</span></td>
                    <td style="padding: 10px 16px;"><span style="color: #60a5fa; cursor: pointer;">Inspect Logs</span></td>
                  </tr>
                  <tr style="border-bottom: 1px solid #233149;">
                    <td style="padding: 10px 16px; font-weight: 600; color: #ffffff;">worker-node-prod-02</td>
                    <td style="padding: 10px 16px;">us-east-1b</td>
                    <td style="padding: 10px 16px;">Microservice Mesh</td>
                    <td style="padding: 10px 16px;">32 vCPU</td>
                    <td style="padding: 10px 16px;">39.1 GB / 64 GB (61%)</td>
                    <td style="padding: 10px 16px;"><span style="color: #34d399; font-weight: 600;">HEALTHY</span></td>
                    <td style="padding: 10px 16px;"><span style="color: #60a5fa; cursor: pointer;">Inspect Logs</span></td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 16px; font-weight: 600; color: #ffffff;">db-sharder-primary-01</td>
                    <td style="padding: 10px 16px;">us-east-1a</td>
                    <td style="padding: 10px 16px;">Postgres Write Replica</td>
                    <td style="padding: 10px 16px;">64 vCPU</td>
                    <td style="padding: 10px 16px;">180.4 GB / 256 GB (70%)</td>
                    <td style="padding: 10px 16px;"><span style="color: #34d399; font-weight: 600;">HEALTHY</span></td>
                    <td style="padding: 10px 16px;"><span style="color: #60a5fa; cursor: pointer;">Inspect Logs</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
    `,
  },
  {
    id: 'wikipedia-desktop',
    title: 'Wikipedia (Desktop View) — James Webb Telescope',
    url: 'https://en.wikipedia.org/wiki/James_Webb_Space_Telescope',
    favicon: '🌐',
    category: 'encyclopedia',
    targetDesktopWidth: 1200,
    htmlContent: `
      <div style="width: 1200px; min-height: 900px; background: #ffffff; color: #202122; font-family: sans-serif; box-sizing: border-box; display: flex; flex-direction: column;">
        <!-- Top Desktop Wiki Nav (1200px wide) -->
        <header style="border-bottom: 1px solid #a2a9b1; padding: 12px 24px; display: flex; align-items: center; justify-content: space-between; background: #f8f9fa;">
          <div style="display: flex; align-items: center; gap: 20px;">
            <div style="font-size: 22px; font-family: serif; font-weight: bold; color: #000000;">WIKIPEDIA</div>
            <span style="font-size: 12px; color: #54595d;">The Free Encyclopedia (Full Desktop Vector Skin)</span>
          </div>
          <div style="display: flex; gap: 14px; font-size: 13px; color: #36c;">
            <span>Create account</span>
            <span>Log in</span>
            <span>Article</span>
            <span>Talk</span>
            <span>Read</span>
            <span>View source</span>
            <span>View history</span>
          </div>
        </header>

        <div style="display: flex; flex: 1; padding: 24px;">
          <!-- Desktop Table of Contents Sidebar (220px) -->
          <div style="width: 220px; border-right: 1px solid #eaecf0; padding-right: 16px; margin-right: 24px;">
            <div style="font-weight: bold; font-size: 14px; margin-bottom: 12px;">Contents</div>
            <ul style="list-style: none; padding: 0; margin: 0; font-size: 13px; color: #36c; line-height: 2;">
              <li><strong>(Top)</strong></li>
              <li>1 Mission & Orbit</li>
              <li>2 Optical Design</li>
              <li>3 Science Instruments</li>
              <li>4 Comparison with Hubble</li>
              <li>5 Launch and Commissioning</li>
              <li>6 Scientific Results</li>
              <li>7 References</li>
            </ul>
          </div>

          <!-- Main Article Body with Desktop Infobox (920px) -->
          <div style="flex: 1; display: flex; gap: 24px;">
            <div style="flex: 1;">
              <h1 style="font-family: 'Linux Libertine', Georgia, serif; font-size: 28px; font-weight: normal; border-bottom: 1px solid #a2a9b1; padding-bottom: 6px; margin-top: 0;">James Webb Space Telescope</h1>
              <p style="font-size: 14px; line-height: 1.6; color: #202122;">
                The <strong>James Webb Space Telescope</strong> (<strong>JWST</strong>) is a space telescope designed primarily to conduct infrared astronomy. As the largest optical telescope in space, its high resolution and sensitivity allow it to view objects too old, distant, or faint for the Hubble Space Telescope.
              </p>
              <h2 style="font-family: serif; font-size: 20px; border-bottom: 1px solid #a2a9b1; padding-bottom: 4px; margin-top: 24px;">Mission & Orbit</h2>
              <p style="font-size: 14px; line-height: 1.6; color: #202122;">
                The JWST operates in a halo orbit around the Sun–Earth L<sub>2</sub> (second Lagrange point), approximately 1,500,000 km (930,000 mi) beyond Earth's orbit around the Sun. Its primary operating temperature is maintained below 50 K (−223 °C; −370 °F) by a five-layer sunshield the size of a tennis court.
              </p>
              <h2 style="font-family: serif; font-size: 20px; border-bottom: 1px solid #a2a9b1; padding-bottom: 4px; margin-top: 24px;">Optical Design</h2>
              <p style="font-size: 14px; line-height: 1.6; color: #202122;">
                JWST's primary mirror consists of 18 hexagonal mirror segments made of gold-plated beryllium, which combine to create a 6.5-meter-diameter (21 ft) mirror. This gives JWST a light-collecting area of about 25.4 m<sup>2</sup>, over six times larger than Hubble.
              </p>
            </div>

            <!-- Desktop Right-Hand Infobox (300px fixed width) -->
            <div style="width: 300px; background: #f8f9fa; border: 1px solid #a2a9b1; padding: 12px; font-size: 12px; box-sizing: border-box; align-self: flex-start;">
              <div style="text-align: center; font-weight: bold; font-size: 14px; margin-bottom: 8px;">James Webb Space Telescope</div>
              <div style="background: #111827; height: 140px; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #fbbf24; font-size: 32px; margin-bottom: 10px;">🔭</div>
              <div style="text-align: center; font-size: 11px; color: #54595d; margin-bottom: 12px;">Full-scale model of JWST in orbit configuration</div>
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-top: 1px solid #eaecf0;"><td style="padding: 6px 0; font-weight: bold;">Organization:</td><td>NASA / ESA / CSA</td></tr>
                <tr style="border-top: 1px solid #eaecf0;"><td style="padding: 6px 0; font-weight: bold;">Primary mirror:</td><td>6.5 m (21.3 ft) Beryllium</td></tr>
                <tr style="border-top: 1px solid #eaecf0;"><td style="padding: 6px 0; font-weight: bold;">Focal length:</td><td>131.4 m (431 ft)</td></tr>
                <tr style="border-top: 1px solid #eaecf0;"><td style="padding: 6px 0; font-weight: bold;">Launch date:</td><td>25 December 2021</td></tr>
                <tr style="border-top: 1px solid #eaecf0;"><td style="padding: 6px 0; font-weight: bold;">Orbital insertion:</td><td>24 January 2022</td></tr>
                <tr style="border-top: 1px solid #eaecf0;"><td style="padding: 6px 0; font-weight: bold;">Orbital site:</td><td>Sun–Earth L<sub>2</sub> Point</td></tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    `,
  },
  {
    id: 'hacker-news-desktop',
    title: 'Hacker News (Desktop Classical 1100px)',
    url: 'https://news.ycombinator.com',
    favicon: '🟧',
    category: 'community',
    targetDesktopWidth: 1100,
    htmlContent: `
      <div style="width: 1100px; min-height: 800px; background: #f6f6ef; color: #222; font-family: Verdana, Geneva, sans-serif; box-sizing: border-box; padding: 12px 20px;">
        <!-- HN Orange Header -->
        <table style="width: 100%; background: #ff6600; border: none; padding: 4px 6px;">
          <tr>
            <td style="width: 18px; padding-right: 6px;">
              <div style="border: 1px solid white; color: white; font-weight: bold; font-size: 12px; width: 18px; height: 18px; text-align: center; line-height: 18px;">Y</div>
            </td>
            <td style="line-height: 12px;">
              <span style="font-weight: bold; font-size: 14px; margin-right: 10px;">Hacker News</span>
              <span style="font-size: 12px; color: #222;">new | past | comments | ask | show | jobs | submit</span>
            </td>
            <td style="text-align: right; font-size: 12px; padding-right: 6px;">login</td>
          </tr>
        </table>

        <!-- Posts List in Desktop Fixed Table Format -->
        <table style="border: 0; margin-top: 10px; width: 100%; font-size: 13px; line-height: 1.5;">
          <tr>
            <td style="vertical-align: top; color: #828282; width: 25px; text-align: right; padding-right: 6px;">1.</td>
            <td style="vertical-align: top; width: 14px; color: #828282;">▲</td>
            <td>
              <a href="#" style="color: #000; text-decoration: none; font-size: 14px;">Show HN: Forced Desktop Browser for Mobile with Viewport Rescaling</a>
              <span style="font-size: 11px; color: #828282;"> (github.com/engine/desktop-mobile)</span>
              <div style="font-size: 10px; color: #828282;">482 points by dev_architect 3 hours ago | hide | 142 comments</div>
            </td>
          </tr>
          <tr style="height: 10px;"></tr>
          <tr>
            <td style="vertical-align: top; color: #828282; width: 25px; text-align: right; padding-right: 6px;">2.</td>
            <td style="vertical-align: top; width: 14px; color: #828282;">▲</td>
            <td>
              <a href="#" style="color: #000; text-decoration: none; font-size: 14px;">Why Mobile WebViews Resist Desktop Viewport Meta Tags</a>
              <span style="font-size: 11px; color: #828282;"> (webkit.org/blog)</span>
              <div style="font-size: 10px; color: #828282;">319 points by browserhacker 5 hours ago | hide | 88 comments</div>
            </td>
          </tr>
          <tr style="height: 10px;"></tr>
          <tr>
            <td style="vertical-align: top; color: #828282; width: 25px; text-align: right; padding-right: 6px;">3.</td>
            <td style="vertical-align: top; width: 14px; color: #828282;">▲</td>
            <td>
              <a href="#" style="color: #000; text-decoration: none; font-size: 14px;">A fast CSS transform matrix for pinch-to-zoom on Canvas and WebViews</a>
              <span style="font-size: 11px; color: #828282;"> (math.stackexchange.com)</span>
              <div style="font-size: 10px; color: #828282;">205 points by raymond 6 hours ago | hide | 43 comments</div>
            </td>
          </tr>
        </table>
      </div>
    `,
  },
  {
    id: 'ecommerce-desktop',
    title: 'Nordic Craft Studio — Multi-Column Desktop Storefront',
    url: 'https://store.nordiccraftstudio.com/collection/workstations',
    favicon: '🪑',
    category: 'ecommerce',
    targetDesktopWidth: 1280,
    htmlContent: `
      <div style="width: 1280px; min-height: 850px; background: #fafaf9; color: #1c1917; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; box-sizing: border-box;">
        <!-- Desktop Header & Mega Menu -->
        <header style="background: #ffffff; border-bottom: 1px solid #e7e5e4; padding: 16px 36px; display: flex; justify-content: space-between; align-items: center;">
          <div style="font-size: 20px; font-weight: 800; letter-spacing: -0.03em;">NORDIC CRAFT</div>
          <nav style="display: flex; gap: 28px; font-size: 14px; font-weight: 500;">
            <span style="color: #0c0a09; border-bottom: 2px solid #0c0a09; padding-bottom: 4px;">Desks & Tables</span>
            <span style="color: #78716c;">Ergonomic Chairs</span>
            <span style="color: #78716c;">Monitor Stands</span>
            <span style="color: #78716c;">Studio Lighting</span>
            <span style="color: #78716c;">Cable Architecture</span>
          </nav>
          <div style="display: flex; gap: 16px; font-size: 13px; font-weight: 500;">
            <span>Search (⌘K)</span>
            <span>Cart (2 items — $1,420)</span>
          </div>
        </header>

        <!-- Desktop 2-Column Store Layout (260px filter sidebar + 4-column product grid) -->
        <div style="display: flex; padding: 32px 36px; gap: 32px;">
          <!-- Left Facet Filter Sidebar (240px) -->
          <div style="width: 240px; shrink: 0;">
            <div style="font-size: 14px; font-weight: 700; margin-bottom: 16px;">Filter Collection (42 items)</div>
            <div style="border-bottom: 1px solid #e7e5e4; padding-bottom: 16px; margin-bottom: 16px;">
              <div style="font-size: 12px; font-weight: 600; color: #57534e; margin-bottom: 8px;">SOLID TIMBER SPECIES</div>
              <div style="font-size: 13px; display: flex; flex-direction: column; gap: 6px; color: #292524;">
                <label><input type="checkbox" checked /> European White Oak (18)</label>
                <label><input type="checkbox" checked /> American Black Walnut (14)</label>
                <label><input type="checkbox" /> Smoked Birch (10)</label>
              </div>
            </div>
            <div style="border-bottom: 1px solid #e7e5e4; padding-bottom: 16px; margin-bottom: 16px;">
              <div style="font-size: 12px; font-weight: 600; color: #57534e; margin-bottom: 8px;">DESKTOP WIDTH</div>
              <div style="font-size: 13px; display: flex; flex-direction: column; gap: 6px; color: #292524;">
                <label><input type="radio" name="w" /> 140 cm Compact</label>
                <label><input type="radio" name="w" checked /> 180 cm Executive</label>
                <label><input type="radio" name="w" /> 220 cm Dual Studio</label>
              </div>
            </div>
          </div>

          <!-- Product 3-Column Desktop Grid -->
          <div style="flex: 1; display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">
            <div style="background: white; border: 1px solid #e7e5e4; border-radius: 12px; overflow: hidden; padding: 16px;">
              <div style="background: #e2e8f0; height: 180px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 36px;">🪵</div>
              <div style="margin-top: 12px; font-size: 11px; font-weight: 600; color: #a8a29e;">OAK ARCHITECTURE</div>
              <div style="font-size: 15px; font-weight: 700; margin: 4px 0;">Kobenhavn 180cm Standing Desk</div>
              <div style="font-size: 14px; font-weight: 600; color: #0c0a09; margin-bottom: 12px;">$1,180.00</div>
              <button style="width: 100%; background: #0c0a09; color: white; border: none; padding: 8px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer;">Add to Workspace</button>
            </div>
            <div style="background: white; border: 1px solid #e7e5e4; border-radius: 12px; overflow: hidden; padding: 16px;">
              <div style="background: #cbd5e1; height: 180px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 36px;">🖥️</div>
              <div style="margin-top: 12px; font-size: 11px; font-weight: 600; color: #a8a29e;">DESK SHELF SYSTEM</div>
              <div style="font-size: 15px; font-weight: 700; margin: 4px 0;">Solid Walnut Dual Monitor Riser</div>
              <div style="font-size: 14px; font-weight: 600; color: #0c0a09; margin-bottom: 12px;">$240.00</div>
              <button style="width: 100%; background: #0c0a09; color: white; border: none; padding: 8px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer;">Add to Workspace</button>
            </div>
            <div style="background: white; border: 1px solid #e7e5e4; border-radius: 12px; overflow: hidden; padding: 16px;">
              <div style="background: #94a3b8; height: 180px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 36px;">💡</div>
              <div style="margin-top: 12px; font-size: 11px; font-weight: 600; color: #a8a29e;">PRECISION ILLUMINATION</div>
              <div style="font-size: 15px; font-weight: 700; margin: 4px 0;">Articulated Studio Task Lamp</div>
              <div style="font-size: 14px; font-weight: 600; color: #0c0a09; margin-bottom: 12px;">$310.00</div>
              <button style="width: 100%; background: #0c0a09; color: white; border: none; padding: 8px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer;">Add to Workspace</button>
            </div>
          </div>
        </div>
      </div>
    `,
  },
];
