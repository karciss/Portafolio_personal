"""Crea o actualiza el registro A de un dominio existente en Cloudflare."""
import json
import os
from urllib.parse import urlencode
from urllib.request import Request, urlopen

token = os.environ["CLOUDFLARE_API_TOKEN"]
zone_id = os.environ["CLOUDFLARE_ZONE_ID"]
domain = os.environ["SITE_DOMAIN"]
public_ip = os.environ["PUBLIC_IP"]
base = f"https://api.cloudflare.com/client/v4/zones/{zone_id}/dns_records"


def call(url, method="GET", payload=None):
    data = json.dumps(payload).encode() if payload is not None else None
    request = Request(url, data=data, method=method, headers={
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    })
    with urlopen(request, timeout=20) as response:
        result = json.load(response)
    if not result.get("success"):
        raise RuntimeError(f"Cloudflare rechazó la operación: {result.get('errors')}")
    return result["result"]


existing = call(f"{base}?{urlencode({'type': 'A', 'name': domain})}")
record = {"type": "A", "name": domain, "content": public_ip, "ttl": 1, "proxied": False}
if existing:
    call(f"{base}/{existing[0]['id']}", "PATCH", record)
    print(f"Registro A actualizado para {domain}")
else:
    call(base, "POST", record)
    print(f"Registro A creado para {domain}")
