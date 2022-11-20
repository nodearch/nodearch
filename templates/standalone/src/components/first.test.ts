import { Case, Test, TestMode } from '@nodearch/core';
import { expect } from 'chai';
import { SimpleService } from './simple.service';

@Test({ mode: TestMode.UNIT })
export class FirstTest {
  
  constructor(
    private simpleService: SimpleService
  ) {}

  @Case('1', { params: { x: 5, y: 5, res: 10 } })
  @Case('2', { params: { x: 5, y: 5, res: 10 } })
  @Case('3', { params: { x: 5, y: 5, res: 10 } })
  @Case('4', { params: { x: 5, y: 5, res: 10 } })
  @Case('5', { params: { x: 5, y: 5, res: 10 } })
  @Case('6', { params: { x: 5, y: 5, res: 10 } })
  async myFirstTest({ x, y, res }: { x: number, y: number, res: number }) {
    expect(this.simpleService.sum(x, y)).to.equal(res);
  }
}