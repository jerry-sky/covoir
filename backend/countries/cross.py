#!/usr/bin/env python3

import json
from typing import List, NamedTuple
from sys import stderr


class Country(NamedTuple):
    '''
    A single element in the countries’ codes/names map.
    '''
    code: str
    name: str

# [Type] A list of map elements.
CodesList = List[Country]

with open('countries-covid-api.json', 'r+') as target_f,\
        open('countries-codes.json', 'r+') as codes_f:

    # load the COVID-19 API countries list
    target_list: List[str] = json.loads(target_f.read())
    # load a partially compatible (with the COVID-19 API) countries’ codes/names map
    codes_list: CodesList = json.loads(codes_f.read())

    # the target map
    output_list: CodesList = []

    # utility map for checking if given name is in the partically compatible list
    codes_names_map: List[str] = list(map(lambda x: x['name'], codes_list))
    for country in target_list:
        # normalize the country name
        c = country.replace('-', ' ').strip()
        if c not in codes_names_map:
            print(country, 'not in the list! you must add it manually', file=stderr)
            continue
        # otherwise add the country to the map
        i = codes_names_map.index(c)

        output_list.append({
            'code': codes_list[i]['code'],
            'name': country
        })

    # dump it to stdout
    print(json.dumps(output_list, indent=4))
