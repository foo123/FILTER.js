#!/usr/bin/env python

###########################################################################
#
# Build and Compress Javascript Packages using Closure Compiler (Nikos M.)
#
###########################################################################

try:
    import argparse
    ap = 1
except ImportError:
    import optparse
    ap = 0

import os
import tempfile
import sys

def openFile(file, op, enc=False):
    if enc:
        f = open(file, op, encoding=enc)
    else:
        f = open(file, op)
    return f

def openFileDescriptor(file, op, enc=False):
    if enc:
        fh = os.fdopen(file, op, encoding=enc)
    else:
        fh = os.fdopen(file, op)
    return fh

def parseSettings(deps_file, enc=False):
    deps = []
    out = []
    opts = []
    minify=False
    buffer = deps

    f=openFile(deps_file, 'r', enc)
    lines=f.readlines()
    f.close()
    
    for line in lines:
        line=line.strip().replace('\n', '').replace('\r', '')
        if line.startswith('#') or ''==line: # comment or empty line
            continue
        if line.startswith('@'):
            if line.startswith('@MINIFY'): # minify compiler option
                buffer=opts
                minify=True
                continue
            elif line.startswith('@DEPENDENCIES'): # list of dependencies files option
                buffer=deps
                continue
            elif line.startswith('@OUT'): # output file option
                buffer=out
                continue
            else: # unknown option
                continue
        buffer.append(line)
    
    return [out[0], deps, minify, "".join(opts)]

def mergeFiles(files, enc=False):

    buffer = []

    for filename in files:
        f = openFile(os.path.join('..', 'src', filename), 'r', enc)
        buffer.append(f.read())
        f.close()

    return "".join(buffer)


def output(text, filename, enc=False):

    f = openFile(os.path.join('..', 'build', filename), 'w', enc)
    f.write(text)
    f.close()


def compress(text, opts='', enc=False):

    in_tuple = tempfile.mkstemp()
    handle = openFileDescriptor(in_tuple[0], 'w', enc)
    handle.write(text)
    handle.close()
    
    out_tuple = tempfile.mkstemp()

    os.system("java -jar compiler/compiler.jar %s --js %s --js_output_file %s" % (opts, in_tuple[1], out_tuple[1]))

    handle = openFileDescriptor(out_tuple[0], 'r', enc)
    compressed = handle.read()
    handle.close()
    
    os.unlink(in_tuple[1])
    os.unlink(out_tuple[1])

    return compressed


def makeDebug(text):
    position = 0
    while True:
        position = text.find("/* DEBUG", position)
        if position == -1:
            break
        text = text[0:position] + text[position+8:]
        position = text.find("*/", position)
        text = text[0:position] + text[position+2:]
    return text


def buildLib(filename, files, minified=False, opts='', enc=False):

    text = mergeFiles(files, enc)
    folder = ''

    if minified:
        print ("=" * 50)
        print ("Compiling and Minifying", filename)
        print ("=" * 50)
    else:
        print ("=" * 50)
        print ("Compiling", filename)
        print ("=" * 50)

    if minified:
        text = compress(text, opts, enc)
    
    header = ''
    headerfile=os.path.join('..', 'src', 'header')
    if os.path.isfile(headerfile):
        buffer = []
        f = openFile(headerfile, 'r', enc)
        buffer.append(f.read())
        f.close()
        header = "".join(buffer)
    
    output(header + text, folder + filename, enc)


def parseArgs():
    if ap:
        parser = argparse.ArgumentParser(description='Build and Compress Javascript Packages using Closure Compiler')
        parser.add_argument('--deps', help='Dependencies file (REQUIRED)', metavar="FILE")
        parser.add_argument('-enc', help='set encoding', default=False)
        args = parser.parse_args()

    else:
        parser = optparse.OptionParser(description='Build and Compress Javascript Packages using Closure Compiler')
        parser.add_option('--deps', help='Dependencies file (REQUIRED)', metavar="FILE")
        parser.add_option('--enc', dest='enc', help='set encoding', default=False)
        args, remainder = parser.parse_args()

    # If no arguments have been passed, show the help message and exit
    if len(sys.argv) == 1:
        parser.print_help()
        sys.exit(1)
    
    # Ensure variable is defined
    try:
        args.deps
    except NameError:
        args.deps = None

    # If no dependencies have been passed, show the help message and exit
    if None == args.deps:
        parser.print_help()
        sys.exit(1)
    
    return args


def main(argv=None):

    args = parseArgs()
    (outfile, infiles, minify, compile_opts)=parseSettings(args.deps, args.enc)
    config = [
    [outfile, infiles, minify, compile_opts]
    ]

    for fname_lib, files, do_minified, lib_compile_opts in config:
        buildLib(fname_lib, files, do_minified, lib_compile_opts, args.enc)

if __name__ == "__main__":
    main()
