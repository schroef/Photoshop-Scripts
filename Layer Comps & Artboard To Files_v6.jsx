// Copyright 2007.  Adobe Systems, Incorporated.  All rights reserved.
// This script will apply each comp and then export to a file
// Written by Naoki Hada
// ZStrings and auto layout by Tom Ruark
// PNG support by Jeffrey Tranberry
// Artboard support by Antonio Costa

/*
@@@BUILDINFO@@@ Layer Comps &amp; Artboards to Files.jsx 1.0.0.24
*/

/*

// ADD SCRIPT TO FILE SYSTEM
// BEGIN__HARVEST_EXCEPTION_ZSTRING

<javascriptresource>
<name>$$$/JavaScripts/LayerCompsArtboardsToFiles/Menu=Layer Comps &amp; Artboards to Files...</name>
	<category>scriptexport</category>
	<menu>export</menu>
	
	<enableinfo>PSHOP_DocHasLayerComps</enableinfo>
<eventid>cf34b502-2013-4d07-8431-1dfd634ee0cd</eventid>
<terminology><![CDATA[<< /Version 1 
						 /Events << 
						  /cf34b502-2013-4d07-8431-1dfd634ee0cd [($$$/JavaScripts/LayerCompsToABFiles/Action=Layer Comps &amp; Artboards to Files) /noDirectParam <<
						  >>] 
						 >> 
					  >> ]]></terminology>
</javascriptresource>

// END__HARVEST_EXCEPTION_ZSTRING

*/


// enable double clicking from the Macintosh Finder or the Windows Explorer
#target photoshop

// debug level: 0-2 (0:disable, 1:break on error, 2:break at beginning)
// $.level = 0;
// debugger; // launch debugger on next line

// on localized builds we pull the $$$/Strings from a .dat file, see documentation for more details
$.localize = true;

//=================================================================
// Globals
//=================================================================

// UI strings to be localized
var strTitle = localize("$$$/JavaScripts/LayerCompsToABFiles/Title=Export");
var strButtonRun = localize("$$$/JavaScripts/LayerCompsToABFiles/Run=Run");
var strButtonCancel = localize("$$$/JavaScripts/LayerCompsToABFiles/Cancel=Cancel");
var strHelpText = localize("$$$/JavaScripts/LayerCompsToABFiles/Help=Please specify the format and location for saving each layer comp as a file.");
var strLabelDestination = localize("$$$/JavaScripts/LayerCompsToABFiles/Destination=Destination:");
var strButtonBrowse = localize("$$$/JavaScripts/LayerCompsToABFiles/Browse=&Browse...");
var strLabelFileNamePrefix = localize("$$$/JavaScripts/LayerCompsToABFiles/FileNamePrefix=File Name Prefix:");
var strCheckboxSelectionOnly = localize("$$$/JavaScripts/LayerCompsToABFiles/SelectedOnly=&Selected Layer Comps Only");
var strCheckboxAddCompComment = localize("$$$/JavaScripts/LayerCompsToABFiles/AddCompComment=&Include Layer Comp Comment");
var strLabelFileType = localize("$$$/JavaScripts/LayerCompsToABFiles/FileType=File Type:");
var strCheckboxIncludeICCProfile = localize("$$$/JavaScripts/LayerCompsToABFiles/IncludeICC=&Include ICC Profile");
var strJPEGOptions = localize("$$$/JavaScripts/LayerCompsToABFiles/JPEGOptions=JPEG Options:");
var strLabelQuality = localize("$$$/JavaScripts/LayerCompsToABFiles/Quality=Quality:");
var strPSDOptions = localize("$$$/JavaScripts/LayerCompsToABFiles/PSDOptions=PSD Options:");
var strPSDlayers = localize("$$$/JavaScripts/LayerCompsToABFiles/PSDlayers=Save Layers:");
var strCheckboxMaximizeCompatibility = localize("$$$/JavaScripts/LayerCompsToABFiles/Maximize=&Maximize Compatibility");
var strTIFFOptions = localize("$$$/JavaScripts/LayerCompsToABFiles/TIFFOptions=TIFF Options:");
var strCheckboxTIFFTransparency = localize("$$$/JavaScripts/ExportLayersToFiles/Transparency=Transparency");
var strLabelImageCompression = localize("$$$/JavaScripts/LayerCompsToABFiles/ImageCompression=Image Compression:");
var strNone = localize("$$$/JavaScripts/LayerCompsToABFiles/None=None");
var strPDFOptions = localize("$$$/JavaScripts/LayerCompsToABFiles/PDFOptions=PDF Options:");
var strLabelEncoding = localize("$$$/JavaScripts/LayerCompsToABFiles/Encoding=Encoding:");
var strTargaOptions = localize("$$$/JavaScripts/LayerCompsToABFiles/TargaOptions=Targa Options:");
var strLabelDepth = localize("$$$/JavaScripts/LayerCompsToABFiles/Depth=Depth:");
var strRadiobutton16bit = localize("$$$/JavaScripts/LayerCompsToABFiles/Bit16=16bit");
var strRadiobutton24bit = localize("$$$/JavaScripts/LayerCompsToABFiles/Bit24=24bit");
var strRadiobutton32bit = localize("$$$/JavaScripts/LayerCompsToABFiles/Bit32=32bit");
var strBMPOptions = localize("$$$/JavaScripts/LayerCompsToABFiles/BMPOptions=BMP Options:");
var strAlertSpecifyDestination = localize("$$$/JavaScripts/LayerCompsToABFiles/SpecifyDestination=Please specify destination.");
var strAlertDestinationNotExist = localize("$$$/JavaScripts/LayerCompsToABFiles/DestionationDoesNotExist=Destination does not exist.");
var strTitleSelectDestination = localize("$$$/JavaScripts/LayerCompsToABFiles/SelectDestination=Select Destination");
var strAlertDocumentMustBeOpened = localize("$$$/JavaScripts/LayerCompsToABFiles/OneDocument=You must have a document open to export!");
var strAlertNoLayerCompsFound = localize("$$$/JavaScripts/LayerCompsToABFiles/NoComps=No layer comps found in document!");
var strAlertNoLayerCompsSelected = localize("$$$/JavaScripts/LayerCompsToFiles/NoSelectedComps=No layer comps selected in document!");
var strAlertWasSuccessful = localize("$$$/JavaScripts/LayerCompsToABFiles/Success= was successful.");
var strUnexpectedError = localize("$$$/JavaScripts/LayerCompsToABFiles/Unexpectedd=Unexpected error");
var strMessage = localize("$$$/JavaScripts/LayerCompsToABFiles/Message=Layer Comps To Files action settings");
var stretQuality = localize("$$$/locale_specific/JavaScripts/LayerCompsToABFiles/ETQualityLength=30");
var stretDestination = localize("$$$/locale_specific/JavaScripts/LayerCompsToABFiles/ETDestinationLength=350");
var strddFileType = localize("$$$/locale_specific/JavaScripts/LayerCompsToABFiles/DDFileType=100");
var strpnlOptions = localize("$$$/locale_specific/JavaScripts/LayerCompsToABFiles/PNLOptions=100");
var strCreateFolder = localize("$$$/JavaScripts/LayerCompsToABFiles/CreateFolder=The folder does not exist. Do you wish to create it?^r");
var strCouldNotCreate = localize("$$$/JavaScripts/LayerCompsToABFiles/CouldNotCreate=The folder could not be created.");
var strPNG8Options = localize("$$$/JavaScripts/ExportLayersToFiles/PNG8Options=PNG-8 Options:");
var strCheckboxPNGTransparency = localize("$$$/JavaScripts/ExportLayersToFiles/Transparency=Transparency");
var strCheckboxPNGInterlaced = localize("$$$/JavaScripts/ExportLayersToFiles/Interlaced=Interlaced");
var strPNG24Options = localize("$$$/JavaScripts/ExportLayersToFiles/PNG24Options=PNG-24 Options:");
var strConvertICC = localize( "$$$/JavaScripts/ImageProcessor/Convert=Convert to sRGB" );
var strConvertICCHelp = localize( "$$$/JavaScripts/ImageProcessor/ConvertHelp=Convert the ICC profile to sRGB before saving" );

var strAlertNoArtboardsFound = localize("$$$/JavaScripts/LayerCompsToABFiles/Noartbrd=No artboards found in document.");
var strIncludeArtboardName = localize('$$$/JavaScripts/LayerCompsToABFiles/IncludeArtboardName=Include Artboard Name')
var strShowUseArtboard = localize('$$$/JavaScripts/ArtboardsToFiles/ShowUseArtboard=Single Artboard')
var strddUseArtBoard = localize("$$$/locale_specific/JavaScripts/LayerCompsToABFiles/DDUseArtboard=100");
var strLabelUseArtboard = localize("$$$/JavaScripts/LayerCompsToABFiles/UseArtboard=Choose Artboard");
var strArtboardPanelOptions = localize('$$$/JavaScripts/ArtboardsToFiles/Options=Options:')

// the drop down list indexes for file type
var bmpIndex = 0;
var jpegIndex = 1;
var pdfIndex = 2;
var psdIndex = 3;
var targaIndex = 4;
var tiffIndex = 5;
var png8Index = 6;
var png24Index = 7;

// the drop down list indexes for tiff compression
var compNoneIndex = 0;
var compLZWIndex = 1;
var compZIPIndex = 2;
var compJPEGIndex = 3;

// ok and cancel button
var runButtonID = 1;
var cancelButtonID = 2;


///////////////////////////////////////////////////////////////////////////////
// Dispatch
///////////////////////////////////////////////////////////////////////////////

main();



///////////////////////////////////////////////////////////////////////////////
// Functions
///////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////
// Function: main
// Usage: the core routine for this script
// Input: <none>
// Return: <none>
///////////////////////////////////////////////////////////////////////////////
function main() {

    if (app.documents.length <= 0) {
        if (DialogModes.NO != app.playbackDisplayDialogs) {
            alert(strAlertDocumentMustBeOpened);
        }
        return 'cancel'; // quit, returning 'cancel' (dont localize) makes the actions palette not record our script
    }

    // Check selected Artboards
    // var origDoc = app.activeDocument
    //var sel_indxs = getSelectedLayersAMIdx(origDoc)
    // check to see if selected layers are artboards have artboardID.
    // var abArSelected = getArtBoards(sel_indxs)

    // Check if Artboards are available
    var abAr = getABLayerInfo().reverse();
    var artbrdCount = abAr.length;
    // if (abArSelected.length === 0) {
    if (artbrdCount === 0) {
        var artboardAvail = false
    } else {
        var artboardAvail = true
    }
    // Check if Artboards are available
    var abAr = getABLayerInfo().reverse();
    var artbrdCount = abAr.length;

    // Check if we can use Layercomps
    var docLayerComps = app.activeDocument.layerComps;
    var compsCount = docLayerComps.length;
    var compS_indx = [];
    for ( compsIndex = 0; compsIndex < compsCount; compsIndex++ ) {
        var compRef = docLayerComps[ compsIndex ];
        //alert(compRef+" "+compRef.selected)
        if (compRef.selected) {
            var isSel = true
            compS_indx.push(isSelection);
        } else {
            var isSel = false
        }
    }
    if (compS_indx.length === 0) {
            var isSelection = false
        } else {
            var isSelection = true
        }
    
    var exportInfo = new Object();

    initExportInfo(exportInfo, isSelection, artboardAvail, false);
    // initExportInfo(exportInfo, isSelection);

    // look for last used params via Photoshop registry, getCustomOptions will throw if none exist
    try {
        var d = app.getCustomOptions("d69fc733-75b4-4d5c-ae8a-c6d6f9a8aa32");
        descriptorToObject(exportInfo, d, strMessage, postProcessExportInfo);
    } catch (e) {
        // it's ok if we don't have any options, continue with defaults
    }

    // see if I am getting descriptor parameters
    descriptorToObject(exportInfo, app.playbackParameters, strMessage, postProcessExportInfo);

    // This method set to init settings
    // RUN THE DIALOG! (if dialog setting is on - in case running through recorded action.)
    // if (DialogModes.NO != app.playbackDisplayDialogs) {
    //     // adding anything else here that I do NOT want to be sticky, like the other export options that are not file based.
    //     initExportInfo(exportInfo, isSelection, artboardAvail, true)
    //     initFileNameDestination(exportInfo)
    //     if (DialogModes.ALL == app.playbackDisplayDialogs) {
    //         if (cancelButtonID == settingDialog(exportInfo)) {
    //             return 'cancel'; // quit, returning 'cancel' (dont localize) makes the actions palette not record our script
    //         }
    //     }
    // }

    // initExportInfo without "exportInfo" remembers last settings
    // alert(artboardAvail)
    initExportInfo(exportInfo, isSelection, artboardAvail, true);
    if (DialogModes.ALL == app.playbackDisplayDialogs) {
        if (cancelButtonID == settingDialog(exportInfo)) {
            return 'cancel'; // quit, returning 'cancel' (dont localize) makes the actions palette not record our script
        }
    }

    try {
        var docName = app.activeDocument.name; // save the app.activeDocument name before duplicate.
        var compsName = new String("none");
        var compsCount = app.activeDocument.layerComps.length;
        if (compsCount < 1) {
            if (DialogModes.NO != app.playbackDisplayDialogs) {
                alert(strAlertNoLayerCompsFound);
            }
            return 'cancel'; // quit, returning 'cancel' (dont localize) makes the actions palette not record our script
		} else if ( selectedCompsConfigError(app.activeDocument.layerComps, exportInfo) ) {
            if ( DialogModes.NO != app.playbackDisplayDialogs ) {
                alert ( strAlertNoLayerCompsSelected );
            }
	    	return 'cancel'; // quit, returning 'cancel' (dont localize) makes the actions palette not record our script	
        } else {
            app.activeDocument = app.documents[docName];
            docRef = app.activeDocument;

            var rememberMaximize;
            var needMaximize = exportInfo.psdMaxComp ? QueryStateType.ALWAYS : QueryStateType.NEVER;
            if (exportInfo.fileType == psdIndex && app.preferences.maximizeCompatibility != needMaximize) {
                rememberMaximize = app.preferences.maximizeCompatibility;
                app.preferences.maximizeCompatibility = needMaximize;
            }

			if (exportInfo.artboardShow && (exportInfo.singleArtboard == "0")) {
				alert("No artboard selected!" +"\n" + "Select one from the dropdown menu");
				return 'cancel'; // quit, returning 'cancel' (dont localize) makes the actions palette not record our script
			}
            var nameCountObj = countCompsNames(docRef.layerComps);
            for (compsIndex = 0; compsIndex < compsCount; compsIndex++) {
                var compRef = docRef.layerComps[compsIndex];
                if (exportInfo.selectionOnly && !compRef.selected) continue; // selected only
                compRef.apply();

                try {
                    // get the artboard data from the active document,
                    var abAr = getABLayerInfo().reverse();
                    var artbrdCount = abAr.length;
                } catch (e) {
                    // DO nothing
                }
                // if (artbrdCount == 0) {
                //     if (DialogModes.NO != app.playbackDisplayDialogs) {
                //         alert(strAlertNoArtboardsFound);
                //     }
                    // return 'cancel'; // quit, returning 'cancel' (dont localize) makes the actions palette not record our script
                // } else {    
                if (exportInfo.artboardShow) {
                    var singAB = exportInfo.singleArtboard;
                    // alert (abAr+" - Artboard - SingAB - " + singAB)
                    exportArtboards(compsIndex, singAB, exportInfo, abAr, compRef, nameCountObj);
                }
                if (!exportInfo.artboardShow) {
                    if (artbrdCount !== 0) {
                        for (artbrdIndex = 0; artbrdIndex < artbrdCount; artbrdIndex++) {
                            exportArtboards(compsIndex, artbrdIndex, exportInfo, abAr, compRef, nameCountObj);
                        }
                    } else {
                        var abAr = false
                        exportArtboards(compsIndex, singAB, exportInfo, abAr, compRef, nameCountObj);
                    }
                
                }
                // }
            }

            var d = objectToDescriptor(exportInfo, strMessage, preProcessExportInfo);
            app.putCustomOptions("d69fc733-75b4-4d5c-ae8a-c6d6f9a8aa32", d);

            var dd = objectToDescriptor(exportInfo, strMessage, preProcessExportInfo);
            app.playbackParameters = dd;

            if (rememberMaximize != undefined) {
                app.preferences.maximizeCompatibility = rememberMaximize;
            }

            if (DialogModes.ALL == app.playbackDisplayDialogs) {
                alert(strTitle + strAlertWasSuccessful + '\n' + exportInfo.destination);
            }

            app.playbackDisplayDialogs = DialogModes.ALL;

        }
    } catch (e) {
        if (DialogModes.NO != app.playbackDisplayDialogs) {
            alert(e);
        }
        return 'cancel'; // quit, returning 'cancel' (dont localize) makes the actions palette not record our script
    }
}


///////////////////////////////////////////////////////////////////////////////
// Function: settingDialog
// Usage: pop the ui and get user settings
// Input: exportInfo object containing our parameters
// Return: on ok, the dialog info is set to the exportInfo object
///////////////////////////////////////////////////////////////////////////////
function settingDialog(exportInfo) {
    var dlgMain = new Window("dialog", strTitle);

    // match our dialog background color to the host application
    var brush = dlgMain.graphics.newBrush(dlgMain.graphics.BrushType.THEME_COLOR, "appDialogBackground");
    dlgMain.graphics.backgroundColor = brush;
    dlgMain.graphics.disabledBackgroundColor = brush;

    dlgMain.orientation = 'column';
    dlgMain.alignChildren = 'left';

    // -- top of the dialog, first line
    dlgMain.add("statictext", undefined, strLabelDestination);

    // -- two groups, one for left and one for right ok, cancel
    dlgMain.grpTop = dlgMain.add("group");
    dlgMain.grpTop.orientation = 'row';
    dlgMain.grpTop.alignChildren = 'top';
    dlgMain.grpTop.alignment = 'fill';

    // -- group top left 
    dlgMain.grpTopLeft = dlgMain.grpTop.add("group");
    dlgMain.grpTopLeft.orientation = 'column';
    dlgMain.grpTopLeft.alignChildren = 'left';
    dlgMain.grpTopLeft.alignment = 'fill';

    // -- the second line in the dialog
    dlgMain.grpSecondLine = dlgMain.grpTopLeft.add("group");
    dlgMain.grpSecondLine.orientation = 'row';
    dlgMain.grpSecondLine.alignChildren = 'center';

    dlgMain.etDestination = dlgMain.grpSecondLine.add("edittext", undefined, exportInfo.destination.toString());
    dlgMain.etDestination.preferredSize = [220,20];
    // dlgMain.etDestination.preferredSize.width = StrToIntWithDefault(stretDestination, 250);

    dlgMain.btnBrowse = dlgMain.grpSecondLine.add("button", undefined, strButtonBrowse);
    dlgMain.btnBrowse.preferredSize = [50,25];
    dlgMain.btnBrowse.onClick = function() {
        var defaultFolder = dlgMain.etDestination.text;
        var testFolder = new Folder(dlgMain.etDestination.text);
        if (!testFolder.exists) defaultFolder = "~";
        var selFolder = Folder.selectDialog(strTitleSelectDestination, defaultFolder);
        if (selFolder != null) {
            dlgMain.etDestination.text = selFolder.fsName;
        }
        dlgMain.defaultElement.active = true;
    }

    // -- the third line in the dialog
    dlgMain.grpTopLeft.add("statictext", undefined, strLabelFileNamePrefix);

    // -- the fourth line in the dialog
    // dlgMain.etFileNamePrefix = dlgMain.grpTopLeft.add("edittext", undefined, exportInfo.fileNamePrefix.toString());
    // dlgMain.etFileNamePrefix.alignment = 'fill';
    // dlgMain.etFileNamePrefix.preferredSize.width = StrToIntWithDefault( stretDestination, 160 );
    dlgMain.grFileNamePrefixGr = dlgMain.grpTopLeft.add("group");
    dlgMain.grFileNamePrefixGr.orientation = "row";
    dlgMain.grFileNamePrefixGr.spacing = 5;
    dlgMain.grFileNamePrefixGr.margins = 5;
    dlgMain.etFileNamePrefix = dlgMain.grFileNamePrefixGr.add("edittext", undefined, exportInfo.fileNamePrefix.toString());
    dlgMain.etFileNamePrefix.preferredSize = [250, 20];
    dlgMain.cbFileNamePrefixIndex = dlgMain.grFileNamePrefixGr.add("checkbox", undefined, "Index");
    dlgMain.cbFileNamePrefixIndex.alignment = "right";
    dlgMain.cbFileNamePrefixIndex.value = exportInfo.prefixIndex;

    // -- the fifth line in the dialog
    dlgMain.cbSelection = dlgMain.grpTopLeft.add("checkbox", undefined, strCheckboxSelectionOnly);
    dlgMain.cbSelection.value = exportInfo.selectionOnly;
    dlgMain.cbSelection.enabled = exportInfo.selectionOnly;
    
    dlgMain.cbComment = dlgMain.grpTopLeft.add("checkbox", undefined, strCheckboxAddCompComment);
    dlgMain.cbComment.value = exportInfo.addCompComment;

    // - Added ArtBoard names optional
    dlgMain.cbIncludeArtboardName = dlgMain.grpTopLeft.add('checkbox', undefined, strIncludeArtboardName);
    dlgMain.cbIncludeArtboardName.value = exportInfo.inclArtboardName;
    dlgMain.cbIncludeArtboardName.enabled = exportInfo.artboardsEnab;

    // - Picker custom Artboard
    // -- now a dropdown list
    // enable checkbox functionality
	dlgMain.cbArtboardShow = dlgMain.grpTopLeft.add('checkbox', undefined, strShowUseArtboard);
	dlgMain.cbArtboardShow.value = exportInfo.artboardShow;
    dlgMain.cbArtboardShow.enabled = exportInfo.artboardsEnab;

    dlgMain.pnlUseArtboard = dlgMain.grpTopLeft.add("group");
    dlgMain.pnlUseArtboard.alignment = 'left';

    // dlgMain.pnlUseArtboard.pnlABoptions = dlgMain.grpTopLeft.add("panel", undefined, strLabelUseArtboard);
    dlgMain.pnlUseArtboard.pnlABoptions = dlgMain.grpTopLeft.add("group");
    // dlgMain.pnlUseArtboard.pnlABoptions.spacing = 1;
    // dlgMain.pnlUseArtboard.pnlABoptions.margins = 1;
    dlgMain.pnlUseArtboard.pnlABoptions.alignment = 'left';
    

    dlgMain.pnlUseArtboard.pnlABoptions.add("statictext", undefined, strLabelUseArtboard);
    dlgMain.pnlUseArtboard.pnlABoptions.ddUseArtboard = dlgMain.pnlUseArtboard.pnlABoptions.add("dropdownlist");
    dlgMain.pnlUseArtboard.pnlABoptions.ddUseArtboard.preferredSize.width = StrToIntWithDefault(strddUseArtBoard, 120);
    dlgMain.pnlUseArtboard.pnlABoptions.ddUseArtboard.alignment = 'left';
    var UseabAr = getABLayerInfo().reverse();
    var UseartbrdCount = UseabAr.length;
	// UseartbrdCount += 1; //add 1 to compensentate None in menu
	dlgMain.pnlUseArtboard.pnlABoptions.ddUseArtboard.add("item", "None");
    for (UseartbrdIndex = 0; UseartbrdIndex < UseartbrdCount; UseartbrdIndex++) {
        dlgMain.pnlUseArtboard.pnlABoptions.ddUseArtboard.add("item", UseabAr[UseartbrdIndex].name);
    }
	// -- now the options panel that changes
    //   dlgMain.pnlUseArtboard.pnlABoptions = dlgMain.pnlUseArtboard.add('panel', undefined, strArtboardPanelOptions)
    //   dlgMain.pnlUseArtboard.pnlABoptions.alignment = 'fill'

    dlgMain.cbArtboardShow.onClick = function() {
        if (dlgMain.cbArtboardShow.value) {
            dlgMain.pnlUseArtboard.pnlABoptions.show();
            populateOptions(dlgMain.pnlUseArtboard.pnlABoptions.ddUseArtboard.selection.index);
        }
        if (!dlgMain.cbArtboardShow.value) {
            dlgMain.pnlUseArtboard.pnlABoptions.hide();
        }
    }
    // Also hide artboard options
    if (!dlgMain.cbArtboardShow.value) dlgMain.pnlUseArtboard.pnlABoptions.hide();
	// Set menu too default
	dlgMain.pnlUseArtboard.pnlABoptions.ddUseArtboard.items["0"].selected = true;
	// dlgMain.pnlUseArtboard.pnlABoptions.ddUseArtboard.items[chosenArtboard].selected = true;
	
    // -- the sixth line is the panel
    dlgMain.pnlFileType = dlgMain.grpTopLeft.add("panel", undefined, strLabelFileType);
    dlgMain.pnlFileType.alignment = 'fill';

    // -- now a dropdown list
    dlgMain.ddFileType = dlgMain.pnlFileType.add("dropdownlist");
    dlgMain.ddFileType.preferredSize.width = StrToIntWithDefault(strddFileType, 100);
    dlgMain.ddFileType.alignment = 'left';

    dlgMain.ddFileType.add("item", "BMP");
    dlgMain.ddFileType.add("item", "JPEG");
    dlgMain.ddFileType.add("item", "PDF");
    dlgMain.ddFileType.add("item", "PSD");
    dlgMain.ddFileType.add("item", "Targa");
    dlgMain.ddFileType.add("item", "TIFF");
    dlgMain.ddFileType.add("item", "PNG-8");
    dlgMain.ddFileType.add("item", "PNG-24");

    dlgMain.ddFileType.onChange = function() {
        hideAllFileTypePanel(dlgMain);
        switch (this.selection.index) {
            case bmpIndex:
                dlgMain.pnlFileType.pnlOptions.text = strBMPOptions;
                dlgMain.pnlFileType.pnlOptions.grpBMPOptions.show();
                break;
            case jpegIndex:
                dlgMain.pnlFileType.pnlOptions.text = strJPEGOptions;
                dlgMain.pnlFileType.pnlOptions.grpJPEGOptions.show();
                break;
            case tiffIndex:
                dlgMain.pnlFileType.pnlOptions.text = strTIFFOptions;
                dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.show();
                break;
            case pdfIndex:
                dlgMain.pnlFileType.pnlOptions.text = strPDFOptions;
                dlgMain.pnlFileType.pnlOptions.grpPDFOptions.show();
                break;
            case targaIndex:
                dlgMain.pnlFileType.pnlOptions.text = strTargaOptions;
                dlgMain.pnlFileType.pnlOptions.grpTargaOptions.show();
                break;
            case png8Index:
                dlgMain.pnlFileType.pnlOptions.text = strPNG8Options;
                dlgMain.pnlFileType.pnlOptions.grpPNG8Options.show();
                break;
            case png24Index:
                dlgMain.pnlFileType.pnlOptions.text = strPNG24Options;
                dlgMain.pnlFileType.pnlOptions.grpPNG24Options.show();
                break;
            case psdIndex:
            default:
                dlgMain.pnlFileType.pnlOptions.text = strPSDOptions;
                dlgMain.pnlFileType.pnlOptions.grpPSDOptions.show();
                break;
        }
    }

    dlgMain.ddFileType.items[exportInfo.fileType].selected = true;

    // -- now after all the radio buttons
    dlgMain.grICCGr = dlgMain.pnlFileType.add("group");
    dlgMain.grICCGr.orientation = "row";
    // dlgMain.grICCGr.spacing = 0;
    // dlgMain.grICCGr.margins = 5;
    
    dlgMain.cbIcc = dlgMain.grICCGr.add("checkbox", undefined, strCheckboxIncludeICCProfile);
    dlgMain.cbIcc.value = exportInfo.icc;
    // dlgMain.cbIcc.alignment = 'left';

    dlgMain.cbConvertICC = dlgMain.grICCGr.add( 'checkbox', undefined, strConvertICC );
    dlgMain.cbConvertICC.value = exportInfo.convicc;
    dlgMain.cbConvertICC.alignment = 'right';
    dlgMain.cbConvertICC.helpTip = strConvertICCHelp;

    // -- now the options panel that changes
    dlgMain.pnlFileType.pnlOptions = dlgMain.pnlFileType.add("panel", undefined, "Options");
    dlgMain.pnlFileType.pnlOptions.alignment = 'fill';
    dlgMain.pnlFileType.pnlOptions.orientation = 'stack';
    dlgMain.pnlFileType.pnlOptions.preferredSize.height = StrToIntWithDefault(strpnlOptions, 100);

    // PSD options
    dlgMain.pnlFileType.pnlOptions.grpPSDOptions = dlgMain.pnlFileType.pnlOptions.add("group");
    dlgMain.pnlFileType.pnlOptions.grpPSDOptions.cbPSDlayers = dlgMain.pnlFileType.pnlOptions.grpPSDOptions.add("checkbox", undefined, strPSDlayers.toString());
    dlgMain.pnlFileType.pnlOptions.grpPSDOptions.cbPSDlayers.value = exportInfo.psdLayers;
    dlgMain.pnlFileType.pnlOptions.grpPSDOptions.cbMax = dlgMain.pnlFileType.pnlOptions.grpPSDOptions.add("checkbox", undefined, strCheckboxMaximizeCompatibility);
    dlgMain.pnlFileType.pnlOptions.grpPSDOptions.cbMax.value = exportInfo.psdMaxComp;
    dlgMain.pnlFileType.pnlOptions.grpPSDOptions.visible = (exportInfo.fileType == psdIndex);

    // PNG8 options
    dlgMain.pnlFileType.pnlOptions.grpPNG8Options = dlgMain.pnlFileType.pnlOptions.add("group");
    dlgMain.pnlFileType.pnlOptions.grpPNG8Options.png8Trans = dlgMain.pnlFileType.pnlOptions.grpPNG8Options.add("checkbox", undefined, strCheckboxPNGTransparency.toString());
    dlgMain.pnlFileType.pnlOptions.grpPNG8Options.png8Inter = dlgMain.pnlFileType.pnlOptions.grpPNG8Options.add("checkbox", undefined, strCheckboxPNGInterlaced.toString());
    dlgMain.pnlFileType.pnlOptions.grpPNG8Options.png8Trans.value = exportInfo.png8Transparency;
    dlgMain.pnlFileType.pnlOptions.grpPNG8Options.png8Inter.value = exportInfo.png8Interlaced;
    dlgMain.pnlFileType.pnlOptions.grpPNG8Options.visible = (exportInfo.fileType == png8Index);

    // PNG24 options
    dlgMain.pnlFileType.pnlOptions.grpPNG24Options = dlgMain.pnlFileType.pnlOptions.add("group");
    dlgMain.pnlFileType.pnlOptions.grpPNG24Options.png24Trans = dlgMain.pnlFileType.pnlOptions.grpPNG24Options.add("checkbox", undefined, strCheckboxPNGTransparency.toString());
    dlgMain.pnlFileType.pnlOptions.grpPNG24Options.png24Inter = dlgMain.pnlFileType.pnlOptions.grpPNG24Options.add("checkbox", undefined, strCheckboxPNGInterlaced.toString());
    dlgMain.pnlFileType.pnlOptions.grpPNG24Options.png24Trans.value = exportInfo.png24Transparency;
    dlgMain.pnlFileType.pnlOptions.grpPNG24Options.png24Inter.value = exportInfo.png24Interlaced;
    dlgMain.pnlFileType.pnlOptions.grpPNG24Options.visible = (exportInfo.fileType == png24Index);

    // JPEG options
    dlgMain.pnlFileType.pnlOptions.grpJPEGOptions = dlgMain.pnlFileType.pnlOptions.add("group");
    dlgMain.pnlFileType.pnlOptions.grpJPEGOptions.add("statictext", undefined, strLabelQuality);
    dlgMain.pnlFileType.pnlOptions.grpJPEGOptions.etQuality = dlgMain.pnlFileType.pnlOptions.grpJPEGOptions.add("edittext", undefined, exportInfo.jpegQuality.toString());
    dlgMain.pnlFileType.pnlOptions.grpJPEGOptions.etQuality.preferredSize.width = StrToIntWithDefault(stretQuality, 30);
    dlgMain.pnlFileType.pnlOptions.grpJPEGOptions.visible = (exportInfo.fileType == jpegIndex);

    // TIFF options
    dlgMain.pnlFileType.pnlOptions.grpTIFFOptions = dlgMain.pnlFileType.pnlOptions.add("group");
    dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.orientation = 'column';
    dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.visible = (exportInfo.fileType == tiffIndex);

    dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.tiffTrans = dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.add("checkbox", undefined, strCheckboxTIFFTransparency.toString());
    dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.tiffTrans.value = exportInfo.tiffTransparency;

    dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpCompression = dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.add("group");
    dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpCompression.alignment = 'left';
    dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpCompression.add("statictext", undefined, strLabelImageCompression);

    dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpCompression.ddCompression = dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpCompression.add("dropdownlist");
    dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpCompression.ddCompression.add("item", strNone);
    dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpCompression.ddCompression.add("item", "LZW");
    dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpCompression.ddCompression.add("item", "ZIP");
    dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpCompression.ddCompression.add("item", "JPEG");

    dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpCompression.ddCompression.onChange = function() {
        if (this.selection.index == compJPEGIndex) {
            dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpQuality.stQuality.enabled = true;
            dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpQuality.etQuality.enabled = true;
        } else {
            dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpQuality.stQuality.enabled = false;
            dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpQuality.etQuality.enabled = false;
        }
    }

    dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpQuality = dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.add("group");
    dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpQuality.alignment = 'left';
    dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpQuality.stQuality = dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpQuality.add("statictext", undefined, strLabelQuality);
    dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpQuality.etQuality = dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpQuality.add("edittext", undefined, exportInfo.tiffJpegQuality.toString());
    dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpQuality.etQuality.preferredSize.width = StrToIntWithDefault(stretQuality, 30);
    dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpQuality.etQuality.graphics.disabledBackgroundColor = brush;


    var index;
    switch (exportInfo.tiffCompression) {
        case TIFFEncoding.NONE:
            index = compNoneIndex;
            break;
        case TIFFEncoding.TIFFLZW:
            index = compLZWIndex;
            break;
        case TIFFEncoding.TIFFZIP:
            index = compZIPIndex;
            break;
        case TIFFEncoding.JPEG:
            index = compJPEGIndex;
            break;
        default:
            index = compNoneIndex;
            break;
    }

    dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpCompression.ddCompression.items[index].selected = true;

    if (TIFFEncoding.JPEG != exportInfo.tiffCompression) { // if not JPEG
        dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpQuality.stQuality.enabled = false;
        dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpQuality.etQuality.enabled = false;
    }


    // PDF options
    dlgMain.pnlFileType.pnlOptions.grpPDFOptions = dlgMain.pnlFileType.pnlOptions.add("group");
    dlgMain.pnlFileType.pnlOptions.grpPDFOptions.orientation = 'column';
    dlgMain.pnlFileType.pnlOptions.grpPDFOptions.visible = (exportInfo.fileType == pdfIndex);

    dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpCompression = dlgMain.pnlFileType.pnlOptions.grpPDFOptions.add("group");
    dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpCompression.alignment = 'left';
    dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpCompression.add("statictext", undefined, strLabelEncoding);

    dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpCompression.rbZip = dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpCompression.add("radiobutton", undefined, "ZIP");
    dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpCompression.rbZip.onClick = function() {
        dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpQuality.stQuality.enabled = false;
        dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpQuality.etQuality.enabled = false;
    }

    dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpCompression.rbJpeg = dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpCompression.add("radiobutton", undefined, "JPEG");
    dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpCompression.rbJpeg.onClick = function() {
        dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpQuality.stQuality.enabled = true;
        dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpQuality.etQuality.enabled = true;
    }

    dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpQuality = dlgMain.pnlFileType.pnlOptions.grpPDFOptions.add("group");
    dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpQuality.alignment = 'left';

    dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpQuality.stQuality = dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpQuality.add("statictext", undefined, strLabelQuality);

    dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpQuality.etQuality = dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpQuality.add("edittext", undefined, exportInfo.pdfJpegQuality.toString());
    dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpQuality.etQuality.preferredSize.width = StrToIntWithDefault(stretQuality, 30);
    dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpQuality.etQuality.graphics.disabledBackgroundColor = brush;

    switch (exportInfo.pdfEncoding) {
        case PDFEncoding.PDFZIP:
            dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpCompression.rbZip.value = true;
            break;
        case PDFEncoding.JPEG:
        default:
            dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpCompression.rbJpeg.value = true;
            break;
    }

    if (PDFEncoding.JPEG != exportInfo.pdfEncoding) {
        dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpQuality.stQuality.enabled = false;
        dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpQuality.etQuality.enabled = false;
    }

    // Targa options
    dlgMain.pnlFileType.pnlOptions.grpTargaOptions = dlgMain.pnlFileType.pnlOptions.add("group");
    dlgMain.pnlFileType.pnlOptions.grpTargaOptions.add("statictext", undefined, strLabelDepth);
    dlgMain.pnlFileType.pnlOptions.grpTargaOptions.visible = (exportInfo.fileType == targaIndex);

    dlgMain.pnlFileType.pnlOptions.grpTargaOptions.rb16bit = dlgMain.pnlFileType.pnlOptions.grpTargaOptions.add("radiobutton", undefined, strRadiobutton16bit);
    dlgMain.pnlFileType.pnlOptions.grpTargaOptions.rb24bit = dlgMain.pnlFileType.pnlOptions.grpTargaOptions.add("radiobutton", undefined, strRadiobutton24bit);
    dlgMain.pnlFileType.pnlOptions.grpTargaOptions.rb32bit = dlgMain.pnlFileType.pnlOptions.grpTargaOptions.add("radiobutton", undefined, strRadiobutton32bit);

    switch (exportInfo.targaDepth) {
        case TargaBitsPerPixels.SIXTEEN:
            dlgMain.pnlFileType.pnlOptions.grpTargaOptions.rb16bit.value = true;
            break;
        case TargaBitsPerPixels.TWENTYFOUR:
            dlgMain.pnlFileType.pnlOptions.grpTargaOptions.rb24bit.value = true;
            break;
        case TargaBitsPerPixels.THIRTYTWO:
            dlgMain.pnlFileType.pnlOptions.grpTargaOptions.rb32bit.value = true;
            break;
        default:
            dlgMain.pnlFileType.pnlOptions.grpTargaOptions.rb24bit.value = true;
            break;
    }


    // BMP options
    dlgMain.pnlFileType.pnlOptions.grpBMPOptions = dlgMain.pnlFileType.pnlOptions.add("group");
    dlgMain.pnlFileType.pnlOptions.grpBMPOptions.add("statictext", undefined, strLabelDepth);
    dlgMain.pnlFileType.pnlOptions.grpBMPOptions.visible = (exportInfo.fileType == bmpIndex);

    dlgMain.pnlFileType.pnlOptions.grpBMPOptions.rb16bit = dlgMain.pnlFileType.pnlOptions.grpBMPOptions.add("radiobutton", undefined, strRadiobutton16bit);
    dlgMain.pnlFileType.pnlOptions.grpBMPOptions.rb24bit = dlgMain.pnlFileType.pnlOptions.grpBMPOptions.add("radiobutton", undefined, strRadiobutton24bit);
    dlgMain.pnlFileType.pnlOptions.grpBMPOptions.rb32bit = dlgMain.pnlFileType.pnlOptions.grpBMPOptions.add("radiobutton", undefined, strRadiobutton32bit);

    switch (exportInfo.bmpDepth) {
        case BMPDepthType.SIXTEEN:
            dlgMain.pnlFileType.pnlOptions.grpBMPOptions.rb16bit.value = true;
            break;
        case BMPDepthType.TWENTYFOUR:
            dlgMain.pnlFileType.pnlOptions.grpBMPOptions.rb24bit.value = true;
            break;
        case BMPDepthType.THIRTYTWO:
            dlgMain.pnlFileType.pnlOptions.grpBMPOptions.rb32bit.value = true;
            break;
        default:
            dlgMain.pnlFileType.pnlOptions.grpBMPOptions.rb24bit.value = true;
            break;
    }

    // the right side of the dialog, the ok and cancel buttons
    dlgMain.grpTopRight = dlgMain.grpTop.add("group");
    dlgMain.grpTopRight.orientation = 'column';
    dlgMain.grpTopRight.alignChildren = 'fill';

    dlgMain.btnRun = dlgMain.grpTopRight.add("button", undefined, strButtonRun);
    dlgMain.btnRun.onClick = function() {
        // check if the setting is properly
        var destination = dlgMain.etDestination.text;
        if (destination.length == 0) {
            alert(strAlertSpecifyDestination);
            return;
        }
        var testFolder = new Folder(destination);
        if (!testFolder.exists) {
            alert(strAlertDestinationNotExist);
            return;
        }

        dlgMain.close(runButtonID);
    }

    dlgMain.btnCancel = dlgMain.grpTopRight.add("button", undefined, strButtonCancel);
    dlgMain.btnCancel.onClick = function() {
        dlgMain.close(cancelButtonID);
    }

    dlgMain.defaultElement = dlgMain.btnRun;
    dlgMain.cancelElement = dlgMain.btnCancel;

    // the bottom of the dialog
    dlgMain.grpBottom = dlgMain.add("group");
    dlgMain.grpBottom.orientation = 'column';
    dlgMain.grpBottom.alignChildren = 'left';
    dlgMain.grpBottom.alignment = 'fill';

    dlgMain.pnlHelp = dlgMain.grpBottom.add("panel");
    dlgMain.pnlHelp.alignment = 'fill';

    dlgMain.etHelp = dlgMain.pnlHelp.add("statictext", undefined, strHelpText, {
        multiline: true
    });
    dlgMain.etHelp.alignment = 'fill';

    // do not allow anything except for numbers 0-9
    //dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpQuality.etQuality.addEventListener ('keydown', NumericEditKeyboardHandler);

    // do not allow anything except for numbers 0-9
    //dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpQuality.etQuality.addEventListener ('keydown', NumericEditKeyboardHandler);

    // do not allow anything except for numbers 0-9
    //dlgMain.pnlFileType.pnlOptions.grpJPEGOptions.etQuality.addEventListener ('keydown', NumericEditKeyboardHandler);

    dlgMain.onShow = function() {
        dlgMain.ddFileType.onChange();
        dlgMain.ddUseArtboard.onChange();
    }

    // in case we double clicked the file
    app.bringToFront();

    dlgMain.center();

    var result = dlgMain.show();

    if (cancelButtonID == result) {
        return result; // close to quit
    }

    // get setting from dialog
    exportInfo.destination = dlgMain.etDestination.text;
    exportInfo.fileNamePrefix = dlgMain.etFileNamePrefix.text;
    exportInfo.prefixIndex = dlgMain.cbFileNamePrefixIndex.value;
    exportInfo.selectionOnly = dlgMain.cbSelection.value;
    exportInfo.addCompComment = dlgMain.cbComment.value;

    exportInfo.artboardsEnab = false; // always use true at start
    exportInfo.inclArtboardName = dlgMain.cbIncludeArtboardName.value;
    exportInfo.artboardShow = dlgMain.cbArtboardShow.value;
	// if (exportInfo.artboardShow) {
	try {
		exportInfo.singleArtboard = dlgMain.pnlUseArtboard.pnlABoptions.ddUseArtboard.selection.index;
	} catch (e) {
		// alert("No artboard selected!" + "\n" + e);
	}
	// }

    exportInfo.fileType = dlgMain.ddFileType.selection.index;
    exportInfo.icc = dlgMain.cbIcc.value;
    exportInfo.convicc = dlgMain.cbConvertICC.value;
    exportInfo.jpegQuality = dlgMain.pnlFileType.pnlOptions.grpJPEGOptions.etQuality.text;
    exportInfo.psdLayers = dlgMain.pnlFileType.pnlOptions.grpPSDOptions.cbPSDlayers.value;
    exportInfo.psdMaxComp = dlgMain.pnlFileType.pnlOptions.grpPSDOptions.cbMax.value;
    exportInfo.png8Transparency = dlgMain.pnlFileType.pnlOptions.grpPNG8Options.png8Trans.value;
    exportInfo.png8Interlaced = dlgMain.pnlFileType.pnlOptions.grpPNG8Options.png8Inter.value;
    exportInfo.png24Transparency = dlgMain.pnlFileType.pnlOptions.grpPNG24Options.png24Trans.value;
    exportInfo.png24Interlaced = dlgMain.pnlFileType.pnlOptions.grpPNG24Options.png24Inter.value;
    exportInfo.tiffTransparency = dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.tiffTrans.value;
    index = dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpCompression.ddCompression.selection.index;
    if (index == compNoneIndex) {
        exportInfo.tiffCompression = TIFFEncoding.NONE;
    }
    if (index == compLZWIndex) {
        exportInfo.tiffCompression = TIFFEncoding.TIFFLZW;
    }
    if (index == compZIPIndex) {
        exportInfo.tiffCompression = TIFFEncoding.TIFFZIP;
    }
    if (index == compJPEGIndex) {
        exportInfo.tiffCompression = TIFFEncoding.JPEG;
    }
    exportInfo.tiffJpegQuality = dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpQuality.etQuality.text;
    if (dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpCompression.rbZip.value) {
        exportInfo.pdfEncoding = PDFEncoding.PDFZIP;
    }
    if (dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpCompression.rbJpeg.value) {
        exportInfo.pdfEncoding = PDFEncoding.JPEG;
    }
    exportInfo.pdfJpegQuality = dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpQuality.etQuality.text;
    if (dlgMain.pnlFileType.pnlOptions.grpTargaOptions.rb16bit.value) {
        exportInfo.targaDepth = TargaBitsPerPixels.SIXTEEN;
    }
    if (dlgMain.pnlFileType.pnlOptions.grpTargaOptions.rb24bit.value) {
        exportInfo.targaDepth = TargaBitsPerPixels.TWENTYFOUR;
    }
    if (dlgMain.pnlFileType.pnlOptions.grpTargaOptions.rb32bit.value) {
        exportInfo.targaDepth = TargaBitsPerPixels.THIRTYTWO;
    }
    if (dlgMain.pnlFileType.pnlOptions.grpBMPOptions.rb16bit.value) {
        exportInfo.bmpDepth = BMPDepthType.SIXTEEN;
    }
    if (dlgMain.pnlFileType.pnlOptions.grpBMPOptions.rb24bit.value) {
        exportInfo.bmpDepth = BMPDepthType.TWENTYFOUR;
    }
    if (dlgMain.pnlFileType.pnlOptions.grpBMPOptions.rb32bit.value) {
        exportInfo.bmpDepth = BMPDepthType.THIRTYTWO;
    }

    return result;
}


///////////////////////////////////////////////////////////////////////////////
// Function: hideAllFileTypePanel
// Usage: hide all the panels in the common actions
// Input: dlgMain is the main dialog for this script
// Return: <none>, all panels are now hidden
///////////////////////////////////////////////////////////////////////////////
function hideAllFileTypePanel(dlgMain) {
    dlgMain.pnlFileType.pnlOptions.grpPSDOptions.hide();
    dlgMain.pnlFileType.pnlOptions.grpJPEGOptions.hide();
    dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.hide();
    dlgMain.pnlFileType.pnlOptions.grpPDFOptions.hide();
    dlgMain.pnlFileType.pnlOptions.grpTargaOptions.hide();
    dlgMain.pnlFileType.pnlOptions.grpBMPOptions.hide();
    dlgMain.pnlFileType.pnlOptions.grpPNG8Options.hide();
    dlgMain.pnlFileType.pnlOptions.grpPNG24Options.hide();
}


///////////////////////////////////////////////////////////////////////////////
// Function: initExportInfo
// Usage: create our default parameters
// Input: a new Object
// Return: a new object with params set to default
///////////////////////////////////////////////////////////////////////////////
function initExportInfo(exportInfo, isSelection, artboardAvail, isOverrideSticky) {
    if (isOverrideSticky) {
        if (isSelection) exportInfo.selectionOnly = true;
        if (!isSelection) exportInfo.selectionOnly = false;
        // }
        if (artboardAvail) exportInfo.artboardsEnab = true;    
        if (!artboardAvail) exportInfo.artboardsEnab = false;
        // }
        // Currently uses stored data
        // try {
        //     exportInfo.destination = Folder(app.activeDocument.fullName.parent).fsName; // destination folder
        //     var tmp = app.activeDocument.fullName.name;
        //     exportInfo.fileNamePrefix = decodeURI(tmp.substring(0, tmp.indexOf("."))); // filename body part
        // } catch (someError) {
        //     exportInfo.destination = new String("");
        //     exportInfo.fileNamePrefix = app.activeDocument.name; // filename body part
        // }
        if (artboardAvail) exportInfo.artboardShow = true;
        if (!artboardAvail) exportInfo.artboardShow = false;
        if (artboardAvail) exportInfo.inclArtboardName = true;
        if (!artboardAvail) exportInfo.inclArtboardName = false;
    } else {
        // Currently uses stored data
        exportInfo.destination = new String("");
        exportInfo.fileNamePrefix = new String("untitled_");
        exportInfo.prefixIndex = false;
        exportInfo.addCompComment = false;
        exportInfo.singleArtboard = 0;
        exportInfo.fileType = psdIndex;
        exportInfo.icc = false;
        exportInfo.convicc = false;
        exportInfo.jpegQuality = 8;
        exportInfo.psdLayers = false;
        exportInfo.psdMaxComp = true;
        exportInfo.tiffTransparency = false;
        exportInfo.tiffCompression = TIFFEncoding.NONE;
        exportInfo.tiffJpegQuality = 8;
        exportInfo.pdfEncoding = PDFEncoding.JPEG;
        exportInfo.pdfJpegQuality = 8;
        exportInfo.targaDepth = TargaBitsPerPixels.TWENTYFOUR;
        exportInfo.bmpDepth = BMPDepthType.TWENTYFOUR;
        exportInfo.png24Transparency = false;
        exportInfo.png24Interlaced = false;
        exportInfo.png8Transparency = false;
        exportInfo.png8Interlaced = false;
    }
}

function logToHeadLights(eventRecord) {
    var headlightsActionID = stringIDToTypeID("headlightsLog");
    var desc = new ActionDescriptor();
    desc.putString(stringIDToTypeID("subcategory"), "Export");
    desc.putString(stringIDToTypeID("eventRecord"), eventRecord);
    executeAction(headlightsActionID, desc, DialogModes.NO);
}



/// ////////////////////////////////////////////////////////////////////////////
// Function: initFileNameDestination
// Usage: read the filename and path from the current document, overriding saved or recorded parameters
// Input: an initialized object
// Return: a modified object
/// ////////////////////////////////////////////////////////////////////////////
function initFileNameDestination (exportInfo) {
  try {
    exportInfo.destination = Folder(app.activeDocument.fullName.parent).fsName // destination folder
    var tmp = app.activeDocument.fullName.name
    var pieces = tmp.split('.')
    exportInfo.fileNamePrefix = decodeURI(pieces.length == 1 ? tmp : pieces.slice(0, pieces.length - 1).join('.')) // filename body part
  } catch (someError) {
    exportInfo.destination = new String('')
    exportInfo.fileNamePrefix = app.activeDocument.name // filename body part
  }
}

///////////////////////////////////////////////////////////////////////////////
// Function: saveFile
// Usage: the worker routine, take our params and save the file accordingly
// Input: reference to the document, the name of the output file, 
//        export info object containing more information
// Return: <none>, a file on disk
///////////////////////////////////////////////////////////////////////////////
function saveFile(docRef, fileNameBody, exportInfo) {
    var isS4W = false,
        fileExtension;
    if (true /* folderExists(exportInfo.destination)*/ ) {
        switch (exportInfo.fileType) {
            case jpegIndex:
                fileExtension = "jpg";
                docRef.bitsPerChannel = BitsPerChannelType.EIGHT;
                var saveFile = new File(exportInfo.destination + "/" + fileNameBody + ".jpg");
                jpgSaveOptions = new JPEGSaveOptions();
                jpgSaveOptions.embedColorProfile = exportInfo.icc;
                jpgSaveOptions.quality = exportInfo.jpegQuality;
                docRef.saveAs(saveFile, jpgSaveOptions, true, Extension.LOWERCASE);
                break;
            case psdIndex:
                fileExtension = "psd";
                var saveFile = new File(exportInfo.destination + "/" + fileNameBody + ".psd");
                psdSaveOptions = new PhotoshopSaveOptions();
                psdSaveOptions.layers = exportInfo.psdLayers;
                psdSaveOptions.embedColorProfile = exportInfo.icc;
                docRef.saveAs(saveFile, psdSaveOptions, true, Extension.LOWERCASE);
                break;
            case tiffIndex:
                fileExtension = "tiff";
                var saveFile = new File(exportInfo.destination + "/" + fileNameBody + ".tif");
                tiffSaveOptions = new TiffSaveOptions();
                TiffSaveOptions.transparency = exportInfo.icc;
                // TiffSaveOptions.layers = exportInfo.icc;
                tiffSaveOptions.embedColorProfile = exportInfo.icc;
                tiffSaveOptions.imageCompression = exportInfo.tiffCompression;
                if (TIFFEncoding.JPEG == exportInfo.tiffCompression) tiffSaveOptions.jpegQuality = exportInfo.tiffJpegQuality;
                docRef.saveAs(saveFile, tiffSaveOptions, true, Extension.LOWERCASE);
                break;
            case pdfIndex:
                fileExtension = "pdf";
                if (docRef.bitsPerChannel == BitsPerChannelType.THIRTYTWO)
                    docRef.bitsPerChannel = BitsPerChannelType.SIXTEEN;
                var saveFile = new File(exportInfo.destination + "/" + fileNameBody + ".pdf");
                pdfSaveOptions = new PDFSaveOptions();
                pdfSaveOptions.embedColorProfile = exportInfo.icc;
                pdfSaveOptions.encoding = exportInfo.pdfEncoding;
                if (PDFEncoding.JPEG == exportInfo.pdfEncoding) pdfSaveOptions.jpegQuality = exportInfo.pdfJpegQuality;
                docRef.saveAs(saveFile, pdfSaveOptions, true, Extension.LOWERCASE);
                break;
            case targaIndex:
                fileExtension = "tga";
                docRef.bitsPerChannel = BitsPerChannelType.EIGHT;
                var saveFile = new File(exportInfo.destination + "/" + fileNameBody + ".tga");
                targaSaveOptions = new TargaSaveOptions();
                targaSaveOptions.resolution = exportInfo.targaDepth;
                docRef.saveAs(saveFile, targaSaveOptions, true, Extension.LOWERCASE);
                break;
            case bmpIndex:
                fileExtension = "bmp";
                docRef.bitsPerChannel = BitsPerChannelType.EIGHT;
                var saveFile = new File(exportInfo.destination + "/" + fileNameBody + ".bmp");
                bmpSaveOptions = new BMPSaveOptions();
                bmpSaveOptions.depth = exportInfo.bmpDepth;
                docRef.saveAs(saveFile, bmpSaveOptions, true, Extension.LOWERCASE);
                break;
            case png8Index:
                fileExtension "png8";
                isS4W = true;
                var id5 = charIDToTypeID("Expr");
                var desc3 = new ActionDescriptor();
                var id6 = charIDToTypeID("Usng");
                var desc4 = new ActionDescriptor();
                var id7 = charIDToTypeID("Op  ");
                var id8 = charIDToTypeID("SWOp");
                var id9 = charIDToTypeID("OpSa");
                desc4.putEnumerated(id7, id8, id9);
                var id10 = charIDToTypeID("Fmt ");
                var id11 = charIDToTypeID("IRFm");
                var id12 = charIDToTypeID("PNG8");
                desc4.putEnumerated(id10, id11, id12);
                var id13 = charIDToTypeID("Intr"); //Interlaced
                desc4.putBoolean(id13, exportInfo.png8Interlaced);
                var id14 = charIDToTypeID("RedA");
                var id15 = charIDToTypeID("IRRd");
                var id16 = charIDToTypeID("Prcp"); //Algorithm
                desc4.putEnumerated(id14, id15, id16);
                var id17 = charIDToTypeID("RChT");
                desc4.putBoolean(id17, false);
                var id18 = charIDToTypeID("RChV");
                desc4.putBoolean(id18, false);
                var id19 = charIDToTypeID("AuRd");
                desc4.putBoolean(id19, false);
                var id20 = charIDToTypeID("NCol"); //NO. Of Colors
                desc4.putInteger(id20, 256);
                var id21 = charIDToTypeID("Dthr"); //Dither
                var id22 = charIDToTypeID("IRDt");
                var id23 = charIDToTypeID("Dfsn"); //Dither type
                desc4.putEnumerated(id21, id22, id23);
                var id24 = charIDToTypeID("DthA");
                desc4.putInteger(id24, 100);
                var id25 = charIDToTypeID("DChS");
                desc4.putInteger(id25, 0);
                var id26 = charIDToTypeID("DCUI");
                desc4.putInteger(id26, 0);
                var id27 = charIDToTypeID("DChT");
                desc4.putBoolean(id27, false);
                var id28 = charIDToTypeID("DChV");
                desc4.putBoolean(id28, false);
                var id29 = charIDToTypeID("WebS");
                desc4.putInteger(id29, 0);
                var id30 = charIDToTypeID("TDth"); //transparency dither
                var id31 = charIDToTypeID("IRDt");
                var id32 = charIDToTypeID("None");
                desc4.putEnumerated(id30, id31, id32);
                var id33 = charIDToTypeID("TDtA");
                desc4.putInteger(id33, 100);
                var id34 = charIDToTypeID("Trns"); //Transparency
                desc4.putBoolean(id34, exportInfo.png8Transparency);
                var id35 = charIDToTypeID("Mtt ");
                desc4.putBoolean(id35, true); //matte
                var id36 = charIDToTypeID("MttR"); //matte color
                desc4.putInteger(id36, 255);
                var id37 = charIDToTypeID("MttG");
                desc4.putInteger(id37, 255);
                var id38 = charIDToTypeID("MttB");
                desc4.putInteger(id38, 255);
                var id39 = charIDToTypeID("SHTM");
                desc4.putBoolean(id39, false);
                var id40 = charIDToTypeID("SImg");
                desc4.putBoolean(id40, true);
                var id41 = charIDToTypeID("SSSO");
                desc4.putBoolean(id41, false);
                var id42 = charIDToTypeID("SSLt");
                var list1 = new ActionList();
                desc4.putList(id42, list1);
                var id43 = charIDToTypeID("DIDr");
                desc4.putBoolean(id43, false);
                var id44 = charIDToTypeID("In  ");
                desc4.putPath(id44, new File(exportInfo.destination + "/" + fileNameBody + ".png"));
                var id45 = stringIDToTypeID("SaveForWeb");
                desc3.putObject(id6, id45, desc4);
                executeAction(id5, desc3, DialogModes.NO);
                break;
            case png24Index:
                fileExtension "png24";
                if (exportInfo.png24Transparency) {
                    fileExtension = "png32"
                }
                isS4W = true;
                var id6 = charIDToTypeID("Expr");
                var desc3 = new ActionDescriptor();
                var id7 = charIDToTypeID("Usng");
                var desc4 = new ActionDescriptor();
                var id8 = charIDToTypeID("Op  ");
                var id9 = charIDToTypeID("SWOp");
                var id10 = charIDToTypeID("OpSa");
                desc4.putEnumerated(id8, id9, id10);
                var id11 = charIDToTypeID("Fmt ");
                var id12 = charIDToTypeID("IRFm");
                var id13 = charIDToTypeID("PN24");
                desc4.putEnumerated(id11, id12, id13);
                var id14 = charIDToTypeID("Intr");
                desc4.putBoolean(id14, exportInfo.png24Interlaced);
                var id15 = charIDToTypeID("Trns");
                desc4.putBoolean(id15, exportInfo.png24Transparency);
                var id16 = charIDToTypeID("Mtt ");
                desc4.putBoolean(id16, true);
                var id17 = charIDToTypeID("MttR");
                desc4.putInteger(id17, 255);
                var id18 = charIDToTypeID("MttG");
                desc4.putInteger(id18, 255);
                var id19 = charIDToTypeID("MttB");
                desc4.putInteger(id19, 255);
                var id20 = charIDToTypeID("SHTM");
                desc4.putBoolean(id20, false);
                var id21 = charIDToTypeID("SImg");
                desc4.putBoolean(id21, true);
                var id22 = charIDToTypeID("SSSO");
                desc4.putBoolean(id22, false);
                var id23 = charIDToTypeID("SSLt");
                var list1 = new ActionList();
                desc4.putList(id23, list1);
                var id24 = charIDToTypeID("DIDr");
                desc4.putBoolean(id24, false);
                var id25 = charIDToTypeID("In  ");
                desc4.putPath(id25, new File(exportInfo.destination + "/" + fileNameBody + ".png"));
                var id26 = stringIDToTypeID("SaveForWeb");
                desc3.putObject(id7, id26, desc4);
                executeAction(id6, desc3, DialogModes.NO);
                break;
            default:
                if (DialogModes.NO != app.playbackDisplayDialogs) {
                    alert(strUnexpectedError);
                }
                break;
        }
    }
    if (isS4W) {
        logToHeadLights("Save for web - Layer Comp Script");
    } else {
        logToHeadLights("Save As - Layer Comp Script");
    }
    logToHeadLights("Layer Comp To File " + fileExtension);
}


///////////////////////////////////////////////////////////////////////////////
// Function: ConvertTosRGBProfile
// Usage: Convert to sRGB profile
// Input: <none> (must be an active document)
// Return: activeDocument is now in sRGB profile
///////////////////////////////////////////////////////////////////////////////
function ConvertTosRGBProfile() {
	app.activeDocument.convertProfile("sRGB IEC61966-2.1", Intent.RELATIVECOLORIMETRIC, true, true);
}


///////////////////////////////////////////////////////////////////////////////
// Function: zeroSuppress
// Usage: return a string padded to digit(s)
// Input: num to convert, digit count needed
// Return: string padded to digit length
///////////////////////////////////////////////////////////////////////////////
function zeroSuppress(num, digit) {
    var tmp = num.toString();
    while (tmp.length < digit) {
        tmp = "0" + tmp;
    }
    return tmp;
}


///////////////////////////////////////////////////////////////////////////////
// Function: objectToDescriptor
// Usage: create an ActionDescriptor from a JavaScript Object
// Input: JavaScript Object (o)
//        object unique string (s)
//        Pre process converter (f)
// Return: ActionDescriptor
// NOTE: Only boolean, string, number and UnitValue are supported, use a pre processor
//       to convert (f) other types to one of these forms.
// REUSE: This routine is used in other scripts. Please update those if you 
//        modify. I am not using include or eval statements as I want these 
//        scripts self contained.
///////////////////////////////////////////////////////////////////////////////
function objectToDescriptor(o, s, f) {
    if (undefined != f) {
        o = f(o);
    }
    var d = new ActionDescriptor;
    var l = o.reflect.properties.length;
    d.putString(app.charIDToTypeID('Msge'), s);
    for (var i = 0; i < l; i++) {
		// Gives properties of items
		// alert(o.reflect.properties[i].toString() + "\n" + typeof(o.reflect.properties[i].toString()+ "\n" + typeof(v)))
		// alert(f)
        var k = o.reflect.properties[i].toString();
        if (k == "__proto__" || k == "__count__" || k == "__class__" || k == "reflect")
            continue;
        var v = o[k];
        k = app.stringIDToTypeID(k);
		// alert(typeof(v))
		// alert(v + "\n" + typeof(v))
        switch (typeof(v)) {
            case "boolean":
                d.putBoolean(k, v);
                break;
            case "string":
                d.putString(k, v);
                break;
            case "number":
                d.putDouble(k, v);
                break;
            case "object":
                alert(k+" "+v)
            //     d.putObject(k, v);
            //     break;    
            default:
                {
                    if (v instanceof UnitValue) {
                        var uc = new Object;
                        uc["px"] = charIDToTypeID("#Rlt"); // unitDistance
                        uc["%"] = charIDToTypeID("#Prc"); // unitPercent
                        d.putUnitDouble(k, uc[v.type], v.value);
                    } else {
						// if (typeof(v) === "object"){
						// 	break; // Dirty fix for OBJECT type > dont know why this is
						// } else {
                        // 	throw (new Error("Unsupported type in objectToDescriptor " + typeof(v)));
						// }
                        throw (new Error("Unsupported type in objectToDescriptor " + typeof(v) + "\n"+v+" - Error exportinfo: "+o.reflect.properties[i].toString()));
                    }
                }
        }
    }
    return d;
}


///////////////////////////////////////////////////////////////////////////////
// Function: descriptorToObject
// Usage: update a JavaScript Object from an ActionDescriptor
// Input: JavaScript Object (o), current object to update (output)
//        Photoshop ActionDescriptor (d), descriptor to pull new params for object from
//        object unique string (s)
//        JavaScript Function (f), post process converter utility to convert
// Return: Nothing, update is applied to passed in JavaScript Object (o)
// NOTE: Only boolean, string, number and UnitValue are supported, use a post processor
//       to convert (f) other types to one of these forms.
// REUSE: This routine is used in other scripts. Please update those if you 
//        modify. I am not using include or eval statements as I want these 
//        scripts self contained.
///////////////////////////////////////////////////////////////////////////////
function descriptorToObject(o, d, s, f) {
    var l = d.count;
    if (l) {
        var keyMessage = app.charIDToTypeID('Msge');
        if (d.hasKey(keyMessage) && (s != d.getString(keyMessage))) return;
    }
    for (var i = 0; i < l; i++) {
        var k = d.getKey(i); // i + 1 ?
        var t = d.getType(k);
        strk = app.typeIDToStringID(k);
        switch (t) {
            case DescValueType.BOOLEANTYPE:
                o[strk] = d.getBoolean(k);
                break;
            case DescValueType.STRINGTYPE:
                o[strk] = d.getString(k);
                break;
            case DescValueType.DOUBLETYPE:
                o[strk] = d.getDouble(k);
                break;
            case DescValueType.UNITDOUBLE:
                {
                    var uc = new Object;
                    uc[charIDToTypeID("#Rlt")] = "px"; // unitDistance
                    uc[charIDToTypeID("#Prc")] = "%"; // unitPercent
                    uc[charIDToTypeID("#Pxl")] = "px"; // unitPixels
                    var ut = d.getUnitDoubleType(k);
                    var uv = d.getUnitDoubleValue(k);
                    o[strk] = new UnitValue(uv, uc[ut]);
                }
                break;
            case DescValueType.INTEGERTYPE:
            case DescValueType.ALIASTYPE:
            case DescValueType.CLASSTYPE:
            case DescValueType.ENUMERATEDTYPE:
            case DescValueType.LISTTYPE:
            case DescValueType.OBJECTTYPE:
            case DescValueType.RAWTYPE:
            case DescValueType.REFERENCETYPE:
            default:
                throw (new Error("Unsupported type in descriptorToObject " + t));
        }
    }
    if (undefined != f) {
        o = f(o);
    }
}


///////////////////////////////////////////////////////////////////////////////
// Function: preProcessExportInfo
// Usage: convert Photoshop enums to strings for storage
// Input: JavaScript Object of my params for this script
// Return: JavaScript Object with objects converted for storage
///////////////////////////////////////////////////////////////////////////////
function preProcessExportInfo(o) {
    o.tiffCompression = o.tiffCompression.toString();
    o.pdfEncoding = o.pdfEncoding.toString();
    o.targaDepth = o.targaDepth.toString();
    o.bmpDepth = o.bmpDepth.toString();
    return o;
}

///////////////////////////////////////////////////////////////////////////////
// Function: postProcessExportInfo
// Usage: convert strings from storage to Photoshop enums
// Input: JavaScript Object of my params in string form
// Return: JavaScript Object with objects in enum form
///////////////////////////////////////////////////////////////////////////////
function postProcessExportInfo(o) {
    o.tiffCompression = eval(o.tiffCompression);
    o.pdfEncoding = eval(o.pdfEncoding);
    o.targaDepth = eval(o.targaDepth);
    o.bmpDepth = eval(o.bmpDepth);
    return o;
}

///////////////////////////////////////////////////////////////////////////
// Function: StrToIntWithDefault
// Usage: convert a string to a number, first stripping all characters
// Input: string and a default number
// Return: a number
///////////////////////////////////////////////////////////////////////////
function StrToIntWithDefault(s, n) {
    var onlyNumbers = /[^0-9]/g;
    var t = s.replace(onlyNumbers, "");
    t = parseInt(t);
    if (!isNaN(t)) {
        n = t;
    }
    return n;
}

///////////////////////////////////////////////////////////////////////////////
// Function: folderExists
// Usage: see if the string passed in is a valid folder ask to create if not
// Input: string of the folder in question
// Return: true if folder exists or was created successfully
///////////////////////////////////////////////////////////////////////////////
function folderExists(folderAsString) {
    var f = Folder(folderAsString);
    if (f.exists) return true;
    if (DialogModes.NO == app.playbackDisplayDialogs) return false;
    if (confirm(strCreateFolder + folderAsString)) {
        if (f.create()) {
            return true;
        } else {
            alert(strCouldNotCreate);
        }
    }
    return false;
}

///////////////////////////////////////////////////////////////////////////////
// Function: NumericEditKeyboardHandler
// Usage: Do not allow anything except for numbers 0-9
// Input: ScriptUI keydown event
// Return: <nothing> key is rejected and beep is sounded if invalid
///////////////////////////////////////////////////////////////////////////////
function NumericEditKeyboardHandler(event) {
    try {
        var keyIsOK = KeyIsNumeric(event) ||
            KeyIsDelete(event) ||
            KeyIsLRArrow(event) ||
            KeyIsTabEnterEscape(event);

        if (!keyIsOK) {
            //    Bad input: tell ScriptUI not to accept the keydown event
            event.preventDefault();
            /*    Notify user of invalid input: make sure NOT
            	to put up an alert dialog or do anything which
            	requires user interaction, because that
            	interferes with preventing the 'default'
            	action for the keydown event */
            app.beep();
        }
    } catch (e) {
        ; // alert ("Ack! bug in NumericEditKeyboardHandler: " + e);
    }
}


//    key identifier functions
function KeyHasModifier(event) {
    return event.shiftKey || event.ctrlKey || event.altKey || event.metaKey;
}

function KeyIsNumeric(event) {
    return (event.keyName >= '0') && (event.keyName <= '9') && !KeyHasModifier(event);
}

function KeyIsDelete(event) {
    //    Shift-delete is ok
    return ((event.keyName == 'Backspace') || (event.keyName == 'Delete')) && !(event.ctrlKey);
}

function KeyIsLRArrow(event) {
    return ((event.keyName == 'Left') || (event.keyName == 'Right')) && !(event.altKey || event.metaKey);
}

function KeyIsTabEnterEscape(event) {
    return event.keyName == 'Tab' || event.keyName == 'Enter' || event.keyName == 'Escape';
}





///////////////////////////////////////////////////////////////////////////////
// Function: getABLayerInfo
// Usage:  use ActionManager to check each layer in document for artboard and extract location and AMID
// Input: nothing. 
// Return: array of artboard object data extracted.
///////////////////////////////////////////////////////////////////////////////
function getABLayerInfo() {
    var abArr = [];
	abArr.visible = [];

    var ref = new ActionReference();
    ref.putEnumerated(charIDToTypeID('Dcmn'), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
    var count = executeActionGet(ref).getInteger(charIDToTypeID('NmbL')) + 1; //  number of total layers in the document including start AND stop of groups.  So layersets get counted twice. 
    var infoList = [];
    try {
        activeDocument.backgroundLayer;
        var i = 0;
    } catch (e) {
        var i = 1;
    };

    for (i; i < count; i++) {
        ref = new ActionReference();
        ref.putIndex(charIDToTypeID('Lyr '), i);
        var desc = executeActionGet(ref);
        // this gets the layer name 
        var layerName = desc.getString(charIDToTypeID('Nm  '));
        if (layerName.match(/^<\/Layer group/)) continue; // removes "/Layer Groups" from the listed output.   (like if ID = "/Layer Group" then skip)         
        var name = layerName
        var id = desc.getInteger(stringIDToTypeID('layerID'));
        var index = desc.getInteger(charIDToTypeID('ItmI'));
        var layerType = typeIDToStringID(desc.getEnumerationValue(stringIDToTypeID('layerSection')));
        var isLayerSet = (layerType == 'layerSectionContent') ? false : true;
        var isVisible = desc.getBoolean(charIDToTypeID('Vsbl'));
        // if (isLayerSet && isVisible) {
        if (isLayerSet && isVisible) {
            var artBoardLay = {};
            artBoardLay.result = false;
            var ab_actDesc = desc.getObjectValue(stringIDToTypeID('artboard'));
            var abrect_desc = ab_actDesc.getObjectValue(stringIDToTypeID('artboardRect'));
            //~     // get bounds of artboard. 
            atop = parseInt(abrect_desc.getUnitDoubleValue(charIDToTypeID('Top ')))
            aleft = parseInt(abrect_desc.getUnitDoubleValue(charIDToTypeID('Left')));
            abottom = parseInt(abrect_desc.getUnitDoubleValue(charIDToTypeID('Btom')));
            aright = parseInt(abrect_desc.getUnitDoubleValue(charIDToTypeID('Rght')));

            // add the 4 values together, and if they are 0  then I know its not an actual artboard. 
            var checVal = (atop + aleft + abottom + aright);
            if (checVal != 0) {
                artBoardLay.result = true;
                artBoardLay.name = name;
                artBoardLay.top = atop;
                artBoardLay.left = aleft;
                artBoardLay.bottom = abottom;
                artBoardLay.right = aright;
                artBoardLay.AMid = id;
                artBoardLay.index = index;
				artBoardLay.visible = isVisible;
				// alert(artBoardLay.name+" "+artBoardLay.visible)
                //alert([name, isLayerSet, atop,aleft,abottom,aright, name, id, index, visible] )
                abArr.push(artBoardLay);
            }
        }
    };
    return abArr;
};

/// ////////////////////////////////////////////////////////////////////////////
// Function: getSelectedLayersAMIdx
// Usage: extract a list of index values of all the selected layers.
// Input:: (active document.) s
// Return: array of indexes ID's of selected layers.
/// ////////////////////////////////////////////////////////////////////////////
function getSelectedLayersAMIdx (srcDoc) {
  var selectedLayers = new Array()
  var ref = new ActionReference()
  // get a number list of selected artLayers in the document
  ref.putProperty(app.charIDToTypeID('Prpr'), stringIDToTypeID('targetLayers'))
  ref.putEnumerated(charIDToTypeID('Dcmn'), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'))
  // what do I want to do this this list? Define an description of an action.
  var desc = executeActionGet(ref)
  // if the selected object has the "Target Layers" key (only works CS4+)
  if (desc.hasKey(stringIDToTypeID('targetLayers'))) {
    desc = desc.getList(stringIDToTypeID('targetLayers'))
    var c = desc.count
    var selectedLayers = [] // for each
    for (var i = 0; i < c; i++) {
      try {
        srcDoc.backgroundLayer // try to select a background layer, if I can then adjust the index counting. (Background layers change index counitng of all layers by 1)
        selectedLayers.push(desc.getReference(i).getIndex())
      } catch (e) {
        selectedLayers.push(desc.getReference(i).getIndex() + 1)
      }
    }
  }
  return selectedLayers
}

/// ////////////////////////////////////////////////////////////////////////////
// Function: getArtBoards
// Usage: verify that supplied layers (identified by AMid) are artboards.
// Input: array of AM idicies.
// Return: Return list of AMid of actual artboards. (removing any layers that are not artboards and artboards that are hidden)
/// ////////////////////////////////////////////////////////////////////////////
function getArtBoards (inArray) {
  var infoList = []

  for (var i = 0; i < inArray.length; i++) {
    var obj = {}
    ref = new ActionReference()
    ref.putIndex(charIDToTypeID('Lyr '), inArray[i])
    var desc = executeActionGet(ref)
    var Id = desc.getInteger(stringIDToTypeID('layerID'))
    var name = desc.getString(charIDToTypeID('Nm  '))
    var isArtboard = desc.getBoolean(stringIDToTypeID('artboardEnabled'))
    var isVisible = desc.getBoolean(charIDToTypeID('Vsbl'))
    if (isArtboard && isVisible) {
      obj.name = name
      obj.AMid = Id
      obj.visible = isVisible
      var ab_actDesc = desc.getObjectValue(stringIDToTypeID('artboard'))
      obj.bgType = ab_actDesc.getInteger(stringIDToTypeID('artboardBackgroundType'))
      var abBgColor_desc = ab_actDesc.getObjectValue(charIDToTypeID('Clr '))
      obj.bgColor = [
        abBgColor_desc.getDouble(charIDToTypeID('Rd  ')),
        abBgColor_desc.getDouble(charIDToTypeID('Grn ')),
        abBgColor_desc.getDouble(charIDToTypeID('Bl  '))
      ]
      obj.empty = isArtboardEmpty(inArray[i])
      infoList.push(obj)
    }
  }
  return infoList
}

/// ////////////////////////////////////////////////////////////////////////////
// Function: isArtboardEmpty
// Usage: Detect whether given artboard is empty.
// Input: index of artboard
// Return: boolean
/// ////////////////////////////////////////////////////////////////////////////
function isArtboardEmpty (index) {
  var ref = new ActionReference()
  ref.putProperty(charIDToTypeID('Prpr'), stringIDToTypeID('layerSection'))
  ref.putIndex(charIDToTypeID('Lyr '), index - 1)
  var desc = executeActionGet(ref)
  var sectionEnum = desc.getEnumerationValue(stringIDToTypeID('layerSection'))
  return stringIDToTypeID('layerSectionEnd') == sectionEnum
}

///////////////////////////////////////////////////////////////////////////////
// Function: getActiveDocRulerOrigin
// Usage:  Used to get the document coordinates of the 0,0 ruler coordinate. 
// Input:  active document.
// Return: the document coordinates of the 0,0 ruler center location.
///////////////////////////////////////////////////////////////////////////////
function getActiveDocRulerOrigin() {
    var ref = new ActionReference();
    ref.putEnumerated(charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    var applicationDesc = executeActionGet(ref);
    var theH = applicationDesc.getInteger(stringIDToTypeID("rulerOriginH")) / 65536;
    var theV = applicationDesc.getInteger(stringIDToTypeID("rulerOriginV")) / 65536;
    return [theH, theV]
}


///////////////////////////////////////////////////////////////////////////////
// Function: countCompsNames
// Usage:  Count the comps' names collecting duplicates
// Input: collection of comps
// Return: object with names as keys and as values, an object with total count and an index (for incrementing during file naming)
///////////////////////////////////////////////////////////////////////////////
function countCompsNames(list) {
    var obj = {};
    for (var i = 0; i < list.length; i++) {
        var name = list[i].name;
        if (name in obj)
            obj[name].total += 1;
        else
            obj[name] = {
                total: 1,
                nameIndex: 1
            };
    }
    return obj;
}

///////////////////////////////////////////////////////////////////////////////

// Function: selectedCompsConfigError

// Usage:  if the selected comps only option is on see if we have any selected

// Input: layer comps in the document, export settings

// Return: true for option on and none selected

///////////////////////////////////////////////////////////////////////////////

function selectedCompsConfigError(docLayerComps, exportInfo) {
    if (exportInfo.selectionOnly) {
        var compsCount = docLayerComps.length;
        for ( compsIndex = 0; compsIndex < compsCount; compsIndex++ ) {
            var compRef = docLayerComps[ compsIndex ];
            if (compRef.selected) {
                return false; // all good, we have work to do
            }
        }
        return true; // none found selected, this is bad, no work to do
    }
    return false; // option off
}

///////////////////////////////////////////////////////////////////////////////
// Function: exportArtboards - Single or All
// Usage: Check what settings user wants
// Input: exportInfo object containing our parameters
// Return: on ok, the dialog info is set to the exportInfo object
///////////////////////////////////////////////////////////////////////////////

function exportArtboards(compsIndex, artbrdIndex, exportInfo, abAr, compRef, nameCountObj) {
    // create duplicate doc and flatten to save memory. and processing time.  I already have all the data i need so don't need the layers anymore. 
    var duppedDocument = app.activeDocument.duplicate();

    switch (exportInfo.fileType) {
        case png24Index:
            if (exportInfo.png24Transparency) {
                //do nothing
                break;
            }
        case png8Index:
            if (exportInfo.png8Transparency) {
                //do nothing
                break;
            }
        case tiffIndex:
            if (exportInfo.tiffTransparency) {
                //do nothing
                break;
            }    
        case psdIndex:
            if (exportInfo.psdLayers) {
                //do nothing
                break;
            }
        default:
            duppedDocument.flatten();
    }

    app.activeDocument = duppedDocument;

    var curRulOrigin = getActiveDocRulerOrigin();
    if (exportInfo.artboardShow) {
	    artbrdIndex -= 1; // Minus 1 to compensentate None in menu
    }

    // get crop region
    if (abAr) {
        var lt = -curRulOrigin[0] + abAr[artbrdIndex].left;
        var tp = -curRulOrigin[1] + abAr[artbrdIndex].top;
        var rt = (abAr[artbrdIndex].right - abAr[artbrdIndex].left) + lt;
        var bt = (abAr[artbrdIndex].bottom - abAr[artbrdIndex].top) + tp;
        var cropRegion = [lt, tp, rt, bt];
        duppedDocument.crop(cropRegion);
    }

	// alert(abAr[artbrdIndex].visible)
    if (duppedDocument.bitsPerChannel == duppedDocument.THIRTYTWO) duppedDocument.bitsPerChannel = duppedDocument.SIXTEEN;

    // Naming method from layercomps to Files + artboardnames
    var fileNameBody = exportInfo.fileNamePrefix;
    // fileNameBody += "_" + zeroSuppress(compsIndex, 4);
    // fileNameBody += "_" + compRef.name;
    fileNameBody = fileNameBody.replace(/[:\/\\*\?\"\<\>\|\\\r\\\n]/g, "_"); // '/\:*?"<>|\r\n' -> '_'

    if (exportInfo.inclArtboardName) {
        if (exportInfo.fileNamePrefix) {
            fileNameBody += '_';
        }
        fileNameBody += abAr[artbrdIndex].name;
    }

    if (exportInfo.prefixIndex) {
		if ((exportInfo.inclArtboardName) || (exportInfo.fileNamePrefix)) {
            fileNameBody += '_';
        }
        fileNameBody += zeroSuppress(compsIndex, 4) + "_";
        fileNameBody += compRef.name;
    } else // not using prefix, but we'll still make sure each file name is unique
    {
		if ((exportInfo.inclArtboardName) || (exportInfo.fileNamePrefix)) {
			fileNameBody += '_';
		}
        fileNameBody += compRef.name;
        var nameEntry = nameCountObj[compRef.name];
        if (nameEntry.total > 1)
            fileNameBody += '_' + nameEntry.nameIndex++;
    }
    if ((null != compRef.comment) && exportInfo.addCompComment) {
        if (compRef.comment.length > 20) compRef.comment = compRef.comment.substring(0, 20);
        fileNameBody += "_" + compRef.comment;
    }
    if (fileNameBody.length > 120) fileNameBody = fileNameBody.substring(0, 120);
    fileNameBody = fileNameBody.replace(/[:\/\\*\?\"\<\>\|\\\r\\\n]/g,""); // '/\:*?"<>|\r\n' -> '_'
    // Convert to sRGB if true
    if ( exportInfo.convicc ) {
        ConvertTosRGBProfile();
    }
    saveFile(duppedDocument, fileNameBody, exportInfo);
    duppedDocument.close(SaveOptions.DONOTSAVECHANGES);
}

// End Layer Comps To Files.jsx