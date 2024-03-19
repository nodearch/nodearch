import { Controller, Service, Use } from '@nodearch/core';
import { Subscribe, NamespaceProvider, Namespace, SocketInfo, EventData, IO, INamespace } from '@nodearch/socket.io';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));



@NamespaceProvider('/user1')
export class UserNamespace implements INamespace {
  async middleware(socket: IO.Socket) {
  }
}


@Service()
export class Context {
  private value: number = 0;

  setValue(value: number) {
    this.value = value;
  }

  getValue() {
    return this.value;
  }
}

@Service()
export class AddService {
  
  constructor(private context: Context) {}

  add(value: number) {
    this.context.setValue(this.context.getValue() + value);
  }
}

@Service()
export class GetService { 
  constructor(private context: Context) {}

  get() {
    return this.context.getValue();
  }
}


@Controller()
export class UserController {
  
  constructor(
    private addService: AddService,
    private getService: GetService
  ) {}


  @Namespace(UserNamespace)
  @Subscribe('message')
  async createUser(@EventData(0) data: string) {

    const value = parseInt(data);

    this.addService.add(value);

    return this.getService.get();
  }
}