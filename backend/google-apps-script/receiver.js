/** El Taller: receptor privado de respuestas. No publica ni lee respuestas por HTTP. */
function setup() {
  const p=PropertiesService.getScriptProperties();
  let id=p.getProperty('SHEET_ID');
  if (!id) {const book=SpreadsheetApp.create('El Taller - Respuestas de colaboradores');id=book.getId();p.setProperty('SHEET_ID',id);book.getSheets()[0].setName('Propuestas');}
  const book=SpreadsheetApp.openById(id);
  const sheet=book.getSheetByName('Propuestas')||book.insertSheet('Propuestas');
  ensureHeaders_(sheet);
  sheet.setFrozenRows(1);
  sheet.getRange(1,1,1,headers_().length).setBackground('#626746').setFontColor('#ffffff').setFontWeight('bold').setWrap(true);
  sheet.setColumnWidths(1,headers_().length,180);
  sheet.setRowHeight(1,70);
  console.log('Hoja privada de respuestas: '+book.getUrl());
}
function headers_(){return ['ID de envío','Fecha UTC','Idioma'].concat(TallerForm.fields.map(function(f){return f.es+' ['+f.id+']';}));}
function ensureHeaders_(sheet){
  const expected=headers_();
  if(sheet.getMaxColumns()<expected.length)sheet.insertColumnsAfter(sheet.getMaxColumns(),expected.length-sheet.getMaxColumns());
  if(sheet.getLastRow()===0){sheet.getRange(1,1,1,expected.length).setValues([expected]);return;}
  const actual=sheet.getRange(1,1,1,expected.length).getValues()[0];
  if(actual.some(function(v,i){return v!==expected[i];}))throw new Error('schema_mismatch');
}
function json_(v){return ContentService.createTextOutput(JSON.stringify(v)).setMimeType(ContentService.MimeType.JSON);}
function doGet(){return json_({service:'el-taller-propuestas',schema:2,configured:!!PropertiesService.getScriptProperties().getProperty('SHEET_ID')});}
function safeCell_(value){const s=String(value==null?'':value);return /^[\s]*[=+@-]/.test(s)?"'"+s:s;}
function parseHttpUrl_(value){if(!/^https?:\/\/[^\s/?#]+(?:[/?#][^\s]*)?$/i.test(value))throw new Error('url');return {protocol:value.slice(0,value.indexOf(':')+1).toLowerCase()};}
function doPost(e){
  let lock;
  try {
    const raw=e&&e.postData&&e.postData.contents;
    if(typeof raw!=='string'||raw.length>30000)return json_({ok:false,error:'invalid'});
    const body=JSON.parse(raw);
    if(!body||typeof body.requestId!=='string'||!/^[-a-zA-Z0-9]{20,60}$/.test(body.requestId)||!['es','en'].includes(body.language)||!body.values||typeof body.values!=='object'||Array.isArray(body.values)||body.website)return json_({ok:false,error:'invalid'});
    const errors=TallerForm.validate(body.values);
    if(Object.keys(errors).length)return json_({ok:false,error:'validation',fields:errors});
    const id=PropertiesService.getScriptProperties().getProperty('SHEET_ID');
    if(!id)return json_({ok:false,error:'not_configured'});
    lock=LockService.getScriptLock();if(!lock.tryLock(15000))return json_({ok:false,error:'busy'});
    const sheet=SpreadsheetApp.openById(id).getSheetByName('Propuestas');
    if(!sheet)throw new Error('missing_sheet');
    ensureHeaders_(sheet);
    const v=TallerForm.normalize(body.values);
    const values=[body.language].concat(TallerForm.fields.map(function(f){const val=v[f.id];return safeCell_(Array.isArray(val)?val.join(' | '):val);}));
    if(sheet.getLastRow()>1){
      const found=sheet.getRange(2,1,sheet.getLastRow()-1,1).createTextFinder(body.requestId).matchEntireCell(true).findNext();
      if(found){const previous=sheet.getRange(found.getRow(),3,1,values.length).getValues()[0].map(String);if(previous.some(function(value,i){const expected=String(values[i]);return value!==expected&&!(expected.charAt(0)==="'"&&value===expected.slice(1));}))return json_({ok:false,error:'id_conflict'});return json_({ok:true,requestId:body.requestId});}
    }
    // A modest shared limit protects spreadsheet quotas. No personal data is cached.
    const cache=CacheService.getScriptCache(),key='rate_'+Math.floor(Date.now()/60000),count=Number(cache.get(key)||0);
    if(count>=30)return json_({ok:false,error:'busy'});
    const row=[body.requestId,new Date().toISOString()].concat(values);
    sheet.getRange(sheet.getLastRow()+1,1,1,row.length).setNumberFormat('@').setValues([row]);
    SpreadsheetApp.flush();
    cache.put(key,String(count+1),120);
    return json_({ok:true,requestId:body.requestId});
  } catch(error) {return json_({ok:false,error:'submission_failed'});}
  finally {if(lock)lock.releaseLock();}
}
