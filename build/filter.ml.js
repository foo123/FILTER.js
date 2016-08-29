/**
*
*   FILTER.js MachineLearning Routines
*   @version: 0.9.6
*   @dependencies: Filter.js
*
*   JavaScript Image Processing Library (Machine Learning Routines)
*   https://github.com/foo123/FILTER.js
*
**/!function( root, factory ){
"use strict";
if ( ('object'===typeof module) && module.exports ) /* CommonJS */
    module.exports = factory.call(root,(module.$deps && module.$deps["FILTER"]) || require("./FILTER".toLowerCase()));
else if ( ("function"===typeof define) && define.amd && ("function"===typeof require) && ("function"===typeof require.specified) && require.specified("FILTER_ML") /*&& !require.defined("FILTER_ML")*/ ) 
    define("FILTER_ML",['module',"FILTER"],function(mod,module){factory.moduleUri = mod.uri; factory.call(root,module); return module;});
else /* Browser/WebWorker/.. */
    (factory.call(root,root["FILTER"])||1)&&('function'===typeof define)&&define.amd&&define(function(){return root["FILTER"];} );
}(  /* current root */          this, 
    /* module factory */        function ModuleFactory__FILTER_ML( FILTER ){
/* main code starts here */

/**
*
*   FILTER.js MachineLearning Routines
*   @version: 0.9.6
*   @dependencies: Filter.js
*
*   JavaScript Image Processing Library (Machine Learning Routines)
*   https://github.com/foo123/FILTER.js
*
**/

/**
*
* Filter Machine Learning Connected Components
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var A32I = FILTER.Array32I, A32U = FILTER.Array32U, A8U = FILTER.Array8U,
    ceil = Math.ceil, min = Math.min, max = Math.max, abs = Math.abs, NUM_LABELS = 20;

// adapted from http://xenia.media.mit.edu/~rahimi/connected/
function root_of( id, labels )
{
    while( labels[id][1] !== id )
    {
        // link this node to its parent's parent, just to shorten the tree.
        //merge_box( labels[id][1], labels[labels[id][1]][1], labels );
        //merge_box( id, labels[id][1], labels );
        labels[id][1] = labels[labels[id][1]][1];
        id = labels[id][1];
    }
    return id;
}
function merge( id1, id2, labels )
{
    var r1 = root_of(id1, labels), r2 = root_of(id2, labels);
    if ( r1 !== r2 )
    {
        labels[r1][1] = r2;
        //merge_box( r1, r2, labels );
    }
}
/*function merge_box( id1, id2, labels )
{
    var x1 = min(labels[id1][3],labels[id2][3]),
        y1 = min(labels[id1][4],labels[id2][4]),
        x2 = max(labels[id1][5],labels[id2][5]),
        y2 = max(labels[id1][6],labels[id2][6]);

    labels[id1][3] = x1;
    labels[id1][4] = y1;
    labels[id1][5] = x2;
    labels[id1][6] = y2;
    
    labels[id2][3] = x1;
    labels[id2][4] = y1;
    labels[id2][5] = x2;
    labels[id2][6] = y2;
}*/
function new_label( x, y, labels )
{
    var current = labels.next;
    if ( current+1 > labels.length ) Array.prototype.push.apply(labels, new Array(NUM_LABELS));
    labels[current] = [current, current, 0/*, x, y, x, y*/];
    ++labels.next;
    return current;
}
function copy_label( id, x, y, labels )
{
    /*labels[id][3] = min(labels[id][3],x);
    labels[id][4] = min(labels[id][4],y);
    labels[id][5] = max(labels[id][5],x);
    labels[id][6] = max(labels[id][6],y);*/
    return id;
}
// TODO: add bounding boxes, so it can be used as connected color/hue detector/tracker as well efficiently
function connected_components( stride, labeled, D, w, h, connectivity, invert, delta, V0 )
{
    var i, j, k, imLen = labeled.length, imSize = imLen>>>stride,
        K8_CONNECTIVITY = 8 === connectivity, d0 = K8_CONNECTIVITY ? -1 : 0,
        mylab, c, r, d, row, labels, labelimg, background_label = null,
        need_match = null != V0, highest, tag, color;//, box
    
    labels = new Array(NUM_LABELS);
    labels.next = 0;
    labelimg = new A32U(imSize);
    background_label = need_match ? new_label(0, 0, labels) : null;

    labelimg[0] = need_match && (abs(D[0]-V0)>delta) ? background_label : new_label(0, 0, labels);

    // label the first row.
    for(c=1; c<w; c++)
        labelimg[c] = need_match && (abs(D[c]-V0)>delta) ? background_label : (abs(D[c]-D[c-1])<=delta ? labelimg[c-1]/*copy_label(labelimg[c-1], c, 0, labels)*/ : new_label(c, 0, labels));

    // label subsequent rows.
    for(r=1,row=w; r<h; r++,row+=w)
    {
        // label the first pixel on this row.
        labelimg[row] = need_match && (abs(D[row]-V0)>delta) ? background_label : (abs(D[row]-D[row-w])<=delta ? labelimg[row-w]/*copy_label(labelimg[row-w], 0, r, labels)*/ : new_label(0, r, labels));

        // label subsequent pixels on this row.
        for(c=1; c<w; c++)
        {
            if ( need_match && (abs(D[row+c]-V0)>delta) )
            {
                labelimg[row+c] = background_label;
                continue;
            }
            // inherit label from pixel on the left if we're in the same blob.
            mylab = background_label === labelimg[row+c-1] ? -1 : (abs(D[row+c]-D[row+c-1])<=delta ? labelimg[row+c-1]/*copy_label(labelimg[row+c-1], c, r, labels)*/ : -1);

            for(d=d0; d<1; d++)
            {
                // if we're in the same blob, inherit value from above pixel.
                // if we've already been assigned, merge its label with ours.
                if( (background_label !== labelimg[row-w+c+d]) && (abs(D[row+c]-D[row-w+c+d])<=delta) )
                {
                    if( mylab >= 0 ) merge(mylab, labelimg[row-w+c+d], labels);
                    else mylab = labelimg[row-w+c+d]/*copy_label(labelimg[row-w+c+d], c+d, r, labels)*/;
                }
            }
            labelimg[row+c] = mylab >= 0 ? mylab/*copy_label(mylab, c, r, labels)*/ : new_label(c, r, labels);

            if( K8_CONNECTIVITY && 
                (background_label !== labelimg[row+c-1]) && 
                (background_label !== labelimg[row-w+c]) && 
                (abs(D[row+c-1]-D[row-w+c])<=delta)
            )
                merge(labelimg[row+c-1], labelimg[row-w+c], labels);
        }
    }

    // relabel image
    if ( 0 === background_label )
    {
        for(i=0,highest=labels.next,tag=0; i<highest; i++)
            if ( i === labels[i][1] ) labels[i][2] = 0 === labels[i][1] ? 0 : ++tag;
    }
    else
    {
        for(i=0,highest=labels.next,tag=0; i<highest; i++)
            if ( i === labels[i][1] ) labels[i][2] = tag++;
    }

    //box = {};
    tag = tag > 0 ? tag : 1;
    if ( invert )
    {
        if ( stride )
        {
            for(c=0,i=0; i<imLen; i+=4,c++)
            {
                color = labels[root_of(labelimg[c], labels)][2];
                color = (255-255*color/tag)|0;
                labeled[i] = labeled[i+1] = labeled[i+2] = color;
                //labeled[i+3] = im[i+3];
                //box[tag] = [mylab[2], mylab[3], mylab[4], mylab[5]];
            }
        }
        else
        {
            for(c=0; c<imLen; c++)
            {
                color = labels[root_of(labelimg[c], labels)][2];
                color = (255-255*color/tag)|0;
                labeled[c] = color;
                //box[tag] = [mylab[2], mylab[3], mylab[4], mylab[5]];
            }
        }
    }
    else
    {
        if ( stride )
        {
            for(c=0,i=0; i<imLen; i+=4,c++)
            {
                color = labels[root_of(labelimg[c], labels)][2];
                color = (255*color/tag)|0;
                labeled[i] = labeled[i+1] = labeled[i+2] = color;
                //labeled[i+3] = im[i+3];
                //box[tag] = [mylab[2], mylab[3], mylab[4], mylab[5]];
            }
        }
        else
        {
            for(c=0; c<imLen; c++)
            {
                color = labels[root_of(labelimg[c], labels)][2];
                color = (255*color/tag)|0;
                labeled[c] = color;
                //box[tag] = [mylab[2], mylab[3], mylab[4], mylab[5]];
            }
        }
    }
    return labeled;
}
function connected_component( x0, y0, r0, g0, b0, bounding_box, im, w, h, delta )
{
    var imLen = im.length, imSize = imLen>>>2, xm, ym, xM, yM,
        y, yy, dy = w<<2, ymin = 0, ymax = imLen-dy, xmin = 0, xmax = (w-1)<<2,
        l, i, k, x, x1, x2, yw, stack, slen, notdone, labeled;
        
    xm = x0; ym = y0; xM = x0; yM = y0; 
    //labeled = new A8U(imSize);
    labeled = new A32U(ceil(imSize/32));
    stack = new A32I(imSize<<2); slen = 0; // pre-allocate and soft push/pop for speed
    
    //labeled[(x0+y0)>>>2] = 255;
    labeled[(x0+y0)>>>7] |= 1<<(((x0+y0)>>>2)&31);
    if ( y0+dy >= ymin && y0+dy <= ymax )
    {
        /* needed in some cases */
        stack[slen  ]=y0;
        stack[slen+1]=x0;
        stack[slen+2]=x0;
        stack[slen+3]=dy;
        slen += 4;
    }
    /*if ( y0 >= ymin && y0 <= ymax)*/
    /* seed segment (popped 1st) */
    stack[slen  ]=y0+dy;
    stack[slen+1]=x0;
    stack[slen+2]=x0;
    stack[slen+3]=-dy;
    slen += 4;
    
    while ( 0 < slen ) 
    {
        /* pop segment off stack and fill a neighboring scan line */
        slen -= 4;
        dy = stack[slen+3];
        yw = stack[slen  ]+dy;
        x1 = stack[slen+1];
        x2 = stack[slen+2];
        ym = min(ym, yw); yM = max(yM, yw);
        xm = min(xm, x1); xM = max(xM, x2);
        
        /*
         * segment of scan line y-dy for x1<=x<=x2 was previously filled,
         * now explore adjacent pixels in scan line y
         */
        for (x=x1; x>=xmin; x-=4)
        {
            i = x+yw; k = i>>>2;
            if ( /*0===labeled[k]*/!(labeled[k>>>5]&(1<<(k&31))) && abs(r0-im[i])<=delta && abs(g0-im[i+1])<=delta && abs(b0-im[i+2])<=delta )
            {
                //labeled[k] = 255;
                labeled[k>>>5] |= 1<<(k&31);
                xm = min(xm, x);
            }
            else break;
        }
        if ( x >= x1 ) 
        {
            // goto skip:
            i = x+yw; k = i>>>2;
            while ( x<=x2 && (/*0!==labeled[k]*/(labeled[k>>>5]&(1<<(k&31))) || abs(r0-im[i])>delta || abs(g0-im[i+1])>delta || abs(b0-im[i+2])>delta) )
            {
                x+=4;
                i = x+yw; k = i>>>2;
            }
            l = x;
            notdone = (x <= x2);
        }
        else
        {
            l = x+4;
            if ( l < x1 ) 
            {
                if ( yw-dy >= ymin && yw-dy <= ymax )
                {
                    //stack[slen++]=[yw, l, x1-4, -dy];  /* leak on left? */
                    stack[slen  ]=yw;
                    stack[slen+1]=l;
                    stack[slen+2]=x1-4;
                    stack[slen+3]=-dy;
                    slen += 4;
                }
            }
            x = x1+4;
            notdone = true;
        }
        
        while ( notdone ) 
        {
            i = x+yw; k = i>>>2;
            while ( x<=xmax && /*0===labeled[k]*/!(labeled[k>>>5]&(1<<(k&31))) && abs(r0-im[i])<=delta && abs(g0-im[i+1])<=delta && abs(b0-im[i+2])<=delta )
            {
                //labeled[k] = 255;
                labeled[k>>>5] |= 1<<(k&31);
                xM = max(xM, x);
                x+=4; i = x+yw; k = i>>>2;
            }
            if ( yw+dy >= ymin && yw+dy <= ymax)
            {
                //stack[slen++]=[yw, l, x-4, dy];
                stack[slen  ]=yw;
                stack[slen+1]=l;
                stack[slen+2]=x-4;
                stack[slen+3]=dy;
                slen += 4;
            }
            if ( x > x2+4 ) 
            {
                if ( yw-dy >= ymin && yw-dy <= ymax)
                {
                    //stack[slen++]=[yw, x2+4, x-4, -dy];	/* leak on right? */
                    stack[slen  ]=yw;
                    stack[slen+1]=x2+4;
                    stack[slen+2]=x-4;
                    stack[slen+3]=-dy;
                    slen += 4;
                }
            }
    /*skip:*/   
            i = x+yw; k = i>>>2;
            while ( x<=x2 && (/*0!==labeled[k]*/(labeled[k>>>5]&(1<<(k&31))) || abs(r0-im[i])>delta || abs(g0-im[i+1])>delta || abs(b0-im[i+2])>delta) ) 
            {
                x+=4;
                i = x+yw; k = i>>>2;
            }
            l = x;
            notdone = (x <= x2);
        }
    }
    bounding_box[0] = xm; bounding_box[1] = ym;
    bounding_box[2] = xM; bounding_box[3] = yM;
    return labeled;
}

FILTER.MachineLearning.connected_components = connected_components;
FILTER.MachineLearning.connected_component = connected_component;

}(FILTER);
/* main code ends here */
/* export the module */
return FILTER;
});