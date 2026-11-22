variable "region" {
  description = "Región OCI, por ejemplo sa-santiago-1."
  type        = string
}

variable "tenancy_ocid" {
  description = "OCID del tenancy para consultar dominios de disponibilidad."
  type        = string
}

variable "compartment_ocid" {
  description = "OCID del compartment donde crear la infraestructura."
  type        = string
}

variable "ssh_public_key" {
  description = "Clave pública SSH para el usuario ubuntu."
  type        = string
}

variable "ssh_allowed_cidr" {
  description = "CIDR autorizado para SSH. En Actions se usa la IP del runner /32."
  type        = string
  validation {
    condition     = can(cidrhost(var.ssh_allowed_cidr, 0))
    error_message = "Escribe un CIDR válido, por ejemplo 203.0.113.10/32."
  }
}

variable "instance_shape" {
  description = "Shape OCI para la VM Ubuntu."
  type        = string
  default     = "VM.Standard.E5.Flex"
}

variable "ocpus" {
  description = "Número de OCPU de la VM."
  type        = number
  default     = 1
}

variable "memory_gb" {
  description = "Memoria RAM de la VM en GB."
  type        = number
  default     = 4
}

variable "baseline_ocpu_utilization" {
  description = "Línea base de CPU para instancias E4 burstable; BASELINE_1_8 equivale a 12,5 %."
  type        = string
  default     = "BASELINE_1_8"
}

variable "image_ocid" {
  description = "OCID opcional de una imagen Ubuntu 24.04 fija. Vacío usa la imagen más reciente compatible."
  type        = string
  default     = ""
}
