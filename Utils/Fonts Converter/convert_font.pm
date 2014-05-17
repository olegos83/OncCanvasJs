#!/usr/bin/perl
use strict;
binmode(STDOUT, ":utf8");

#Convert ttf font to js format for drawing text on canvas as vector.
#Usage: ./convert_font ttf_file

#Js file name is constructed automatically - js folder must exist to store converted file.
#Needs some modules to be installed, it can be done using command line:

#cpan Font::FreeType; //can fail with cpan, so try sudo apt-get install libfont-freetype-perl
#cpan Font::TTF::Font;
#cpan JSON::XS;
#cpan Unicode::UCD; //can be installed allready

#import font lib
use Font::TypefaceJS;

#test command line arguments
if (scalar @ARGV < 1) { die "ERROR: ttf file is not specified\n"; }

#init chartables and load font data
#my @chartabs = ('Letterlike Symbols', 'Mathematical Operators', 'Currency Symbols', 'Cyrillic', 'Basic Latin', 'General Punctuation');
my @chartabs = ('Letterlike Symbols', 'Mathematical Operators', 'Currency Symbols', 'Basic Latin', 'General Punctuation');
my $typeface = Font::TypefaceJS->new(input_filename => $ARGV[0], export_unicode_range_names => \@chartabs);

#go through char tables and print their chars
print "Scanning character tables\n\n";

foreach my $chtab (@chartabs) {
	print "$chtab\n";
	my $arr = $typeface->{unicode_ranges}{$chtab}{characters};
	if (length $arr) { print "@$arr\n\n"; } else { print "not found\n\n"; }
}

#set up JS filename
my $js_file_name = 'js/'.$typeface->{js_name};

#print config string
my $js_cfg_str = $typeface->{js_cfg_str};
print "$js_cfg_str\n";

#write JS font file
$typeface->write_file(output_filename => $js_file_name);
print "File $js_file_name successfuly written\n\n";
