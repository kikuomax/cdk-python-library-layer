# -*- coding: utf-8 -*-

"""Example for PythonLibraryLayer.
"""

import libexample


def lambda_handler(event, context):
    """Returns the results of ``libexample.get_information``.
    """
    return libexample.get_information()
