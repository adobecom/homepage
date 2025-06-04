/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { setLibs } from './utils.js';

const ACOM_SIGNED_IN_STATUS = 'acomsis';
const ACOM_SIGNED_IN_STATUS_STAGE = 'acomsis_stage';
const STYLES = '/homepage/styles/styles.css';
const LIBS = '/libs';
const ENVS = {
  stage: { edgeConfigId: 'e065836d-be57-47ef-b8d1-999e1657e8fd' },
  prod: { edgeConfigId: '913eac4d-900b-45e8-9ee7-306216765cd2' }
}
ENVS.local = {
  ...ENVS.stage,
  name: 'local',
};

const locales = {
  // Americas
  ar: { ietf: 'es-AR', tk: 'oln4yqj.css' },
  br: { ietf: 'pt-BR', tk: 'inq1xob.css' },
  ca: { ietf: 'en-CA', tk: 'pps7abe.css' },
  ca_fr: { ietf: 'fr-CA', tk: 'vrk5vyv.css' },
  cl: { ietf: 'es-CL', tk: 'oln4yqj.css' },
  co: { ietf: 'es-CO', tk: 'oln4yqj.css' },
  la: { ietf: 'es-DO', tk: 'oln4yqj.css' },
  mx: { ietf: 'es-MX', tk: 'oln4yqj.css' },
  pe: { ietf: 'es-PE', tk: 'oln4yqj.css' },
  '': { ietf: 'en-US', tk: 'hah7vzn.css' },
  // EMEA
  africa: { ietf: 'en', tk: 'pps7abe.css' },
  be_fr: { ietf: 'fr-BE', tk: 'vrk5vyv.css' },
  be_en: { ietf: 'en-BE', tk: 'pps7abe.css' },
  be_nl: { ietf: 'nl-BE', tk: 'cya6bri.css' },
  cy_en: { ietf: 'en-CY', tk: 'pps7abe.css' },
  dk: { ietf: 'da-DK', tk: 'aaz7dvd.css' },
  de: { ietf: 'de-DE', tk: 'vin7zsi.css' },
  ee: { ietf: 'et-EE', tk: 'aaz7dvd.css' },
  es: { ietf: 'es-ES', tk: 'oln4yqj.css' },
  fr: { ietf: 'fr-FR', tk: 'vrk5vyv.css' },
  gr_en: { ietf: 'en-GR', tk: 'pps7abe.css' },
  ie: { ietf: 'en-GB', tk: 'pps7abe.css' },
  il_en: { ietf: 'en-IL', tk: 'pps7abe.css' },
  it: { ietf: 'it-IT', tk: 'bbf5pok.css' },
  lv: { ietf: 'lv-LV', tk: 'aaz7dvd.css' },
  lt: { ietf: 'lt-LT', tk: 'aaz7dvd.css' },
  lu_de: { ietf: 'de-LU', tk: 'vin7zsi.css' },
  lu_en: { ietf: 'en-LU', tk: 'pps7abe.css' },
  lu_fr: { ietf: 'fr-LU', tk: 'vrk5vyv.css' },
  hu: { ietf: 'hu-HU', tk: 'aaz7dvd.css' },
  mt: { ietf: 'en-MT', tk: 'pps7abe.css' },
  mena_en: { ietf: 'en', tk: 'pps7abe.css' },
  nl: { ietf: 'nl-NL', tk: 'cya6bri.css' },
  no: { ietf: 'no-NO', tk: 'aaz7dvd.css' },
  pl: { ietf: 'pl-PL', tk: 'aaz7dvd.css' },
  pt: { ietf: 'pt-PT', tk: 'inq1xob.css' },
  ro: { ietf: 'ro-RO', tk: 'aaz7dvd.css' },
  sa_en: { ietf: 'en', tk: 'pps7abe.css' },
  ch_de: { ietf: 'de-CH', tk: 'vin7zsi.css' },
  si: { ietf: 'sl-SI', tk: 'aaz7dvd.css' },
  sk: { ietf: 'en-SK', tk: 'aaz7dvd.css' },
  ch_fr: { ietf: 'fr-CH', tk: 'vrk5vyv.css' },
  fi: { ietf: 'fi-FI', tk: 'aaz7dvd.css' },
  se: { ietf: 'sv-SE', tk: 'fpk1pcd.css' },
  ch_it: { ietf: 'it-CH', tk: 'bbf5pok.css' },
  tr: { ietf: 'tr-TR', tk: 'aaz7dvd.css' },
  ae_en: { ietf: 'en', tk: 'pps7abe.css' },
  uk: { ietf: 'en-GB', tk: 'pps7abe.css' },
  at: { ietf: 'de-AT', tk: 'vin7zsi.css' },
  cz: { ietf: 'cs-CZ', tk: 'aaz7dvd.css' },
  bg: { ietf: 'bg-BG', tk: 'aaz7dvd.css' },
  ru: { ietf: 'ru-RU', tk: 'aaz7dvd.css' },
  ua: { ietf: 'uk-UA', tk: 'aaz7dvd.css' },
  il_he: { ietf: 'he', tk: 'nwq1mna.css', dir: 'rtl' },
  ae_ar: { ietf: 'ar', tk: 'nwq1mna.css', dir: 'rtl' },
  mena_ar: { ietf: 'ar', tk: 'dis2dpj.css', dir: 'rtl' },
  sa_ar: { ietf: 'ar', tk: 'nwq1mna.css', dir: 'rtl' },
  // Asia Pacific
  au: { ietf: 'en-AU', tk: 'pps7abe.css' },
  hk_en: { ietf: 'en-HK', tk: 'pps7abe.css' },
  in: { ietf: 'en-GB', tk: 'pps7abe.css' },
  id_id: { ietf: 'id', tk: 'czc0mun.css' },
  id_en: { ietf: 'en', tk: 'pps7abe.css' },
  my_ms: { ietf: 'ms', tk: 'sxj4tvo.css' },
  my_en: { ietf: 'en-GB', tk: 'pps7abe.css' },
  nz: { ietf: 'en-GB', tk: 'pps7abe.css' },
  ph_en: { ietf: 'en', tk: 'pps7abe.css' },
  ph_fil: { ietf: 'fil-PH', tk: 'ict8rmp.css' },
  sg: { ietf: 'en-SG', tk: 'pps7abe.css' },
  th_en: { ietf: 'en', tk: 'pps7abe.css' },
  in_hi: { ietf: 'hi', tk: 'aaa8deh.css' },
  th_th: { ietf: 'th', tk: 'aaz7dvd.css' },
  cn: { ietf: 'zh-CN', tk: 'puu3xkp' },
  hk_zh: { ietf: 'zh-HK', tk: 'jay0ecd' },
  tw: { ietf: 'zh-TW', tk: 'jay0ecd' },
  jp: { ietf: 'ja-JP', tk: 'dvg6awq' },
  kr: { ietf: 'ko-KR', tk: 'qjs5sfm' },
  // Langstore Support.
  langstore: { ietf: 'en-US', tk: 'hah7vzn.css' },
  // geo expansion MWPW-124903
  za: { ietf: 'en-GB', tk: 'pps7abe.css' }, // South Africa (GB English)
  ng: { ietf: 'en-GB', tk: 'pps7abe.css' }, // Nigeria (GB English)
  cr: { ietf: 'es-CR', tk: 'oln4yqj.css' }, // Costa Rica (Spanish Latin America)
  ec: { ietf: 'es-EC', tk: 'oln4yqj.css' }, // Ecuador (Spanish Latin America)
  pr: { ietf: 'es-US', tk: 'oln4yqj.css' }, // Puerto Rico (Spanish Latin America)
  gt: { ietf: 'es-GT', tk: 'oln4yqj.css' }, // Guatemala (Spanish Latin America)
  eg_ar: { ietf: 'ar', tk: 'nwq1mna.css', dir: 'rtl' }, // Egypt (Arabic)
  kw_ar: { ietf: 'ar', tk: 'nwq1mna.css', dir: 'rtl' }, // Kuwait (Arabic)
  qa_ar: { ietf: 'ar', tk: 'nwq1mna.css', dir: 'rtl' }, // Quatar (Arabic)
  eg_en: { ietf: 'en-GB', tk: 'pps7abe.css' }, // Egypt (GB English)
  kw_en: { ietf: 'en-GB', tk: 'pps7abe.css' }, // Kuwait (GB English)
  qa_en: { ietf: 'en-GB', tk: 'pps7abe.css' }, // Qatar (GB English)
  gr_el: { ietf: 'el', tk: 'fnx0rsr.css' }, // Greece (Greek)
  el: { ietf: 'el', tk: 'aaz7dvd.css' },
  vn_vi: { ietf: 'vi', tk: 'jii8bki.css' },
  vn_en: { ietf: 'en-GB', tk: 'pps7abe.css' },
  cis_en: { ietf: 'en', tk: 'rks2kng.css' },
  cis_ru: { ietf: 'ru', tk: 'qxw8hzm.css' },
};

const stageDomainsMap = {
  'www.stage.adobe.com': {
    'www.adobe.com': 'origin',
    'business.adobe.com': 'business.stage.adobe.com',
    'learning.adobe.com': 'learning.stage.adobe.com',
    'helpx.adobe.com': 'helpx.stage.adobe.com',
    'blog.adobe.com': 'blog.stage.adobe.com',
    'developer.adobe.com': 'developer-stage.adobe.com',
    'news.adobe.com': 'news.stage.adobe.com',
    'firefly.adobe.com': 'firefly-stage.corp.adobe.com',
    'creativecloud.adobe.com': 'stage.creativecloud.adobe.com',
    'projectneo.adobe.com': 'stg.projectneo.adobe.com',
  },
  '.graybox.adobe.com': { 'www.stage.adobe.com': 'origin' },
  '.business-graybox.adobe.com': { 'business.stage.adobe.com': 'origin' },
};

// Add any config options.
const CONFIG = {
  ...ENVS,
  chimeraOrigin: 'homepage',
  codeRoot: '/homepage',
  contentRoot: '/homepage',
  imsClientId: 'homepage_milo',
  prodDomains: ['stock.adobe.com', 'helpx.adobe.com', 'business.adobe.com', 'www.adobe.com', 'blog.adobe.com'],
  stageDomainsMap,
  geoRouting: 'on',
  fallbackRouting: 'on',
  locales,
  decorateArea,
  jarvis: {
    id: 'homepage_loggedout_default',
    version: '1.83',
    onDemand: true,
  }
};

/*
 * ------------------------------------------------------------
 * Edit below at your own risk
 * ------------------------------------------------------------
 */

function replaceDotMedia(elem = document) {
  const resetAttributeBase = (tag, attr) => {
    elem.querySelectorAll(`${tag}[${attr}^="./media_"]`).forEach((el) => {
      el[attr] = `${new URL(`${CONFIG.contentRoot}${el.getAttribute(attr).substring(1)}`, window.location).href}`;
    });
  };
  resetAttributeBase('img', 'src');
  resetAttributeBase('source', 'srcset');
}

function decorateArea(area = document, options = {}) {
  const lcpImageUpdate = (img) => {
    img.setAttribute('loading', 'eager');
    img.setAttribute('fetchpriority', 'high');
  };

  replaceDotMedia(area);
  
  (function loadLCPImage() {
    const { fragmentLink } = options;
    const lcpImg = area.querySelector('img');
    const documentHasEagerImg = document.querySelector('img[fetchpriority="high"]');
    if (!lcpImg || documentHasEagerImg) return;
    
    // For fragment LCP
    if (fragmentLink) {
      const isFirstFragment = fragmentLink === document.querySelector('a.fragment');
      if (!documentHasEagerImg && isFirstFragment) {
        lcpImageUpdate(lcpImg);
        return;
      }
    }
    
    // For non-fragment
    const sectionMetadataBg = area.querySelector('main > div:first-child > .section-metadata img');
    if (sectionMetadataBg) {
      lcpImageUpdate(sectionMetadataBg);
      return;
    }
    lcpImageUpdate(lcpImg);
  }());
}
decorateArea();


const miloLibs = setLibs(LIBS);

const getCookie = (name) => document.cookie
  .split('; ')
  .find((row) => row.startsWith(`${name}=`))
  ?.split('=')[1];

async function imsCheck() {
  const { host, pathname } = window.location;
  // no need to check IMS for these cases:
  if (!host.includes('adobe.com') || pathname.split('/').at(-1).startsWith('media_')) return false;
  
  const { loadIms, setConfig } = await import(`${miloLibs}/utils/utils.js`);
  setConfig({ ...CONFIG, miloLibs });
  let isSignedInUser = false;
  try {
    await loadIms();
    if (window.adobeIMS?.isSignedInUser()) {
      await window.adobeIMS.validateToken();
      // validate token rejects and falls into the following catch block.
      isSignedInUser = true;
    }
  } catch(e) {
    window.lana?.log('Homepage IMS check failed', e);
  }
  if (!isSignedInUser) {
    document.getElementById('ims-body-style')?.remove();
  }
  return isSignedInUser;
}

function loadStyles() {
  const paths = [`${miloLibs}/styles/styles.css`];
  if (STYLES) { paths.push(STYLES); }
  paths.forEach((path) => {
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', path);
    document.head.appendChild(link);
  });
}

(async function loadPage() {
  loadStyles();
  const { loadArea, setConfig, loadLana } = await import(`${miloLibs}/utils/utils.js`);
  setConfig({ ...CONFIG, miloLibs });
  loadLana({ clientId: 'homepage' });
  
  const loadAreaPromise = loadArea();
  const isStage = window.location.host.includes('stage');
  
  const getRedirectUri = () => {
    if (!window.adobeIMS) return '';

    const baseURL = `${isStage ? 'https://www.stage.adobe.com' : 'https://www.adobe.com'}`;
    const pathname = window.location.pathname.slice(1, -1);
    
    // China & SEA should not redirect
    if (pathname === 'cn' || pathname === 'sea') return '';
    
    // return with ?acomLocale parameter if it is not root
    return `${baseURL}/home${pathname ? `?acomLocale=${pathname}` : ''}`;
  }

  imsCheck().then(isSignedInUser => {
    const signedInCookie = isStage ? getCookie(ACOM_SIGNED_IN_STATUS_STAGE) : getCookie(ACOM_SIGNED_IN_STATUS);
    const redirectUri = getRedirectUri();
    if (redirectUri) window.adobeIMS.adobeIdData.redirect_uri = redirectUri;
    
    if (isSignedInUser && !signedInCookie) {
      const date = new Date();
      date.setTime(date.getTime() + (365*24*60*60*1000));
      document.cookie = `${isStage ? ACOM_SIGNED_IN_STATUS_STAGE : ACOM_SIGNED_IN_STATUS}=1;path=/;expires=${date.toUTCString()};domain=${isStage ? 'www.stage.' : ''}adobe.com;`;
      window.location.reload();
    }
    if (!isSignedInUser && signedInCookie) {
      if (!isStage) {
        document.cookie = `${ACOM_SIGNED_IN_STATUS}=;path=/;expires=${new Date(0).toUTCString()};`;
        document.cookie = `${ACOM_SIGNED_IN_STATUS}=;path=/;expires=${new Date(0).toUTCString()};domain=adobe.com;`;
      } else {
        document.cookie = `${ACOM_SIGNED_IN_STATUS_STAGE}=;path=/;expires=${new Date(0).toUTCString()};domain=www.stage.adobe.com;`;
      }
      window.location.reload();
    }
    if (signedInCookie && isSignedInUser && !window.location.href.includes('/fragments/')) {
      window.location.reload();
    }
  });
  
  // for media_ update for feds
  const observeCallback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      replaceDotMedia(mutation.target);
    }
  };
  const observer = new MutationObserver(observeCallback);
  observer.observe(document.querySelector('header'), { childList: true, subtree: true });
  observer.observe(document.querySelector('footer'), { childList: true, subtree: true });

  await loadAreaPromise;
}());
