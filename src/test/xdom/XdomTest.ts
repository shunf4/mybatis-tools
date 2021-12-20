import { DOMParserImpl } from 'xmldom-ts';
import * as xpath from 'xpath-ts';
 
const xml = '<book><title>Harry Potter</title></book>';

const doc =  new DOMParserImpl({}).parseFromString(xml, 'text/xml');
doc.
const nodes = xpath.select('//title', doc);
 
console.log(nodes[0].localName + ': ' + nodes[0].firstChild.data);
console.log('Node: ' + nodes[0].toString());


