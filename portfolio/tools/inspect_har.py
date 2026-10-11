#!/usr/bin/env python3
import argparse, collections, json
from pathlib import Path
from urllib.parse import urlsplit

def inspect(path):
    entries = json.loads(Path(path).read_text())['log']['entries']
    groups = collections.Counter()
    problems = []
    for i, e in enumerate(entries):
        r, c = e['response'], e['response'].get('content', {})
        body = 'missing' if 'text' not in c else ('empty' if not c['text'] else ('base64' if c.get('encoding') == 'base64' else 'present'))
        url = e['request']['url']
        mime = c.get('mimeType', '')
        groups[(urlsplit(url).netloc, mime, body)] += 1
        print(f"{i:04d}\t{e['request']['method']}\t{r['status']}\t{mime}\t{c.get('size', '?')}\t{body}\t{url}")
        if r['status'] in (0, 206, 304) or body in ('missing', 'empty'):
            problems.append({'entry': i, 'url': url, 'status': r['status'], 'body': body})
    print('\nSUMMARY host / mime / body / count')
    for key, count in sorted(groups.items()):
        print(*key, count, sep='\t')
    for i,e in enumerate(entries):
        c=e['response'].get('content',{})
        if '.framercms' in e['request']['url'] and c.get('encoding')!='base64':
            print(f"CMS binary stored as text: entry {i}, advertised {c.get('size')} bytes, UTF-8 body {len(c.get('text','').encode())} bytes, replacement characters {c.get('text','').count(chr(0xfffd))}")
    print(f'\nENTRIES {len(entries)}; INCOMPLETE/EMPTY {len(problems)}')
    print(json.dumps(problems, indent=2))
    return problems

if __name__ == '__main__':
    p = argparse.ArgumentParser()
    p.add_argument('har', nargs='?', default='arjuna.framer.media.har')
    inspect(p.parse_args().har)
