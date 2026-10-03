import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: { root: path.resolve(__dirname, ".."), resolveAlias: { "./dompurify/dompurify.js": "dompurify" } },
  outputFileTracingRoot: path.resolve(__dirname, ".."),
  async headers() {
    return [
      {source:"/:path*",headers:[
        {key:"X-Content-Type-Options",value:"nosniff"},
        {key:"X-Frame-Options",value:"SAMEORIGIN"},
        {key:"Referrer-Policy",value:"strict-origin-when-cross-origin"},
        {key:"Permissions-Policy",value:"camera=(), microphone=(), geolocation=(), payment=()"},
        ...(process.env.NODE_ENV==="production"?[{key:"Strict-Transport-Security",value:"max-age=31536000"}]:[]),
      ]},
      ...["/","/start","/debugging","/companion","/projects","/foundations","/curriculum","/learn/:path*","/patterns/:path*","/practice","/solve/:path*","/progress","/design/:path*","/account/:path*"].map(source=>({source,headers:[{key:"Content-Security-Policy",value:"base-uri 'self'; object-src 'none'; frame-ancestors 'self'; form-action 'self'"}]})),
      ...["/python-runtime/:path*", "/runner-assets/:path*"].map(source=>({source,headers:[{key:"Access-Control-Allow-Origin",value:"*"},{key:"Cross-Origin-Resource-Policy",value:"cross-origin"},{key:"Cache-Control",value:"public, max-age=86400"}]})),
    ];
  },
};

export default nextConfig;
