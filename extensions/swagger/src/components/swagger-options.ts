import { Service } from '@nodearch/core';
import path from 'path';
import fs from 'fs/promises';
import { SwaggerConfig } from './swagger.config.js';
import { SwaggerAppOptions } from '../interfaces.js';
import { getAbsoluteFSPath } from 'swagger-ui-dist';


@Service()
export class SwaggerOptions {
  
  constructor(
    private readonly swaggerConfig: SwaggerConfig
  ) {}

  async set() {
    const distDir = getAbsoluteFSPath();

    const initCode = this.getInitCode(this.swaggerConfig);

    await fs.writeFile(path.join(distDir, 'swagger-initializer.js'), initCode);
  }
  
  private getInitCode(options: SwaggerAppOptions) {
    return `window.onload = function() {
      window.ui = SwaggerUIBundle({
        url: "${options.url}",
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout"
      });
    };`;
  }
} 