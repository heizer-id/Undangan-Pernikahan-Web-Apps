const CONFIG = {
  SHEET_WEDDINGS: 'weddings',
  SHEET_GUESTS: 'guests',
  SHEET_WISHES: 'wishes'
};

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Weddings
  let weddingsSheet = ss.getSheetByName(CONFIG.SHEET_WEDDINGS);
  if (!weddingsSheet) {
    weddingsSheet = ss.insertSheet(CONFIG.SHEET_WEDDINGS);
    weddingsSheet.appendRow(['wedding_id', 'couple_name', 'date', 'venue', 'story', 'cover_photo', 'user_email', 'template_theme', 'guest_password', 'created_at', 'is_published', 'bride_name', 'bride_parents', 'bride_ig', 'groom_name', 'groom_parents', 'groom_ig', 'music_url', 'gallery_photos', 'digital_gifts']);
  }
  
  // Guests
  let guestsSheet = ss.getSheetByName(CONFIG.SHEET_GUESTS);
  if (!guestsSheet) {
    guestsSheet = ss.insertSheet(CONFIG.SHEET_GUESTS);
    guestsSheet.appendRow(['guest_id', 'wedding_id', 'name', 'phone', 'attendance_status', 'number_of_guests', 'message', 'confirmed_at']);
  }
  
  // Wishes
  let wishesSheet = ss.getSheetByName(CONFIG.SHEET_WISHES);
  if (!wishesSheet) {
    wishesSheet = ss.insertSheet(CONFIG.SHEET_WISHES);
    wishesSheet.appendRow(['wish_id', 'wedding_id', 'guest_name', 'message', 'created_at', 'is_private']);
  }
}

function response(data, success = true, message = "") {
  return ContentService.createTextOutput(JSON.stringify({
    success,
    message,
    data
  })).setMimeType(ContentService.MimeType.JSON);
}

function getRowsData(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  const headers = data[0];
  const rows = [];
  for (let i = 1; i < data.length; i++) {
    const rowObj = {};
    for (let j = 0; j < headers.length; j++) {
      rowObj[headers[j]] = data[i][j];
    }
    rows.push(rowObj);
  }
  return rows;
}

function doGet(e) {
  const action = e.parameter.action;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  try {
    if (action === 'getWedding') {
      const id = e.parameter.id;
      const data = getRowsData(ss.getSheetByName(CONFIG.SHEET_WEDDINGS)).filter(r => r.wedding_id === id);
      return response(data[0] || null, !!data[0], data[0] ? "Found" : "Wedding not found");
    }
    
    if (action === 'getAllWeddings') {
      const email = e.parameter.email;
      const data = getRowsData(ss.getSheetByName(CONFIG.SHEET_WEDDINGS)).filter(r => String(r.user_email).toLowerCase() === String(email).toLowerCase());
      return response(data);
    }
    
    if (action === 'getGuests') {
      const wedding_id = e.parameter.wedding_id;
      const data = getRowsData(ss.getSheetByName(CONFIG.SHEET_GUESTS)).filter(r => r.wedding_id === wedding_id);
      return response(data);
    }
    
    if (action === 'getWishes') {
      const wedding_id = e.parameter.wedding_id;
      const data = getRowsData(ss.getSheetByName(CONFIG.SHEET_WISHES)).filter(r => r.wedding_id === wedding_id);
      return response(data);
    }
    
    return response(null, false, "Invalid action");
  } catch (error) {
    return response(null, false, error.toString());
  }
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const action = body.action;
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    if (action === 'createWedding') {
      const s = ss.getSheetByName(CONFIG.SHEET_WEDDINGS);
      const newId = Utilities.getUuid();
      s.appendRow([
        newId,
        body.couple_name || '',
        body.date || '',
        body.venue || '',
        body.story || '',
        body.cover_photo || '',
        body.user_email || '',
        body.template_theme || 'classic',
        body.guest_password || '',
        new Date().toISOString(),
        body.is_published ? 'TRUE' : 'FALSE',
        body.bride_name || '',
        body.bride_parents || '',
        body.bride_ig || '',
        body.groom_name || '',
        body.groom_parents || '',
        body.groom_ig || '',
        body.music_url || '',
        body.gallery_photos || '',
        body.digital_gifts || ''
      ]);
      return response({ wedding_id: newId });
    }

    if (action === 'updateWedding') {
      const s = ss.getSheetByName(CONFIG.SHEET_WEDDINGS);
      const data = s.getDataRange().getValues();
      let rowIndex = -1;
      for(let i=1; i<data.length; i++) {
        if(data[i][0] === body.wedding_id) { rowIndex = i+1; break; }
      }
      if (rowIndex === -1) return response(null, false, "Not found");
      
      const values = [[
        body.wedding_id,
        body.couple_name,
        body.date,
        body.venue,
        body.story,
        body.cover_photo,
        body.user_email,
        body.template_theme,
        body.guest_password,
        data[rowIndex-1][9], // keep created_at
        body.is_published ? 'TRUE' : 'FALSE',
        body.bride_name || '',
        body.bride_parents || '',
        body.bride_ig || '',
        body.groom_name || '',
        body.groom_parents || '',
        body.groom_ig || '',
        body.music_url || '',
        body.gallery_photos || '',
        body.digital_gifts || ''
      ]];
      s.getRange(rowIndex, 1, 1, 20).setValues(values);
      return response({ wedding_id: body.wedding_id });
    }

    if (action === 'deleteWedding') {
      const s = ss.getSheetByName(CONFIG.SHEET_WEDDINGS);
      const data = s.getDataRange().getValues();
      let rowIndex = -1;
      for(let i=1; i<data.length; i++) {
        if(data[i][0] === body.wedding_id) { rowIndex = i+1; break; }
      }
      if (rowIndex !== -1) {
        s.deleteRow(rowIndex);
        return response({ wedding_id: body.wedding_id });
      }
      return response(null, false, "Not found");
    }

    if (action === 'rsvp') {
      const s = ss.getSheetByName(CONFIG.SHEET_GUESTS);
      const newId = Utilities.getUuid();
      s.appendRow([
        newId,
        body.wedding_id,
        body.name,
        body.phone || '',
        body.attendance_status,
        body.number_of_guests,
        body.message || '',
        new Date().toISOString()
      ]);
      return response({ guest_id: newId });
    }

    if (action === 'addWish') {
      const s = ss.getSheetByName(CONFIG.SHEET_WISHES);
      const newId = Utilities.getUuid();
      s.appendRow([
        newId,
        body.wedding_id,
        body.guest_name,
        body.message,
        new Date().toISOString(),
        body.is_private ? 'TRUE' : 'FALSE'
      ]);
      return response({ wish_id: newId });
    }

    return response(null, false, "Invalid action");
  } catch (error) {
    return response(null, false, error.toString());
  }
}
