import { Controller, Use } from '@nodearch/core';
import { HttpGet, HttpPath } from '@nodearch/express';

@HttpPath('product')
@Controller()
export class ProductController {

  @Use(class One{})
  @HttpGet()
  async getProducts() {
    return [
      'one', 'two', 'three'
    ];
  }

  @HttpGet('/:id')
  async getProductById() {
    return [
      'one', 'two', 'three'
    ];
  }

}