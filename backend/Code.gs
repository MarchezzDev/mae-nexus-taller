// MAE Nexus · Taller de la web: servicio de guardado.
// Guarda lo que eligen las clientas en una hoja de cálculo y sus archivos (logo, fotos) en una carpeta de Drive.
// 1) Ejecutar una vez la función "setup" desde el editor (pide permisos de Drive y Hojas de cálculo).
// 2) Implementar → Nueva implementación → Aplicación web → Ejecutar como: yo · Acceso: cualquier usuario.
// 3) Pegar la URL que termina en /exec en la constante BACKEND de index.html.
var CARPETA = 'MAE Nexus · Taller';
var HOJA = 'MAE Nexus · Taller (respuestas)';

function setup() { sheet(); root(); Logger.log('Listo: hoja y carpeta creadas en tu Drive.'); }

function doGet(e) {
  var c = String((e && e.parameter && e.parameter.c) || '').toUpperCase().trim();
  if (!c) return out({ ok: false, error: 'sin código' });
  var r = find(c);
  if (!r) return out({ ok: false, error: 'no existe' });
  return out({ ok: true, code: c, state: JSON.parse(r.json) });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var b = JSON.parse(e.postData.contents);
    var code = String(b.code || '').toUpperCase().trim();
    if (!/^MAE-[A-Z0-9]{4}$/.test(code)) code = newCode();
    var st = b.state || {};
    var files = (b.files || []).slice(0, 12).map(function (f) {
      var blob = Utilities.newBlob(Utilities.base64Decode(f.b64), f.type || 'image/jpeg', String(f.name || 'imagen').replace(/[^\w.\-]/g, '_'));
      var folder = sub(code);
      var old = folder.getFilesByName(blob.getName());
      while (old.hasNext()) old.next().setTrashed(true);
      var file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      return { k: f.k, url: 'https://drive.google.com/thumbnail?id=' + file.getId() + '&sz=w1600' };
    });
    files.forEach(function (f) {
      if (f.k === 'logo' && st.logo) st.logo.url = f.url;
      else if (st.fotos) { var x = st.fotos.filter(function (y) { return y.id === f.k; })[0]; if (x) x.url = f.url; }
    });
    st.code = code;
    save(code, b.quien || st.quien || '', st);
    return out({ ok: true, code: code, files: files });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (e2) {}
  }
}

function out(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

function newCode() {
  var A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', c;
  do { c = 'MAE-'; for (var i = 0; i < 4; i++) c += A[Math.floor(Math.random() * A.length)]; } while (find(c));
  return c;
}

function sheet() {
  var p = PropertiesService.getScriptProperties(), id = p.getProperty('sheet'), ss = null;
  if (id) { try { ss = SpreadsheetApp.openById(id); } catch (e) { ss = null; } }
  if (!ss) {
    ss = SpreadsheetApp.create(HOJA);
    ss.getActiveSheet().appendRow(['código', 'fecha', 'quién', 'tema', 'acento', 'fondo', 'texto', 'letra títulos', 'letra texto', 'eslogan', 'json']);
    p.setProperty('sheet', ss.getId());
  }
  return ss.getSheets()[0];
}

function find(code) {
  var v = sheet().getDataRange().getValues();
  for (var i = v.length - 1; i >= 1; i--) if (String(v[i][0]).toUpperCase() === code) return { row: i + 1, json: v[i][10] };
  return null;
}

function save(code, quien, st) {
  var sh = sheet();
  var c = st.c || {}, f = st.f || {}, t = st.t || {};
  var row = [code, new Date(), quien, st.tema || '', c.acento || '', c.fondo || '', c.texto || '', f.titulo || '', f.texto || '', t.eslogan || '', JSON.stringify(st)];
  var x = find(code);
  if (x) sh.getRange(x.row, 1, 1, row.length).setValues([row]); else sh.appendRow(row);
}

function root() { var it = DriveApp.getFoldersByName(CARPETA); return it.hasNext() ? it.next() : DriveApp.createFolder(CARPETA); }
function sub(code) { var r = root(), it = r.getFoldersByName(code); return it.hasNext() ? it.next() : r.createFolder(code); }
