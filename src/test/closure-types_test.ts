/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt The complete set of authors may be found
 * at http://polymer.github.io/AUTHORS.txt The complete set of contributors may
 * be found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by
 * Google as part of the polymer project is also subject to an additional IP
 * rights grant found at http://polymer.github.io/PATENTS.txt
 */

import {assert} from 'chai';

import {closureParamToTypeScript, closureTypeToTypeScript} from '../closure-types';
import {serializeType} from '../ts-serialize';

suite('closureTypeToTypeScript', () => {

  function check(closureType: string, expectedType: string) {
    const actualType = serializeType(closureTypeToTypeScript(closureType));
    assert.equal(actualType, expectedType);
  }

  test('primitives', () => {
    check('string', 'string');
    check('boolean', 'boolean');
    check('number', 'number');
  });

  test('nullable primitives', () => {
    check('?string', 'string|null');
    check('?boolean', 'boolean|null');
    check('?string', 'string|null');
  });

  test('all type', () => {
    check('*', 'any');
  });

  test('unknown type', () => {
    check('?', 'any');
  });

  test('null', () => {
    check('null', 'null');
  });

  test('undefined', () => {
    check('undefined', 'undefined');
  });

  test('nullable object', () => {
    check('Object', 'Object|null');
    check('?Object', 'Object|null');
  });

  test('non-nullable object', () => {
    check('!Object', 'Object');
  });

  test('nullable array', () => {
    check('Array<string>', 'string[]|null');
    check('?Array<string>', 'string[]|null');
  });

  test('non-nullable array', () => {
    check('!Array<string>', 'string[]');
  });

  test('bare array', () => {
    check('Array', 'any[]|null');
    check('?Array', 'any[]|null');
    check('!Array', 'any[]');
  });

  test('union', () => {
    check('string|number', 'string|number');
  });

  test('paren edge cases', () => {
    check('(string)', 'string');
    check('((string))', 'string');

    check('(string|number)', 'string|number');
    check('(string)|(number)', 'string|number');
    check('((string)|(number))', 'string|number');

    check('!Array<((string|number))>', 'Array<string|number>');
  });

  test('nested array', () => {
    check('!Array<!Array<string>>', 'Array<string[]>');
  });

  test('array union', () => {
    check('!Array<string|number>', 'Array<string|number>');
  });

  test('function', () => {
    check('function()', '() => any');
    check('!function()', '() => any');
    check('?function()', '(() => any)|null');

    check(
        'function(string, number): boolean',
        '(p0: string, p1: number) => boolean');
  });

  test('function object', () => {
    check('Function', 'Function|null');
    check('?Function', 'Function|null');
    check('!Function', 'Function');
  });

  test('returns any when invalid', () => {
    check('><', 'any');
  });
});

suite('closureParamToTypeScript', () => {

  function check(
      closureType: string, expectedType: string, expectedOptional: boolean) {
    const {type: actualType, optional: actualOptional} =
        closureParamToTypeScript(closureType);
    assert.equal(serializeType(actualType), expectedType);
    assert.equal(actualOptional, expectedOptional);
  }

  test('optional string', () => {
    check('string=', 'string', true);
  });

  test('required string', () => {
    check('string', 'string', false);
  });

  test('optional array', () => {
    check('Array=', 'any[]|null', true);
  });

  test('required array', () => {
    check('Array', 'any[]|null', false);
  });

  test('invalid required', () => {
    check('><', 'any', false);
  });

  test('invalid optional', () => {
    check('><=', 'any', true);
  });
});