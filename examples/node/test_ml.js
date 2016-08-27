"use strict";

function echo( o )
{
    console.log(o||"");
}
function fmt_num( n, digits )
{
    return 0 > n ? String(n.toPrecision(digits||5)) : " "+String(n.toPrecision(digits||5));
}
function fmt_matrix( m, rows, cols )
{
    var s = "", i, j, k;
    if ( m[0].push )
    {
        for(i=0; i<rows; i++)
        {
            for(j=0; j<cols; j++) s += fmt_num(m[i][j]) + "  ";
            s += "\n";
        }
    }
    else
    {
        for(i=0,k=0; i<rows; i++,k+=cols)
        {
            for(j=0; j<cols; j++) s += fmt_num(m[k+j]) + "  ";
            s += "\n";
        }
    }
    s += "\n";
    return s;
}

var F = require('../../build/filter.bundle.js'),
    SVD = F.MachineLearning.svd, ERR = F.MachineLearning.svd_err,
    array_copy = F.Util.Array.copy, array_transpose = F.Util.Array.transpose;

var matrix1 = [
[1,0,0,0],
[0,0,0,2],
[0,3,0,0],
[0,0,0,0],
[2,0,0,0]
];

/*echo(fmt_matrix(matrix1, 5, 4));
echo(fmt_matrix(array_copy( new Float32Array( 20 ), 5, 4, matrix1, 5, 4 ), 5, 4));
echo(fmt_matrix(array_transpose( new Float32Array( 20 ), matrix1, 5, 4 ), 4, 5));
return;*/

var svd1 = SVD(matrix1, 5, 4);
echo("M");
echo(fmt_matrix(matrix1, 5, 4));
echo("S");
echo(fmt_matrix(svd1[0], 1, 5));
echo("U");
echo(fmt_matrix(svd1[1], 5, 4));
echo("V");
echo(fmt_matrix(svd1[2], 4, 4));
echo( "Max|M - U*S*V'| = " + ERR(0, 5, 4, matrix1, svd1[0], svd1[1], svd1[2]) );
echo("\n\n");

var matrix2 = [
[1,0,0,0,2],
[0,0,3,0,0],
[0,0,0,0,0],
[0,2,0,0,0]
];
var svd2 = SVD(matrix2, 4, 5);
echo("M");
echo(fmt_matrix(matrix2, 4, 5));
echo("S");
echo(fmt_matrix(svd2[0], 1, 5));
echo("U");
echo(fmt_matrix(svd2[1], 4, 4));
echo("V");
echo(fmt_matrix(svd2[2], 5, 4));
echo( "Max|M - U*S*V'| = " + ERR(0, 4, 5, matrix2, svd2[0], svd2[1], svd2[2]) );
echo("\n\n");

var matrix3 = [
[1,0,0,0,0],
[0,1,0,0,0],
[0,0,1,0,0],
[0,0,0,1,0],
[0,0,0,0,1]
];
var svd3 = SVD(matrix3, 5, 5);

echo("M");
echo(fmt_matrix(matrix3, 5, 5));
echo("S");
echo(fmt_matrix(svd3[0], 1, 5));
echo("U");
echo(fmt_matrix(svd3[1], 5, 5));
echo("V");
echo(fmt_matrix(svd3[2], 5, 5));
echo( "Max|M - U*S*V'| = " + ERR(0, 5, 5, matrix3, svd3[0], svd3[1], svd3[2]) );
