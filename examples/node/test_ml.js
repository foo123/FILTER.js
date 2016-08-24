"use strict";

function echo( o )
{
    console.log(o||"");
}
function fmt_num( n, digits )
{
    return 0 > n ? String(n.toPrecision(digits||5)) : " "+String(n.toPrecision(digits||5));
}
function fmt_matrix( m )
{
    var s = "", i, j, rows, cols;
    if ( m[0].push )
    {
        for(i=0,rows=m.length,s; i<rows; i++)
        {
            for(s+="| ",j=0,cols=m[i].length; j<cols; j++) s += " " + fmt_num(m[i][j]);
            s += "\n";
        }
    }
    else
    {
        for(i=0,rows=m.length,s; i<rows; i++)
        {
            s += " " + fmt_num(m[i]);
        }
        s = "[ "+s+" ]";
    }
    s += "\n";
    return s;
}

var F = require('../../build/filter.bundle.js'), SVD = F.MachineLearning.svd;

var matrix1 = [
[1,0,0,0],
[0,0,0,2],
[0,3,0,0],
[0,0,0,0],
[2,0,0,0]
];
var svd1 = SVD(matrix1, 5, 4);
echo("matrix");
echo(fmt_matrix(matrix1));
echo("S");
echo(fmt_matrix(svd1[0]));
echo("U");
echo(fmt_matrix(svd1[1]));
echo("V");
echo(fmt_matrix(svd1[2]));

echo("\n\n");

var matrix2 = [
[1,0,0,0,0],
[0,1,0,0,0],
[0,0,1,0,0],
[0,0,0,1,0],
[0,0,0,0,1]
];
var svd2 = SVD(matrix2, 5, 5);

echo("matrix");
echo(fmt_matrix(matrix2));
echo("S");
echo(fmt_matrix(svd2[0]));
echo("U");
echo(fmt_matrix(svd2[1]));
echo("V");
echo(fmt_matrix(svd2[2]));
