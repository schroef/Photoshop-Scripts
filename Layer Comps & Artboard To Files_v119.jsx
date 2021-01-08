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





////////////////////////////////////////////////////////////
//
//  TODO
//  • Webexport > resize to 72
//  • Foit action? Handy for big or higher res docs
//  • Check convertsRGB, it does this on layered
//  • Speed improvement layer cleaner > went from 122s to 20s for 4 artboards with 25 layers - 06012020
//  X Fix PSD export keep layers doesnt clean artboards. - 06012021
//  X Fix PSD export keep layers doesnt clean artboards. - 17122020 > not properly fixed
//  X Add templates gitgub issues - 17122020
//
////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////
//
//  v1.1.9 - 07012021
//  Added
//  - switch to fullscreen mode, ui doesnt need to update > seems faster
//

//  v1.1.8 - 07012021
//  Fixed
//  - Transparent Export, Layered PSD and artboards > Wasnt working on OSX
//
//  Added
//  - PDF layers
//

//  v1.1.8 - 06012021
//  Fixed
//  - Transparent Export, Layered PSD and artboards > Now single artboards are exported properly
//
//  Changed
//  - Better cleaning of docs for layers and transparent files
//  - When no artboard is selected dialog shows again > prior it would close and script need to be selected again
//  - Speed Improvement > The more layers you had the slower it was > Now its blazing!!!
//  25 layers on 4 artboards
//  20.652 New time
//  122.169 Old time

//  v1.1.7 - 17122020
//  Fixed
//  - Exporting artboards with transparency cleans artboards properly > still had issues single artboards

//  v1.1.6 - 17122020
//  Fixed
//  - #146 1302 No such elelement > app.activeDocument.colorProfileName

//  VERSION
//  v1.1.5 - August 3 2020
//
////////////////////////////////////////////////////////////



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
var strcbSelectionHelp = localize("$$$/JavaScripts/LayerCompsToABFiles/SelectedHelp=Uses selected Layer Lomp only");
var strddUseComp = localize("$$$/JavaScripts/LayerCompsToABFiles/DDuseComp=Select Layer Comp from document");
var strCheckboxAddCompComment = localize("$$$/JavaScripts/LayerCompsToABFiles/AddCompComment=&Include Layer Comp Comment");
var strLabelFileType = localize("$$$/JavaScripts/LayerCompsToABFiles/FileType=File Type:");
var strCheckboxIncludeICCProfile = localize("$$$/JavaScripts/LayerCompsToABFiles/IncludeICC=&Include ICC Profile");
var strJPEGOptions = localize("$$$/JavaScripts/LayerCompsToABFiles/JPEGOptions=JPEG Options:");
var strLabelQuality = localize("$$$/JavaScripts/LayerCompsToABFiles/Quality=Quality:");
var strPSDOptions = localize("$$$/JavaScripts/LayerCompsToABFiles/PSDOptions=PSD Options:");
var strPSDlayers = localize("$$$/JavaScripts/LayerCompsToABFiles/PSDlayers=Save Layers");
var strCheckboxMaximizeCompatibility = localize("$$$/JavaScripts/LayerCompsToABFiles/Maximize=&Maximize Compatibility");
var strTIFFOptions = localize("$$$/JavaScripts/LayerCompsToABFiles/TIFFOptions=TIFF Options:");
var strTIFFlayers = localize("$$$/JavaScripts/LayerCompsToABFiles/TIFFlayers=Save Layers");
var strCheckboxTIFFTransparency = localize("$$$/JavaScripts/ExportLayersToFiles/Transparency=Transparency");
var strLabelImageCompression = localize("$$$/JavaScripts/LayerCompsToABFiles/ImageCompression=Image Compression:");
var strNone = localize("$$$/JavaScripts/LayerCompsToABFiles/None=None");
var strPDFOptions = localize("$$$/JavaScripts/LayerCompsToABFiles/PDFOptions=PDF Options:");
var strPDFlayers = localize("$$$/JavaScripts/LayerCompsToABFiles/PDFlayers=Save Layers");
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
var strConvertICC = localize("$$$/JavaScripts/ImageProcessor/Convert=Convert to sRGB");
var strConvertICCHelp = localize("$$$/JavaScripts/ImageProcessor/ConvertHelp=Convert the ICC profile to sRGB before saving");
var strCheckboxTrimLayers = localize("$$$/JavaScripts/CompsToFiles/Trim=Trim Layers");
var strCheckboxTrimLayersHelp = localize("$$$/JavaScripts/ImageProcessor/TrimLayersHelp=Trims transparent pixels");

var strAlertNoArtboardsFound = localize("$$$/JavaScripts/LayerCompsToABFiles/Noartbrd=No artboards found in document.");
var strIncludeArtboardName = localize("$$$/JavaScripts/LayerCompsToABFiles/IncludeArtboardName=Include Artboard Name")
var strShowUseArtboard = localize("$$$/JavaScripts/ArtboardsToFiles/ShowUseArtboard=Single Artboard")
var strddUseArtBoard = localize("$$$/locale_specific/JavaScripts/LayerCompsToABFiles/DDUseArtboard=100");
var strLabelUseArtboard = localize("$$$/JavaScripts/LayerCompsToABFiles/UseArtboard=Choose Artboard");
var strArtboardPanelOptions = localize("$$$/JavaScripts/ArtboardsToFiles/Options=Options:")

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


// */
///////////////////////////////////////////////////////////////////////////////
// Dispatch
///////////////////////////////////////////////////////////////////////////////


app.activeDocument.suspendHistory("Script > Layercomps & Artboards to Files", 'main()');




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
        return "cancel"; // quit, returning "cancel" (dont localize) makes the actions palette not record our script
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
    for (compsIndex = 0; compsIndex < compsCount; compsIndex++) {
        var compRef = docLayerComps[compsIndex];
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
        // it"s ok if we don"t have any options, continue with defaults
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
    //             return "cancel"; // quit, returning "cancel" (dont localize) makes the actions palette not record our script
    //         }
    //     }
    // }

    // initExportInfo without "exportInfo" remembers last settings
    // alert(artboardAvail)
    initExportInfo(exportInfo, isSelection, artboardAvail, true);
    if (DialogModes.ALL == app.playbackDisplayDialogs) {
        if (cancelButtonID == settingDialog(exportInfo)) {
            return "cancel"; // quit, returning "cancel" (dont localize) makes the actions palette not record our script
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
            return "cancel"; // quit, returning "cancel" (dont localize) makes the actions palette not record our script
        } else if (selectedCompsConfigError(app.activeDocument.layerComps, exportInfo)) {
            if (DialogModes.NO != app.playbackDisplayDialogs) {
                alert(strAlertNoLayerCompsSelected);
            }
            return "cancel"; // quit, returning "cancel" (dont localize) makes the actions palette not record our script	
        } else {

            // var totalTime = new Timer(); // Timer Tom Ruark // Source: Getter.jsx
            
            app.activeDocument = app.documents[docName];
            docRef = app.activeDocument;

            var rememberMaximize;
            var needMaximize = exportInfo.psdMaxComp ? QueryStateType.ALWAYS : QueryStateType.NEVER;
            if (exportInfo.fileType == psdIndex && app.preferences.maximizeCompatibility != needMaximize) {
                rememberMaximize = app.preferences.maximizeCompatibility;
                app.preferences.maximizeCompatibility = needMaximize;
            }

            if (exportInfo.artboardShow && (exportInfo.singleArtboard == "0")) {
                alert("No artboard selected!" + "\n" + "Select one from the dropdown menu");
                main()// return "cancel"; // quit, returning "cancel" (dont localize) makes the actions palette not record our script
            }
            // alert((exportInfo.selectionOnly && !compRef.selected)+" selected only")
            // if ((!exportInfo.useLayerComp == "0") && (!exportInfo.useLayerComp == "1")) {
            // alert(exportInfo.useLayerComp.value)
            // alert(exportInfo.useLayerComp)
            app.runMenuItem(stringIDToTypeID('screenModeFullScreen'));
            if ((exportInfo.useLayerComp == "0") || (exportInfo.useLayerComp == "1")) {
                var nameCountObj = countCompsNames(docRef.layerComps);
                for (compsIndex = 0; compsIndex < compsCount; compsIndex++) {
                    var compRef = docRef.layerComps[compsIndex];
                    if (exportInfo.selectionOnly && !compRef.selected) continue; // selected only
                    compRef.apply();
                    exportComps(compsIndex, exportInfo, compRef, nameCountObj)
                }
            } else {
                compsIndex = exportInfo.useLayerComp;
                var nameCountObj = countCompsNames(docRef.layerComps);
                if (exportInfo.useLayerComp == "1") {
                    var compRef = docRef.layerComps[exportInfo.useLayerComp + 2];
                } else {
                    var compRef = docRef.layerComps[exportInfo.useLayerComp - 2];
                }
                compRef.apply();
                exportComps(compsIndex, exportInfo, compRef, nameCountObj)
            }

            var d = objectToDescriptor(exportInfo, strMessage, preProcessExportInfo);
            app.putCustomOptions("d69fc733-75b4-4d5c-ae8a-c6d6f9a8aa32", d);

            var dd = objectToDescriptor(exportInfo, strMessage, preProcessExportInfo);
            app.playbackParameters = dd;

            if (rememberMaximize != undefined) {
                app.preferences.maximizeCompatibility = rememberMaximize;
            }

            if (DialogModes.ALL == app.playbackDisplayDialogs) {
                alert(strTitle + strAlertWasSuccessful + "\n" + exportInfo.destination);
            }

            app.playbackDisplayDialogs = DialogModes.ALL;

        }
    } catch (e) {
        if (DialogModes.NO != app.playbackDisplayDialogs) {
            alert(e);
        }
        return "cancel"; // quit, returning "cancel" (dont localize) makes the actions palette not record our script
    }
    app.runMenuItem(stringIDToTypeID('screenModeStandard'));
    // alert("Script Time: " + totalTime.getElapsed())
}


///////////////////////////////////////////////////////////////////////////////
// Function: settingDialog
// Usage: pop the ui and get user settings
// Input: exportInfo object containing our parameters
// Return: on ok, the dialog info is set to the exportInfo object
///////////////////////////////////////////////////////////////////////////////
function settingDialog(exportInfo) {
    var docName = app.activeDocument.name;
    app.activeDocument = app.documents[docName];
    docRef = app.activeDocument;

    var dlgMain = new Window("dialog", strTitle);

    // match our dialog background color to the host application
    var brush = dlgMain.graphics.newBrush(dlgMain.graphics.BrushType.THEME_COLOR, "appDialogBackground");
    dlgMain.graphics.backgroundColor = brush;
    dlgMain.graphics.disabledBackgroundColor = brush;

    dlgMain.orientation = "column";
    dlgMain.alignChildren = "left";

    // -- top of the dialog, first line
    dlgMain.add("statictext", undefined, strLabelDestination);

    // -- two groups, one for left and one for right ok, cancel
    dlgMain.grpTop = dlgMain.add("group");
    dlgMain.grpTop.orientation = "row";
    dlgMain.grpTop.alignChildren = "top";
    dlgMain.grpTop.alignment = "fill";

    // -- group top left 
    dlgMain.grpTopLeft = dlgMain.grpTop.add("group");
    dlgMain.grpTopLeft.orientation = "column";
    dlgMain.grpTopLeft.alignChildren = "left";
    dlgMain.grpTopLeft.alignment = "fill";

    // -- the second line in the dialog
    dlgMain.grpSecondLine = dlgMain.grpTopLeft.add("group");
    dlgMain.grpSecondLine.orientation = "row";
    dlgMain.grpSecondLine.alignChildren = "center";

    dlgMain.etDestination = dlgMain.grpSecondLine.add("edittext", undefined, exportInfo.destination.toString());
    dlgMain.etDestination.preferredSize = [350, 20];
    // dlgMain.etDestination.preferredSize.width = StrToIntWithDefault(stretDestination, 250);

    dlgMain.btnBrowse = dlgMain.grpSecondLine.add("button", undefined, strButtonBrowse);
    dlgMain.btnBrowse.preferredSize = [50, 25];
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
    // dlgMain.etFileNamePrefix.alignment = "fill";
    // dlgMain.etFileNamePrefix.preferredSize.width = StrToIntWithDefault( stretDestination, 160 );
    dlgMain.grFileNamePrefixGr = dlgMain.grpTopLeft.add("group");
    dlgMain.grFileNamePrefixGr.orientation = "row";
    dlgMain.grFileNamePrefixGr.spacing = 5;
    dlgMain.grFileNamePrefixGr.margins = 5;
    dlgMain.etFileNamePrefix = dlgMain.grFileNamePrefixGr.add("edittext", undefined, exportInfo.fileNamePrefix.toString());
    dlgMain.etFileNamePrefix.preferredSize = [350, 20];
    dlgMain.cbFileNamePrefixIndex = dlgMain.grFileNamePrefixGr.add("checkbox", undefined, "Index");
    dlgMain.cbFileNamePrefixIndex.alignment = "right";
    dlgMain.cbFileNamePrefixIndex.value = exportInfo.prefixIndex;

    // -- the fifth line in the dialog
    dlgMain.grLayComps = dlgMain.grpTopLeft.add("group");
    dlgMain.grLayComps.orientation = "row";

    dlgMain.cbSelection = dlgMain.grLayComps.add("checkbox", undefined, strCheckboxSelectionOnly);
    dlgMain.cbSelection.value = exportInfo.selectionOnly;
    dlgMain.cbSelection.enabled = exportInfo.selectionOnly;
    // if (!dlgMain.ddUseComp.items["0"]) dlgMain.cbSelection.enabled = true
    dlgMain.cbSelection.helpTip = strcbSelectionHelp;

    // dlgMain.pnlUseArtboard.pnlABoptions.add("statictext", undefined, strLabelUseArtboard);
    dlgMain.ddUseComp = dlgMain.grLayComps.add("dropdownlist");
    dlgMain.ddUseComp.preferredSize.width = StrToIntWithDefault(strddUseArtBoard, 120);
    dlgMain.ddUseComp.alignment = "right";
    dlgMain.ddUseComp.helpTip = strddUseComp;

    // var UseComp = countCompsNames(docRef.layerComps);
    var UseCompCount = docRef.layerComps.length;
    dlgMain.ddUseComp.add("item", "All");
    dlgMain.ddUseComp.add("item", "Selected");
    for (UseCompIndex = 0; UseCompIndex < UseCompCount; UseCompIndex++) {
        dlgMain.ddUseComp.add("item", docRef.layerComps[UseCompIndex].name);
    }

    // Set menu too default
    if (!exportInfo.selectionOnly) dlgMain.ddUseComp.items["0"].selected = true;
    if (exportInfo.selectionOnly) dlgMain.ddUseComp.items["1"].selected = true;

    dlgMain.ddUseComp.onChange = function() {
        if ((dlgMain.cbSelection.value) && (dlgMain.ddUseComp.items["0"].selected)) {
            dlgMain.cbSelection.value = false;
        }
        if ((!dlgMain.cbSelection.value) && (dlgMain.ddUseComp.items["1"].selected)) {
            dlgMain.cbSelection.value = true;
        } else {
            dlgMain.cbSelection.value = false;
        }
    }

    dlgMain.cbComment = dlgMain.grpTopLeft.add("checkbox", undefined, strCheckboxAddCompComment);
    dlgMain.cbComment.value = exportInfo.addCompComment;

    // - Added ArtBoard names optional
    dlgMain.cbIncludeArtboardName = dlgMain.grpTopLeft.add("checkbox", undefined, strIncludeArtboardName);
    dlgMain.cbIncludeArtboardName.value = exportInfo.inclArtboardName;
    dlgMain.cbIncludeArtboardName.enabled = exportInfo.artboardsEnab;

    // - Picker custom Artboard
    // -- now a dropdown list
    // enable checkbox functionality
    dlgMain.cbArtboardShow = dlgMain.grpTopLeft.add("checkbox", undefined, strShowUseArtboard);
    dlgMain.cbArtboardShow.value = exportInfo.artboardShow;
    dlgMain.cbArtboardShow.enabled = exportInfo.artboardsEnab;

    dlgMain.pnlUseArtboard = dlgMain.grpTopLeft.add("group");
    dlgMain.pnlUseArtboard.alignment = "left";

    // dlgMain.pnlUseArtboard.pnlABoptions = dlgMain.grpTopLeft.add("panel", undefined, strLabelUseArtboard);
    dlgMain.pnlUseArtboard.pnlABoptions = dlgMain.grpTopLeft.add("group");
    // dlgMain.pnlUseArtboard.pnlABoptions.spacing = 1;
    // dlgMain.pnlUseArtboard.pnlABoptions.margins = 1;
    dlgMain.pnlUseArtboard.pnlABoptions.alignment = "left";


    dlgMain.pnlUseArtboard.pnlABoptions.add("statictext", undefined, strLabelUseArtboard);
    dlgMain.pnlUseArtboard.pnlABoptions.ddUseArtboard = dlgMain.pnlUseArtboard.pnlABoptions.add("dropdownlist");
    dlgMain.pnlUseArtboard.pnlABoptions.ddUseArtboard.preferredSize.width = StrToIntWithDefault(strddUseArtBoard, 120);
    dlgMain.pnlUseArtboard.pnlABoptions.ddUseArtboard.alignment = "left";
    var UseabAr = getABLayerInfo().reverse();
    var UseartbrdCount = UseabAr.length;
    // UseartbrdCount += 1; //add 1 to compensentate None in menu
    dlgMain.pnlUseArtboard.pnlABoptions.ddUseArtboard.add("item", "None");
    for (UseartbrdIndex = 0; UseartbrdIndex < UseartbrdCount; UseartbrdIndex++) {
        dlgMain.pnlUseArtboard.pnlABoptions.ddUseArtboard.add("item", UseabAr[UseartbrdIndex].name);
    }
    // -- now the options panel that changes
    //   dlgMain.pnlUseArtboard.pnlABoptions = dlgMain.pnlUseArtboard.add("panel", undefined, strArtboardPanelOptions)
    //   dlgMain.pnlUseArtboard.pnlABoptions.alignment = "fill"

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
    // dlgMain.pnlFileType.alignment = "fill";
    dlgMain.pnlFileType.alignChildren = ["top", "left"];

    // -- now a dropdown list
    dlgMain.ddFileType = dlgMain.pnlFileType.add("dropdownlist");
    dlgMain.ddFileType.preferredSize.width = StrToIntWithDefault(strddFileType, 100);
    dlgMain.ddFileType.alignment = "left";

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
    var grICCGr = dlgMain.pnlFileType.add("group");
        grICCGr.orientation = "row";
        grICCGr.alignChildren = ["left", "top"];
    // dlgMain.grICCGr.orientation = "column";
    // dlgMain.grICCGr.alignment = "left";
        grICCGr.spacing = 10;
        grICCGr.margins = 5;


    var grICC = grICCGr.add("group");
        grICC.orientation = "column";
        grICC.alignChildren = ["left", "top"];

    var cbIcc = grICC.add("checkbox", undefined, strCheckboxIncludeICCProfile);
        cbIcc.value = exportInfo.icc;
        strICCprofile = grICC.add("statictext", undefined);
        try {
            strICCprofile.text = app.activeDocument.colorProfileName;
        }
        catch(e){
        //   alert(e)
            alert("Missing document Color Profile! \nScript will continou but export can look different");
        }
    // dlgMain.cbIcc.alignment = "left";

    var cbConvertICC = grICCGr.add("checkbox", undefined, strConvertICC);
    	cbConvertICC.value = exportInfo.convicc;
    // 	cbConvertICC.alignment = "right";
    	cbConvertICC.helpTip = strConvertICCHelp;

    var cbTrimLayers = grICCGr.add("checkbox", undefined, strCheckboxTrimLayers);
    	cbTrimLayers.value = exportInfo.convicc;
    // 	cbTrimLayers.alignment = "right";
    	cbTrimLayers.helpTip = strCheckboxTrimLayersHelp;


    // -- now the options panel that changes
    dlgMain.pnlFileType.pnlOptions = dlgMain.pnlFileType.add("panel", undefined, "Options");
    dlgMain.pnlFileType.pnlOptions.alignment = "fill";
    dlgMain.pnlFileType.pnlOptions.orientation = "stack";
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
    dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.orientation = "column";
    dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.visible = (exportInfo.fileType == tiffIndex);

    dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.rowtiff = dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.add("group");
    dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.rowtiff.orientation = "row";

    dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.cbTIFFlayers = dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.rowtiff.add("checkbox", undefined, strTIFFlayers.toString());
    dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.cbTIFFlayers.value = exportInfo.tiffLayers;
    dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.tiffTrans = dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.rowtiff.add("checkbox", undefined, strCheckboxTIFFTransparency.toString());
    dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.tiffTrans.value = exportInfo.tiffTransparency;

    dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpCompression = dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.add("group");
    dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpCompression.alignment = "left";
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
    dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpQuality.alignment = "left";
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
    dlgMain.pnlFileType.pnlOptions.grpPDFOptions.orientation = "column";
    dlgMain.pnlFileType.pnlOptions.grpPDFOptions.visible = (exportInfo.fileType == pdfIndex);

    dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpCompression = dlgMain.pnlFileType.pnlOptions.grpPDFOptions.add("group");
    dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpCompression.alignment = "left";
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
    dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpQuality.alignment = "left";

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

    dlgMain.pnlFileType.pnlOptions.grpPDFOptions.cbPDFlayers = dlgMain.pnlFileType.pnlOptions.grpPDFOptions.add("checkbox", undefined, strPDFlayers.toString());
    dlgMain.pnlFileType.pnlOptions.grpPDFOptions.cbPDFlayers.value = exportInfo.pdfLayers;


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
    dlgMain.grpTopRight.orientation = "column";
    dlgMain.grpTopRight.alignChildren = "fill";

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
    dlgMain.grpBottom.orientation = "column";
    dlgMain.grpBottom.alignChildren = "left";
    dlgMain.grpBottom.alignment = "fill";

    dlgMain.pnlHelp = dlgMain.grpBottom.add("panel");
    dlgMain.pnlHelp.alignment = "fill";

    dlgMain.etHelp = dlgMain.pnlHelp.add("statictext", undefined, strHelpText, {
        multiline: true
    });
    dlgMain.etHelp.alignment = "fill";

    // do not allow anything except for numbers 0-9
    //dlgMain.pnlFileType.pnlOptions.grpPDFOptions.grpQuality.etQuality.addEventListener ("keydown", NumericEditKeyboardHandler);

    // do not allow anything except for numbers 0-9
    //dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.grpQuality.etQuality.addEventListener ("keydown", NumericEditKeyboardHandler);

    // do not allow anything except for numbers 0-9
    //dlgMain.pnlFileType.pnlOptions.grpJPEGOptions.etQuality.addEventListener ("keydown", NumericEditKeyboardHandler);

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
        exportInfo.useLayerComp = dlgMain.ddUseComp.selection.index;
        exportInfo.singleArtboard = dlgMain.pnlUseArtboard.pnlABoptions.ddUseArtboard.selection.index;
    } catch (e) {
        // alert("No artboard selected!" + "\n" + e);
    }
    // }

    exportInfo.fileType = dlgMain.ddFileType.selection.index;
    exportInfo.icc = cbIcc.value;
    exportInfo.convicc = cbConvertICC.value;
    exportInfo.trimLayers = cbTrimLayers.value;
    exportInfo.pdfLayers = dlgMain.pnlFileType.pnlOptions.grpPDFOptions.cbPDFlayers.value;
    exportInfo.jpegQuality = dlgMain.pnlFileType.pnlOptions.grpJPEGOptions.etQuality.text;
    exportInfo.psdLayers = dlgMain.pnlFileType.pnlOptions.grpPSDOptions.cbPSDlayers.value;
    exportInfo.psdMaxComp = dlgMain.pnlFileType.pnlOptions.grpPSDOptions.cbMax.value;
    exportInfo.png8Transparency = dlgMain.pnlFileType.pnlOptions.grpPNG8Options.png8Trans.value;
    exportInfo.png8Interlaced = dlgMain.pnlFileType.pnlOptions.grpPNG8Options.png8Inter.value;
    exportInfo.png24Transparency = dlgMain.pnlFileType.pnlOptions.grpPNG24Options.png24Trans.value;
    exportInfo.png24Interlaced = dlgMain.pnlFileType.pnlOptions.grpPNG24Options.png24Inter.value;
    exportInfo.tiffTransparency = dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.tiffTrans.value;
    exportInfo.tiffLayers = dlgMain.pnlFileType.pnlOptions.grpTIFFOptions.cbTIFFlayers.value;
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



// Object: Timer
// Usage: Time how long things take or delay script execution
// Input: <none>
// Return: Timer object
// Example:
//
//   var a = new Timer();
//   for (var i = 0; i < 2; i++)
//      a.pause(3.33333);
//   a.getElapsed();
//  jeff tranberry
///////////////////////////////////////////////////////////////////////////////
function Timer() {
   // member properties
   this.startTime = new Date();
   this.endTime = new Date();
   
   // member methods
   
   // reset the start time to now
   this.start = function () { this.startTime = new Date(); }
   
   // reset the end time to now
   this.stop = function () { this.endTime = new Date(); }
   
   // get the difference in milliseconds between start and stop
   this.getTime = function () { return (this.endTime.getTime() - this.startTime.getTime()) / 1000; }
   
   // get the current elapsed time from start to now, this sets the endTime
   this.getElapsed = function () { this.endTime = new Date(); return this.getTime(); }
   
   // pause for this many seconds
   this.pause = function ( inSeconds ) {
      var t = 0;
      var s = new Date();
      while( t < inSeconds ) {
         t = (new Date().getTime() - s.getTime()) / 1000;
      }
   }
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
        //Currently uses stored data
        exportInfo.destination = new String("");
        exportInfo.fileNamePrefix = new String("untitled_");
        exportInfo.prefixIndex = false;

        exportInfo.useLayerComp = 0;
        exportInfo.addCompComment = false;
        exportInfo.singleArtboard = 0;
        exportInfo.fileType = psdIndex;
        exportInfo.icc = false;
        exportInfo.convicc = false;
        exportInfo.trimLayers = false;
        exportInfo.jpegQuality = 8;
        exportInfo.psdLayers = false;
        exportInfo.psdMaxComp = true;
        exportInfo.tiffTransparency = false;
        exportInfo.tiffLayers = false;
        exportInfo.tiffCompression = TIFFEncoding.NONE;
        exportInfo.tiffJpegQuality = 8;
        exportInfo.pdfEncoding = PDFEncoding.JPEG;
        exportInfo.pdfJpegQuality = 8;
        exportInfo.pdfLayers = false;
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
function initFileNameDestination(exportInfo) {
    try {
        exportInfo.destination = Folder(app.activeDocument.fullName.parent).fsName // destination folder
        var tmp = app.activeDocument.fullName.name
        var pieces = tmp.split(".")
        exportInfo.fileNamePrefix = decodeURI(pieces.length == 1 ? tmp : pieces.slice(0, pieces.length - 1).join(".")) // filename body part
    } catch (someError) {
        exportInfo.destination = new String("")
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
                TiffSaveOptions.layers = exportInfo.tiffLayers;
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
                pdfSaveOptions.layers = exportInfo.pdfLayers;
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
                // embed icc
                var idEICC = charIDToTypeID( "EICC" ); 
                desc4.putBoolean( idEICC, exportInfo.icc );
                // Convert to sRGB
                var idSWch = charIDToTypeID( "SWch" );
                var idSTch = charIDToTypeID( "STch" );
                if (exportInfo.convicc) {
                    var doConvert = charIDToTypeID( "CHsR" );
                } else {
                    var doConvert = charIDToTypeID( "CHDc" );
                }
                desc4.putEnumerated( idSWch, idSTch, doConvert );
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
                // embed icc
                var idEICC = charIDToTypeID( "EICC" ); 
                desc4.putBoolean( idEICC, exportInfo.icc );
                // Convert to sRGB
                var idSWch = charIDToTypeID( "SWch" );
                var idSTch = charIDToTypeID( "STch" );
                if (exportInfo.convicc) {
                    var doConvert = charIDToTypeID( "CHsR" );
                } else {
                    var doConvert = charIDToTypeID( "CHDc" );
                }
                desc4.putEnumerated( idSWch, idSTch, doConvert );
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
                
                // docRef.bitsPerChannel = BitsPerChannelType.EIGHT;
                // Doesnt store anythign concerning colorprofiles
                // BUG with PS when profile is sRGB, yiou cant embed it???
                // var saveFile = new File(exportInfo.destination + "/" + fileNameBody + ".png");
                // pngSaveOptions = new PNGSaveOptions();
                // // pngSaveOptions.format = SaveDocumentType.PNG; //-24 //JPEG, COMPUSERVEGIF, PNG-8, BMP 
                // pngSaveOptions.embedColorProfile = exportInfo.icc;
                // pngSaveOptions.interlaced = exportInfo.png24Interlaced; 
                // // pngSaveOptions.quality = exportInfo.jpegQuality;
                // docRef.saveAs(saveFile, pngSaveOptions, true, Extension.LOWERCASE);

                // https://stackoverflow.com/questions/5664750/photoshop-script-exportdocument
                // Always adds sRGB automatically > why???
                // docExportOptions = new ExportOptionsSaveForWeb; 
                // docExportOptions.format = SaveDocumentType.PNG; //-24 //JPEG, COMPUSERVEGIF, PNG-8, BMP 
                // docExportOptions.transparency = exportInfo.png24Transparency; 
                // docExportOptions.blur = 0.0; 
                // docExportOptions.includeProfile = exportInfo.icc; 
                // docExportOptions.interlaced = exportInfo.png24Interlaced; 
                // docExportOptions.optimized = true ;
                // docExportOptions.quality = 100;
                // docExportOptions.PNG8 = false;
                // var saveFile = new File(exportInfo.destination + "/" + fileNameBody + ".png");
                // docRef.exportDocument(saveFile,ExportType.SAVEFORWEB,docExportOptions) 
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
    d.putString(app.charIDToTypeID("Msge"), s);
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
                alert(k + " " + v)
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
                        throw (new Error("Unsupported type in objectToDescriptor " + typeof(v) + "\n" + v + " - Error exportinfo: " + o.reflect.properties[i].toString()));
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
        var keyMessage = app.charIDToTypeID("Msge");
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
            	interferes with preventing the "default"
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
    return (event.keyName >= "0") && (event.keyName <= "9") && !KeyHasModifier(event);
}

function KeyIsDelete(event) {
    //    Shift-delete is ok
    return ((event.keyName == "Backspace") || (event.keyName == "Delete")) && !(event.ctrlKey);
}

function KeyIsLRArrow(event) {
    return ((event.keyName == "Left") || (event.keyName == "Right")) && !(event.altKey || event.metaKey);
}

function KeyIsTabEnterEscape(event) {
    return event.keyName == "Tab" || event.keyName == "Enter" || event.keyName == "Escape";
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
    ref.putEnumerated(charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    var count = executeActionGet(ref).getInteger(charIDToTypeID("NmbL")) + 1; //  number of total layers in the document including start AND stop of groups.  So layersets get counted twice. 
    var infoList = [];
    try {
        activeDocument.backgroundLayer;
        var i = 0;
    } catch (e) {
        var i = 1;
    };

    for (i; i < count; i++) {
        ref = new ActionReference();
        ref.putIndex(charIDToTypeID("Lyr "), i);
        var desc = executeActionGet(ref);
        // this gets the layer name 
        var layerName = desc.getString(charIDToTypeID("Nm  "));
        if (layerName.match(/^<\/Layer group/)) continue; // removes "/Layer Groups" from the listed output.   (like if ID = "/Layer Group" then skip)         
        var name = layerName
        var id = desc.getInteger(stringIDToTypeID("layerID"));
        var index = desc.getInteger(charIDToTypeID("ItmI"));
        var layerType = typeIDToStringID(desc.getEnumerationValue(stringIDToTypeID("layerSection")));
        var isLayerSet = (layerType == "layerSectionContent") ? false : true;
        var isVisible = desc.getBoolean(charIDToTypeID("Vsbl"));
        // if (isLayerSet && isVisible) {
        if (isLayerSet && isVisible) {
            var artBoardLay = {};
            artBoardLay.result = false;
            var ab_actDesc = desc.getObjectValue(stringIDToTypeID("artboard"));
            var abrect_desc = ab_actDesc.getObjectValue(stringIDToTypeID("artboardRect"));
            //~     // get bounds of artboard. 
            atop = parseInt(abrect_desc.getUnitDoubleValue(charIDToTypeID("Top ")))
            aleft = parseInt(abrect_desc.getUnitDoubleValue(charIDToTypeID("Left")));
            abottom = parseInt(abrect_desc.getUnitDoubleValue(charIDToTypeID("Btom")));
            aright = parseInt(abrect_desc.getUnitDoubleValue(charIDToTypeID("Rght")));

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
// Return: array of indexes ID"s of selected layers.
/// ////////////////////////////////////////////////////////////////////////////
function getSelectedLayersAMIdx(docRef) {
    var selectedLayers = new Array()
    var ref = new ActionReference()
    // get a number list of selected artLayers in the document
    ref.putProperty(app.charIDToTypeID("Prpr"), stringIDToTypeID("targetLayers"))
    ref.putEnumerated(charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"))
    // what do I want to do this this list? Define an description of an action.
    var desc = executeActionGet(ref)
    // if the selected object has the "Target Layers" key (only works CS4+)
    if (desc.hasKey(stringIDToTypeID("targetLayers"))) {
        desc = desc.getList(stringIDToTypeID("targetLayers"))
        var c = desc.count
        var selectedLayers = [] // for each
        for (var i = 0; i < c; i++) {
            try {
                docRef.backgroundLayer // try to select a background layer, if I can then adjust the index counting. (Background layers change index counitng of all layers by 1)
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
function getArtBoards(inArray) {
    var infoList = []

    for (var i = 0; i < inArray.length; i++) {
        var obj = {}
        ref = new ActionReference()
        ref.putIndex(charIDToTypeID("Lyr "), inArray[i])
        var desc = executeActionGet(ref)
        var Id = desc.getInteger(stringIDToTypeID("layerID"))
        var name = desc.getString(charIDToTypeID("Nm  "))
        var isArtboard = desc.getBoolean(stringIDToTypeID("artboardEnabled"))
        var isVisible = desc.getBoolean(charIDToTypeID("Vsbl"))
        if (isArtboard && isVisible) {
            obj.name = name
            obj.AMid = Id
            obj.visible = isVisible
            var ab_actDesc = desc.getObjectValue(stringIDToTypeID("artboard"))
            obj.bgType = ab_actDesc.getInteger(stringIDToTypeID("artboardBackgroundType"))
            var abBgColor_desc = ab_actDesc.getObjectValue(charIDToTypeID("Clr "))
            obj.bgColor = [
                abBgColor_desc.getDouble(charIDToTypeID("Rd  ")),
                abBgColor_desc.getDouble(charIDToTypeID("Grn ")),
                abBgColor_desc.getDouble(charIDToTypeID("Bl  "))
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
function isArtboardEmpty(index) {
    var ref = new ActionReference()
    ref.putProperty(charIDToTypeID("Prpr"), stringIDToTypeID("layerSection"))
    ref.putIndex(charIDToTypeID("Lyr "), index - 1)
    var desc = executeActionGet(ref)
    var sectionEnum = desc.getEnumerationValue(stringIDToTypeID("layerSection"))
    return stringIDToTypeID("layerSectionEnd") == sectionEnum
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
// Usage:  Count the comps" names collecting duplicates
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
        for (compsIndex = 0; compsIndex < compsCount; compsIndex++) {
            var compRef = docLayerComps[compsIndex];
            if (compRef.selected) {
                return false; // all good, we have work to do
            }
        }
        return true; // none found selected, this is bad, no work to do
    }
    return false; // option off
}


///////////////////////////////////////////////////////////////////////////////

function deselectLayers() {
    //from scriptlistener plugin
    var idselectNoLayers = stringIDToTypeID("selectNoLayers");
    var desc7 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref3 = new ActionReference();
    var idLyr = charIDToTypeID("Lyr ");
    var idOrdn = charIDToTypeID("Ordn");
    var idTrgt = charIDToTypeID("Trgt");
    ref3.putEnumerated(idLyr, idOrdn, idTrgt);
    desc7.putReference(idnull, ref3);
    executeAction(idselectNoLayers, desc7, DialogModes.NO);
    // refresh();
    // app.activeDocument.layers.selectAll()
    // executeAction( idselectNoLayers, desc7, DialogModes.NO );
    // alert("deselect")
}


///////////////////////////////////////////////////////////////////////////////
function getLayerInfo(docRef) {
    var ref = new ActionReference()
    ref.putEnumerated(charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"))
    var count = executeActionGet(ref).getInteger(charIDToTypeID("NmbL")) + 1 // number of total layers in the document including start AND stop of groups. So layersets get counted twice.
    var infoList = []
    try {
        docRef.backgroundLayer;
        var i = 0
    } catch (e) {
        var i = 1
    }

    for (i; i < count; i++) {
        newLay = {};
        ref = new ActionReference();
        ref.putIndex(charIDToTypeID("Lyr "), i);
        var desc = executeActionGet(ref);
        newLay.id = desc.getInteger(stringIDToTypeID("layerID"));
        infoList.push(newLay)
    }
    return infoList;
}


/// ////////////////////////////////////////////////////////////////////////////
// Function: deleteByID
// Usage: delete the layer with the supplied action ID
// Input: ActionManagerID of a layer I wish to delete
// Return: none (deleted layers)
/// ////////////////////////////////////////////////////////////////////////////
function deleteByID(ID) {
    var ref = new ActionReference()
    ref.putIdentifier(charIDToTypeID("Lyr "), ID)
    var desc = new ActionDescriptor()
    desc.putReference(charIDToTypeID("null"), ref)

    desc.putBoolean(charIDToTypeID("MkVs"), false)
    try {
        executeAction(stringIDToTypeID("delete"), desc, DialogModes.NO)
    } catch (e) {}
}


// From Layers to Files
///////////////////////////////////////////////////////////////////////////////
// Function: removeAllInvisibleArtLayers
// Usage: remove all the invisible art layers, recursively
// Input: document or layer set
// Return: <none>, all layers that were invisible are now gone
///////////////////////////////////////////////////////////////////////////////
function removeAllInvisibleArtLayers(obj) {
    infoList = [];
    for (var i = obj.artLayers.length - 1; 0 <= i; i--) {
        if (!obj.artLayers[i].visible) {
            obj.artLayers[i].remove();
        }
    }
    for (var i = obj.layerSets.length - 1; 0 <= i; i--) {
        removeAllInvisibleArtLayers(obj.layerSets[i]);
    }
}


///////////////////////////////////////////////////////////////////////////////
// Function: removeAllEmptyLayerSets
// Usage: find all empty layer sets and remove them, recursively
// Input: document or layer set
// Return: empty layer sets are now gone
///////////////////////////////////////////////////////////////////////////////
function removeAllEmptyLayerSets(obj) {
    var foundEmpty = true;
    for (var i = obj.layerSets.length - 1; 0 <= i; i--) {
        if (removeAllEmptyLayerSets(obj.layerSets[i])) {
            obj.layerSets[i].remove();
        } else {
            foundEmpty = false;
        }
    }
    if (obj.artLayers.length > 0) {
        foundEmpty = false;
    }
    return foundEmpty;
}


///////////////////////////////////////////////////////////////////////////////
// Function: zeroSuppress
// Usage: return a string padded to digit(s)
// Input: num to convert, digit count needed
// Return: string padded to digit length
///////////////////////////////////////////////////////////////////////////////
function removeAllInvisible(docRef) {
    // alert(getLayerInfo(docRef));
    var getInfo = getLayerInfo(docRef);
    getLayerInfo(docRef);
    // alert(getInfo.length);
    // getInfo[i].id
    removeAllInvisibleArtLayers(docRef);
    removeAllEmptyLayerSets(docRef);
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
// Function: Delete Hidden Layers
// Usage: Checks if layer is visible if false layer is removed
// Input: Active Document layers
// Return: Cleaned document
///////////////////////////////////////////////////////////////////////////////

function deleteHiddenLayers(docRef) {
    // deselectLayers();
    // https://www.ps-scripts.com/viewtopic.php?t=8834
    var lyrHid = []
    for (var n = docRef.layers.length - 1; n >= 0; n--) {
        var thisLayer = docRef.layers[n];
        if (thisLayer.visible == false) {
            lyrHid.push(thisLayer.name)
            // thisLayer.deselect = true;
            // thisLayer.visible = true;
            // thisLayer.remove();
        }
    }

    // for (i = -1; i < lyrhid.lenght; i++){
    // alert(lyrHid[i])
    //     // docRef.activeLayer = docRef.layers.getByName(lyrhid[i]); 
    //     // docRef.activeLayer.remove();
    // }

    // alert(lyrHid)
    // alert(lyrHid[3]) 
    items = lyrHid;
    // alert(items)
    alert(docRef.layers.getByName([lyrHid.length - 1]))
}


///////////////////////////////////////////////////////////////////////////////
// Function: exportComps
// Usage: Check what settings user wants
// Input: exportInfo object containing our parameters
// Return: on ok, starte exporting comps / artboards
///////////////////////////////////////////////////////////////////////////////

function exportComps(compsIndex, exportInfo, compRef, nameCountObj) {
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
    // return "cancel"; // quit, returning "cancel" (dont localize) makes the actions palette not record our script
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


///////////////////////////////////////////////////////////////////////////////
// Function: cleanArtboards
// Usage: Check what artboard is active, deletes others
// Input: active artboard index
// Return: Cleaned document of noen active arboards
///////////////////////////////////////////////////////////////////////////////
// alert(artbrdIndex+" "+abAr)
    // alert(abAr[artbrdIndex])

// IDEA
// Loop over all artboards, skip when is one active, delete all others
function cTID(s) { return app.charIDToTypeID(s); };
function sTID(s) { return app.stringIDToTypeID(s); };

function cleanArtboards() {
    var desc582 = new ActionDescriptor();
    var ref126 = new ActionReference();
    ref126.putEnumerated( cTID('Lyr '), cTID('Ordn'), cTID('Trgt') );
    desc582.putReference( cTID('null'), ref126 );
    executeAction( cTID('Dlt '), desc582, DialogModes.NO );
};


// duplciate artboard script???
    function dupliABnewDoc(){
        // =======================================================
        var idmodalStateChanged = stringIDToTypeID( "modalStateChanged" );
        var desc819 = new ActionDescriptor();
        var idLvl = charIDToTypeID( "Lvl " );
        desc819.putInteger( idLvl, 0 );
        var idStte = charIDToTypeID( "Stte" );
        var idStte = charIDToTypeID( "Stte" );
        var idexit = stringIDToTypeID( "exit" );
        desc819.putEnumerated( idStte, idStte, idexit );
        var idkcanDispatchWhileModal = stringIDToTypeID( "kcanDispatchWhileModal" );
        desc819.putBoolean( idkcanDispatchWhileModal, true );
        var idTtl = charIDToTypeID( "Ttl " );
        desc819.putString( idTtl, """Duplicate Artboard""" );
        executeAction( idmodalStateChanged, desc819, DialogModes.YES );

        // =======================================================
        // var idMk = charIDToTypeID( "Mk  " );
        // var desc820 = new ActionDescriptor();
        // var idnull = charIDToTypeID( "null" );
        // var ref162 = new ActionReference();
        // var idDcmn = charIDToTypeID( "Dcmn" );
        // ref162.putClass( idDcmn );
        // desc820.putReference( idnull, ref162 );
        // var idNm = charIDToTypeID( "Nm  " );
        // desc820.putString( idNm, """AB-02""" );
        // var idUsng = charIDToTypeID( "Usng" );
        // var ref163 = new ActionReference();
        // var idLyr = charIDToTypeID( "Lyr " );
        // var idOrdn = charIDToTypeID( "Ordn" );
        // var idTrgt = charIDToTypeID( "Trgt" );
        // ref163.putEnumerated( idLyr, idOrdn, idTrgt );
        // desc820.putReference( idUsng, ref163 );
        // var idVrsn = charIDToTypeID( "Vrsn" );
        // desc820.putInteger( idVrsn, 5 );
        // executeAction( idMk, desc820, DialogModes.NO );

        // =======================================================
        //var idlayersFiltered = stringIDToTypeID( "layersFiltered" );
        //executeAction( idlayersFiltered, undefined, DialogModes.NO );
};


function switchFileType(exportInfo, duppedDocument,abAr, artbrdIndex) {
    // Deleta all Layer Comps > for when saving PSD & TIFF so we can clean them
    switch (exportInfo.fileType) {
        case png24Index:
            // alert(exportInfo.png24Transparency)
            if (exportInfo.trimLayers == true) {
                duppedDocument.trim(TrimType.TRANSPARENT);
            }
            if (exportInfo.png24Transparency) {
                // alert(exportInfo.png24Transparency)
                //do nothing
                break;
            } else {
                if (!exportInfo.png24Transparency) {
                    duppedDocument.flatten();
                    // alert("DO IT PNG24")
                }
            }
            
        case png8Index:
            if (exportInfo.trimLayers == true) {
                duppedDocument.trim(TrimType.TRANSPARENT);
            }
            if (exportInfo.png8Transparency) {
                //do nothing
                break;
            } else {
                if (!exportInfo.png8Transparency) {
                    duppedDocument.flatten();
                    // alert("DO IT PNG8")
                }
            }
        case tiffIndex:
            if (exportInfo.trimLayers == true) {
                duppedDocument.trim(TrimType.TRANSPARENT);
            }
            if ((exportInfo.tiffTransparency) || (exportInfo.tiffLayers)) {
                if (exportInfo.tiffLayers) {
                    docRef.layerComps.removeAll();
                    // removeAllInvisible(duppedDocument);// slow
                    // hideOthers(abAr, artbrdIndex);// faster
                    // deleteHidden();//faster
                }
                //do nothing
                break; 
            } else {
                if ((!exportInfo.tiffTransparency) || (!exportInfo.tiffLayers)) {
                    duppedDocument.flatten();
                    // alert("DO IT TIFF")
                }
            }
        case psdIndex:
            if (exportInfo.trimLayers == true) {
                duppedDocument.trim(TrimType.TRANSPARENT);
            }
            if (exportInfo.psdLayers) {
                docRef.layerComps.removeAll();
                // removeAllInvisible(duppedDocument);// slow
                    // hideOthers(abAr, artbrdIndex);// faster
                    // deleteHidden();//faster
                //do nothing
                break;
            } else {
                if (!exportInfo.psdLayers) {
                    duppedDocument.flatten();
                    // alert("DO IT PSD")
                }
            }
        case pdfIndex:
            // if (exportInfo.trimLayers == true) {
            //     duppedDocument.trim(TrimType.TRANSPARENT);
            // }
            if (exportInfo.pdfLayers) {
                docRef.layerComps.removeAll();
                // removeAllInvisible(duppedDocument);// slow
                    // hideOthers(abAr, artbrdIndex);// faster
                    // deleteHidden();//faster
                //do nothing
                break;
            } else {
                if (!exportInfo.pdfLayers) {
                    duppedDocument.flatten();
                    // alert("DO IT PSD")
                }
            }
        default:
            if (exportInfo.trimLayers == true) {
                duppedDocument.trim(TrimType.TRANSPARENT);
            }
            docRef.layerComps.removeAll();
            // alert("DO IT DEFAULT")
            duppedDocument.flatten();
    }
}



function cropFromMask () {
  var idset = stringIDToTypeID('set')
  var desc78 = new ActionDescriptor()
  var idnull = stringIDToTypeID('null')
  var ref40 = new ActionReference()
  var idchannel = stringIDToTypeID('channel')
  var idselection = stringIDToTypeID('selection')
  ref40.putProperty(idchannel, idselection)
  desc78.putReference(idnull, ref40)
  var idto = stringIDToTypeID('to')
  var ref41 = new ActionReference()
  var idchannel = stringIDToTypeID('channel')
  var idordinal = stringIDToTypeID('ordinal')
  var idtargetEnum = stringIDToTypeID('targetEnum')
  ref41.putEnumerated(idchannel, idordinal, idtargetEnum)
  desc78.putReference(idto, ref41)
  executeAction(idset, desc78, DialogModes.NO)

  // =======================================================
  var idcrop = stringIDToTypeID('crop')
  var desc79 = new ActionDescriptor()
  var iddelete = stringIDToTypeID('delete')
  desc79.putBoolean(iddelete, true)
  executeAction(idcrop, desc79, DialogModes.NO)
}


function deleteHidden(){
    // =======================================================
// var idDlt = charIDToTypeID( "Dlt " );
//     var desc46 = new ActionDescriptor();
//     var idnull = charIDToTypeID( "null" );
//         var ref4 = new ActionReference();
//         var idLyr = charIDToTypeID( "Lyr " );
//         var idOrdn = charIDToTypeID( "Ordn" );
//         var idhidden = stringIDToTypeID( "hidden" );
//         ref4.putEnumerated( idLyr, idOrdn, idhidden );
//     desc46.putReference( idnull, ref4 );
// executeAction( idDlt, desc46, DialogModes.NO );
    var desc46 = new ActionDescriptor();
        var ref4 = new ActionReference();
        ref4.putEnumerated( cTID('Lyr '), cTID('Ordn'), sTID('hidden') );
    desc46.putReference( cTID('null'), ref4 );
    executeAction( cTID('Dlt '), desc46, DialogModes.NO );
}

function hideOthers(abAr,artbrdIndex){
    // =======================================================
// var idShw = charIDToTypeID( "Shw " );
//     var desc12 = new ActionDescriptor();
//     var idnull = charIDToTypeID( "null" );
//         var list1 = new ActionList();
//             var ref1 = new ActionReference();
//             var idLyr = charIDToTypeID( "Lyr " );
//             var idOrdn = charIDToTypeID( "Ordn" );
//             var idTrgt = charIDToTypeID( "Trgt" );
//             ref1.putEnumerated( idLyr, idOrdn, idTrgt );
//         list1.putReference( ref1 );
//     desc12.putList( idnull, list1 );
//     var idTglO = charIDToTypeID( "TglO" );
//     desc12.putBoolean( idTglO, true );
// executeAction( idShw, desc12, DialogModes.NO );
    // var desc12 = new ActionDescriptor();
    //     var list1 = new ActionList();
    //         var ref1 = new ActionReference();
    //         ref1.putEnumerated( cTID('Lyr '), cTID('Ordn'), cTID('Trgt') );
    //     list1.putReference( ref1 );
    // desc12.putList( cTID('null'), list1 );
    // desc12.putBoolean( cTID('TglO'), true );
    // executeAction( cTID('Shw '), desc12, DialogModes.NO );
    // alert(abAr[artbrdIndex].index)
    // alert(typeof(abAr[artbrdIndex].index))
    // alert(parseInt(abAr[artbrdIndex].index))
    // alert(typeof(9))
    // layIndex = abAr[artbrdIndex].index;
    // alert(activeDocument.layers[9])
    // alert(typeof(activeDocument.layers[9]))
    // alert(getArtBoards(inArray))
    // getBoolean(stringIDToTypeID("artboardEnabled")
    // if (theLayer.kind == "LayerKind.SMARTOBJECT") {
    activeDocument.activeLayer = activeDocument.layers.getByName(abAr[artbrdIndex].name);
    // alert(activeDocument.activeLayer[abAr[artbrdIndex].name]);
    // activeDocument.activeLayer = activeDocument.layers[25];
    // Hide Others Artbaords
//     var idShw = charIDToTypeID( "Shw " );
//     var desc124 = new ActionDescriptor();
//     var idnull = charIDToTypeID( "null" );
//         var list2 = new ActionList();
//             var ref8 = new ActionReference();
//             var idLyr = charIDToTypeID( "Lyr " );
//             ref8.putName( idLyr, abAr[artbrdIndex].name );
//         list2.putReference( ref8 );
//     desc124.putList( idnull, list2 );
//     var idTglO = charIDToTypeID( "TglO" );
//     desc124.putBoolean( idTglO, true );
// executeAction( idShw, desc124, DialogModes.NO );

    // var desc124 = new ActionDescriptor();
    // var list2 = new ActionList();
    // var ref8 = new ActionReference();
    // ref8.putName( cTID('Lyr '), activeDocument.activeLayer.name );
    // list2.putReference( ref8 );
    // desc124.putList( cTID('null'), list2 );
    // desc124.putBoolean( cTID('TglO'), true );
    // executeAction( cTID('Shw '), desc124, DialogModes.NO );

    // var idShw = charIDToTypeID( "Shw " );
    // var desc101 = new ActionDescriptor();
    // var idnull = charIDToTypeID( "null" );
    //     var list4 = new ActionList();
    //         var ref14 = new ActionReference();
    //         var idLyr = charIDToTypeID( "Lyr " );
    //         var idOrdn = charIDToTypeID( "Ordn" );
    //         var idTrgt = charIDToTypeID( "Trgt" );
    //         ref14.putEnumerated( idLyr, idOrdn, idTrgt );
    //     list4.putReference( ref14 );
    // desc101.putList( idnull, list4 );
    // var idTglO = charIDToTypeID( "TglO" );
    // desc101.putBoolean( idTglO, true );
    // executeAction( idShw, desc101, DialogModes.NO );

    var desc101 = new ActionDescriptor();
        var list4 = new ActionList();
            var ref14 = new ActionReference();
            ref14.putEnumerated( cTID('Lyr '), cTID('Ordn'), cTID('Trgt') );
        list4.putReference( ref14 );
    desc101.putList( cTID('null'), list4 );
    desc101.putBoolean( cTID('TglO'), true );
    executeAction( cTID('Shw '), desc101, DialogModes.NO );
}

function ungroupAB(){
    selectAll();

    // Ungroup artboards
    var idungroupLayersEvent = stringIDToTypeID( "ungroupLayersEvent" );
    var desc77 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref9 = new ActionReference();
        var idLyr = charIDToTypeID( "Lyr " );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref9.putEnumerated( idLyr, idOrdn, idTrgt );
    desc77.putReference( idnull, ref9 );
    executeAction( idungroupLayersEvent, desc77, DialogModes.NO );

    // crop to election
    var desc55 = new ActionDescriptor();
    desc55.putBoolean( cTID('Dlt '), true );
    executeAction( cTID('Crop'), desc55, DialogModes.NO );
}

function selectAll(){
     var desc46 = new ActionDescriptor();
        var ref14 = new ActionReference();
        ref14.putProperty( cTID('Chnl'), cTID('fsel') );
    desc46.putReference( cTID('null'), ref14 );
    desc46.putEnumerated( cTID('T   '), cTID('Ordn'), cTID('Al  ') );
    executeAction( cTID('setd'), desc46, DialogModes.NO );

}
///////////////////////////////////////////////////////////////////////////////
// Function: exportArtboards - Single or All
// Usage: Check what settings user wants
// Input: exportInfo object containing our parameters
// Return: on ok, artboards from comps or just layer comps are saved
///////////////////////////////////////////////////////////////////////////////

function exportArtboards(compsIndex, artbrdIndex, exportInfo, abAr, compRef, nameCountObj) {
    // create duplicate doc and flatten to save memory. and processing time.  I already have all the data i need so don"t need the layers anymore. 
    var duppedDocument = app.activeDocument.duplicate();
    
    // switchFileType(exportInfo, duppedDocument,abAr, artbrdIndex)
    switchFileType(exportInfo, duppedDocument)

    app.activeDocument = duppedDocument;

    var curRulOrigin = getActiveDocRulerOrigin();
    if (exportInfo.artboardShow) {
        artbrdIndex -= 1; // Minus 1 to compensentate None in menu
    }
    // alert("start crop")
    //active index should be set
    // alert("test dupli")
    //dupliABnewDoc()
    // get crop region
    if (abAr) {
        if((exportInfo.psdLayers && exportInfo.fileType == psdIndex) || (exportInfo.pdfLayers && exportInfo.fileType == pdfIndex) || (exportInfo.tiffLayers && exportInfo.fileType == tiffIndex) || (exportInfo.tiffTransparency && exportInfo.fileType == tiffIndex)||(exportInfo.png24Transparency && exportInfo.fileType == png24Index)||(exportInfo.png8Transparency&& exportInfo.fileType == png8Index)){
            // alert("hide files")
            // alert(exportInfo.fileType)
            try{
                hideOthers(abAr, artbrdIndex); // hides others > Artvoards in this case
                deleteHidden(); // Then we delete them > now crop works
                ungroupAB();// Fix for OSX
            } catch(e){
                alert(e)
            }
        } else {
            var lt = -curRulOrigin[0] + abAr[artbrdIndex].left;
            var tp = -curRulOrigin[1] + abAr[artbrdIndex].top;
            var rt = (abAr[artbrdIndex].right - abAr[artbrdIndex].left) + lt;
            var bt = (abAr[artbrdIndex].bottom - abAr[artbrdIndex].top) + tp;
            var cropRegion = [lt, tp, rt, bt];
            // alert(cropRegion)
            
            duppedDocument.crop(cropRegion);
        }
        // if((exportInfo.psdLayers && exportInfo.fileType == psdIndex) || (exportInfo.tiffLayers && exportInfo.fileType == tiffIndex)||(exportInfo.png24Transparency && exportInfo.fileType == png24Index)||(exportInfo.png8Transparency&& exportInfo.fileType == png8Index)){
        //     duppedDocument.trim(TrimType.TRANSPARENT); // extra check
        // }
        // cropFromMask();
        // cleanArtboards();
        
    }
    // alert("end crop crop")
    // alert(abAr[artbrdIndex].visible)
    if (duppedDocument.bitsPerChannel == duppedDocument.THIRTYTWO) duppedDocument.bitsPerChannel = duppedDocument.SIXTEEN;

    // Naming method from layercomps to Files + artboardnames
    var fileNameBody = exportInfo.fileNamePrefix;
    // fileNameBody += "_" + zeroSuppress(compsIndex, 4);
    // fileNameBody += "_" + compRef.name;
    fileNameBody = fileNameBody.replace(/[:\/\\*\?\"\<\>\|\\\r\\\n]/g, "-"); // "/\:*?"<>|\r\n" -> "-"
    if (exportInfo.inclArtboardName) {
        if (exportInfo.fileNamePrefix) {
            fileNameBody += "-";
        }
        fileNameBody += abAr[artbrdIndex].name;
    }

    if (exportInfo.prefixIndex) {
        if ((exportInfo.inclArtboardName) || (exportInfo.fileNamePrefix)) {
            fileNameBody += "-";
        }
        fileNameBody += zeroSuppress(compsIndex, 4) + "-";
        fileNameBody += compRef.name;
    } else // not using prefix, but we"ll still make sure each file name is unique
    {
        if ((exportInfo.inclArtboardName) || (exportInfo.fileNamePrefix)) {
            fileNameBody += "-";
        }
        fileNameBody += compRef.name;
        var nameEntry = nameCountObj[compRef.name];
        if (nameEntry.total > 1)
            fileNameBody += "-" + nameEntry.nameIndex++;
    }
    if ((null != compRef.comment) && exportInfo.addCompComment) {
        if (compRef.comment.length > 20) compRef.comment = compRef.comment.substring(0, 20);
        fileNameBody += "-" + compRef.comment;
    }
    if (fileNameBody.length > 120) fileNameBody = fileNameBody.substring(0, 120);
    fileNameBody = fileNameBody.replace(/[:\/\\*\?\"\<\>\|\\\r\\\n]/g, ""); // "/\:*?"<>|\r\n" -> "-"

    // alert("add icc: "+exportInfo.icc+" - conv icc: "+exportInfo.convicc)
    // //Convert to sRGB if true
    if (exportInfo.convicc) {
        ConvertTosRGBProfile();
    }

    saveFile(duppedDocument, fileNameBody, exportInfo);
    duppedDocument.close(SaveOptions.DONOTSAVECHANGES);
}

// End Layer Comps To Files.jsx