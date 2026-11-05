/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  centsToFrequency,
  calculateHarmonicSeries,
  MICROTONAL_CONSTANTS,
  MODAL_CONTINUUM_SYSTEMS,
  CARTOGRAPHIC_NODES,
  TRANSMISSION_ROUTES,
  AKSAK_METERS,
} from './acousticMath';

test('centsToFrequency calculates accurate equal-temperament A4', () => {
  // A4 is 9 semitones above C4: 9 semitones, 0 cents
  const freqA4 = centsToFrequency(9, 0, 440);
  assert.ok(Math.abs(freqA4 - 440) < 0.01, `Expected ~440Hz, got ${freqA4}`);
});

test('centsToFrequency calculates Persian Koron (-50 cents) correctly', () => {
  // E4 is 4 semitones above C4 (approx 329.63 Hz). With -50 cents koron, it should be lower
  const freqE4Natural = centsToFrequency(4, 0, 440);
  const freqE4Koron = centsToFrequency(4, MICROTONAL_CONSTANTS.PERSIAN_KORON, 440);
  assert.ok(freqE4Koron < freqE4Natural, 'Koron must lower the frequency');
  // 50 cents ratio is 2^(-50/1200) = ~0.9715
  const ratio = freqE4Koron / freqE4Natural;
  assert.ok(Math.abs(ratio - Math.pow(2, -50 / 1200)) < 0.001);
});

test('calculateHarmonicSeries generates correct harmonics and amplitudes', () => {
  const harmonics = calculateHarmonicSeries(220, 4, 'struck_metallic');
  assert.equal(harmonics.length, 4);
  assert.equal(harmonics[0].frequency, 220);
  assert.equal(harmonics[1].frequency, 440);
  assert.equal(harmonics[2].frequency, 660);
  assert.equal(harmonics[3].frequency, 880);
  assert.ok(harmonics[0].amplitude > 0);
});

test('modal continuum systems include Persian, Ottoman, Byzantine and Romanian traditions', () => {
  assert.ok(MODAL_CONTINUUM_SYSTEMS.length >= 4);
  const shur = MODAL_CONTINUUM_SYSTEMS.find(m => m.id === 'dastgah-shur');
  assert.ok(shur);
  const koronNote = shur?.notes.find(n => n.centOffset === -50);
  assert.ok(koronNote, 'Shur must contain the iconic Koron microtone');

  const doina = MODAL_CONTINUUM_SYSTEMS.find(m => m.id === 'romanian-doina-carpathian');
  assert.ok(doina);
  assert.ok(doina?.notes.length >= 7);
});

test('cartographic nodes span from Iranian Plateau to Carpathian Basin', () => {
  assert.ok(CARTOGRAPHIC_NODES.length >= 10);
  // Verify coordinate bounds within 21:9 canvas (2100 x 900)
  for (const node of CARTOGRAPHIC_NODES) {
    assert.ok(node.x >= 0 && node.x <= 2100, `Node ${node.id} x out of range: ${node.x}`);
    assert.ok(node.y >= 0 && node.y <= 900, `Node ${node.id} y out of range: ${node.y}`);
  }
  // Check presence of key terminals
  const isfahan = CARTOGRAPHIC_NODES.find(n => n.id === 'node-isfahan');
  const bucharest = CARTOGRAPHIC_NODES.find(n => n.id === 'node-bucharest');
  const istanbul = CARTOGRAPHIC_NODES.find(n => n.id === 'node-istanbul');
  assert.ok(isfahan && bucharest && istanbul);
});

test('transmission routes contain Scythian, Romani, and Ottoman historical paths', () => {
  assert.equal(TRANSMISSION_ROUTES.length, 3);
  const scythian = TRANSMISSION_ROUTES.find(r => r.id === 'scythian-alan');
  const romani = TRANSMISSION_ROUTES.find(r => r.id === 'romani-diaspora');
  const ottoman = TRANSMISSION_ROUTES.find(r => r.id === 'ottoman-saray');
  assert.ok(scythian && romani && ottoman);
});

test('aksak rhythmic meters are correctly structured', () => {
  const ruchenitsa = AKSAK_METERS.find(m => m.id === 'ruchenitsa-7-8');
  assert.ok(ruchenitsa);
  assert.deepEqual(ruchenitsa?.subdivisions, [2, 2, 3]);
  const sum = ruchenitsa?.subdivisions.reduce((a, b) => a + b, 0);
  assert.equal(sum, 7);
});
