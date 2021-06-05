import * as ts from "typescript";
import * as util from "util";
import fs from 'fs';
import path from 'path';
import { ComponentType } from "./enums";
import { IMethodArgumentTypeDocs, ITypeDocs, MethodsTypeDocs } from "./interfaces";


export class ComponentTypeParser {
  private program?: ts.Program; 
  private checker: ts.TypeChecker; 

  constructor() {
    this.checker = ts.createProgram([], {}).getTypeChecker();
  }
  
  getComponentMethodTypes = (
    componentType: ComponentType,
    componentName: string,
    methodNames: string[],
    projectPath: string
  ): MethodsTypeDocs | undefined => {

    if (!this.program) {
      const configPath = ts.findConfigFile(projectPath, ts.sys.fileExists, 'tsconfig.json');

      if (!configPath) throw new Error('Failed to find tsconfig.json file')
  
      const config = ts.readJsonConfigFile(configPath!, ts.sys.readFile);
    
      const { fileNames } = ts.parseJsonSourceFileConfigFileContent(
        config,
        ts.sys,
        projectPath
      );
  
      this.program = ts.createProgram(fileNames, {
        target: ts.ScriptTarget.ES5,
        module: ts.ModuleKind.CommonJS
      });
    
      this.checker = this.program.getTypeChecker();
    }


    const docs = this.generateDocumentation(componentType, componentName, methodNames);

    return docs;
  }


  /** Generate documentation for all classes in a set of .ts files */
  private generateDocumentation = (
    componentType: ComponentType,
    componentName: string,
    methodNames: string[]
  ) => {
    let types: MethodsTypeDocs | undefined;
    // Visit every sourceFile in the program
    for (const sourceFile of this.program!.getSourceFiles()) {
      if (!sourceFile.isDeclarationFile) {
        // Walk the tree to search for classes
        ts.forEachChild(sourceFile, (node) => {
          const componentTypes = this.visit(node, componentType, componentName, methodNames);

          if (componentTypes && componentTypes.size > 0) {
            types = componentTypes;

            return;
          };
        });
      }
    }
    return types;
  }

  
  /** visit nodes finding exported classes */
  private visit = (
    node: ts.Node,
    componentType: ComponentType,
    componentName: string,
    methodNames: string[]
  ) => {
    let methodsTypes: MethodsTypeDocs = new Map();

    // Only consider exported nodes
    if (!this.isNodeExported(node)) return;

    if (ts.isClassDeclaration(node)) {
      const type = this.checker.getTypeAtLocation(node);
      const symbol = type.getSymbol();
      const isTargetComponent = this.isTargetComponent(symbol!, componentType, componentName);

      if (isTargetComponent) this.serializeClass(type, methodNames, methodsTypes);

      return methodsTypes;

      // No need to walk any further, class expressions/inner declarations
      // cannot be exported
    } else if (ts.isModuleDeclaration(node)) {
      // This is a namespace, visit its children
      ts.forEachChild(node, (node) => this.visit(node, componentType, componentName, methodNames));
    }

  }

  /** Serialize a class symbol information */
  private serializeClass = (type: ts.Type, methodNames: string[], methodsTypes: MethodsTypeDocs): MethodsTypeDocs | undefined => {
    type.getProperties().forEach(x => {
      const symbol = this.checker.getTypeOfSymbolAtLocation(x, x.valueDeclaration!);
      const methodSign = symbol?.getCallSignatures()?.[0];

      if (methodSign) {
        const methodName = (<ts.SignatureDeclaration> methodSign.declaration)?.name?.getText();

        if (methodName && methodNames.includes(methodName)) {
          const returnType = this.serializeSymbol(methodSign.getReturnType());
          const argumentsTypes: Map<string, IMethodArgumentTypeDocs> = new Map();

          for (const param of methodSign.getParameters()) {
            const paramType = this.checker.getTypeOfSymbolAtLocation(param, param.valueDeclaration!)
            const argumentType = this.serializeSymbol(paramType, param);
            const decorators = this.getDecoratorsOfType(param);

            argumentsTypes.set(param.getName().toString(), { type: argumentType, decorators })
          }

          if (returnType) methodsTypes.set(methodName, { returnType, argumentsTypes });
        }
      }

    });

    return methodsTypes;
  }

    /** Serialize a symbol into a json object */
    private serializeSymbol = (symbolType: ts.Type, symbol?: ts.Symbol): ITypeDocs => {
      const isArray = symbolType.getSymbol()?.escapedName === 'Array';
      let hasReference = symbolType.isClassOrInterface();
      let type = this.getType(symbolType, hasReference);
      let arrayHasReference = false;
      let nestedProps: ts.Symbol[] = [];
  
      if (isArray) {
        const resolvedType = (<any> symbolType).resolvedTypeArguments?.[0];
        const symbol = resolvedType?.getSymbol();
        arrayHasReference = symbol?.isReferenced || (symbol?.escapedName && symbol?.escapedName !== '__type');

        if (resolvedType.getSymbol()) nestedProps = this.getNestedProperties(resolvedType);
        type = arrayHasReference ? (symbol?.escapedName || this.getType(symbolType, hasReference)) : (resolvedType?.intrinsicName || 'array');
      }
      else {
        if (symbolType.getSymbol())  {
          nestedProps = this.getNestedProperties(symbolType);
          
          type = hasReference ? this.getType(symbolType, hasReference) : 'object';
        }
      }
  
      return {
        name: symbol?.getName(),
        tags: symbol?.getJsDocTags(),
        type,
        isArray,
        optional: symbol ? this.checker.isOptionalParameter(<any> symbol.valueDeclaration!) : false,
        hasReference: hasReference || arrayHasReference ? true : false,
        nestedType: nestedProps.map(prop => {
          return this.serializeSymbol(this.checker.getTypeOfSymbolAtLocation(prop, prop.valueDeclaration!), prop)
        })
      };
    }

  private getNestedProperties = (symbolType: ts.Type): ts.Symbol[] => {
    if (symbolType.aliasSymbol) {
      const aliasSymbol = symbolType.aliasSymbol?.escapedName;
      const totalProperties = symbolType.aliasTypeArguments?.[0]?.getProperties();
      const aliasConfig = (<any> symbolType).aliasTypeArguments?.[1];

      if (totalProperties) {
        const pickedProps = aliasConfig?.value ? [aliasConfig.value] : aliasConfig?.types?.map((t: any) => t.value);

        if (aliasSymbol === 'Omit') {
          return totalProperties?.filter(prop => !pickedProps.includes(prop.escapedName))
        }
        else if (aliasSymbol === 'Pick') {
          return totalProperties?.filter(prop => pickedProps.includes(prop.escapedName))
        }
        else if (aliasSymbol === 'Partial') {
          return totalProperties
        }
      }
    }

    return symbolType.getProperties();
  }

  private getType = (symbolType: ts.Type, hasRef: boolean = false) => {
    let type = this.checker.typeToString(symbolType);

    if (hasRef) {
      return type;
    }
    else {
      switch (type) {
        case 'string':
        case 'number':
        case 'boolean':
        case 'object':
        case 'array':
        case 'void':

          return type;
      
        default:
          return 'any';
      }
    }
  }

  
  private isTargetComponent(symbol: ts.Symbol, componentType: ComponentType, componentName: string) {
    if (symbol?.name !== componentName) return false;

    const decorators = this.getDecoratorsOfType(symbol)

    return decorators.some(decorator => {
      // remove the parentheses and convert it to lower case, i.e. Controller() => controller
      const decoratorName = decorator.replace(/\(.*\)$/,'').toLowerCase();

      return decoratorName === componentType;
    });
  }

  private getDecoratorsOfType(symbol: ts.Symbol) {
    const decorators: string[] = [];

    const declarations = symbol?.getDeclarations();

    if (!declarations) return [];

    declarations.forEach(declaration => {
      if (!declaration.decorators) return [];

      const decoratorsNames = declaration.decorators.map(decorator => decorator?.expression?.getText())

      decorators.push(...decoratorsNames);
    });

    return decorators;
  }

  /** True if this is visible outside this file, false otherwise */
  private isNodeExported = (node: ts.Node): boolean => {
    return (
      (ts.getCombinedModifierFlags(node as ts.Declaration) & ts.ModifierFlags.Export) !== 0 ||
      (!!node?.parent && node?.parent.kind === ts.SyntaxKind.SourceFile)
    );
  }

}
