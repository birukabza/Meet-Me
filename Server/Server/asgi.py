"""
ASGI config for Server project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

settings_to_use = "Server.deployment_settings" if 'RENDER_EXTERNAL_HOSTNAME' in os.environ else "Server.settings"

os.environ.setdefault("DJANGO_SETTINGS_MODULE", settings_to_use)

application = get_asgi_application()
