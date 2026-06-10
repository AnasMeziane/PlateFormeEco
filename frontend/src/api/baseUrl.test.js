import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { normalizeApiBaseUrl, normalizeStorageBaseUrl } from './baseUrl.js';

describe('normalizeApiBaseUrl', () => {
  it('uses the local Laravel API when no URL is configured', () => {
    assert.equal(normalizeApiBaseUrl(), 'http://localhost:8000/api');
  });

  it('trims whitespace and trailing slashes from a configured URL', () => {
    assert.equal(normalizeApiBaseUrl(' /api/// '), '/api');
  });
});

describe('normalizeStorageBaseUrl', () => {
  it('uses the local Laravel storage URL when no URL is configured', () => {
    assert.equal(normalizeStorageBaseUrl(), 'http://localhost:8000/storage/');
  });

  it('keeps exactly one trailing slash on a configured URL', () => {
    assert.equal(normalizeStorageBaseUrl(' /storage/// '), '/storage/');
  });
});
