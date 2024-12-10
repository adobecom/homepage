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

/**
 * The decision engine for where to get Milo's libs from.
 */
export const [setLibs, getLibs] = (() => {
  let libs;
  return [
    (prodLibs, location) => {
      libs = (() => {
        const { hostname, search } = location || window.location;
        if (hostname.includes('stage.adobe.com')) {
          return "https://stage--milo--adobecom.aem.live/libs";
        }
        if (!['.hlx.', '.aem.', 'local'].some((i) => hostname.includes(i))) return prodLibs;
        const branch = new URLSearchParams(search).get('milolibs') || 'main';
        // Validate the branch name to mitigate potential security risks
        if (!/^[a-zA-Z0-9-_]+$/.test(branch)) {
          throw new Error("Invalid branch name.");
        }
        if (branch === 'local') return 'http://localhost:6456/libs';
        return branch.includes('--') ? `https://${branch}.aem.live/libs` : `https://${branch}--milo--adobecom.aem.live/libs`;
      })();
      return libs;
    }, () => libs,
  ];
})();
