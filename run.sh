pnpm install
pnpm build > logs/build.log 2>&1 
cd pocketbase
go mod download
go run main.go serve > ../logs/pocketbase.log 2>&1 &