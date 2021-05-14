#!/usr/bin/env python3

import json
from typing import List, NamedTuple
from sys import stderr

class Country(NamedTuple):
    code: str
    name: str


CodesList = List[Country]

with open('countries-covid-api.json', 'r+') as target_f,\
    open('countries-codes.json', 'r+') as codes_f:
    target_list: List[str] = json.loads(target_f.read())
    codes_list: CodesList = json.loads(codes_f.read())

    output_list: CodesList = []

    codes_names_map: List[str] = list(map(lambda x: x['name'], codes_list))
    for country in target_list:
        # normalize the country name
        c = country.replace('-', ' ').strip()
        if c not in codes_names_map:
            print(country, 'not in the list! you must add it manually', file=stderr)
            continue
        i = codes_names_map.index(c)

        output_list.append({
            'code': codes_list[i]['code'],
            'name': country
        })

    print(json.dumps(output_list, indent=4))
