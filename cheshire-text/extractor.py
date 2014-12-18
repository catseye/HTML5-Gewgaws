import os
import re

from bs4 import BeautifulSoup


soup = BeautifulSoup(open('index.html', 'r').read())

paras = [p for p in soup.find_all('p')]

for p in paras:
    s = ''.join(p.strings)
    s = s.replace('\n', ' ');

    print (u'"%s",' % s).encode('UTF-8')
