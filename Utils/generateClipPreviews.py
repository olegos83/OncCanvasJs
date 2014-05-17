#!/usr/bin/python

import os, pipes

# Convert images with imagemagick
def convertImage(source, dest):
    "Convert source to dest with imagemagick"
    print "Converting", source, "to", dest
    
    cmd = "convert -flatten -strip -channel RGBA -background none -resize 200 " + pipes.quote(source) + " " + pipes.quote(dest)
    os.system(cmd)
    
    return

# Category items iteration and processing
def parseCat(cat):
    "Iterate over category items and process them"
    print "Entering category:", cat
    items = os.listdir(cat)
    
    dest = cat.replace('repo', 'preview', 1)
    os.mkdir(dest, 0755)
    print "Preview dir created:", dest
    
    for item in items:
        item = cat + '/' + item
        
        if os.path.isdir(item): parseCat(item)
        if ".svg" in item: convertImage(item, item.replace('repo', 'preview', 1).replace('.svg', '.png'))
        if ".DS_Store" in item: print "Deleting '.DS_Store'"; os.unlink(item)
    
    print ""
    return

# Main code
print "Clipart preview generation\n"

repo = "./repo/"
categories = os.listdir(repo)

for cat in categories: parseCat(repo + cat)
print "Previews generated"
