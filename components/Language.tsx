'use client';
import {createContext,useContext,useState,ReactNode,useEffect} from 'react';
export type Lang='es'|'en';
const Context=createContext({lang:'es' as Lang,setLang:(_l:Lang)=>{}});
export function LanguageProvider({children}:{children:ReactNode}){const [lang,setLang]=useState<Lang>('es');useEffect(()=>{document.documentElement.lang=lang},[lang]);return <Context.Provider value={{lang,setLang}}>{children}</Context.Provider>}
export const useLanguage=()=>useContext(Context);
export function LanguageSwitch(){const {lang,setLang}=useLanguage();return <div className="language" aria-label="Language / Idioma">{(['es','en'] as Lang[]).map(l=><button type="button" key={l} aria-pressed={lang===l} onClick={()=>setLang(l)}>{l.toUpperCase()}</button>)}</div>}
