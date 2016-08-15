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
    
    ,type: 2 // 0 radial, 1 linear 1, 2 linear 2
    
    // constructor
    ,init: function( mode ) {
        var self = this;
        self.type = null == mode ? 2 : (mode||0);
    }
    
    // support worker serialize/unserialize interface
    ,path: FILTER_PLUGINS_PATH
    
    ,serialize: function( ) {
        var self = this;
        return {
            type: self.type
        };
    }
    
    ,unserialize: function( params ) {
        var self = this;
        self.type = params.type;
        return self;
    }
    
    // this is the filter actual apply method routine
    // adapted from: http://www.blitzbasic.com/Community/posts.php?topic=43846
    ,apply: function(im, w, h) {
        var self = this, masktype = self.type,
            resize = FILTER.Interpolation.bilinear,
            IMG = FILTER.ImArray, A8U = FILTER.Array8U,
            //needed arrays
            diagonal, tile, mask, a1, a2, a3, d, i, j, k, 
            index, N, N2, size, imSize, sqrt = Math.sqrt;

        //find largest side of the image
        //and resize the image to become square
        if ( w !== h ) im = resize( im, w, h, N = w > h ? w : h, N );
        else  N = w; 
        N2 = Math.round(N/2);
        size = N*N; imSize = im.length;
        diagonal = new IMG(imSize);
        tile = new IMG(imSize);
        mask = new A8U(size);

        for (i=0,j=0,k=0; k<imSize; k+=4,i++)
        {
            if ( i >= N ) {i=0; j++;}
            index = ((i+N2)%N + ((j+N2)%N)*N)<<2;
            diagonal[index  ] = im[k  ];
            diagonal[index+1] = im[k+1];
            diagonal[index+2] = im[k+2];
            diagonal[index+3] = im[k+3];
        }

        //try to make your own masktypes here
        if ( 0 === masktype ) //RADIAL
        {
            //Create the mask
            for (i=0,j=0; i<N2; j++)
            {
                if ( j >= N2 ) { j=0; i++; }
                
                //Scale d To range from 1 To 255
                d = 255 - (255 * sqrt((i-N2)*(i-N2) + (j-N2)*(j-N2)) / N2);
                d = d < 1 ? 1 : (d > 255 ? 255 : d);

                //Form the mask in Each quadrant
                mask [i     + j*N      ] = d;
                mask [i     + (N-1-j)*N] = d;
                mask [N-1-i + j*N      ] = d;
                mask [N-1-i + (N-1-j)*N] = d;
            }
        }
        else if ( 1 === masktype ) //LINEAR 1
        {
            //Create the mask
            for (i=0,j=0; i<N2; j++)
            {
                if ( j >= N2 ) { j=0; i++; }
                
                //Scale d To range from 1 To 255
                d = 255 - (255 * (N2+j < N2+i ? (j-N2)/N2 : (i-N/2)/N2));
                d = d < 1 ? 1 : (d > 255 ? 255 : d);

                //Form the mask in Each quadrant
                mask [i     + j*N      ] = d;
                mask [i     + (N-1-j)*N] = d;
                mask [N-1-i + j*N      ] = d;
                mask [N-1-i + (N-1-j)*N] = d;
            }
        }
        else //if ( 2 === masktype ) //LINEAR 2
        {
            //Create the mask
            for (i=0,j=0; i<N2; j++)
            {
                if ( j >= N2 ) { j=0; i++; }
                
                //Scale d To range from 1 To 255
                d = 255 - (255 * (N2+j < N2+i ? sqrt((j-N)*(j-N) + (i-N)*(i-N)) / (1.13*N) : sqrt((i-N)*(i-N) + (j-N)*(j-N)) / (1.13*N)));
                d = d < 1 ? 1 : (d > 255 ? 255 : d);

                //Form the mask in Each quadrant
                mask [i     + j*N      ] = d;
                mask [i     + (N-1-j)*N] = d;
                mask [N-1-i + j*N      ] = d;
                mask [N-1-i + (N-1-j)*N] = d;
            }
        }

        //Create the tile
        for (j=0,i=0; j<N; i++)
        {
            if ( i >= N ) {i=0; j++;}
            index = i+j*N;
            a1 = mask[index]; a2 = mask[(i+N2) % N + ((j+N2) % N)*N];
            a3 = a1+a2; a1 /= a3; a2 /= a3; index <<= 2;
            tile[index  ] = ~~(a1*im[index  ] + a2*diagonal[index  ]);
            tile[index+1] = ~~(a1*im[index+1] + a2*diagonal[index+1]);
            tile[index+2] = ~~(a1*im[index+2] + a2*diagonal[index+2]);
            tile[index+3] = im[index+3];
        }

        //create the new tileable image
        //if it wasn't a square image, resize it back to the original scale
        if ( w !== h ) tile = resize( tile, N, N, w, h );

        // return the new image data
        return tile;
    }
});

}(FILTER);