// replace selected smart object, scale according to layer layer mask and save jpgs
// 2017, use it at your own risk

// Original Gist by Laryn
// https://gist.github.com/laryn/0a1f6bf0dab5b713395a835f9bfa805c

// Updated wuth functionality to scale image to mask size.
// Adde code by MaginSun 2022-10-08
// Update code Rombout 2022-10-08

// Replace_SmartObject_Image v.0.0.2
// 2023-08-22

#target photoshop
if (app.documents.length > 0) {
	var myDocument = app.activeDocument;
	var theName= myDocument.name.match(/(.*)\.[^\.]+$/)[1];
	var thePath = myDocument.path;
	var theLayer = myDocument.activeLayer;
	// jpg options;
	var jpegOptions = new JPEGSaveOptions();
	jpegOptions.quality = 9;
	jpegOptions.embedColorProfile = true;
	jpegOptions.matte = MatteType.NONE;
	// check if layer is smart object;
	if (theLayer.kind != "LayerKind.SMARTOBJECT") { 
		alert ("selected layer is not a smart object")
	} else {
		// select files;
		if ($.os.search(/windows/i) != -1) {
			var theFiles = File.openDialog ("please select files", "*.psd;*.jpg;*.tif;*.eps", true)
		} else { 
			var theFiles = File.openDialog ("please select files", getFiles, true)
		};
	if (theFiles) {
		var originalRulerUnits = app.preferences.rulerUnits;
		app.preferences.rulerUnits = Units.PIXELS;
		// get target area;
		// alert(myDocument.activeLayer)
		// select layer with mask
		myDocument.activeLayer = myDocument.layers.getByName("+ Masked design");
		// myDocument.activeLayer = theLayer.parent;
		loadLayerMaskSelection (myDocument, theLayer.parent, false);
		var theDim = myDocument.selection.bounds;
		myDocument.activeLayer = theLayer;
		myDocument.selection.deselect();
		// work through the array;
		for (var m = 0; m < theFiles.length; m++) {
			// replace smart object;
			theLayer = replaceContents (theFiles[m], theLayer);
			// scale;
			var theBounds = theLayer.bounds;
			var theHor = (theDim[2]-theDim[0])/(theBounds[2]-theBounds[0])*100;
			var theVer = (theDim[3]-theDim[1])/(theBounds[3]-theBounds[1])*100;
			$.writeln(theDim);
			$.writeln((theDim[2]-theDim[0])/(theDim[3]-theDim[1]) +"\n"+ (theBounds[2]-theBounds[0])/(theBounds[3]-theBounds[1])+"\n");
		if ((theDim[2]-theDim[0])/(theDim[3]-theDim[1]) < (theBounds[2]-theBounds[0])/(theBounds[3]-theBounds[1])) 
	{
		var theFactor = theHor
	} else {
	var theFactor = theVer
	};
		theLayer.resize(theFactor, theFactor, AnchorPosition.MIDDLECENTER);
		//save jpg;
		var theNewName = theFiles[m].name.match(/(.*)\.[^\.]+$/)[1];
		myDocument.saveAs((new File(thePath+"/"+theName+"_"+theNewName+".jpg")),jpegOptions,true);
	};
		// reset;
		app.preferences.rulerUnits = originalRulerUnits;
	}
	}
	};

// Get PSDs, TIFs and JPGs from files
function getFiles(theFile) {
    if (theFile.name.match(/\.(psd|tif|jpg|eps)$/i) != null || theFile.constructor.name == "Folder") {
        return true
    };
};

////// replace contents //////

function replaceContents(newFile, theSO) {
    app.activeDocument.activeLayer = theSO;
    // =======================================================
    var idplacedLayerReplaceContents = stringIDToTypeID("placedLayerReplaceContents");
    var desc3 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    desc3.putPath(idnull, new File(newFile));
    var idPgNm = charIDToTypeID("PgNm");
    desc3.putInteger(idPgNm, 1);
    executeAction(idplacedLayerReplaceContents, desc3, DialogModes.NO);
    return app.activeDocument.activeLayer
};


////// also adapted from xbytors stdlib //////

function loadLayerMaskSelection (doc, layer, invert) {
  var desc = new ActionDescriptor();
  var cref = new ActionReference();
  cref.putProperty(charIDToTypeID("Chnl"), charIDToTypeID("fsel"));
  desc.putReference(charIDToTypeID("null"), cref);
  var tref = new ActionReference(); // Channel Kind ("Trsp" or "Msk ")
  tref.putEnumerated(charIDToTypeID("Chnl"), charIDToTypeID("Chnl"), charIDToTypeID("Msk "));
  desc.putReference(charIDToTypeID("T   "), tref);
  if (invert == true) {desc.putBoolean(charIDToTypeID("Invr"), true)};
  executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
  };