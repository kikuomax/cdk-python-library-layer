# -*- coding: utf-8 -*-

"""Example library to be packaged as a Lambda layer.
"""

VERSION = '0.0.1'

def get_information():
    """Returns a silly ``dict`` object.
    """
    return {
        'version': VERSION,
        'description': 'This is an example module to test PythonLibraryLayer',
    }
