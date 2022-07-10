import { App } from "../../app";
import path from 'path';

export class TestExt2 extends App {
  constructor() { 
    super({ 
      classLoader: { classpath: path.join(__dirname, './') }
    }); 
  }

}