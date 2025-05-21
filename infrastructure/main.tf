provider "docker" {}

resource "docker_image" "app_image" {
  name = "ghcr.io/Breezyoss/terraform_workflow:dev"
}

resource "docker_container" "app_container" {
  name  = "terraform-test-app"
  image = docker_image.app_image.name

  ports {
    internal = 3000
    external = 80
  }
}