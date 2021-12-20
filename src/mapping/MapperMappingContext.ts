import { DOMParserImpl as dom } from 'xmldom-ts';
import * as xpath from 'xpath-ts';

export class MapperMappingContext {
  private mapperMappings: MapperMapping[];

  registryMapperMapping(xmlContent: string) : boolean {
    let doc = new dom().parseFromString(xmlContent);
    let nodes = xpath.select('//mapper', doc);
    return false;
  }

}

class MapperMapping {
  private namespace: string;
  private xmlMapper: XmlMapper;
}

class XmlMapper {}

class InterfaceMapper {}


