{
	"translatorID": "ddfc6b0c-85f5-4f9d-9e17-6fd3030b1aba",
	"label": "Ontario Statutes and Regulations",
	"creator": "Marc Lajoie",
	"target": "^https?://(?:www\\.)?e-laws\\.gov\\.on\\.ca\\/",
	"minVersion": "3.0",
	"maxVersion": "",
	"priority": 100,
	"inRepository": true,
	"translatorType": 4,
	"browserSupport": "gcsib",
	"lastUpdated": "2014-07-05 19:24:48"
}

/*
Consolidated Statutes and Regulations of Ontario Translator
Copyright (C) 2014 Marc Lajoie

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

var csroRegexp = /https?:\/\/(?:www\.)?e-laws\.gov\.on\.ca\/html\/.+/;

function getMultiple(doc, checkOnly) {
  var res = ZU.xpath(doc, '//a[@class="inlineGreenResult"][not(@title="Legislative History")][not(@title="Historique législatif")]');
  if(!res.length) return false;
  if(checkOnly) return true;
  var items = {};
  for(var i=0; i<res.length; i++) {
  	items[res[i].href] = ZU.trimInternal(res[i].textContent);
  	
  }
  return items;
  
}

function detectWeb(doc, url) {
	
	if (csroRegexp.test(url)) {
	return "statute";	
	} else if (getMultiple(doc,true)){
		return "multiple";	
		
	}	
	
	}		

function scrape(doc, url) {
	var frenchRegexp = /https?:\/\/(?:www\.)?e-laws\.gov\.on\.ca\/html\/(?:statutes|regs)\/french\/.+/;
	var lawsRegexp = /https?:\/\/(?:www\.)?e-laws\.gov\.on\.ca\/html\/statutes\/(?:english|french)\/.+/;
	var newItem = new Zotero.Item("statute");
	
	if (lawsRegexp.test(url)) {
		var titleloi = doc.getElementsByClassName('shorttitle-e')[0]||doc.getElementsByClassName('shorttitle-f')[0];
		titleloi = ZU.trimInternal(titleloi.textContent); 
		Z.debug("titleloi: ("+titleloi+")");
		newItem.title=titleloi;

	} else {
		// The title for Ontario  Regulations is always capitalized. To my knowledge the only way to correct this is manually 
		var titlereg = doc.getElementsByClassName('regtitle-e')[0]||doc.getElementsByClassName('regtitle-f')[0];
		titlereg = ZU.trimInternal(titlereg.textContent); 
		//Z.debug("titlereg: ("+titlereg+")");
		newItem.title=titlereg;
	}
	
	var codeloi = doc.getElementsByClassName('chapter-e')[0]||doc.getElementsByClassName('chapter-f')[0]||doc.getElementsByClassName('regnumber-e')[0]||doc.getElementsByClassName('regnumber-f')[0];
	codeloi = ZU.trimInternal(codeloi.textContent);
	//Z.debug("codeloi: ("+codeloi+")");
	//newItem.code=codeloi;
	
	if(frenchRegexp.test(url)){
		newItem.language="fr-CA";
		codeloi=codeloi.replace("CHAPITRE", "c").replace("RÈGLEMENT DE L’ONTARIO", "Règl de l'Ont").replace("RÈGLEMENT","Reg");
		newItem.code=codeloi;
	} else {
		newItem.language="en-CA";
		codeloi=codeloi.replace("CHAPTER", "c").replace("ONTARIO REGULATION", "O Reg").replace("REGULATION","Reg");
		newItem.code=codeloi;
	}
	
	newItem.rights="© Queen's Printer for Ontario";
	
	newItem.jurisdiction="Ontario, Canada";
	newItem.url=url;


	var docurl = url.replace(/\/html\/statutes\/(?:english|french)/,"/Download").replace(/\.htm(?:[?#].*)?/, ".doc");
	//Z.debug("docurl: ("+docurl+")");
	
	newItem.attachments.push({
		url: docurl,
		title: "e-Laws Full Text Word",
		mimeType: "application/msword"
	});
	newItem.attachments.push({
		document: doc,
		title: "Snapshot"
	});
	newItem.complete();
}

function doWeb(doc, url) {
	if (csroRegexp.test(url)) {
		scrape(doc, url);
	} else {
		var items = getMultiple(doc);
		Zotero.selectItems(items, function (items) {
			if (!items) {
				return true;
			}
			var articles = [];
			for (var i in items) {
				articles.push(i);
			}
			ZU.processDocuments(articles, scrape);
		});
	}
}/** BEGIN TEST CASES **/
var testCases = [
	{
		"type": "web",
		"url": "http://www.e-laws.gov.on.ca/Browse?queryText=&resultCount=200&sortField=dDocTitle&sortOrder=ASC&startIndex=1&type=statutes&letter=A&lang=en&reload=yes#result",
		"items": "multiple"
	},
	{
		"type": "web",
		"url": "https://www.e-laws.gov.on.ca/html/statutes/english/elaws_statutes_90l08_e.htm",
		"items": [
			{
				"itemType": "statute",
				"creators": [],
				"notes": [],
				"tags": [],
				"seeAlso": [],
				"attachments": [
					{
						"title": "e-Laws Full Text Word",
						"mimeType": "application/msword"
					},
					{
						"title": "Snapshot"
					}
				],
				"nameOfAct": "Law Society Act",
				"code": "R.S.O. 1990, c L.8",
				"language": "en-CA",
				"rights": "© Queen's Printer for Ontario",
				"url": "https://www.e-laws.gov.on.ca/html/statutes/english/elaws_statutes_90l08_e.htm"
			}
		]
	},
	{
		"type": "web",
		"url": "https://www.e-laws.gov.on.ca/html/statutes/french/elaws_statutes_90l08_f.htm",
		"items": [
			{
				"itemType": "statute",
				"creators": [],
				"notes": [],
				"tags": [],
				"seeAlso": [],
				"attachments": [
					{
						"title": "e-Laws Full Text Word",
						"mimeType": "application/msword"
					},
					{
						"title": "Snapshot"
					}
				],
				"nameOfAct": "Loi sur le Barreau",
				"code": "L.R.O. 1990, c L.8",
				"language": "fr-CA",
				"rights": "© Queen's Printer for Ontario",
				"url": "https://www.e-laws.gov.on.ca/html/statutes/french/elaws_statutes_90l08_f.htm"
			}
		]
	},
	{
		"type": "web",
		"url": "https://www.e-laws.gov.on.ca/html/regs/english/elaws_regs_900708_e.htm",
		"items": [
			{
				"itemType": "statute",
				"creators": [],
				"notes": [],
				"tags": [],
				"seeAlso": [],
				"attachments": [
					{
						"title": "e-Laws Full Text Word",
						"mimeType": "application/msword"
					},
					{
						"title": "Snapshot"
					}
				],
				"nameOfAct": "COUNTY AND DISTRICT LAW ASSOCIATIONS",
				"code": "R.R.O. 1990, Reg 708",
				"language": "en-CA",
				"rights": "© Queen's Printer for Ontario",
				"url": "https://www.e-laws.gov.on.ca/html/regs/english/elaws_regs_900708_e.htm"
			}
		]
	},
	{
		"type": "web",
		"url": "https://www.e-laws.gov.on.ca/html/regs/french/elaws_regs_900708_f.htm",
		"items": [
			{
				"itemType": "statute",
				"creators": [],
				"notes": [],
				"tags": [],
				"seeAlso": [],
				"attachments": [
					{
						"title": "e-Laws Full Text Word",
						"mimeType": "application/msword"
					},
					{
						"title": "Snapshot"
					}
				],
				"nameOfAct": "ASSOCIATIONS D’AVOCATS DE COMTÉ ET DE DISTRICT",
				"code": "R.R.O. 1990, Reg 708",
				"language": "fr-CA",
				"rights": "© Queen's Printer for Ontario",
				"url": "https://www.e-laws.gov.on.ca/html/regs/french/elaws_regs_900708_f.htm"
			}
		]
	}
]
/** END TEST CASES **/
