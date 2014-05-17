#!/usr/bin/python

# Usage: ./generateFonts.py &> fntgen.txt
# Fonts must be in fnt folder and results will be stored in fntgen.txt file

import os, pipes

# Convert fonts in source folder
def convertFont(source):
    "Convert font to js format with perl converter"
    print "Converting", source

    cmd = "perl convert_font.pm " + pipes.quote(source)
    os.system(cmd)

    return

# Category items iteration and processing
def parseCat(cat):
    "Iterate over category items and process them"
    if os.path.isdir(cat):
		print "Entering category:", cat
		items = os.listdir(cat)

		for item in items:
			item = cat + '/' + item

			if os.path.isdir(item): parseCat(item)
			if ".ttf" in item or ".otf" in item or ".OTF" in item or ".TTF" in item: convertFont(item)

    print ""
    return

# Main code
print "Fonts generation\n"

repo = "./fnt/"
categories = os.listdir(repo)

for cat in categories: parseCat(repo + cat)
print "Fonts generated"
