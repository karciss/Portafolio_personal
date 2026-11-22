output "public_ip" {
  description = "IP pública de la VM Ubuntu 24.04."
  value       = oci_core_instance.portfolio.public_ip
}

output "public_url" {
  description = "URL HTTP disponible sin dominio."
  value       = "http://${oci_core_instance.portfolio.public_ip}"
}

output "vcn_id" {
  value = oci_core_vcn.portfolio.id
}

output "subnet_id" {
  value = oci_core_subnet.public.id
}
