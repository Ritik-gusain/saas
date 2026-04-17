import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, { TextDecoder, TextEncoder });

// Polyfill Headers
if (typeof Headers === 'undefined') {
  global.Headers = class Headers {
    map: Record<string, string> = {};
    constructor(init?: any) {
      if (init) {
        for (const [key, value] of Object.entries(init)) {
          this.map[key.toLowerCase()] = value as string;
        }
      }
    }
    get(name: string) {
      return this.map[name.toLowerCase()] || null;
    }
    set(name: string, value: string) {
      this.map[name.toLowerCase()] = value;
    }
  } as any;
}

// Polyfill Request and Response for API Route Testing
if (typeof Request === 'undefined') {
  global.Request = class Request {
    headers: Headers;
    url: string;
    method: string;
    body: any;
    
    constructor(input: string, init?: any) {
      this.url = input;
      this.method = init?.method || 'GET';
      this.body = init?.body || null;
      this.headers = new global.Headers(init?.headers);
    }
    async json() {
      return JSON.parse(this.body);
    }
  } as any;
}

if (typeof Response === 'undefined') {
  global.Response = class Response {
    status: number;
    body: any;
    headers: Headers;
    
    constructor(body?: any, init?: any) {
      this.body = body;
      this.status = init?.status || 200;
      this.headers = new global.Headers(init?.headers);
    }
    async json() {
      return typeof this.body === 'string' ? JSON.parse(this.body) : this.body;
    }
    static json(data: any, init?: any) {
      return new Response(JSON.stringify(data), {
        ...init,
        headers: { 'content-type': 'application/json', ...init?.headers }
      });
    }
  } as any;
}

