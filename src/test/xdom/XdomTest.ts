import { DOMParserImpl as dom } from "xmldom-ts";
import * as xpath from "xpath-ts";

const xml = "<book><title>Harry Potter</title></book>";
const doc = new dom().parseFromString(xml);
const nodes = xpath.select("//title", doc);

console.log("Node: " + nodes);
