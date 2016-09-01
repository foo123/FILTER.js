/**
*
* Filter Machine Learning Connected Components
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var A32I = FILTER.Array32I, A32U = FILTER.Array32U, A32F = FILTER.Array32F, A8U = FILTER.Array8U,
    ceil = Math.ceil, min = Math.min, max = Math.max, abs = Math.abs, NUM_LABELS = 256;

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
function connected_components( output, w, h, stride, D, K, dist, delta, V0, invert )
{
    stride = stride|0;
    var i, j, k, len = output.length, size = len>>>stride, K8_CONNECTIVITY = 8 === K,
        mylab, c, r, d, row, labels, label, background_label = null,
        need_match = null != V0, highest, tag, color;//, box
    
    labels = new Array(NUM_LABELS); labels.next = 0;
    label = new A32U(size);
    background_label = need_match ? new_label(0, 0, labels) : null;

    label[0] = need_match && !dist(D[0],V0,delta) ? background_label : new_label(0, 0, labels);

    // label the first row.
    for(c=1; c<w; c++)
        label[c] = need_match && !dist(D[c],V0,delta) ? background_label : (dist(D[c],D[c-1],delta) ? label[c-1]/*copy_label(label[c-1], c, 0, labels)*/ : new_label(c, 0, labels));

    // label subsequent rows.
    for(r=1,row=w; r<h; r++,row+=w)
    {
        // label the first pixel on this row.
        label[row] = need_match && !dist(D[row],V0,delta) ? background_label : (dist(D[row],D[row-w],delta) ? label[row-w]/*copy_label(label[row-w], 0, r, labels)*/ : new_label(0, r, labels));

        // label subsequent pixels on this row.
        for(c=1; c<w; c++)
        {
            if ( need_match && !dist(D[row+c],V0,delta) )
            {
                label[row+c] = background_label;
                continue;
            }
            // inherit label from pixel on the left if we're in the same blob.
            mylab = background_label === label[row+c-1] ? -1 : (dist(D[row+c],D[row+c-1],delta) ? label[row+c-1]/*copy_label(label[row+c-1], c, r, labels)*/ : -1);

            //for(d=d0; d<1; d++)
            // full loop unrolling
            // if we're in the same blob, inherit value from above pixel.
            // if we've already been assigned, merge its label with ours.
            if ( K8_CONNECTIVITY )
            {
                //d = -1;
                if( (background_label !== label[row-w+c-1/*+d*/]) && dist(D[row+c],D[row-w+c-1/*+d*/],delta) )
                {
                    if( mylab > -1 ) merge(mylab, label[row-w+c-1/*+d*/], labels);
                    else mylab = label[row-w+c-1/*+d*/]/*copy_label(label[row-w+c-1/*+d* /], c-1/*+d* /, r, labels)*/;
                }
            }
            //d = 0;
            if( (background_label !== label[row-w+c/*+d*/]) && dist(D[row+c],D[row-w+c/*+d*/],delta) )
            {
                if( mylab > -1 ) merge(mylab, label[row-w+c/*+d*/], labels);
                else mylab = label[row-w+c/*+d*/]/*copy_label(label[row-w+c/*+d* /], c/*+d* /, r, labels)*/;
            }
            
            label[row+c] = mylab > -1 ? mylab/*copy_label(mylab, c, r, labels)*/ : new_label(c, r, labels);

            if( K8_CONNECTIVITY &&
                (background_label !== label[row+c-1]) && (background_label !== label[row-w+c]) && 
                dist(D[row+c-1],D[row-w+c],delta) )
                merge(label[row+c-1], label[row-w+c], labels);
        }
    }

    // relabel output
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
            for(c=0,i=0; i<len; i+=4,c++)
            {
                color = labels[root_of(label[c], labels)][2];
                color = (255-255*color/tag)|0;
                output[i] = output[i+1] = output[i+2] = color;
                //output[i+3] = output[i+3];
                //box[tag] = [mylab[2], mylab[3], mylab[4], mylab[5]];
            }
        }
        else
        {
            for(c=0; c<len; c++)
            {
                color = labels[root_of(label[c], labels)][2];
                color = (255-255*color/tag)|0;
                output[c] = color;
                //box[tag] = [mylab[2], mylab[3], mylab[4], mylab[5]];
            }
        }
    }
    else
    {
        if ( stride )
        {
            for(c=0,i=0; i<len; i+=4,c++)
            {
                color = labels[root_of(label[c], labels)][2];
                color = (255*color/tag)|0;
                output[i] = output[i+1] = output[i+2] = color;
                //output[i+3] = output[i+3];
                //box[tag] = [mylab[2], mylab[3], mylab[4], mylab[5]];
            }
        }
        else
        {
            for(c=0; c<len; c++)
            {
                color = labels[root_of(label[c], labels)][2];
                color = (255*color/tag)|0;
                output[c] = color;
                //box[tag] = [mylab[2], mylab[3], mylab[4], mylab[5]];
            }
        }
    }
    return output;
}


// adapted from: A Seed Fill Algorithm, by Paul Heckbert from "Graphics Gems", Academic Press, 1990
// http://www.codeproject.com/Articles/6017/QuickFill-An-efficient-flood-fill-algorithm
// http://www.codeproject.com/Articles/16405/Queue-Linear-Flood-Fill-A-Fast-Flood-Fill-Algorith
function flood_region( im, w, h, stride, D, K, x0, y0 )
{
    stride = stride|0;
    var imLen = im.length, imSize = imLen>>>stride, xm, ym, xM, yM,
        y, yy, dx = 1<<stride, dy = w<<stride,
        ymin = 0, ymax = imLen-dy, xmin = 0, xmax = (w-1)<<stride,
        l, i, k, x, x1, x2, yw, stack, slen, notdone, labeled, diff;
        
    xm = x0; ym = y0; xM = x0; yM = y0;
    // mask is a packed bit array for efficiency
    labeled = new A32U(ceil(imSize/32));
    stack = new A32I(imSize<<2); slen = 0; // pre-allocate and soft push/pop for speed
    
    k = (x0+y0)>>>stride; labeled[k>>>5] |= 1<<(k&31);
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
    
    if ( stride )
    {
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
            for (x=x1; x>=xmin; x-=dx)
            {
                i = x+yw; k = i>>>stride;
                diff = (D[im[i  ]] & 1) | (D[im[i+1]] & 2) | (D[im[i+2]] & 4);
                if ( !diff && !(labeled[k>>>5]&(1<<(k&31))) )
                {
                    labeled[k>>>5] |= 1<<(k&31);
                    xm = min(xm, x);
                }
                else break;
            }
            
            if ( x >= x1 ) 
            {
                // goto skip:
                i = x+yw; k = i>>>stride;
                diff = (D[im[i  ]] & 1) | (D[im[i+1]] & 2) | (D[im[i+2]] & 4);
                while ( x<=x2 && (diff || (labeled[k>>>5]&(1<<(k&31)))) )
                {
                    x+=dx;
                    i = x+yw; k = i>>>stride;
                    diff = (D[im[i  ]] & 1) | (D[im[i+1]] & 2) | (D[im[i+2]] & 4);
                }
                l = x;
                notdone = (x <= x2);
            }
            else
            {
                l = x+dx;
                if ( l < x1 ) 
                {
                    if ( yw >= ymin+dy && yw <= ymax+dy )
                    {
                        //stack[slen++]=[yw, l, x1-4, -dy];  /* leak on left? */
                        stack[slen  ]=yw;
                        stack[slen+1]=l;
                        stack[slen+2]=x1-dx;
                        stack[slen+3]=-dy;
                        slen += 4;
                    }
                }
                x = x1+dx;
                notdone = true;
            }
            
            while ( notdone ) 
            {
                i = x+yw; k = i>>>stride;
                diff = (D[im[i  ]] & 1) | (D[im[i+1]] & 2) | (D[im[i+2]] & 4);
                while ( x<=xmax && !diff && !(labeled[k>>>5]&(1<<(k&31))) )
                {
                    labeled[k>>>5] |= 1<<(k&31);
                    xM = max(xM, x);
                    x+=dx; i = x+yw; k = i>>>stride;
                    diff = (D[im[i  ]] & 1) | (D[im[i+1]] & 2) | (D[im[i+2]] & 4);
                }
                if ( yw+dy >= ymin && yw+dy <= ymax)
                {
                    //stack[slen++]=[yw, l, x-4, dy];
                    stack[slen  ]=yw;
                    stack[slen+1]=l;
                    stack[slen+2]=x-dx;
                    stack[slen+3]=dy;
                    slen += 4;
                }
                if ( x > x2+dx ) 
                {
                    if ( yw-dy >= ymin && yw-dy <= ymax)
                    {
                        //stack[slen++]=[yw, x2+4, x-4, -dy];	/* leak on right? */
                        stack[slen  ]=yw;
                        stack[slen+1]=x2+dx;
                        stack[slen+2]=x-dx;
                        stack[slen+3]=-dy;
                        slen += 4;
                    }
                }
        /*skip:*/
                i = x+yw; k = i>>>stride;
                diff = (D[im[i  ]] & 1) | (D[im[i+1]] & 2) | (D[im[i+2]] & 4);
                while ( x<=x2 && (diff || (labeled[k>>>5]&(1<<(k&31)))) ) 
                {
                    x+=dx;
                    i = x+yw; k = i>>>stride;
                    diff = (D[im[i  ]] & 1) | (D[im[i+1]] & 2) | (D[im[i+2]] & 4);
                }
                l = x;
                notdone = (x <= x2);
            }
        }
    }
    else
    {
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
            for (x=x1; x>=xmin; x-=dx)
            {
                i = x+yw; k = i;
                if ( !(D[im[i]] & 1) && !(labeled[k>>>5]&(1<<(k&31))) )
                {
                    labeled[k>>>5] |= 1<<(k&31);
                    xm = min(xm, x);
                }
                else break;
            }
            
            if ( x >= x1 ) 
            {
                // goto skip:
                i = x+yw; k = i;
                while ( x<=x2 && ((D[im[i]] & 1) || (labeled[k>>>5]&(1<<(k&31)))) )
                {
                    x+=dx;
                    i = x+yw; k = i;
                }
                l = x;
                notdone = (x <= x2);
            }
            else
            {
                l = x+dx;
                if ( l < x1 ) 
                {
                    if ( yw >= ymin+dy && yw <= ymax+dy )
                    {
                        //stack[slen++]=[yw, l, x1-4, -dy];  /* leak on left? */
                        stack[slen  ]=yw;
                        stack[slen+1]=l;
                        stack[slen+2]=x1-dx;
                        stack[slen+3]=-dy;
                        slen += 4;
                    }
                }
                x = x1+dx;
                notdone = true;
            }
            
            while ( notdone ) 
            {
                i = x+yw; k = i;
                while ( x<=xmax && !(D[im[i]] & 1) && !(labeled[k>>>5]&(1<<(k&31))) )
                {
                    labeled[k>>>5] |= 1<<(k&31);
                    xM = max(xM, x);
                    x+=dx; i = x+yw; k = i;
                }
                if ( yw+dy >= ymin && yw+dy <= ymax)
                {
                    //stack[slen++]=[yw, l, x-4, dy];
                    stack[slen  ]=yw;
                    stack[slen+1]=l;
                    stack[slen+2]=x-dx;
                    stack[slen+3]=dy;
                    slen += 4;
                }
                if ( x > x2+dx ) 
                {
                    if ( yw-dy >= ymin && yw-dy <= ymax)
                    {
                        //stack[slen++]=[yw, x2+4, x-4, -dy];	/* leak on right? */
                        stack[slen  ]=yw;
                        stack[slen+1]=x2+dx;
                        stack[slen+2]=x-dx;
                        stack[slen+3]=-dy;
                        slen += 4;
                    }
                }
        /*skip:*/
                i = x+yw; k = i;
                while ( x<=x2 && ((D[im[i]] & 1) || (labeled[k>>>5]&(1<<(k&31)))) ) 
                {
                    x+=dx;
                    i = x+yw; k = i;
                }
                l = x;
                notdone = (x <= x2);
            }
        }
    }
    return { mask: labeled, box: [xm, ym, xM, yM] };
}
FILTER.MachineLearning.connected_components = connected_components;
FILTER.MachineLearning.connected_region = FILTER.MachineLearning.flood_region = flood_region;

}(FILTER);