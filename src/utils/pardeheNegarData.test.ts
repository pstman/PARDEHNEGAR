/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Unit tests for PardehNegar data structures & musical calculations
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PERSIAN_DASTGAH_DATA,
  CLASSICAL_SCALES_DATA,
  FIFTHS_WHEEL_DATA,
  RHYTHM_PRESETS,
  AUTHOR_CREDITS,
  NOTE_NAMES,
  RESEARCH_PDF_DOCS,
  SCHOLARLY_TREATISE_CHAPTERS
} from './pardeheNegarData';

test('12 Persian Dastgahs and Avazes are correctly defined with 4-string violin kook and repertoire', () => {
  assert.ok(PERSIAN_DASTGAH_DATA.length >= 12, 'Must contain all 12 dastgahs and avazes (including variants)');

  for (const dastgah of PERSIAN_DASTGAH_DATA) {
    assert.ok(dastgah.id, 'Dastgah must have an id');
    assert.ok(dastgah.name, 'Dastgah must have a name');
    assert.ok(dastgah.notes.length >= 7, `${dastgah.name} must have at least 7 scale degrees`);
    assert.ok(dastgah.kookViolin.length === 4, `${dastgah.name} must specify all 4 violin strings`);
    assert.ok(dastgah.motifMelody.length > 0, `${dastgah.name} must have a motif melody`);
    assert.ok(dastgah.repertoire && dastgah.repertoire.length > 0, `${dastgah.name} must have repertoire pieces`);

    // Verify string order 1 to 4
    assert.equal(dastgah.kookViolin[0].stringNumber, 1);
    assert.equal(dastgah.kookViolin[3].stringNumber, 4);

    // Verify witness (shahed) and pause (ist) notes
    assert.ok(dastgah.shahedMidi !== undefined, `${dastgah.name} must have shahedMidi`);
    assert.ok(dastgah.istMidi !== undefined, `${dastgah.name} must have istMidi`);
  }
});

test('Classical scales and Circle of Fifths contain complete 12 keys', () => {
  assert.ok(CLASSICAL_SCALES_DATA.length >= 13, 'Must contain 12 major keys + chromatic');
  assert.equal(FIFTHS_WHEEL_DATA.length, 12, 'Wheel must contain 12 clock positions');

  // Verify Circle of Fifths angles and relative minors
  FIFTHS_WHEEL_DATA.forEach((pos, idx) => {
    assert.equal(pos.angle, idx * 30, `Position ${pos.major} should be at ${idx * 30} degrees`);
    assert.ok(pos.triadMidi.length === 3, 'Must have 3 triad notes (Root, 3rd, 5th)');
    assert.ok(pos.tritone, 'Must specify opposing tritone note');
  });

  // Verify C Major triad (60, 64, 67 = C4, E4, G4)
  const cMaj = FIFTHS_WHEEL_DATA[0];
  assert.equal(cMaj.major, 'C');
  assert.deepEqual(cMaj.triadMidi, [60, 64, 67]);
});

test('Rhythm presets have valid hits matching subdivisions, counting text, and mnemonics', () => {
  assert.ok(RHYTHM_PRESETS.length >= 6);

  for (const preset of RHYTHM_PRESETS) {
    assert.ok(preset.countingText, `${preset.name} must have countingText`);
    assert.ok(preset.mnemonicSyllables.length > 0, `${preset.name} must have mnemonicSyllables`);
    assert.equal(preset.hits.length, preset.mnemonicSyllables.length, `${preset.name} hits count must match syllables`);
  }

  const chaharmezrab = RHYTHM_PRESETS.find(p => p.id === 'chaharmezrab_6_8');
  assert.ok(chaharmezrab);
  assert.equal(chaharmezrab?.hits.length, 6);

  const ruchenitsa = RHYTHM_PRESETS.find(p => p.id === 'ruchenitsa_7_8');
  assert.ok(ruchenitsa);
  assert.equal(ruchenitsa?.hits.length, 7);
  assert.deepEqual(ruchenitsa?.subdivisions, [2, 2, 3]);

  const paidushko = RHYTHM_PRESETS.find(p => p.id === 'paidushko_5_8');
  assert.ok(paidushko);
  assert.equal(paidushko?.hits.length, 5);
  assert.deepEqual(paidushko?.subdivisions, [2, 3]);
});

test('Author and publisher credits are authentic and branded under EnamiX', () => {
  assert.equal(AUTHOR_CREDITS.author, 'ایمان برزجان');
  assert.equal(AUTHOR_CREDITS.publisher, 'استودیو اینامیکس (EnamiX)');
  assert.equal(AUTHOR_CREDITS.advisor, 'استاد بابک بختیاری');
  assert.ok(AUTHOR_CREDITS.authorWebsite.includes('imanbarzjan.ir'));
});

test('Treatise data has all 5 research PDFs and 8 chapters', () => {
  assert.equal(RESEARCH_PDF_DOCS.length, 5, 'Must contain all 5 uploaded PDF references');
  assert.equal(SCHOLARLY_TREATISE_CHAPTERS.length, 8, 'Must contain 8 comprehensive research chapters');
  assert.ok(SCHOLARLY_TREATISE_CHAPTERS[1].title.includes('هرمز فرهت'));
});

test('Note names contain 12 pitch classes with both Solfege and English names', () => {
  assert.equal(NOTE_NAMES.length, 12);
  assert.equal(NOTE_NAMES[0].natural, 'C');
  assert.equal(NOTE_NAMES[0].solfege, 'دو');
  assert.equal(NOTE_NAMES[9].natural, 'A');
  assert.equal(NOTE_NAMES[9].solfege, 'لا');
});
