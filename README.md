# Portafolio personal · Carolina Cisneros Arroyo

Portafolio full stack basado en el [sitio original](https://github.com/karciss/Portafolio_personal). Conserva la paleta violeta y verde, y transforma las páginas estáticas en una experiencia Vue con proyectos cargados desde una API y mensajes guardados en SQLite. El código original permanece en el historial Git; la copia local `legacy/` se ignora para evitar publicar otra vez datos personales que aparecían en el currículum anterior.

## Tecnologías

| Capa | Tecnología | Función |
| --- | --- | --- |
| Frontend | Vue 3 + Vite | Interfaz responsive, filtros, modal y formulario |
| Backend | Express 5 | API REST y archivos de producción |
| Base de datos | SQLite mediante `sql.js` | Proyectos y mensajes persistidos en un volumen Docker |
| Pruebas | Node Test Runner + Playwright | 4 unitarias, 5 de integración y 3 E2E |
| Entrega | Docker, GitHub Actions, Terraform, Ansible, Caddy | Imagen, VM OCI, configuración y HTTPS opcional |

## Ejecutar localmente

Requiere Node.js 24 y npm. Desde la raíz del proyecto:

```bash
npm ci
npm run build
npm start
```

Abre `http://localhost:3000`. La API se encuentra en `/api/projects`, `/api/contact` y `/api/health`. Los mensajes se guardan en `data/portfolio.sqlite`; no se envían por correo. Para desarrollar con recarga automática, usa `npm run dev:api` y `npm run dev` en dos terminales y abre `http://localhost:5173`.

### Pruebas

```bash
npm run test:unit
npm run test:integration
npm run build
npx playwright install chromium
npm run test:e2e
```

El flujo **Pruebas automatizadas** ejecuta todo esto en cada push a `dev` y en cada PR hacia `dev` o `main`. El flujo **Publicación del portafolio** vuelve a ejecutar las pruebas en cada push a `main` antes de publicar y desplegar. Los nombres de los flujos, pasos y commits están en español.

## Docker

Con Docker Desktop o Docker Engine activo:

```bash
docker compose up --build -d
```

El sitio queda en `http://localhost`. Si el puerto 80 está ocupado, define `HTTP_PORT=8080` y `HTTPS_PORT=8443` antes de `docker compose up --build -d` y abre `http://localhost:8080`. Caddy sirve como proxy; el contenedor Express no publica su puerto directamente. El volumen `portfolio_data` conserva la base de datos al reemplazar la imagen. Para inspeccionar el estado: `docker compose ps` y `docker compose logs -f`.

## Infraestructura OCI

`infra/` usa Terraform >= 1.12 y el proveedor oficial de Oracle para crear una **VCN**, gateway de Internet, tabla de rutas, subred pública, lista de seguridad y VM Ubuntu **24.04** con IP pública. Se conserva el patrón de los ejemplos locales de OCI. La imagen se selecciona por sistema operativo y shape; para fijar una versión exacta, define `image_ocid`. La VM usa por defecto `VM.Standard.E3.Flex`, 1 OCPU y 8 GB; revisa cuota y posibles cargos en tu cuenta antes de aplicar.

El estado de Terraform se guarda en un bucket de OCI Object Storage mediante el backend nativo, que admite bloqueo. **Crea previamente** el bucket y habilita versionado. El usuario de OCI usado por Actions necesita permisos de gestión de red, Compute y objetos del bucket. No guardes claves ni archivos `.tfvars` reales en Git.

Para comprobar la sintaxis sin acceder a la nube:

```bash
terraform -chdir=infra fmt -check
terraform -chdir=infra init -backend=false
terraform -chdir=infra validate
```

`infra/terraform.example.tfvars` documenta las variables necesarias. En el despliegue, Actions limita el acceso SSH a la IP pública temporal del runner; los puertos 80 y 443 quedan públicos. Ansible instala Docker Engine, Docker Compose, Git, UFW e iptables, despliega los contenedores y persiste las reglas del firewall.

### Configuración de GitHub Actions

En **Settings → Secrets and variables → Actions**, configura:

| Tipo | Nombre | Valor |
| --- | --- | --- |
| Secret | `DOCKERHUB_USERNAME` | Usuario de Docker Hub |
| Secret | `DOCKERHUB_TOKEN` | Token de acceso de Docker Hub |
| Secret | `OCI_TENANCY_OCID` | OCID del tenancy |
| Secret | `OCI_USER_OCID` | OCID del usuario de API |
| Secret | `OCI_FINGERPRINT` | Fingerprint de la clave API |
| Secret | `OCI_COMPARTMENT_OCID` | Compartment de la VM y red |
| Secret | `OCI_PRIVATE_KEY` | Contenido completo de la clave privada OCI PEM |
| Secret | `VM_SSH_PUBLIC_KEY` | Clave SSH pública para `ubuntu` |
| Secret | `VM_SSH_PRIVATE_KEY` | Clave SSH privada correspondiente |
| Variable | `OCI_REGION` | Región OCI, por ejemplo `sa-santiago-1` |
| Variable | `OCI_STATE_BUCKET` | Nombre del bucket de estado, creado previamente |
| Variable | `OCI_NAMESPACE` | Namespace de Object Storage |

La imagen ya está publicada en [Docker Hub como `karitoziss/carolina-portfolio`](https://hub.docker.com/r/karitoziss/carolina-portfolio). El flujo publica las etiquetas `latest` y `<SHA del commit>`, aplica Terraform y usa Ansible para descargar esa imagen exacta. Configura los secretos antes de enviar el primer commit a `main`; si falta alguno, el flujo falla con un mensaje claro.

### Dominio en Cloudflare (opcional)

Para el punto extra, usa un **dominio que ya controles** en Cloudflare y añade `CLOUDFLARE_API_TOKEN` como secret, además de `CLOUDFLARE_ZONE_ID` y `SITE_DOMAIN` como variables. El token necesita permiso **DNS:Edit** solo sobre esa zona. El flujo crea o actualiza el registro A hacia la IP de la VM. Caddy solicita el certificado TLS automáticamente y atiende por HTTPS. Si no configuras dominio, el sitio funciona por HTTP en la IP pública. El script no compra ni registra un dominio nuevo.

## Estructura

```text
src/                 Interfaz Vue y estilos
server/              API Express y acceso SQLite
tests/               Pruebas unitarias, integración y E2E
.github/workflows/    Validación dev y despliegue main
infra/               Terraform para OCI
ansible/             Configuración de Ubuntu y despliegue
scripts/             DNS opcional de Cloudflare
Dockerfile            Imagen de producción
compose.yaml          Aplicación, Caddy y volúmenes
```

## Ramas y commits

Trabaja en `dev` y confirma las pruebas automáticas. Integra en `main` cuando el sitio y la infraestructura estén listos para publicarse. Usa mensajes descriptivos en español, por ejemplo `Crear interfaz Vue y API de proyectos` y `Configurar despliegue OCI con Ansible`.
