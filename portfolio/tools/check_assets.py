#!/usr/bin/env python3
import json,re
from pathlib import Path
from urllib.parse import urlsplit
ROOT=Path(__file__).resolve().parents[1]
mapping=json.loads((ROOT/'url-map.json').read_text())
sources=json.loads((ROOT/'tools/source-map.json').read_text())
graph=json.loads((ROOT/'tools/module-graph.json').read_text())
stub=mapping['https://framer.com/edit/init.mjs']
reachable=set();pending=[mapping[u] for u in mapping if 'script_main.' in u]
while pending:
    node=pending.pop()
    if node in reachable:continue
    reachable.add(node)
    if node==stub:continue
    for edge in graph:
        if edge['source']==node:
            assert 'missing' not in edge,edge
            pending.append(edge['target'])
assert all((ROOT/p).is_file() for p in mapping.values())
references={}
for u,p in sources.items():
    if p.endswith(('.html','.mjs','.css','.json')) and '/cms/' not in u:
        for value in re.findall(r'https?://[^\s"\'<>`\\)]+',(ROOT/'captured'/p).read_text(errors='replace')):
            references.setdefault(value,set()).add(u)
inventory={u:{'mapped':u in mapping,'sources':sorted(v)} for u,v in sorted(references.items())}
(ROOT/'tools/external-reference-inventory.json').write_text(json.dumps(inventory,indent=2))
missing={u:{'reason':'Unused editor UI reference; editor initializer is stubbed.','sources':sorted(v)} for u,v in references.items() if u not in mapping and re.search(r'\.(woff2|png|jpg|svg|mp4|mjs|css|json)$',u)}
(ROOT/'tools/referenced-but-missing.json').write_text(json.dumps(missing,indent=2))
print(f'{len(mapping)} mapped URLs; {len(reachable)} reachable modules resolve; {len(missing)} unused editor asset references remain.')
