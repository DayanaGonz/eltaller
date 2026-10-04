import type {NextConfig} from 'next';
const pages=process.env.GITHUB_PAGES==='true';
const config:NextConfig={devIndicators:false,...(pages?{output:'export',basePath:'/eltaller',trailingSlash:true}:{}),images:{unoptimized:pages,formats:['image/avif','image/webp']}};
export default config;
