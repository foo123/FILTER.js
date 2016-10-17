/**
*
* Filter Machine Learning Connected Components
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var A32I = FILTER.Array32I, A32U = FILTER.Array32U, A32F = FILTER.Array32F, A8U = FILTER.Array8U,
    ceil = Math.ceil, min = Math.min, max = Math.max, abs = Math.abs;

// adapted from http://xenia.media.mit.edu/~rahimi/connected/
function Label( x, y, root )
{
    var self = this;
    self.id = -1;
    self.root = root||self;
    /*self.x1 = x;
    self.y1 = y;
    self.x2 = x;
    self.y2 = y;*/
}
function root_of( label )
{
    while( label !== label.root )
    {
        /*label.root.x1 = min(label.root.x1, label.x1);
        label.root.y1 = min(label.root.y1, label.y1);
        label.root.x2 = max(label.root.x2, label.x2);
        label.root.y2 = max(label.root.y2, label.y2);*/
        label = label.root;
    }
    return label;
}
function merge( l1, l2 )
{
    l1 = root_of( l1 ); l2 = root_of( l2 );
    if ( l1 !== l2 )
    {
        l1.root = l2;
        /*l2.x1 = min(l2.x1, l1.x1);
        l2.y1 = min(l2.y1, l1.y1);
        l2.x2 = max(l2.x2, l1.x2);
        l2.y2 = max(l2.y2, l1.y2);*/
    }
}

// TODO: add bounding boxes, so it can be used as connected color/hue detector/tracker as well efficiently
function connected_components( output, w, h, stride, D, K, delta, V0, invert )
{
    stride = stride|0;
    var i, j, k, len = output.length, size = len>>>stride, K8_CONNECTIVITY = 8 === K,
        mylab, c, r, d, row, numlabels, label, background_label = null,
        need_match = null != V0, color, a, b;
    
    label = new Array(size);
    background_label = need_match ? new Label(0,0) : null;

    label[0] = need_match && (abs(D[0]-V0)>delta) ? background_label : new Label(0,0);

    // label the first row.
    for(c=1; c<w; c++)
        label[c] = need_match && (abs(D[c]-V0)>delta) ? background_label : (abs(D[c]-D[c-1])<=delta ? label[c-1] : new Label(c,0));

    // label subsequent rows.
    for(r=1,row=w; r<h; r++,row+=w)
    {
        // label the first pixel on this row.
        label[row] = need_match && (abs(D[row]-V0)>delta) ? background_label : (abs(D[row]-D[row-w])<=delta ? label[row-w] : new Label(0,r));

        // label subsequent pixels on this row.
        for(c=1; c<w; c++)
        {
            if ( need_match && (abs(D[row+c]-V0)>delta) )
            {
                label[row+c] = background_label;
                continue;
            }
            // inherit label from pixel on the left if we're in the same blob.
            mylab = background_label === label[row+c-1] ? null : (abs(D[row+c]-D[row+c-1])<=delta ? label[row+c-1] : null);

            //for(d=d0; d<1; d++)
            // full loop unrolling
            // if we're in the same blob, inherit value from above pixel.
            // if we've already been assigned, merge its label with ours.
            if( K8_CONNECTIVITY )
            {
                //d = -1;
                if( (background_label !== label[row-w+c-1/*+d*/]) && (abs(D[row+c]-D[row-w+c-1/*+d*/])<=delta) )
                {
                    if( null !== mylab ) merge(mylab, label[row-w+c-1/*+d*/]);
                    else mylab = label[row-w+c-1/*+d*/];
                }
            }
            //d = 0;
            if( (background_label !== label[row-w+c/*+d*/]) && (abs(D[row+c]-D[row-w+c/*+d*/])<=delta) )
            {
                if( null !== mylab ) merge(mylab, label[row-w+c/*+d*/]);
                else mylab = label[row-w+c/*+d*/];
            }
            
            if ( null !== mylab )
            {
                label[row+c] = mylab;
                /*mylab.root.x2 = max(mylab.root.x2,c);
                mylab.root.y2 = max(mylab.root.y2,r);*/
            }
            else
            {
                label[row+c] = new Label(c,r);
            }

            if( K8_CONNECTIVITY &&
                (background_label !== label[row+c-1]) && (background_label !== label[row-w+c]) && 
                (abs(D[row+c-1]-D[row-w+c])<=delta) )
                merge(label[row+c-1], label[row-w+c]);
        }
    }

    // relabel output
    for(c=0,numlabels=0; c<size; c++)
    {
        label[c] = root_of(label[c]);
        if ( 0 > label[c].id ) label[c].id = numlabels++;
    }
    if ( invert ) { a = -255; b = 255; }
    else { a = 255; b = 0; }
    if ( stride )
    {
        for(c=0,i=0; i<len; i+=4,c++)
        {
            color = (b+a*label[c].id/numlabels)|0;
            output[i] = output[i+1] = output[i+2] = color;
            //output[i+3] = output[i+3];
        }
    }
    else
    {
        for(c=0; c<len; c++)
        {
            color = (b+a*label[c].id/numlabels)|0;
            output[c] = color;
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