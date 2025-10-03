#!/usr/bin/env node

/**
 * MCP Server для поиска изображений Google Images
 * Для использования с Claude в Cursor
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Конфигурация Google Images API
const GOOGLE_API_KEY = 'AIzaSyCRNpY7Tb4MrIgGu088sn7h6yYlvfu1LGE';
const SEARCH_ENGINE_ID = '92713e087edb0478b';
const BASE_URL = 'https://www.googleapis.com/customsearch/v1';

class GoogleImagesServer {
  constructor() {
    this.server = new Server(
      {
        name: 'google-images-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    
    // Обработка ошибок
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupToolHandlers() {
    // Список доступных инструментов
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'search_image',
          description: 'Поиск изображений в Google Images по запросу',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Поисковый запрос для изображений',
              },
              count: {
                type: 'number',
                description: 'Количество результатов (1-10, по умолчанию 2)',
                minimum: 1,
                maximum: 10,
                default: 2,
              },
              safe: {
                type: 'string',
                enum: ['off', 'medium', 'high'],
                description: 'Уровень безопасного поиска (по умолчанию off)',
                default: 'off',
              },
              startIndex: {
                type: 'number',
                description: 'Начальный индекс для пагинации (не нужен для первого поиска)',
                minimum: 1,
              },
            },
            required: ['query'],
          },
        },
        {
          name: 'persist_image',
          description: 'Сохранение изображения по URL в папку проекта',
          inputSchema: {
            type: 'object',
            properties: {
              url: {
                type: 'string',
                format: 'uri',
                description: 'URL изображения для сохранения',
              },
              targetPath: {
                type: 'string',
                description: 'Папка для сохранения (относительно текущего workspace)',
              },
              workspacePath: {
                type: 'string',
                description: 'Абсолютный путь к текущему workspace',
              },
            },
            required: ['url', 'targetPath', 'workspacePath'],
          },
        },
      ],
    }));

    // Обработка вызовов инструментов
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'search_image':
            return await this.searchImages(args);
          case 'persist_image':
            return await this.persistImage(args);
          default:
            throw new Error(`Неизвестный инструмент: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Ошибка выполнения ${name}: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async searchImages({ query, count = 2, safe = 'off', startIndex }) {
    try {
      const url = new URL(BASE_URL);
      url.searchParams.set('key', GOOGLE_API_KEY);
      url.searchParams.set('cx', SEARCH_ENGINE_ID);
      url.searchParams.set('q', query);
      url.searchParams.set('searchType', 'image');
      url.searchParams.set('num', Math.min(count, 10).toString());
      url.searchParams.set('safe', safe);
      
      if (startIndex) {
        url.searchParams.set('start', startIndex.toString());
      }

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.items || data.items.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: `По запросу "${query}" изображения не найдены.`,
            },
          ],
        };
      }

      const results = data.items.map((item, index) => ({
        title: item.title || `Изображение ${index + 1}`,
        url: item.link,
        thumbnailUrl: item.image?.thumbnailLink,
        width: item.image?.width || 0,
        height: item.image?.height || 0,
        size: item.image?.byteSize || 0,
        format: item.fileFormat || 'unknown',
        source: item.displayLink,
        contextUrl: item.image?.contextLink,
      }));

      const resultText = `Найдено ${results.length} изображений по запросу "${query}":\n\n` +
        results.map((img, i) => 
          `${i + 1}. ${img.title}\n` +
          `   URL: ${img.url}\n` +
          `   Размер: ${img.width}×${img.height}\n` +
          `   Формат: ${img.format}\n` +
          `   Источник: ${img.source}\n`
        ).join('\n');

      return {
        content: [
          {
            type: 'text',
            text: resultText,
          },
        ],
      };

    } catch (error) {
      throw new Error(`Ошибка поиска изображений: ${error.message}`);
    }
  }

  async persistImage({ url, targetPath, workspacePath }) {
    try {
      // Создаем полный путь к целевой папке
      const fullTargetPath = path.resolve(workspacePath, targetPath);
      
      // Создаем папку если не существует
      await fs.mkdir(fullTargetPath, { recursive: true });

      // Скачиваем изображение
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Не удалось скачать изображение: HTTP ${response.status}`);
      }

      // Определяем имя файла
      const urlObj = new URL(url);
      let filename = path.basename(urlObj.pathname);
      
      if (!filename || filename === '/') {
        const contentType = response.headers.get('content-type');
        const ext = this.getExtensionFromMimeType(contentType) || '.jpg';
        filename = `image_${Date.now()}${ext}`;
      }

      // Сохраняем файл
      const filePath = path.join(fullTargetPath, filename);
      const buffer = await response.buffer();
      await fs.writeFile(filePath, buffer);

      const relativePath = path.relative(workspacePath, filePath);

      return {
        content: [
          {
            type: 'text',
            text: `Изображение успешно сохранено:\n` +
                  `Путь: ${relativePath}\n` +
                  `Размер: ${(buffer.length / 1024).toFixed(1)} KB\n` +
                  `Полный путь: ${filePath}`,
          },
        ],
      };

    } catch (error) {
      throw new Error(`Ошибка сохранения изображения: ${error.message}`);
    }
  }

  getExtensionFromMimeType(mimeType) {
    const extensions = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp',
      'image/svg+xml': '.svg',
      'image/bmp': '.bmp',
    };
    return extensions[mimeType] || '.jpg';
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Google Images MCP Server запущен');
  }
}

// Запуск сервера
const server = new GoogleImagesServer();
server.run().catch(console.error);
