import { parse } from '../src/parser.js';

describe('parse', () => {
  test('empty string → no tokens, no partial', () => {
    expect(parse('')).toEqual({ tokens: [], partial: '' });
  });

  test('single space → no tokens, no partial', () => {
    expect(parse(' ')).toEqual({ tokens: [], partial: '' });
  });

  test('partial command token', () => {
    expect(parse('r')).toEqual({ tokens: [], partial: 'r' });
    expect(parse('repo')).toEqual({ tokens: [], partial: 'repo' });
  });

  test('complete command (trailing space) → token confirmed', () => {
    expect(parse('repo ')).toEqual({ tokens: ['repo'], partial: '' });
  });

  test('partial subcommand', () => {
    expect(parse('repo v')).toEqual({ tokens: ['repo'], partial: 'v' });
    expect(parse('repo view')).toEqual({ tokens: ['repo'], partial: 'view' });
  });

  test('complete subcommand (trailing space) → both tokens confirmed', () => {
    expect(parse('repo view ')).toEqual({ tokens: ['repo', 'view'], partial: '' });
  });

  test('partial first arg', () => {
    expect(parse('repo view face')).toEqual({ tokens: ['repo', 'view'], partial: 'face' });
  });

  test('complete first arg (trailing space)', () => {
    expect(parse('repo view facebook/react ')).toEqual({
      tokens: ['repo', 'view', 'facebook/react'],
      partial: '',
    });
  });

  test('partial second arg', () => {
    expect(parse('issue view facebook/react 4')).toEqual({
      tokens: ['issue', 'view', 'facebook/react'],
      partial: '4',
    });
  });

  test('multiple spaces treated as one separator', () => {
    expect(parse('repo  view ')).toEqual({ tokens: ['repo', 'view'], partial: '' });
  });

  test('search with multiple query words', () => {
    expect(parse('search repos react hook')).toEqual({
      tokens: ['search', 'repos', 'react'],
      partial: 'hook',
    });
    expect(parse('search repos react hook ')).toEqual({
      tokens: ['search', 'repos', 'react', 'hook'],
      partial: '',
    });
  });
});
