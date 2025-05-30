terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {}

resource "docker_image" "app_image" {
  name = "ghcr.io/breezyoss/terraform_workflow:dev"
}

resource "docker_container" "app_container" {
  name  = "terraform-test-app"
  image = docker_image.app_image.name

  ports {
    internal = 3000
    external = 80
  }
  rm = false
}