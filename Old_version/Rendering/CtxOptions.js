/*
* CtxOptions by OlegoS. Feb 4, 2012
*
* Copyright (c) 2012 OlegoS
*
* See license information in readme file.
*/

/**
* OncCanvasJs is a framework to work with html5 canvas. It can be used to write
* games or any other web-applications, which use canvas graphics.
* @module OncCanvasJs
**/


/**
* CtxOptions is a set of classes-helpers to set drawing options of HTML5 canvas context.
* In these helpers there are defined string constants for canvas context options.
**/


//canvas context options helpers:
    /**
     * Options for globalCompositeOperation
     **/
    var Composite = {
        SOURCE_ATOP:'source-atop',
        SOURCE_IN:'source-in',
        SOURCE_OUT:'source-out',
        SOURCE_OVER:'source-over',
        DESTINATION_ATOP:'destination-atop',
        DESTINATION_IN:'destination-in',
        DESTINATION_OUT:'destination-out',
        DESTINATION_OVER:'destination-over',
        LIGHTER:'lighter',
        COPY:'copy',
        XOR:'xor'
    };

    /**
     * Options for lineCap
     **/
   var LineCap = {
        BUTT:'butt',
        ROUND:'round',
        SQUARE:'square'
   };

    /**
     * Options for lineJoin
     **/
    var LineJoin = {
        BEVEL:'bevel',
        ROUND:'round',
        MITER:'miter'
    };
    
    /**
     * Options for textAlign
     **/
    var TextAlign = {
        START:'start',
        END:'end',
        LEFT:'left',
        RIGHT:'right',
        CENTER:'center'
    };
    
    /**
     * Options for textBaseline
     **/
    var TextBaseline = {
        TOP:'top',
        HANGING:'hanging',
        MIDDLE:'middle',
        ALPHABETIC:'alphabetic',
        IDEOGRAPHIC:'ideographic',
        BOTTOM:'bottom'
    };
