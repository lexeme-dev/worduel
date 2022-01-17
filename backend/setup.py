#!/usr/bin/env python

from setuptools import setup

setup(name='BattleWord',
      version='0.1.0',
      description='1v1 Wordle-style game',
      author='Faiz Surani and Varun Iyer',
      url='https://battleword.faizsurani.com',
      packages=['battleword'],
      install_requires=['flask', 'orjson', 'flask-cors', 'pytest'],
      include_package_data=True,
      zip_safe=False
      )
