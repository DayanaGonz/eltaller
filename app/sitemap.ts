export const dynamic='force-static';
import type {MetadataRoute} from 'next';import {config} from '@/lib/config';export default function sitemap():MetadataRoute.Sitemap{return config.site?['','/experiencias','/colabora'].map(path=>({url:config.site+path})):[]}
