data "oci_identity_availability_domains" "available" {
  compartment_id = var.tenancy_ocid
}

data "oci_core_images" "ubuntu" {
  compartment_id           = var.compartment_ocid
  operating_system         = "Canonical Ubuntu"
  operating_system_version = "24.04"
  shape                    = var.instance_shape
  sort_by                  = "TIMECREATED"
  sort_order               = "DESC"
}

resource "oci_core_vcn" "portfolio" {
  compartment_id = var.compartment_ocid
  cidr_blocks    = ["10.70.0.0/16"]
  display_name   = "vcn-portafolio-carolina"
  dns_label      = "portafolio"
}

resource "oci_core_internet_gateway" "portfolio" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.portfolio.id
  display_name   = "igw-portafolio-carolina"
  enabled        = true
}

resource "oci_core_route_table" "public" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.portfolio.id
  display_name   = "rutas-publicas-portafolio"
  route_rules {
    network_entity_id = oci_core_internet_gateway.portfolio.id
    destination       = "0.0.0.0/0"
    destination_type  = "CIDR_BLOCK"
  }
}

resource "oci_core_security_list" "web" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.portfolio.id
  display_name   = "seguridad-web-portafolio"

  ingress_security_rules {
    protocol    = "6"
    source      = var.ssh_allowed_cidr
    source_type = "CIDR_BLOCK"
    description = "SSH solo desde el runner autorizado"
    tcp_options {
      min = 22
      max = 22
    }
  }
  ingress_security_rules {
    protocol    = "6"
    source      = "0.0.0.0/0"
    source_type = "CIDR_BLOCK"
    description = "HTTP"
    tcp_options {
      min = 80
      max = 80
    }
  }
  ingress_security_rules {
    protocol    = "6"
    source      = "0.0.0.0/0"
    source_type = "CIDR_BLOCK"
    description = "HTTPS"
    tcp_options {
      min = 443
      max = 443
    }
  }
  egress_security_rules {
    protocol         = "all"
    destination      = "0.0.0.0/0"
    destination_type = "CIDR_BLOCK"
  }
}

resource "oci_core_subnet" "public" {
  compartment_id             = var.compartment_ocid
  vcn_id                     = oci_core_vcn.portfolio.id
  cidr_block                 = "10.70.1.0/24"
  display_name               = "subred-publica-portafolio"
  dns_label                  = "web"
  route_table_id             = oci_core_route_table.public.id
  security_list_ids          = [oci_core_security_list.web.id]
  prohibit_public_ip_on_vnic = false
  prohibit_internet_ingress  = false
}

resource "oci_core_instance" "portfolio" {
  compartment_id      = var.compartment_ocid
  availability_domain = data.oci_identity_availability_domains.available.availability_domains[0].name
  display_name        = "ubuntu-2404-portafolio-carolina"
  shape               = var.instance_shape

  dynamic "shape_config" {
    for_each = endswith(var.instance_shape, ".Flex") ? [1] : []
    content {
      ocpus                     = var.ocpus
      memory_in_gbs             = var.memory_gb
      baseline_ocpu_utilization = var.instance_shape == "VM.Standard.A1.Flex" ? null : var.baseline_ocpu_utilization
    }
  }

  source_details {
    source_type             = "image"
    source_id               = var.image_ocid != "" ? var.image_ocid : data.oci_core_images.ubuntu.images[0].id
    boot_volume_size_in_gbs = 50
  }

  create_vnic_details {
    subnet_id        = oci_core_subnet.public.id
    assign_public_ip = true
    display_name     = "vnic-portafolio-carolina"
    hostname_label   = "carolina-web"
  }

  metadata = {
    ssh_authorized_keys = trimspace(var.ssh_public_key)
  }

  lifecycle {
    ignore_changes = [source_details[0].source_id]
  }
}
