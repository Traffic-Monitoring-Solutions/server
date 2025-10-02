# Real-time Traffic Monitoring API

Requisitos: Node 18+

## Instalação

```
npm install
```

## Desenvolvimento

```
npm run dev
```

## Build e Start

```
npm run build && npm start
```

## Variáveis de Ambiente

- `PORT` (opcional, padrão 4000)
- `JWT_SECRET` (recomendado em produção)

## Healthcheck

```
curl http://localhost:4000/health
```

## Autenticação

```
# Registro
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"secret123"}'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"secret123"}'
```

Guarde o token JWT retornado para usar nos endpoints protegidos:

```
TOKEN=ey...
```

## Usuários

```
# Obter usuário
curl http://localhost:4000/api/users/$USER_ID \
  -H "Authorization: Bearer $TOKEN"

# Atualizar nome
curl -X PUT http://localhost:4000/api/users/$USER_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice Souza"}'

# Atualizar localização
curl -X PUT http://localhost:4000/api/users/$USER_ID/location \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"latitude":-23.55,"longitude":-46.63}'
```

## Incidentes

```
# Criar
curl -X POST http://localhost:4000/api/incidents \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"tipo_incidente":"Acidente","descricao":"Batida leve","latitude":-23.55,"longitude":-46.63}'

# Listar
curl http://localhost:4000/api/incidents

# Buscar por ID
curl http://localhost:4000/api/incidents/$INCIDENT_ID

# Remover (autor)
curl -X DELETE http://localhost:4000/api/incidents/$INCIDENT_ID \
  -H "Authorization: Bearer $TOKEN"
```

## Rotas

```
# Calcular rota
curl -X POST http://localhost:4000/api/routes/calculate \
  -H "Content-Type: application/json" \
  -d '{"origem":"Local A","destino":"Local B","pontos_intermediarios":["Ponto 1"]}'

# Obter rota por ID
curl http://localhost:4000/api/routes/$ROUTE_ID
```

## Tráfego

```
# Consulta por bounding box
curl "http://localhost:4000/api/traffic?latMin=-23.6&latMax=-23.5&lngMin=-46.7&lngMax=-46.6"

# SSE (tempo real)
curl http://localhost:4000/api/traffic/realtime
```

## Transporte Público

```
# Paradas próximas
curl "http://localhost:4000/api/transport/stops?latitude=-23.55&longitude=-46.63&radius=1000"

# Chegadas na parada
curl http://localhost:4000/api/transport/stops/1/arrivals

# Linhas
curl http://localhost:4000/api/transport/lines
```

## Postman

Importe `server/postman_collection.json` no Postman para testar rapidamente. 