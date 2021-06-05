import * as ts from "typescript";
import * as util from "util";
import fs from 'fs';
import path from 'path';
import { ComponentType } from "./enums";
import { MethodsTypeDocs } from "./interfaces";


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
  
      console.log('fileNames: ', fileNames);
      
  
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
    // Visit every sourceFile in the program
    for (const sourceFile of this.program!.getSourceFiles()) {
      if (!sourceFile.isDeclarationFile) {
        // Walk the tree to search for classes
        return ts.forEachChild(sourceFile, (node) => {

          const types = this.visit(node, componentType, componentName, methodNames);

          console.log('types ppppp', types)

          if (types && types.size > 0) return types;
        });
      }
    }
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
      const isTargetComponent = this.isTargetComponent(type, componentType, componentName);

      if (isTargetComponent) this.serializeClass(type, methodNames, methodsTypes);

      // No need to walk any further, class expressions/inner declarations
      // cannot be exported
    } else if (ts.isModuleDeclaration(node)) {
      // This is a namespace, visit its children
      ts.forEachChild(node, (node) => this.visit(node, componentType, componentName, methodNames));
    }

    return methodsTypes;
  }

  /** Serialize a class symbol information */
  private serializeClass = (type: ts.Type, methodNames: string[], methodsTypes: MethodsTypeDocs): MethodsTypeDocs | undefined => {
    type.getProperties().forEach(x => {
      const methodSign = this.checker.getTypeOfSymbolAtLocation(x, x.valueDeclaration!)?.getCallSignatures()?.[0];

      if (methodSign) {
        const methodName = (<ts.SignatureDeclaration> methodSign.declaration)?.name?.getText();

        if (methodName && methodNames.includes(methodName)) {
          const returnTypeProp = methodSign.getReturnType().getSymbol();

          console.log('returnTypeProp: ', returnTypeProp)

          if (returnTypeProp) methodsTypes.set(methodName, { returnType: this.serializeSymbol(returnTypeProp) });
        }
      }

    });

    return methodsTypes;
  }


  private isTargetComponent(type: ts.Type, componentType: ComponentType, componentName: string) {
    const symbol = type.getSymbol();

    if (symbol?.name !== componentName) return false;

    const declarations = symbol?.getDeclarations();

    if (!declarations) return false;

    return declarations.some(declaration => {
      if (!declaration.decorators) return false;

      return declaration.decorators.some(decorator => {
        // remove the parentheses and convert it to lower case, i.e. Controller() => controller
        const decoratorName = decorator?.expression?.getText().replace(/\(.*\)$/,'').toLowerCase();

        return decoratorName === componentType;
      })
    })
  }

    /** Serialize a symbol into a json object */
    private serializeSymbol = (symbol: ts.Symbol, parentName?: string): any => {
      const symbolType = this.checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!);
      const name = parentName ? `${parentName}_${symbol.getName()}` : symbol.getName();
  
      const isArray = symbolType.getSymbol()?.escapedName === 'Array';
      let hasReference = symbolType.isClassOrInterface();
      let type = this.getType(symbolType, hasReference);
      let arrayHasReference = false;
      let nestedProps: ts.Symbol[] = [];
  
      if (isArray) {
        const resolvedType = (<any> symbolType).resolvedTypeArguments?.[0];
        const symbol = resolvedType?.getSymbol();
        arrayHasReference = symbol?.isReferenced;
  
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
        name: symbol.getName(),
        documentation: ts.displayPartsToString(symbol.getDocumentationComment(this.checker)),
        tags: symbol.getJsDocTags(),
        type,
        isArray,
        optional: this.checker.isOptionalParameter(<any> symbol.valueDeclaration!),
        hasReference: hasReference || arrayHasReference ? true : false,
        nestedType: nestedProps.map(prop => this.serializeSymbol(prop, name))
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
          return type;
      
        default:
          return 'any';
      }
    }
  }

  /** True if this is visible outside this file, false otherwise */
  private isNodeExported = (node: ts.Node): boolean => {
    return (
      (ts.getCombinedModifierFlags(node as ts.Declaration) & ts.ModifierFlags.Export) !== 0 ||
      (!!node?.parent && node?.parent.kind === ts.SyntaxKind.SourceFile)
    );
  }

}
