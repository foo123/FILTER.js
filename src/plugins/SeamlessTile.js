/**
*
* Seamless Tile Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

// a plugin to create a seamless tileable pattern from an image
// adapted from: http://www.blitzbasic.com/Community/posts.php?topic=43846
FILTER.Create({
    name: "SeamlessTileFilter"
    
    ,type: 0 // 0 radial, 1 linear 1, 2 linear 2
    
    // constructor
    ,init: function( tiling_type ) {
        var self = this;
        self.type = tiling_type || 0;
    }
    
    // support worker serialize/unserialize interface
    ,path: FILTER.getPath( ModuleFactory__FILTER_PLUGINS.moduleUri )
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                type: self.type
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.type = params.type;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    // adapted from: http://www.blitzbasic.com/Community/posts.php?topic=43846
    ,apply: function(im, w, h/*, image*/) {
        // im is a copy of the image data as an image array
        // w is image width, h is image height
        // image is the original image instance reference, generally not needed
        var self = this, masktype = self.type,
            //needed arrays
            diagonal, tile, mask, a1, a2, a3, d, i, j, k, 
            index, N, N2, size, imSize;

        //find largest side of the image
        //and resize the image to become square
        if ( w !== h ) im = FILTER.Image.resize( im, w, h, N = w > h ? w : h, N );
        else  N = w; 
        N2 = Math.round(N/2);
        size = N*N; imSize = im.length;
        diagonal = new FILTER.ImArray(imSize);
        tile = new FILTER.ImArray(imSize);
        mask = new FILTER.Array8U(size);

        i = 0; j = 0;
        for (k=0; k<imSize; k+=4,i++)
        {
            if ( i >= N ) {i=0; j++;}
            index = ((i+N2)%N + ((j+N2)%N)*N)<<2;
            diagonal[ index   ] = im[ k ];
            diagonal[ index+1 ] = im[ k+1 ];
            diagonal[ index+2 ] = im[ k+2 ];
            diagonal[ index+3 ] = im[ k+3 ];
        }

        //try to make your own masktypes here
        //Create the mask
        for (i=0; i<=N2-1; i++)
        {
            for (j=0; j<=N2-1; j++)
            {
                switch(masktype)
                {
                    case 0://RADIAL
                    d = Math.sqrt((i-N2)*(i-N2) + (j-N2)*(j-N2)) / N2;
                    break;

                    case 1://LINEAR 1
                    if ( (N2-i) < (N2-j) )
                        d = (j-N2)/N2;

                    else //if ( (N2-i) >= (N2-j) )
                        d = (i-N/2)/N2;
                    break;

                    case 2://LINEAR 2
                    default:
                    if ( (N2-i) < (N2-j) )
                        d = Math.sqrt((j-N)*(j-N) + (i-N)*(i-N)) / (1.13*N);

                    else //if ( (N2-i)>=(N2-j) )
                        d = Math.sqrt((i-N)*(i-N) + (j-N)*(j-N)) / (1.13*N);
                    break;
                }
                //Scale d To range from 1 To 255
                d = 255 - (255 * d);
                if (d < 1) d = 1;
                else if (d > 255) d = 255;

                //Form the mask in Each quadrant
                mask [i     + j*N      ] = d;
                mask [i     + (N-1-j)*N] = d;
                mask [N-1-i + j*N      ] = d;
                mask [N-1-i + (N-1-j)*N] = d;
            }
        }

        //Create the tile
        for (j=0; j<=N-1; j++)
        {
            for (i=0; i<=N-1; i++)
            {
                index = i+j*N;
                a1 = mask[index]; a2 = mask[(i+N2) % N + ((j+N2) % N)*N];
                a3 = a1+a2; a1 /= a3; a2 /= a3; index <<= 2;
                tile[index  ] = ~~(a1*im[index]   + a2*diagonal[index]);
                tile[index+1] = ~~(a1*im[index+1] + a2*diagonal[index+1]);
                tile[index+2] = ~~(a1*im[index+2] + a2*diagonal[index+2]);
                tile[index+3] = im[index+3];
            }
        }

        //create the new tileable image
        //if it wasn't a square image, resize it back to the original scale
        if ( w !== h ) tile = FILTER.Image.resize( tile, N, N, w, h );

        // return the new image data
        return tile;
    }
});

}(FILTER);