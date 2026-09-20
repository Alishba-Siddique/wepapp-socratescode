import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: { root: path.resolve(__dirname, ".."), resolveAlias: { "./dompurify/dompurify.js": "dompurify" } },
  outputFileTracingRoot: path.resolve(__dirname, ".."),
  async headers() {
    return ["/python-runtime/:path*", "/runner-assets/:path*"].map(source=>({source,headers:[{key:"Access-Control-Allow-Origin",value:"*"},{key:"Cross-Origin-Resource-Policy",value:"cross-origin"},{key:"Cache-Control",value:"public, max-age=86400"}]}));
  },
};

export default nextConfig;
