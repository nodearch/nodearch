import { App } from "../../app";
import path from 'path';
import { TestExt1 } from "../test_extension1/main.test";
import { Ext1Service } from "../test_extension1/ext1.service.test";

export class TestingApp extends App {
  constructor() { 
    super({ 
      classLoader: { classpath: path.join(__dirname, './') },
      extensions: [
        { app: new TestExt1({ SYSTEM_URL: 'http://test.com' }), include: [ Ext1Service ] }
      ]
    }); 
  }

}