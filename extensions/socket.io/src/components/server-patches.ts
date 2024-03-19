import { Service } from '@nodearch/core';
import { INamespaceInfo, INamespaceMap, ParentNspNameMatchFn } from '../interfaces.js';
import * as IO from 'socket.io';
import { ComponentInfo } from '@nodearch/core/components';
import { RegistryService } from './registry.service.js';

@Service()
export class ServerPatch {
  
  private patchedNamespaces: string[] = [];

  constructor(
    private registryService: RegistryService
  ) {}

  patch(server: IO.Server, namespaceMap: INamespaceMap) {
    const ofFunc = server.of;
    
    server.of = (...args) => {

      const namespace = args[0];

      if (typeof namespace === 'string' && !server._nsps.has(namespace)) {
        const dynamicNamespace = this.getDynamicNamespace(namespaceMap, namespace);

        if (dynamicNamespace && !this.patchedNamespaces.includes(dynamicNamespace.namespaceInfo.name)) {
          this.patchedNamespaces.push(dynamicNamespace.namespaceInfo.name);
          this.registryService.register(server, dynamicNamespace.namespaceInfo, dynamicNamespace.namespace);
        }
      }

      return ofFunc.apply(server, args);
    };
  }

  private getDynamicNamespace(namespaceMap: INamespaceMap, name: string) {

    const dynamicNamespace = Array.from(namespaceMap).find(([namespace, namespaceInfo]) => {
      if (namespaceInfo.name instanceof RegExp && name.match(namespaceInfo.name)) {
        return true;
      }
    });

    if (!dynamicNamespace) {
      return null;
    }

    const [namespace, namespaceInfo] = dynamicNamespace;

    return {
      namespace,
      namespaceInfo: {
        ...namespaceInfo,
        name
      }
    };
  }
}