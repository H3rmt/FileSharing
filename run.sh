clear;
pnpm run build;
export HOST="0.0.0.0";
export PORT="8081";
export ADMIN_PASSWORD="testtest";
export ADMIN_EMAIL="admin@example.com";
export USER_PASSWORD="test";
export APP_NAME="File Sharing";
go run main.go serve