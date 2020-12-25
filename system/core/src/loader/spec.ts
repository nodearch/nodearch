import { FileSystem } from './file-system';
import path from 'path';

describe('loader/file-system', () => {
  describe('FileSystem.readDir', () => {
    it('Should Failed To Read Dir non exits Dir', async () => {
      await expect(FileSystem.readDir(path.join(__dirname, '../../src/not_exits'))).rejects.toThrowError();;
    });

    it('Should Successfully Read Dir have files and sub dirs', async () => {
      await expect(FileSystem.readDir(path.join(__dirname, '../')))
        .resolves
        .toEqual(
          expect.arrayContaining([
            expect.objectContaining({ type: 'dir', name: 'loader', ext: '' }),
            expect.objectContaining({ type: 'file', ext: '.ts', name: 'index' })
          ])
        );
    });
  });

  describe('FileSystem.readFiles', () => {
    it('Should Failed To Read Files From non exits Dir', async () => {
      await expect(FileSystem.readFiles(path.join(__dirname, '../../src/not_exits'))).rejects.toThrowError();;
    });

    it('Should Return array of empty files with deeps equal 0', async () => {
      await expect(FileSystem.readFiles(path.join(__dirname, '../'), 0)).resolves.toEqual([]);;
    });

    it('Should Successfully Read Dir have files and sub dirs', async () => {
      await expect(FileSystem.readFiles(__dirname))
        .resolves
        .toEqual(
          expect.arrayContaining([
            expect.objectContaining({ type: 'file', ext: '.ts', name: 'spec' })
          ])
        );
    });
  });

  describe('FileSystem.findUpSync', () => {
    it('Should Failed To Find non exits File', () => {
      expect(FileSystem.findUpSync('not_exits.txt', path.join(__dirname, '../../src'))).toEqual(undefined);
    });

    it('Should Failed To Find File with invalid path', () => {
      expect(FileSystem.findUpSync('test.txt', path.join(__dirname, '../../src/not_exits'))).toEqual(undefined);
    });

    it('Should Successfully Find File with valid path', () => {
      expect(FileSystem.findUpSync('file-system.ts', path.join(__dirname, '../../src/loader'))).toEqual(expect.stringMatching('file-system.ts'))
      expect(FileSystem.findUpSync('index.ts', path.join(__dirname, '../../src/loader'))).toEqual(expect.stringMatching('index.ts'))
    });
  });

  describe('FileSystem.findUp', () => {
    it('Should Failed To Find non exits File', async () => {
      await expect(FileSystem.findUp('not_exits.txt', path.join(__dirname, '../../src'))).resolves.toEqual(undefined);
    });

    it('Should Failed To Find File with invalid path', async () => {
      await expect(FileSystem.findUp('test.txt', path.join(__dirname, '../../src/not_exits'))).resolves.toEqual(undefined);
    });

    it('Should Successfully Find File with valid path', async () => {
      await expect(FileSystem.findUp('file-system.ts', path.join(__dirname, '../../src/loader'))).resolves.toEqual(expect.stringMatching('file-system.ts'))
      await expect(FileSystem.findUp('index.ts', path.join(__dirname, '../../src/loader'))).resolves.toEqual(expect.stringMatching('index.ts'))
    });
  });

  describe('FileSystem.importFileSync', () => {
    it('Should Import File Sync', () => {
      expect(FileSystem.importFileSync('./spec.ts')).toBeDefined();
    });

    it('Should Failed to Import non exiting File Sync', () => {
      expect(() => FileSystem.importFileSync('./non_exiting.ts')).toThrowError();
    });
  });
});