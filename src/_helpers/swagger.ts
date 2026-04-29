// src/_helpers/swagger.ts
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

export function swaggerDocs(app: express.Application): void {
  const swaggerFile = fs.readFileSync(
    path.join(__dirname, '../../swagger.yaml'),
    'utf8'
  );
  const swaggerDocument = yaml.load(swaggerFile) as object;
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}