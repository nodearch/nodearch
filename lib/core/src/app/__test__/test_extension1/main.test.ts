import { App } from "../../app";
import path from 'path';
import { Ext2Service } from "../test_extension2/services/ext1.service.test";
import { TestExt2 } from "../test_extension2/main.test";

export class TestExt1 extends App {
  constructor(config: any) { 
    super({ 
      classLoader: { classpath: path.join(__dirname, './') },
      extensions: [
        { app: new TestExt2(), include: [ Ext2Service ] }
      ],
      externalConfig: config
    }); 
  }

}