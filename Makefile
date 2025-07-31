# Makefile for deploying to Azure Static Web Apps

# --- Variables ---
# Replace with the name of your Azure resource group
RESOURCE_GROUP = "lab-internal-tools"
# The name of your Static Web App resource in Azure
APP_NAME = "Phone-travelex-insurance"
# The location of the built app output
OUTPUT_LOCATION = "dist"
# The location of the app source code
APP_LOCATION = "."

# --- Targets ---
.PHONY: all install build deploy clean

all: deploy

# Install dependencies using pnpm
install:
	@echo "Installing dependencies..."
	pnpm install

# Build the application for production
build: install
	@echo "Building the application..."
	pnpm run build

# Deploy to Azure Static Web Apps
# Prerequisites:
# 1. Install Azure CLI: https://docs.microsoft.com/cli/azure/install-azure-cli
# 2. Install Azure SWA CLI: pnpm install -g @azure/static-web-apps-cli
# 3. Login to Azure: az login
deploy: build
	@echo "Deploying to Azure Static Web Apps..."
	swa deploy ./$(OUTPUT_LOCATION) --app-name $(APP_NAME) --resource-group $(RESOURCE_GROUP)

# Clean the build directory
clean:
	@echo "Cleaning the build directory..."
	rm -rf $(OUTPUT_LOCATION)

