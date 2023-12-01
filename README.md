# LocalFileSharing

Astro + Solid using Pocketbase to share files and snippets

## Features

- Password is needed to access files and snippets
- Supports multiple files in one Upload
- Custom name for file-collection
- Simple download of multiple files with one click
- Download/copy causes file to be marked as old and disappear from frontpage
- Old Files can be displayed with one buttonpress
- Generate Links to download files without login

## Example

docker-compose.yml

```yaml
version: "3.8"
services:
  localfilesharing:
    image: h3rmt/localfilesharing
    restart: always
    ports:
      - "8080:80"
    environment:
      - HOST=0.0.0.0
      - PORT=80
      - ADMIN_PASSWORD=testtest
      - ADMIN_EMAIL=admin@example.com
      - USER_PASSWORD=test
    volumes:
      - ./pb_data:/app/pb_data
```
